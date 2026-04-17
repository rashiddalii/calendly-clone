/**
 * Availability engine. Given a host's configuration and a date range, compute
 * the bookable time slots for a particular event type, converted to the
 * booker's timezone.
 *
 * All database timestamps are stored in UTC. Weekly schedule + date overrides
 * are stored as HH:MM strings interpreted in the host's timezone. This module
 * is the single place where those two representations meet.
 */

import { prisma } from "@/app/lib/db"
import { addMinutes, addDays } from "date-fns"
import { fromZonedTime, toZonedTime, formatInTimeZone } from "date-fns-tz"
import { getBusyTimes } from "@/lib/services/calendar"
import type { TimeInterval, AvailableDay, TimeSlot } from "@/types"

interface SlotQuery {
  userId: string
  eventTypeId: string
  /** Booker's IANA timezone — used only to format the output labels. */
  bookerTimezone: string
  /** Inclusive start (YYYY-MM-DD in host timezone). */
  from: string
  /** Inclusive end (YYYY-MM-DD in host timezone). */
  to: string
}

/**
 * Step a Gregorian calendar date by `delta` days. `iso` must be `yyyy-MM-dd`.
 * Uses UTC date arithmetic only — safe for enumerating host calendar labels.
 */
export function addGregorianDays(iso: string, delta: number): string {
  const [y, m, d] = iso.split("-").map((n) => Number.parseInt(n, 10))
  const t = new Date(Date.UTC(y, m - 1, d))
  t.setUTCDate(t.getUTCDate() + delta)
  const yy = t.getUTCFullYear()
  const mm = String(t.getUTCMonth() + 1).padStart(2, "0")
  const dd = String(t.getUTCDate()).padStart(2, "0")
  return `${yy}-${mm}-${dd}`
}

/**
 * Every calendar day from `from` through `to` inclusive (`yyyy-MM-dd` strings).
 * Lexicographic order matches chronological order for ISO dates.
 */
export function* iterateInclusiveCalendarDays(
  from: string,
  to: string,
): Generator<string> {
  let cur = from
  while (cur <= to) {
    yield cur
    cur = addGregorianDays(cur, 1)
  }
}

/**
 * Convert "HH:MM" in `tz` on `dateInTz` (YYYY-MM-DD) to a UTC Date.
 */
function zonedTimeToUtc(dateInTz: string, hhmm: string, tz: string): Date {
  const [h, m] = hhmm.split(":").map((n) => Number.parseInt(n, 10))
  const localIso = `${dateInTz}T${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:00`
  return fromZonedTime(localIso, tz)
}

/**
 * Return the YYYY-MM-DD string of `date` as seen in `tz`.
 */
function toIsoDateInTz(date: Date, tz: string): string {
  return formatInTimeZone(date, tz, "yyyy-MM-dd")
}

/**
 * Return the day of week (0=Sun..6=Sat) of `dateIso` as interpreted in `tz`.
 */
function dayOfWeekInTz(dateIso: string, tz: string): number {
  const midnight = fromZonedTime(`${dateIso}T00:00:00`, tz)
  return toZonedTime(midnight, tz).getDay()
}

/** Subtract a set of busy intervals from a set of free intervals. */
export function subtractIntervals(
  free: TimeInterval[],
  busy: TimeInterval[],
): TimeInterval[] {
  if (busy.length === 0) return free
  const sortedBusy = [...busy].sort(
    (a, b) => a.start.getTime() - b.start.getTime(),
  )
  const result: TimeInterval[] = []
  for (const f of free) {
    let segments: TimeInterval[] = [f]
    for (const b of sortedBusy) {
      const nextSegments: TimeInterval[] = []
      for (const s of segments) {
        if (b.end <= s.start || b.start >= s.end) {
          nextSegments.push(s)
          continue
        }
        if (b.start > s.start) {
          nextSegments.push({ start: s.start, end: b.start })
        }
        if (b.end < s.end) {
          nextSegments.push({ start: b.end, end: s.end })
        }
      }
      segments = nextSegments
      if (segments.length === 0) break
    }
    result.push(...segments)
  }
  return result
}

/**
 * Slice a free interval into fixed-duration slots.
 * Trims `bufferBefore` / `bufferAfter` from the interval edges, then places
 * slots separated by `bufferAfter` between consecutive starts (Calendly-style
 * after-event padding).
 */
export function sliceIntoSlots(
  interval: TimeInterval,
  durationMin: number,
  bufferBeforeMin: number,
  bufferAfterMin: number,
): Date[] {
  const slots: Date[] = []
  const effectiveStart = addMinutes(interval.start, bufferBeforeMin)
  const effectiveEnd = addMinutes(interval.end, -bufferAfterMin)
  let cursor = effectiveStart
  const step = durationMin + bufferAfterMin
  while (
    addMinutes(cursor, durationMin).getTime() <= effectiveEnd.getTime()
  ) {
    slots.push(cursor)
    cursor = addMinutes(cursor, step)
  }
  return slots
}

function sameInstant(aIso: string, b: Date): boolean {
  const t = new Date(aIso).getTime()
  return !Number.isNaN(t) && t === b.getTime()
}

/**
 * Main entry point. Returns a list of days, each with the slots available to
 * book, converted into the booker's timezone.
 */
export async function getAvailableSlots(
  query: SlotQuery,
): Promise<AvailableDay[]> {
  const { userId, eventTypeId, bookerTimezone, from, to } = query

  const [user, eventType, availability] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { timezone: true },
    }),
    prisma.eventType.findFirst({
      where: { id: eventTypeId, userId, deletedAt: null },
    }),
    prisma.availability.findMany({ where: { userId } }),
  ])

  if (!user || !eventType || !eventType.isActive) return []

  const hostTz = user.timezone || "UTC"
  const now = new Date()
  const earliestBookable = addMinutes(now, eventType.minNotice)
  const latestBookable = addDays(now, eventType.maxDaysInFuture)

  const rangeStartUtc = fromZonedTime(`${from}T00:00:00`, hostTz)
  const rangeEndExclusiveUtc = fromZonedTime(
    `${addGregorianDays(to, 1)}T00:00:00`,
    hostTz,
  )

  const [overrides, bookings] = await Promise.all([
    prisma.dateOverride.findMany({
      where: {
        userId,
        date: {
          gte: new Date(`${from}T00:00:00.000Z`),
          lte: new Date(`${to}T00:00:00.000Z`),
        },
      },
    }),
    prisma.booking.findMany({
      where: {
        hostId: userId,
        status: "CONFIRMED",
        startTime: { lt: rangeEndExclusiveUtc },
        endTime: { gt: rangeStartUtc },
      },
      select: { startTime: true, endTime: true },
    }),
  ])

  const byDay = new Map<number, { startTime: string; endTime: string }[]>()
  for (const row of availability) {
    const list = byDay.get(row.dayOfWeek) ?? []
    list.push({ startTime: row.startTime, endTime: row.endTime })
    byDay.set(row.dayOfWeek, list)
  }

  const overrideByDate = new Map<
    string,
    { startTime: string | null; endTime: string | null }
  >()
  for (const o of overrides) {
    const iso = toIsoDateInTz(o.date, "UTC")
    overrideByDate.set(iso, { startTime: o.startTime, endTime: o.endTime })
  }

  const googleBusy = await getBusyTimes(
    userId,
    rangeStartUtc,
    rangeEndExclusiveUtc,
  )

  const bookingIntervals: TimeInterval[] = bookings.map((b) => ({
    start: b.startTime,
    end: b.endTime,
  }))
  const allBusy: TimeInterval[] = [...bookingIntervals, ...googleBusy]

  const result: AvailableDay[] = []

  for (const dateIso of iterateInclusiveCalendarDays(from, to)) {
    const override = overrideByDate.get(dateIso)
    let intervals: { startTime: string; endTime: string }[]
    if (override) {
      if (!override.startTime || !override.endTime) {
        intervals = []
      } else {
        intervals = [
          { startTime: override.startTime, endTime: override.endTime },
        ]
      }
    } else {
      const dow = dayOfWeekInTz(dateIso, hostTz)
      intervals = byDay.get(dow) ?? []
    }

    let freeUtc: TimeInterval[] = intervals.map((i) => ({
      start: zonedTimeToUtc(dateIso, i.startTime, hostTz),
      end: zonedTimeToUtc(dateIso, i.endTime, hostTz),
    }))

    freeUtc = subtractIntervals(freeUtc, allBusy)

    freeUtc = freeUtc
      .map((f) => ({
        start: f.start < earliestBookable ? earliestBookable : f.start,
        end: f.end > latestBookable ? latestBookable : f.end,
      }))
      .filter((f) => f.start < f.end)

    const slotStarts: Date[] = []
    for (const f of freeUtc) {
      slotStarts.push(
        ...sliceIntoSlots(
          f,
          eventType.duration,
          eventType.bufferBefore,
          eventType.bufferAfter,
        ),
      )
    }

    const slots: TimeSlot[] = slotStarts.map((start) => {
      const end = addMinutes(start, eventType.duration)
      return {
        startUtc: start.toISOString(),
        endUtc: end.toISOString(),
        label: formatInTimeZone(start, bookerTimezone, "h:mm a"),
      }
    })

    if (slots.length > 0) {
      result.push({ date: dateIso, slots })
    }
  }

  return result
}

/**
 * Check whether a specific slot is still bookable. Used at booking-creation
 * time to re-verify after the booker filled in the form.
 */
export async function isSlotStillAvailable(
  userId: string,
  eventTypeId: string,
  startUtcIso: string,
): Promise<boolean> {
  const start = new Date(startUtcIso)
  if (Number.isNaN(start.getTime())) return false

  const hostRow = await prisma.user.findUnique({
    where: { id: userId },
    select: { timezone: true },
  })
  const hostTz = hostRow?.timezone ?? "UTC"

  const dateIso = formatInTimeZone(start, hostTz, "yyyy-MM-dd")
  const from = addGregorianDays(dateIso, -1)
  const to = addGregorianDays(dateIso, 1)

  const days = await getAvailableSlots({
    userId,
    eventTypeId,
    bookerTimezone: "UTC",
    from,
    to,
  })
  for (const day of days) {
    if (day.slots.some((s) => sameInstant(s.startUtc, start))) return true
  }
  return false
}
