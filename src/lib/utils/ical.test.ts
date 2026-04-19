import { describe, expect, it } from "vitest"
import { buildIcs, icsAttachment } from "./ical"

const baseInput = {
  uid: "smoke-test-uid",
  sequence: 0 as number,
  summary: "Coffee chat with Alice",
  startUtc: new Date("2026-05-01T15:00:00Z"),
  endUtc: new Date("2026-05-01T15:30:00Z"),
  organizer: { name: "Alice Host", email: "alice@example.com" },
  attendee: { name: "Bob Booker", email: "bob@example.com" },
}

describe("buildIcs", () => {
  it("emits a valid REQUEST VCALENDAR with CRLF line endings", () => {
    const ics = buildIcs({ ...baseInput, method: "REQUEST" })
    // Check folded form for structure
    expect(ics.startsWith("BEGIN:VCALENDAR\r\n")).toBe(true)
    expect(ics).toContain("\r\nMETHOD:REQUEST\r\n")
    expect(ics.endsWith("\r\n")).toBe(true)
    // Unfold (RFC 5545: CRLF + WSP = folded continuation) before checking content
    const unfolded = ics.replace(/\r\n[ \t]/g, "")
    expect(unfolded).toContain("\r\nSTATUS:CONFIRMED\r\n")
    expect(unfolded).toContain("UID:smoke-test-uid@")
    expect(unfolded).toContain("DTSTART:20260501T150000Z")
    expect(unfolded).toContain("DTEND:20260501T153000Z")
    expect(unfolded).toContain("ORGANIZER;CN=Alice Host:mailto:alice@example.com")
    expect(unfolded).toContain(
      "ATTENDEE;CN=Bob Booker;CUTYPE=INDIVIDUAL;ROLE=REQ-PARTICIPANT;PARTSTAT=NEEDS-ACTION;RSVP=TRUE:mailto:bob@example.com",
    )
  })

  it("emits CANCEL with bumped sequence and STATUS:CANCELLED", () => {
    const ics = buildIcs({ ...baseInput, method: "CANCEL", sequence: 1 })
    expect(ics).toContain("\r\nMETHOD:CANCEL\r\n")
    expect(ics).toContain("\r\nSEQUENCE:1\r\n")
    expect(ics).toContain("\r\nSTATUS:CANCELLED\r\n")
  })

  it("emits PUBLISH without RSVP attendee fields", () => {
    const ics = buildIcs({
      ...baseInput,
      method: "PUBLISH",
      attendee: undefined,
    })
    const unfolded = ics.replace(/\r\n[ \t]/g, "")
    expect(unfolded).toContain("\r\nMETHOD:PUBLISH\r\n")
    expect(unfolded).toContain("ORGANIZER;CN=Alice Host:mailto:alice@example.com")
    expect(unfolded).not.toContain("ATTENDEE")
    expect(unfolded).not.toContain("RSVP=TRUE")
    expect(unfolded).toContain("\r\nSTATUS:CONFIRMED\r\n")
  })

  it("escapes commas, semicolons, and newlines in text fields", () => {
    const ics = buildIcs({
      ...baseInput,
      method: "REQUEST",
      description: "Line one; with, punctuation\nand newline",
    })
    expect(ics).toContain(
      "DESCRIPTION:Line one\\; with\\, punctuation\\nand newline",
    )
  })

  it("folds physical lines to <=75 octets with CRLF+space continuation", () => {
    const ics = buildIcs({
      ...baseInput,
      method: "REQUEST",
      description:
        "A very long description intended to exceed seventy five octets so that the folding logic must split this into at least one continuation line per RFC 5545.",
    })
    for (const line of ics.split("\r\n")) {
      expect(Buffer.byteLength(line, "utf8")).toBeLessThanOrEqual(75)
    }
  })

  it("preserves explicit @domain in uid when supplied", () => {
    const ics = buildIcs({
      ...baseInput,
      method: "REQUEST",
      uid: "explicit@custom.example",
    })
    expect(ics).toContain("UID:explicit@custom.example")
  })
})

describe("icsAttachment", () => {
  it("wraps ICS as base64 with text/calendar contentType including method", () => {
    const ics = buildIcs({ ...baseInput, method: "PUBLISH" })
    const att = icsAttachment(ics, "PUBLISH")
    expect(att.filename).toBe("invite.ics")
    expect(att.contentType).toBe(
      "text/calendar; method=PUBLISH; charset=UTF-8",
    )
    expect(Buffer.from(att.content, "base64").toString("utf8")).toBe(ics)
  })
})
