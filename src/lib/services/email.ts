import { Resend } from "resend"
import { formatInTimeZone } from "date-fns-tz"

function getResend(): Resend {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not configured")
  }
  return new Resend(process.env.RESEND_API_KEY)
}

function getFrom(): string {
  return process.env.AUTH_RESEND_FROM ?? "noreply@example.com"
}

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"

/**
 * Send a sign-in magic link (used by NextAuth Resend provider).
 */
export async function sendMagicLinkEmail({
  to,
  url,
}: {
  to: string
  url: string
}): Promise<void> {
  const { error } = await getResend().emails.send({
    from: getFrom(),
    to,
    subject: "Your sign-in link",
    html: `
      <div style="font-family: 'Inter', system-ui, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; color: #32323b;">
        <h2 style="font-size: 20px; font-weight: 600; margin-bottom: 16px;">Sign in to Fluid</h2>
        <p style="color: #5f5e68; margin-bottom: 24px;">Click the button below to sign in. This link expires in 10 minutes.</p>
        <a href="${url}" style="display: inline-block; background: linear-gradient(135deg, #4a4bd7, #7073ff); color: #fbf7ff; padding: 12px 24px; border-radius: 12px; text-decoration: none; font-weight: 500;">Sign in</a>
        <p style="color: #b3b0bc; font-size: 12px; margin-top: 32px;">If you didn't request this email, you can safely ignore it.</p>
      </div>
    `,
    text: `Sign in to Fluid\n\nClick this link to sign in (expires in 10 minutes):\n${url}\n\nIf you didn't request this, ignore this email.`,
  })
  if (error) throw new Error(`Failed to send magic link: ${error.message}`)
}

// -----------------------------------------------------------------------------
// Booking emails
// -----------------------------------------------------------------------------

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
  bookingId: string
  cancelUrlForHost?: string
}

function formatRange(start: Date, end: Date, tz: string): string {
  const day = formatInTimeZone(start, tz, "EEEE, MMMM d, yyyy")
  const startLabel = formatInTimeZone(start, tz, "h:mm a")
  const endLabel = formatInTimeZone(end, tz, "h:mm a zzz")
  return `${day} · ${startLabel} – ${endLabel}`
}

function baseShell(inner: string): string {
  return `
    <div style="font-family: 'Inter', system-ui, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px; color: #32323b; background: #fcf8fe;">
      <div style="background: #ffffff; border-radius: 16px; padding: 32px;">
        ${inner}
      </div>
      <p style="color: #b3b0bc; font-size: 11px; text-align: center; margin-top: 24px;">Sent by Fluid · scheduling, reimagined</p>
    </div>
  `
}

export async function sendBookingConfirmationToBooker(
  ctx: BookingEmailContext,
): Promise<void> {
  const when = formatRange(ctx.startUtc, ctx.endUtc, ctx.bookerTimezone)
  const { error } = await getResend().emails.send({
    from: getFrom(),
    to: ctx.bookerEmail,
    subject: `You're booked: ${ctx.eventTitle} with ${ctx.hostName}`,
    html: baseShell(`
      <h2 style="font-family: 'Manrope', sans-serif; font-size: 22px; font-weight: 700; margin: 0 0 8px 0;">You&rsquo;re all set</h2>
      <p style="color: #5f5e68; margin: 0 0 24px 0;">Your meeting with ${escapeHtml(ctx.hostName)} is confirmed.</p>
      <div style="background: #f6f2fb; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
        <p style="font-size: 16px; font-weight: 600; margin: 0 0 4px 0;">${escapeHtml(ctx.eventTitle)}</p>
        <p style="color: #5f5e68; margin: 0;">${when}</p>
      </div>
      ${ctx.bookerNotes ? `<p style="color: #5f5e68; margin: 0 0 24px 0;"><strong>Your notes:</strong> ${escapeHtml(ctx.bookerNotes)}</p>` : ""}
      <p style="color: #b3b0bc; font-size: 13px;">Need to cancel or reschedule? Reply to this email.</p>
    `),
    text: `You're booked!\n\n${ctx.eventTitle} with ${ctx.hostName}\n${when}\n\nNeed to cancel? Reply to this email.`,
  })
  if (error) console.warn("[email] booker confirmation failed:", error.message)
}

export async function sendBookingNotificationToHost(
  ctx: BookingEmailContext,
): Promise<void> {
  if (!ctx.hostEmail) return
  const when = formatRange(ctx.startUtc, ctx.endUtc, ctx.hostTimezone)
  const cancelLink = `${APP_URL}/meetings`
  const { error } = await getResend().emails.send({
    from: getFrom(),
    to: ctx.hostEmail,
    subject: `New booking: ${ctx.bookerName} — ${ctx.eventTitle}`,
    html: baseShell(`
      <h2 style="font-family: 'Manrope', sans-serif; font-size: 22px; font-weight: 700; margin: 0 0 8px 0;">New booking</h2>
      <p style="color: #5f5e68; margin: 0 0 24px 0;">${escapeHtml(ctx.bookerName)} booked time with you.</p>
      <div style="background: #f6f2fb; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
        <p style="font-size: 16px; font-weight: 600; margin: 0 0 4px 0;">${escapeHtml(ctx.eventTitle)}</p>
        <p style="color: #5f5e68; margin: 0 0 12px 0;">${when}</p>
        <p style="color: #5f5e68; margin: 0;">${escapeHtml(ctx.bookerName)} · <a href="mailto:${encodeURIComponent(ctx.bookerEmail)}" style="color: #4a4bd7; text-decoration: none;">${escapeHtml(ctx.bookerEmail)}</a></p>
      </div>
      ${ctx.bookerNotes ? `<p style="color: #32323b; margin: 0 0 16px 0;"><strong>Notes:</strong> ${escapeHtml(ctx.bookerNotes)}</p>` : ""}
      <a href="${cancelLink}" style="display: inline-block; background: linear-gradient(135deg, #4a4bd7, #7073ff); color: #fbf7ff; padding: 12px 20px; border-radius: 12px; text-decoration: none; font-weight: 500;">Manage in dashboard</a>
    `),
    text: `New booking: ${ctx.eventTitle}\nWith: ${ctx.bookerName} <${ctx.bookerEmail}>\nWhen: ${when}${ctx.bookerNotes ? `\nNotes: ${ctx.bookerNotes}` : ""}\n\nManage: ${cancelLink}`,
  })
  if (error) console.warn("[email] host notification failed:", error.message)
}

export async function sendCancellationToBooker(
  ctx: BookingEmailContext,
): Promise<void> {
  const when = formatRange(ctx.startUtc, ctx.endUtc, ctx.bookerTimezone)
  const { error } = await getResend().emails.send({
    from: getFrom(),
    to: ctx.bookerEmail,
    subject: `Cancelled: ${ctx.eventTitle} with ${ctx.hostName}`,
    html: baseShell(`
      <h2 style="font-family: 'Manrope', sans-serif; font-size: 22px; font-weight: 700; margin: 0 0 8px 0;">Meeting cancelled</h2>
      <p style="color: #5f5e68; margin: 0 0 24px 0;">Your meeting with ${escapeHtml(ctx.hostName)} was cancelled.</p>
      <div style="background: #f6f2fb; border-radius: 12px; padding: 20px;">
        <p style="font-size: 16px; font-weight: 600; margin: 0 0 4px 0;">${escapeHtml(ctx.eventTitle)}</p>
        <p style="color: #5f5e68; margin: 0;">${when}</p>
      </div>
    `),
    text: `Cancelled: ${ctx.eventTitle} with ${ctx.hostName}\n${when}`,
  })
  if (error) console.warn("[email] booker cancellation failed:", error.message)
}

export async function sendCancellationToHost(
  ctx: BookingEmailContext,
): Promise<void> {
  if (!ctx.hostEmail) return
  const when = formatRange(ctx.startUtc, ctx.endUtc, ctx.hostTimezone)
  const { error } = await getResend().emails.send({
    from: getFrom(),
    to: ctx.hostEmail,
    subject: `Cancelled: ${ctx.bookerName} — ${ctx.eventTitle}`,
    html: baseShell(`
      <h2 style="font-family: 'Manrope', sans-serif; font-size: 22px; font-weight: 700; margin: 0 0 8px 0;">Booking cancelled</h2>
      <p style="color: #5f5e68; margin: 0 0 24px 0;">${escapeHtml(ctx.bookerName)}&rsquo;s booking was cancelled.</p>
      <div style="background: #f6f2fb; border-radius: 12px; padding: 20px;">
        <p style="font-size: 16px; font-weight: 600; margin: 0 0 4px 0;">${escapeHtml(ctx.eventTitle)}</p>
        <p style="color: #5f5e68; margin: 0;">${when}</p>
      </div>
    `),
    text: `Cancelled: ${ctx.eventTitle}\nWith: ${ctx.bookerName}\nWhen: ${when}`,
  })
  if (error) console.warn("[email] host cancellation failed:", error.message)
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}
