export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? "Fluid"
export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
export const APP_DOMAIN = APP_URL.replace(/^https?:\/\//, "").replace(/\/$/, "")

const FALLBACK_FROM = "noreply@example.com"

function sanitizeName(name: string | null | undefined): string {
  const cleaned = (name ?? "").replace(/["<>\r\n]/g, "").trim()
  return cleaned.length ? cleaned : APP_NAME
}

function baseFromAddress(): string {
  return process.env.SMTP_FROM ?? FALLBACK_FROM
}

function addressOnly(from: string): string {
  const match = from.match(/<([^>]+)>/)
  return match ? match[1] : from
}

/** Address portion of SMTP_FROM, safe to expose when building email search links. */
export function systemFromAddress(): string {
  return addressOnly(baseFromAddress())
}

/** System-to-host sender (e.g., new-booking notification). */
export function systemFrom(): string {
  const base = systemFromAddress()
  return `${APP_NAME} <${base}>`
}

/** Host-identity sender for invitee-facing mail: "Alice (via Fluid) <notifications@...>". */
export function hostAsFrom(hostName: string | null | undefined): string {
  const base = systemFromAddress()
  return `${sanitizeName(hostName)} (via ${APP_NAME}) <${base}>`
}

/** Local part used for iCal UIDs and Message-IDs. */
export function icalDomain(): string {
  const base = systemFromAddress()
  const at = base.lastIndexOf("@")
  return at === -1 ? APP_DOMAIN : base.slice(at + 1)
}
