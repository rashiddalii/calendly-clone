import type { Availability } from "@/generated/prisma/client"

function to12h(hm: string): string {
  const [hRaw, mRaw] = hm.split(":")
  const h = Number.parseInt(hRaw, 10)
  const m = Number.parseInt(mRaw, 10)
  const period = h >= 12 ? "pm" : "am"
  const h12 = h % 12 === 0 ? 12 : h % 12
  if (m === 0) return `${h12}${period}`
  return `${h12}:${m.toString().padStart(2, "0")}${period}`
}

function rangeLabel(start: string, end: string): string {
  return `${to12h(start)} - ${to12h(end)}`
}

function slotsKey(slots: { start: string; end: string }[]): string {
  return slots.map((s) => `${s.start}-${s.end}`).join("|")
}

/**
 * Short human summary for the scheduling list (Calendly-style subtitle).
 */
export function summarizeWeeklyAvailability(rows: Availability[]): string {
  if (rows.length === 0) {
    return "Set hours in Availability"
  }

  const byDay = new Map<number, { start: string; end: string }[]>()
  for (const r of rows) {
    const list = byDay.get(r.dayOfWeek) ?? []
    list.push({ start: r.startTime, end: r.endTime })
    byDay.set(r.dayOfWeek, list)
  }

  for (const slots of byDay.values()) {
    slots.sort((a, b) => a.start.localeCompare(b.start))
  }

  const keyForDay = (d: number) => {
    const slots = byDay.get(d)
    if (!slots?.length) return ""
    return slotsKey(slots)
  }

  const weekdays = [1, 2, 3, 4, 5]
  const weekend = [0, 6]
  const wkKey = keyForDay(1)
  const allWeekdaysMatch =
    wkKey !== "" && weekdays.every((d) => keyForDay(d) === wkKey)
  const weekendOff = weekend.every((d) => keyForDay(d) === "")

  if (allWeekdaysMatch && weekendOff) {
    const monday = byDay.get(1)!
    if (monday.length === 1) {
      return `Weekdays, ${rangeLabel(monday[0].start, monday[0].end)}`
    }
    return "Weekdays, multiple time windows"
  }

  const allDays = [0, 1, 2, 3, 4, 5, 6]
  const keys = allDays.map(keyForDay)
  const nonEmpty = keys.filter(Boolean)
  if (nonEmpty.length === 7 && new Set(nonEmpty).size === 1) {
    const first = rows[0]
    return `Every day, ${rangeLabel(first.startTime, first.endTime)}`
  }

  return "Custom weekly hours"
}
