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
  locationAddress?: string | null
  bookingId: string
  icalUid: string
  icalSequence: number
  meetingUrl?: string | null
}

function formatRange(start: Date, end: Date, tz: string): string {
  const day = formatInTimeZone(start, tz, "EEEE, MMMM d, yyyy")
  const startLabel = formatInTimeZone(start, tz, "h:mm a")
  const endLabel = formatInTimeZone(end, tz, "h:mm a zzz")
  return `${day} · ${startLabel} – ${endLabel}`
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
  if (!ctx.hostEmail) return null
  return buildIcs({
    uid: ctx.icalUid,
    sequence: ctx.icalSequence,
    method,
    summary: `${ctx.eventTitle} with ${ctx.hostName}`,
    description: ctx.meetingUrl
      ? `Join: ${ctx.meetingUrl}${ctx.bookerNotes ? `\n\n${ctx.bookerNotes}` : ""}`
      : ctx.bookerNotes || undefined,
    location: ctx.meetingUrl || undefined,
    startUtc: ctx.startUtc,
    endUtc: ctx.endUtc,
    organizer: { name: ctx.hostName, email: ctx.hostEmail },
    attendee: { name: ctx.bookerName, email: ctx.bookerEmail },
  })
}

function buildHostIcsRaw(
  ctx: BookingEmailContext,
  method: "PUBLISH" | "CANCEL",
): string | null {
  if (!ctx.hostEmail) return null

  const description = [
    `Invitee: ${ctx.bookerName} <${ctx.bookerEmail}>`,
    ctx.bookerPhone ? `Call: ${ctx.bookerPhone}` : null,
    ctx.meetingUrl ? `Join: ${ctx.meetingUrl}` : null,
    ctx.bookerNotes ? `Notes: ${ctx.bookerNotes}` : null,
  ]
    .filter((line): line is string => Boolean(line))
    .join("\n\n")

  return buildIcs({
    uid: ctx.icalUid,
    sequence: ctx.icalSequence,
    method,
    summary: `${ctx.eventTitle} with ${ctx.bookerName}`,
    description,
    location: ctx.meetingUrl || undefined,
    startUtc: ctx.startUtc,
    endUtc: ctx.endUtc,
    organizer: { name: APP_NAME, email: systemFromAddress() },
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

export async function sendBookingConfirmationToBooker(
  ctx: BookingEmailContext,
): Promise<void> {
  if (await isSuppressed(ctx.bookerEmail)) {
    console.info(`[email] skipping confirmation — ${ctx.bookerEmail} is suppressed`)
    return
  }
  const when = formatRange(ctx.startUtc, ctx.endUtc, ctx.bookerTimezone)
  const icsRaw = buildBookerIcsRaw(ctx, "REQUEST")

  await dispatch({
    from: hostAsFrom(ctx.hostName),
    ...(ctx.hostEmail ? { replyTo: ctx.hostEmail } : {}),
    to: ctx.bookerEmail,
    subject: `Invitation: ${ctx.eventTitle} with ${ctx.hostName}`,
    html: baseShell(`
      <h2 style="font-family: 'Manrope', sans-serif; font-size: 22px; font-weight: 700; margin: 0 0 8px 0;">You&rsquo;re all set</h2>
      <p style="color: #4b5a6d; margin: 0 0 24px 0;">Your meeting with ${escapeHtml(ctx.hostName)} is confirmed.</p>
      <div style="background: #f0f5ff; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
        <p style="font-size: 16px; font-weight: 600; margin: 0 0 4px 0;">${escapeHtml(ctx.eventTitle)}</p>
        <p style="color: #4b5a6d; margin: 0;">${when}</p>
      </div>
      ${ctx.meetingUrl ? `<div style="margin-bottom: 20px;"><a href="${ctx.meetingUrl}" style="display: inline-block; background: linear-gradient(135deg, #006bff, #4d94ff); color: #ffffff; padding: 12px 20px; border-radius: 12px; text-decoration: none; font-weight: 500;">Join meeting</a></div>` : ""}
      ${ctx.bookerPhone && !ctx.meetingUrl ? `<div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 16px; margin-bottom: 20px;"><p style="margin: 0 0 4px 0; font-size: 13px; font-weight: 600; color: #065f46;">Your host will call you at:</p><p style="margin: 0; font-size: 16px; font-weight: 700; color: #1c2b4b;">${escapeHtml(ctx.bookerPhone)}</p></div>` : ""}
      ${ctx.locationAddress && !ctx.meetingUrl && !ctx.bookerPhone ? `<div style="background: #fef9ec; border: 1px solid #fde68a; border-radius: 12px; padding: 16px; margin-bottom: 20px;"><p style="margin: 0 0 4px 0; font-size: 13px; font-weight: 600; color: #92400e;">Meeting location:</p><p style="margin: 0; font-size: 15px; font-weight: 600; color: #1c2b4b;">${escapeHtml(ctx.locationAddress)}</p></div>` : ""}
      ${ctx.bookerNotes ? `<p style="color: #4b5a6d; margin: 0 0 24px 0;"><strong>Your notes:</strong> ${escapeHtml(ctx.bookerNotes)}</p>` : ""}
      <p style="color: #4b5a6d; font-size: 13px; margin: 0 0 8px 0;">Calendar invite attached. Most email clients will let you accept or decline directly.</p>
      <p style="color: #9dafc5; font-size: 13px;">Need to cancel or reschedule? Reply to this email.</p>
    `),
    text: `You're booked!\n\n${ctx.eventTitle} with ${ctx.hostName}\n${when}\n\nCalendar invite attached. Need to cancel? Reply to this email.`,
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
  const icsRaw = buildHostIcsRaw(ctx, "PUBLISH")

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
              : ""}
          ${row("Invitee Timezone:", escapeHtml(ctx.bookerTimezone))}
          ${ctx.bookerNotes
            ? `<tr style="background: #f9fafb;"><td style="padding: 10px 16px; color: #6b7280; font-size: 13px; font-weight: 600; vertical-align: top; white-space: nowrap;">Notes:</td><td style="padding: 10px 16px; color: #1c2b4b; font-size: 13px; vertical-align: top;">${escapeHtml(ctx.bookerNotes)}</td></tr>`
            : ""}
        </tbody>
      </table>

      <a href="${dashboardLink}" style="display: inline-block; background: linear-gradient(135deg, #006bff, #4d94ff); color: #ffffff; padding: 12px 20px; border-radius: 12px; text-decoration: none; font-weight: 500; font-size: 14px;">View event in ${escapeHtml(APP_NAME)}</a>
    `),
    text: `Hi ${ctx.hostName},\n\nA new event has been scheduled.\n\nEvent Type: ${ctx.eventTitle}\nInvitee: ${ctx.bookerName}\nInvitee Email: ${ctx.bookerEmail}${ctx.bookerPhone ? `\nPhone: ${ctx.bookerPhone}` : ""}\nDate and Time: ${when}\nInvitee Timezone: ${ctx.bookerTimezone}${ctx.meetingUrl ? `\nLocation: ${ctx.meetingUrl}` : ctx.locationAddress ? `\nLocation: ${ctx.locationAddress}` : ""}${ctx.bookerNotes ? `\nNotes: ${ctx.bookerNotes}` : ""}\n\nManage: ${dashboardLink}`,
    icsRaw,
    icsMethod: "PUBLISH",
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

  await dispatch({
    from: hostAsFrom(ctx.hostName),
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
  }).catch((err) => console.warn("[email] booker cancellation failed:", err))
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
  const icsRaw = buildHostIcsRaw(ctx, "CANCEL")

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
    icsRaw,
    icsMethod: "CANCEL",
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
