import { icalDomain } from "@/lib/brand"

export type IcsMethod = "PUBLISH" | "REQUEST" | "CANCEL"

interface IcsInput {
  uid: string
  sequence: number
  method: IcsMethod
  summary: string
  description?: string | null
  location?: string | null
  startUtc: Date
  endUtc: Date
  organizer: { name: string; email: string }
  attendee?: { name: string; email: string }
}

function pad(n: number): string {
  return n < 10 ? `0${n}` : `${n}`
}

function formatUtc(date: Date): string {
  return (
    `${date.getUTCFullYear()}` +
    `${pad(date.getUTCMonth() + 1)}` +
    `${pad(date.getUTCDate())}` +
    `T${pad(date.getUTCHours())}` +
    `${pad(date.getUTCMinutes())}` +
    `${pad(date.getUTCSeconds())}Z`
  )
}

function escapeText(s: string): string {
  return s
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;")
}

/**
 * Fold a single logical line to <=75 octets per RFC 5545.
 * Continuation lines start with a single space, which counts toward the 75.
 */
function foldLine(line: string): string {
  const bytes = Buffer.from(line, "utf8")
  if (bytes.length <= 75) return line
  const parts: string[] = []
  let cursor = 0
  // First physical line: up to 75 bytes, no leading space.
  parts.push(bytes.slice(0, 75).toString("utf8"))
  cursor = 75
  // Continuation lines: leading space + up to 74 bytes = 75 total.
  while (cursor < bytes.length) {
    const end = Math.min(cursor + 74, bytes.length)
    parts.push(" " + bytes.slice(cursor, end).toString("utf8"))
    cursor = end
  }
  return parts.join("\r\n")
}

export function buildIcs(input: IcsInput): string {
  const now = formatUtc(new Date())
  const domain = icalDomain()
  const uid = input.uid.includes("@") ? input.uid : `${input.uid}@${domain}`
  const status = input.method === "CANCEL" ? "CANCELLED" : "CONFIRMED"

  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Fluid//Scheduling//EN",
    "CALSCALE:GREGORIAN",
    `METHOD:${input.method}`,
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `SEQUENCE:${input.sequence}`,
    `DTSTAMP:${now}`,
    `DTSTART:${formatUtc(input.startUtc)}`,
    `DTEND:${formatUtc(input.endUtc)}`,
    `SUMMARY:${escapeText(input.summary)}`,
  ]
  if (input.description) {
    lines.push(`DESCRIPTION:${escapeText(input.description)}`)
  }
  if (input.location) {
    lines.push(`LOCATION:${escapeText(input.location)}`)
  }
  lines.push(
    `ORGANIZER;CN=${escapeText(input.organizer.name)}:mailto:${input.organizer.email}`,
  )
  if (input.attendee) {
    lines.push(
      `ATTENDEE;CN=${escapeText(input.attendee.name)};CUTYPE=INDIVIDUAL;ROLE=REQ-PARTICIPANT;PARTSTAT=NEEDS-ACTION;RSVP=TRUE:mailto:${input.attendee.email}`,
    )
  }
  lines.push(
    `STATUS:${status}`,
    "TRANSP:OPAQUE",
    "END:VEVENT",
    "END:VCALENDAR",
  )

  return lines.map(foldLine).join("\r\n") + "\r\n"
}

export function icsAttachment(
  ics: string,
  method: IcsMethod,
  filename = "invite.ics",
) {
  return {
    filename,
    content: Buffer.from(ics, "utf8").toString("base64"),
    contentType: `text/calendar; method=${method}; charset=UTF-8`,
  }
}
