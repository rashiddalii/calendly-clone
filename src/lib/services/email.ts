import * as nodemailer from "nodemailer"
import { formatInTimeZone } from "date-fns-tz"
import {
  APP_NAME,
  APP_URL,
  hostAsFrom,
  systemFrom,
  systemFromAddress,
} from "@/lib/brand"
import { buildIcs } from "@/lib/utils/ical"
import { prisma } from "@/app/lib/db"

// ─── Transport ────────────────────────────────────────────────────────────────

function getTransport(): nodemailer.Transporter {
  const host = process.env.SMTP_HOST
  if (!host) throw new Error("SMTP_HOST is not configured")
  return nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER ?? "",
      pass: process.env.SMTP_PASS ?? "",
    },
  })
}

interface MailPayload {
  from: string
  replyTo?: string
  to: string
  subject: string
  html: string
  text: string
  /**
   * Raw ICS string, sent through Nodemailer's calendar support so mail clients
   * receive both a text/calendar alternative and an .ics attachment.
   */
  icsRaw?: string | null
  icsMethod?: "PUBLISH" | "REQUEST" | "CANCEL"
}

interface SmtpLikeError extends Error {
  code?: string
  responseCode?: number
  response?: string
}

async function dispatch(payload: MailPayload): Promise<void> {
  const transport = getTransport()
  const icalEvent: nodemailer.SendMailOptions["icalEvent"] =
    payload.icsRaw && payload.icsMethod
      ? {
          filename: "invite.ics",
          method: payload.icsMethod,
          content: payload.icsRaw,
        }
      : undefined

  try {
    await transport.sendMail({
      from: payload.from,
      ...(payload.replyTo ? { replyTo: payload.replyTo } : {}),
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
      text: payload.text,
      ...(icalEvent ? { icalEvent } : {}),
    })
  } catch (err) {
    throw err
  }
}

function isFromRejectionError(err: unknown): boolean {
  if (!(err instanceof Error)) return false
  const smtpErr = err as SmtpLikeError
  if (typeof smtpErr.responseCode === "number" && smtpErr.responseCode >= 500) {
    return true
  }
  const text = `${smtpErr.code ?? ""} ${smtpErr.message ?? ""} ${smtpErr.response ?? ""}`
    .toLowerCase()
    .trim()
  return (
    text.includes("sender") ||
    text.includes("from") ||
    text.includes("mail from") ||
    text.includes("not allowed") ||
    text.includes("unauth") ||
    text.includes("not authorized")
  )
}

async function dispatchInviteeMail(
  payload: Omit<MailPayload, "from">,
  hostFrom: string,
): Promise<void> {
  try {
    await dispatch({ ...payload, from: hostFrom })
  } catch (err) {
    if (!isFromRejectionError(err)) throw err
    const fallbackFrom = systemFrom()
    console.warn(
      `[email] host From rejected; retrying with system From. to=${payload.to}`,
    )
    await dispatch({ ...payload, from: fallbackFrom })
  }
}

// ─── Suppression check ────────────────────────────────────────────────────────

async function isSuppressed(email: string): Promise<boolean> {
  try {
    const hit = await prisma.emailSuppression.findUnique({
      where: { email: email.toLowerCase().trim() },
      select: { id: true },
    })
    return hit !== null
  } catch {
    return false
  }
}

// ─── Auth email shell ─────────────────────────────────────────────────────────

function renderAuthEmailShell({
  heading,
  bodyHtml,
  ctaLabel,
  ctaHref,
  expiryNote,
}: {
  heading: string
  bodyHtml: string
  ctaLabel: string
  ctaHref: string
  expiryNote: string
}): string {
  return `
    <div style="font-family: 'Inter', system-ui, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; color: #1c2b4b; background: #ffffff;">
      <h2 style="font-size: 22px; font-weight: 700; margin: 0 0 12px 0; font-family: 'Manrope', sans-serif;">${heading}</h2>
      <p style="color: #4b5a6d; margin: 0 0 24px 0; line-height: 1.6;">${bodyHtml}</p>
      <a href="${ctaHref}" style="display: inline-block; background: linear-gradient(135deg, #006bff, #4d94ff); color: #ffffff; padding: 12px 24px; border-radius: 12px; text-decoration: none; font-weight: 600; font-size: 15px;">${ctaLabel}</a>
      <p style="color: #9dafc5; font-size: 12px; margin-top: 28px; line-height: 1.5;">${expiryNote}</p>
      <p style="color: #c5d0de; font-size: 11px; text-align: center; margin-top: 32px; border-top: 1px solid #f0f4f8; padding-top: 16px;">Sent by ${escapeHtml(APP_NAME)} · scheduling, reimagined</p>
    </div>
  `
}

// ─── Magic link ───────────────────────────────────────────────────────────────

export async function sendMagicLinkEmail({
  to,
  url,
}: {
  to: string
  url: string
}): Promise<void> {
  await dispatch({
    from: systemFrom(),
    to,
    subject: `Your sign-in link for ${APP_NAME}`,
    html: renderAuthEmailShell({
      heading: `Sign in to ${escapeHtml(APP_NAME)}`,
      bodyHtml: "Click the button below to sign in. This link expires in 10 minutes.",
      ctaLabel: "Sign in",
      ctaHref: url,
      expiryNote: "If you didn't request this email, you can safely ignore it.",
    }),
    text: `Sign in to ${APP_NAME}\n\nClick this link to sign in (expires in 10 minutes):\n${url}\n\nIf you didn't request this, ignore this email.`,
  })
}

// ─── Email verification ───────────────────────────────────────────────────────

export async function sendEmailVerificationEmail({
  to,
  url,
  userName,
}: {
  to: string
  url: string
  userName: string
}): Promise<void> {
  await dispatch({
    from: systemFrom(),
    to,
    subject: `Confirm your email for ${APP_NAME}`,
    html: renderAuthEmailShell({
      heading: `Hi ${escapeHtml(userName)}, please confirm your email`,
      bodyHtml: `You're almost there. Click the button below to confirm your email address and finish creating your ${escapeHtml(APP_NAME)} account.`,
      ctaLabel: "Verify email",
      ctaHref: url,
      expiryNote: "This link expires in 24 hours. If you didn't sign up for an account, you can safely ignore this email.",
    }),
    text: `Hi ${userName},\n\nPlease confirm your email to finish creating your ${APP_NAME} account:\n${url}\n\nThis link expires in 24 hours. If you didn't sign up, ignore this email.`,
  })
}

// ─── Password reset ───────────────────────────────────────────────────────────

export async function sendPasswordResetEmail({
  to,
  url,
  userName,
}: {
  to: string
  url: string
  userName: string
}): Promise<void> {
  await dispatch({
    from: systemFrom(),
    to,
    subject: `Reset your ${APP_NAME} password`,
    html: renderAuthEmailShell({
      heading: "Reset your password",
      bodyHtml: `Hi ${escapeHtml(userName)}, we received a request to reset your ${escapeHtml(APP_NAME)} password. Click the button below to choose a new one.`,
      ctaLabel: "Reset password",
      ctaHref: url,
      expiryNote: "This link expires in 1 hour. If you didn't request a password reset, you can safely ignore this email.",
    }),
    text: `Hi ${userName},\n\nClick the link below to reset your ${APP_NAME} password (expires in 1 hour):\n${url}\n\nIf you didn't request this, ignore this email.`,
  })
}

// ─── Booking email helpers ────────────────────────────────────────────────────

interface BookingEmailContext {
  eventTitle: string
  hostName: string
  hostEmail: string | null
  bookerName: string
  bookerEmail: string
  startUtc: Date
  endUtc: Date
  hostTimezone: string
  bookerTimezone: string
  bookerNotes?: string | null
  bookerPhone?: string | null
  locationLabel?: string | null
  locationAddress?: string | null
  bookingId: string
  icalUid: string
  icalSequence: number
  meetingUrl?: string | null
}

function meetingLocationValue(ctx: BookingEmailContext): string | null {
  if (ctx.meetingUrl) return ctx.meetingUrl
  if (ctx.locationAddress) return ctx.locationAddress
  if (ctx.bookerPhone) return ctx.bookerPhone
  if (ctx.locationLabel === "Google Meet") return "Google Meet (host will share link)"
  return ctx.locationLabel ?? null
}

function formatRange(start: Date, end: Date, tz: string): string {
  const day = formatInTimeZone(start, tz, "EEEE, MMMM d, yyyy")
  const startLabel = formatInTimeZone(start, tz, "h:mm a")
  const endLabel = formatInTimeZone(end, tz, "h:mm a zzz")
  return `${day} · ${startLabel} – ${endLabel}`
}

function sanitizeHeaderName(name: string): string {
  return name.replace(/["<>\r\n]/g, "").trim()
}

function baseShell(inner: string): string {
  return `
    <div style="font-family: 'Inter', system-ui, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px; color: #1c2b4b; background: #ffffff;">
      <div style="background: #ffffff; border-radius: 16px; padding: 32px;">
        ${inner}
      </div>
      <p style="color: #9dafc5; font-size: 11px; text-align: center; margin-top: 24px;">Sent by ${escapeHtml(APP_NAME)} · scheduling, reimagined</p>
    </div>
  `
}

function buildBookerIcsRaw(
  ctx: BookingEmailContext,
  method: "REQUEST" | "CANCEL",
): string | null {
  const organizerEmail = systemFromAddress()
  const organizerName = ctx.hostName || APP_NAME
  return buildIcs({
    uid: ctx.icalUid,
    sequence: ctx.icalSequence,
    method,
    summary: `${ctx.eventTitle} with ${ctx.hostName}`,
    description: [
      ctx.meetingUrl ? `Join: ${ctx.meetingUrl}` : null,
      !ctx.meetingUrl && meetingLocationValue(ctx)
        ? `Location: ${meetingLocationValue(ctx)}`
        : null,
      ctx.bookerNotes || null,
    ]
      .filter((line): line is string => Boolean(line))
      .join("\n\n") || undefined,
    location: meetingLocationValue(ctx) || undefined,
    startUtc: ctx.startUtc,
    endUtc: ctx.endUtc,
    organizer: { name: organizerName, email: organizerEmail },
    attendee: { name: ctx.bookerName, email: ctx.bookerEmail },
  })
}

function reservationStructuredData(ctx: BookingEmailContext): string {
  const data = {
    "@context": "https://schema.org",
    "@type": "EventReservation",
    reservationStatus: "https://schema.org/ReservationConfirmed",
    reservationFor: {
      "@type": "Event",
      name: ctx.eventTitle,
      startDate: ctx.startUtc.toISOString(),
      endDate: ctx.endUtc.toISOString(),
      location: ctx.meetingUrl
        ? {
            "@type": "VirtualLocation",
            url: ctx.meetingUrl,
          }
        : undefined,
    },
    underName: {
      "@type": "Person",
      name: ctx.bookerName,
      email: ctx.bookerEmail,
    },
    url: `${APP_URL}/meetings`,
  }
  return `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>`
}

// ─── Booking emails ───────────────────────────────────────────────────────────

function meetingJoinLabel(url: string): string {
  if (url.includes("meet.google.com")) return "Join with Google Meet"
  if (url.includes("zoom.us")) return "Join with Zoom"
  if (url.includes("teams.microsoft.com")) return "Join with Teams"
  return "Join meeting"
}

function calendarInviteHtml(ctx: BookingEmailContext): string {
  const when = formatRange(ctx.startUtc, ctx.endUtc, ctx.bookerTimezone)

  const locationLine = ctx.meetingUrl
    ? ""
    : ctx.locationAddress
      ? `<tr>
          <td style="padding: 12px 0 0 0; vertical-align: top;">
            <p style="margin: 0 0 2px 0; font-size: 12px; font-weight: 600; color: #5f6368; text-transform: uppercase; letter-spacing: 0.5px;">Where</p>
            <p style="margin: 0; font-size: 14px; color: #202124;">${escapeHtml(ctx.locationAddress)}</p>
          </td>
        </tr>`
      : ctx.bookerPhone
        ? `<tr>
            <td style="padding: 12px 0 0 0; vertical-align: top;">
              <p style="margin: 0 0 2px 0; font-size: 12px; font-weight: 600; color: #5f6368; text-transform: uppercase; letter-spacing: 0.5px;">Phone</p>
              <p style="margin: 0; font-size: 14px; color: #202124;">${escapeHtml(ctx.bookerPhone)}</p>
            </td>
          </tr>`
        : meetingLocationValue(ctx)
          ? `<tr>
              <td style="padding: 12px 0 0 0; vertical-align: top;">
                <p style="margin: 0 0 2px 0; font-size: 12px; font-weight: 600; color: #5f6368; text-transform: uppercase; letter-spacing: 0.5px;">Where</p>
                <p style="margin: 0; font-size: 14px; color: #202124;">${escapeHtml(meetingLocationValue(ctx)!)}</p>
              </td>
            </tr>`
        : ""

  const meetingPanel = ctx.meetingUrl
    ? `<td style="width: 180px; padding-left: 24px; vertical-align: top;">
        <a href="${ctx.meetingUrl}" style="display: block; background: #1a73e8; color: #ffffff; padding: 10px 16px; border-radius: 4px; text-decoration: none; font-size: 14px; font-weight: 500; text-align: center; margin-bottom: 12px;">${meetingJoinLabel(ctx.meetingUrl)}</a>
        <p style="margin: 0 0 2px 0; font-size: 12px; font-weight: 600; color: #5f6368;">Meeting link</p>
        <a href="${ctx.meetingUrl}" style="font-size: 12px; color: #1a73e8; word-break: break-all;">${ctx.meetingUrl.replace(/^https?:\/\//, "")}</a>
      </td>`
    : ""

  return `
    <div style="font-family: 'Google Sans', Roboto, Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #202124; background: #ffffff; padding: 24px;">

      <h1 style="font-size: 22px; font-weight: 400; margin: 0 0 4px 0; color: #202124;">${escapeHtml(ctx.eventTitle)}</h1>
      <p style="font-size: 13px; color: #5f6368; margin: 0 0 24px 0;">Booked via ${escapeHtml(APP_NAME)}.</p>

      <table style="width: 100%; border-collapse: collapse;" cellpadding="0" cellspacing="0">
        <tr>
          <td style="vertical-align: top;">
            <table style="width: 100%; border-collapse: collapse;" cellpadding="0" cellspacing="0">

              <tr>
                <td style="padding-bottom: 16px; vertical-align: top;">
                  <p style="margin: 0 0 2px 0; font-size: 12px; font-weight: 600; color: #5f6368; text-transform: uppercase; letter-spacing: 0.5px;">When</p>
                  <p style="margin: 0; font-size: 14px; color: #202124;">${when}</p>
                </td>
              </tr>

              <tr>
                <td style="padding-bottom: 16px; vertical-align: top;">
                  <p style="margin: 0 0 2px 0; font-size: 12px; font-weight: 600; color: #5f6368; text-transform: uppercase; letter-spacing: 0.5px;">Organiser</p>
                  <p style="margin: 0; font-size: 14px; color: #202124;">${escapeHtml(ctx.hostName)}</p>
                  ${ctx.hostEmail ? `<p style="margin: 2px 0 0 0; font-size: 13px; color: #1a73e8;">${escapeHtml(ctx.hostEmail)}</p>` : ""}
                </td>
              </tr>

              <tr>
                <td style="padding-bottom: 16px; vertical-align: top;">
                  <p style="margin: 0 0 2px 0; font-size: 12px; font-weight: 600; color: #5f6368; text-transform: uppercase; letter-spacing: 0.5px;">Guests</p>
                  <p style="margin: 0; font-size: 14px; color: #1a73e8;">${escapeHtml(ctx.bookerEmail)}</p>
                </td>
              </tr>

              ${locationLine}

              ${ctx.bookerNotes ? `<tr><td style="padding-bottom: 16px; vertical-align: top;"><p style="margin: 0 0 2px 0; font-size: 12px; font-weight: 600; color: #5f6368; text-transform: uppercase; letter-spacing: 0.5px;">Notes</p><p style="margin: 0; font-size: 14px; color: #202124;">${escapeHtml(ctx.bookerNotes)}</p></td></tr>` : ""}

            </table>
          </td>
          ${meetingPanel}
        </tr>
      </table>

      <p style="color: #9dafc5; font-size: 11px; text-align: center; margin-top: 24px; border-top: 1px solid #f0f4f8; padding-top: 16px;">Sent by ${escapeHtml(APP_NAME)} · scheduling, reimagined</p>
    </div>
  `
}

export async function sendBookingConfirmationToBooker(
  ctx: BookingEmailContext,
): Promise<void> {
  if (await isSuppressed(ctx.bookerEmail)) {
    console.info(`[email] skipping confirmation — ${ctx.bookerEmail} is suppressed`)
    return
  }
  const when = formatRange(ctx.startUtc, ctx.endUtc, ctx.bookerTimezone)
  const icsRaw = buildBookerIcsRaw(ctx, "REQUEST")
  const hostFrom = hostAsFrom(ctx.hostName)

  await dispatch({
    from: hostFrom,
    ...(ctx.hostEmail ? { replyTo: ctx.hostEmail } : {}),
    to: ctx.bookerEmail,
    subject: `Invitation: ${ctx.eventTitle} with ${ctx.hostName}`,
    html: calendarInviteHtml(ctx),
    text: `${ctx.eventTitle} with ${ctx.hostName}\nBooked via ${APP_NAME}.\n\nWhen: ${when}${ctx.hostEmail ? `\nOrganiser: ${ctx.hostName} <${ctx.hostEmail}>` : `\nOrganiser: ${ctx.hostName}`}\nGuests: ${ctx.bookerEmail}${ctx.meetingUrl ? `\nJoin: ${ctx.meetingUrl}` : ""}${ctx.locationAddress ? `\nWhere: ${ctx.locationAddress}` : ""}${ctx.bookerPhone ? `\nPhone: ${ctx.bookerPhone}` : ""}${ctx.bookerNotes ? `\nNotes: ${ctx.bookerNotes}` : ""}`,
    icsRaw,
    icsMethod: "REQUEST",
  }).catch((err) => console.warn("[email] booker confirmation failed:", err))
}

export async function sendBookingNotificationToHost(
  ctx: BookingEmailContext,
): Promise<void> {
  if (!ctx.hostEmail) return
  if (await isSuppressed(ctx.hostEmail)) {
    console.info(`[email] skipping host notification — ${ctx.hostEmail} is suppressed`)
    return
  }
  const when = formatRange(ctx.startUtc, ctx.endUtc, ctx.hostTimezone)
  const dashboardLink = `${APP_URL}/meetings`

  const row = (label: string, value: string) =>
    `<tr>
      <td style="padding: 10px 16px; width: 140px; color: #6b7280; font-size: 13px; font-weight: 600; vertical-align: top; white-space: nowrap;">${label}</td>
      <td style="padding: 10px 16px; color: #1c2b4b; font-size: 13px; vertical-align: top;">${value}</td>
    </tr>`

  await dispatch({
    from: systemFrom(),
    replyTo: ctx.bookerEmail,
    to: ctx.hostEmail,
    subject: `New event: ${ctx.bookerName} - ${ctx.eventTitle}`,
    html: baseShell(`
      ${reservationStructuredData(ctx)}
      <p style="color: #4b5a6d; margin: 0 0 4px 0;">Hi ${escapeHtml(ctx.hostName)},</p>
      <p style="color: #4b5a6d; margin: 0 0 24px 0;">A new event has been scheduled.</p>

      <table style="width: 100%; border-collapse: collapse; border: 1px solid #e5e7eb; border-radius: 10px; overflow: hidden; margin-bottom: 24px;">
        <tbody>
          ${row("Event Type:", escapeHtml(ctx.eventTitle))}
          <tr style="background: #f9fafb;">
            ${row("Invitee:", escapeHtml(ctx.bookerName)).replace("<tr>", "").replace("</tr>", "")}
          </tr>
          ${row("Invitee Email:", `<a href="mailto:${ctx.bookerEmail}" style="color: #006bff; text-decoration: none;">${escapeHtml(ctx.bookerEmail)}</a>`)}
          <tr style="background: #f9fafb;">
            ${row("Date and Time:", escapeHtml(when)).replace("<tr>", "").replace("</tr>", "")}
          </tr>
          ${ctx.bookerPhone
            ? `<tr style="background: #f9fafb;"><td style="padding: 10px 16px; width: 140px; color: #6b7280; font-size: 13px; font-weight: 600; vertical-align: top; white-space: nowrap;">Phone:</td><td style="padding: 10px 16px; color: #1c2b4b; font-size: 13px; vertical-align: top; font-weight: 600;"><a href="tel:${escapeHtml(ctx.bookerPhone)}" style="color: #006bff; text-decoration: none;">${escapeHtml(ctx.bookerPhone)}</a></td></tr>`
            : ""}
          ${ctx.meetingUrl
            ? row("Location:", `<a href="${ctx.meetingUrl}" style="color: #006bff; text-decoration: none;">Join the meeting</a>`)
            : ctx.locationAddress
              ? row("Location:", escapeHtml(ctx.locationAddress))
              : meetingLocationValue(ctx)
                ? row("Location:", escapeHtml(meetingLocationValue(ctx)!))
              : ""}
          ${row("Invitee Timezone:", escapeHtml(ctx.bookerTimezone))}
          ${ctx.bookerNotes
            ? `<tr style="background: #f9fafb;"><td style="padding: 10px 16px; color: #6b7280; font-size: 13px; font-weight: 600; vertical-align: top; white-space: nowrap;">Notes:</td><td style="padding: 10px 16px; color: #1c2b4b; font-size: 13px; vertical-align: top;">${escapeHtml(ctx.bookerNotes)}</td></tr>`
            : ""}
        </tbody>
      </table>

      <a href="${dashboardLink}" style="display: inline-block; background: linear-gradient(135deg, #006bff, #4d94ff); color: #ffffff; padding: 12px 20px; border-radius: 12px; text-decoration: none; font-weight: 500; font-size: 14px;">View event in ${escapeHtml(APP_NAME)}</a>
    `),
    text: `Hi ${ctx.hostName},\n\nA new event has been scheduled.\n\nEvent Type: ${ctx.eventTitle}\nInvitee: ${ctx.bookerName}\nInvitee Email: ${ctx.bookerEmail}${ctx.bookerPhone ? `\nPhone: ${ctx.bookerPhone}` : ""}\nDate and Time: ${when}\nInvitee Timezone: ${ctx.bookerTimezone}${ctx.meetingUrl ? `\nLocation: ${ctx.meetingUrl}` : meetingLocationValue(ctx) ? `\nLocation: ${meetingLocationValue(ctx)}` : ""}${ctx.bookerNotes ? `\nNotes: ${ctx.bookerNotes}` : ""}\n\nManage: ${dashboardLink}`,
  }).catch((err) => console.warn("[email] host notification failed:", err))
}

export async function sendCancellationToBooker(
  ctx: BookingEmailContext,
): Promise<void> {
  if (await isSuppressed(ctx.bookerEmail)) {
    console.info(`[email] skipping cancellation — ${ctx.bookerEmail} is suppressed`)
    return
  }
  const when = formatRange(ctx.startUtc, ctx.endUtc, ctx.bookerTimezone)
  const icsRaw = buildBookerIcsRaw(ctx, "CANCEL")
  const hostFrom = ctx.hostEmail
    ? `${sanitizeHeaderName(ctx.hostName)} <${ctx.hostEmail}>`
    : hostAsFrom(ctx.hostName)

  await dispatchInviteeMail(
    {
    ...(ctx.hostEmail ? { replyTo: ctx.hostEmail } : {}),
    to: ctx.bookerEmail,
    subject: `Cancelled: ${ctx.eventTitle} with ${ctx.hostName}`,
    html: baseShell(`
      <h2 style="font-family: 'Manrope', sans-serif; font-size: 22px; font-weight: 700; margin: 0 0 8px 0;">Meeting cancelled</h2>
      <p style="color: #4b5a6d; margin: 0 0 24px 0;">Your meeting with ${escapeHtml(ctx.hostName)} was cancelled.</p>
      <div style="background: #f0f5ff; border-radius: 12px; padding: 20px;">
        <p style="font-size: 16px; font-weight: 600; margin: 0 0 4px 0;">${escapeHtml(ctx.eventTitle)}</p>
        <p style="color: #4b5a6d; margin: 0;">${when}</p>
      </div>
    `),
    text: `Cancelled: ${ctx.eventTitle} with ${ctx.hostName}\n${when}`,
    icsRaw,
    icsMethod: "CANCEL",
    },
    hostFrom,
  ).catch((err) => console.warn("[email] booker cancellation failed:", err))
}

export async function sendCancellationToHost(
  ctx: BookingEmailContext,
): Promise<void> {
  if (!ctx.hostEmail) return
  if (await isSuppressed(ctx.hostEmail)) {
    console.info(`[email] skipping host cancellation — ${ctx.hostEmail} is suppressed`)
    return
  }
  const when = formatRange(ctx.startUtc, ctx.endUtc, ctx.hostTimezone)

  await dispatch({
    from: systemFrom(),
    to: ctx.hostEmail,
    subject: `Cancelled: ${ctx.bookerName} — ${ctx.eventTitle}`,
    html: baseShell(`
      <h2 style="font-family: 'Manrope', sans-serif; font-size: 22px; font-weight: 700; margin: 0 0 8px 0;">Booking cancelled</h2>
      <p style="color: #4b5a6d; margin: 0 0 24px 0;">${escapeHtml(ctx.bookerName)}&rsquo;s booking was cancelled.</p>
      <div style="background: #f0f5ff; border-radius: 12px; padding: 20px;">
        <p style="font-size: 16px; font-weight: 600; margin: 0 0 4px 0;">${escapeHtml(ctx.eventTitle)}</p>
        <p style="color: #4b5a6d; margin: 0;">${when}</p>
      </div>
    `),
    text: `Cancelled: ${ctx.eventTitle}\nWith: ${ctx.bookerName}\nWhen: ${when}`,
  }).catch((err) => console.warn("[email] host cancellation failed:", err))
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}
