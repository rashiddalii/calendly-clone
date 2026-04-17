import { prisma } from "@/app/lib/db"
import type {
  WeeklyScheduleInput,
  DateOverrideInput,
} from "@/lib/validators/availability"
import type { Availability, DateOverride } from "@/generated/prisma/client"

/**
 * Fetch the user's weekly availability rows, sorted by day then start time.
 */
export async function getWeeklyAvailability(
  userId: string,
): Promise<Availability[]> {
  return prisma.availability.findMany({
    where: { userId },
    orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
  })
}

/**
 * Fetch date overrides for the user, optionally filtered to a date range.
 */
export async function getDateOverrides(
  userId: string,
  range?: { from: Date; to: Date },
): Promise<DateOverride[]> {
  return prisma.dateOverride.findMany({
    where: {
      userId,
      ...(range && {
        date: { gte: range.from, lte: range.to },
      }),
    },
    orderBy: { date: "asc" },
  })
}

/**
 * Replace the entire weekly schedule for a user in a single transaction.
 * Simpler than diffing — with only ~10 rows per user the churn is fine.
 */
export async function saveWeeklySchedule(
  userId: string,
  input: WeeklyScheduleInput,
): Promise<void> {
  const rows: { dayOfWeek: number; startTime: string; endTime: string }[] = []
  for (const [dayKey, dayConfig] of Object.entries(input.days)) {
    if (!dayConfig.enabled) continue
    const dayOfWeek = Number.parseInt(dayKey, 10)
    for (const slot of dayConfig.slots) {
      rows.push({
        dayOfWeek,
        startTime: slot.startTime,
        endTime: slot.endTime,
      })
    }
  }

  await prisma.$transaction([
    prisma.availability.deleteMany({ where: { userId } }),
    ...(rows.length > 0
      ? [
          prisma.availability.createMany({
            data: rows.map((r) => ({ userId, ...r })),
          }),
        ]
      : []),
  ])
}

/**
 * Insert or update a single date override. Null start/end = whole-day block.
 */
export async function upsertDateOverride(
  userId: string,
  input: DateOverrideInput,
): Promise<DateOverride> {
  const date = new Date(`${input.date}T00:00:00.000Z`)
  return prisma.dateOverride.upsert({
    where: { userId_date: { userId, date } },
    create: {
      userId,
      date,
      startTime: input.startTime,
      endTime: input.endTime,
    },
    update: {
      startTime: input.startTime,
      endTime: input.endTime,
    },
  })
}

export async function deleteDateOverride(
  userId: string,
  date: string,
): Promise<void> {
  const d = new Date(`${date}T00:00:00.000Z`)
  await prisma.dateOverride.deleteMany({
    where: { userId, date: d },
  })
}

/**
 * Normalize DB rows into a day-keyed map used by the editor UI.
 */
export function normalizeWeeklySchedule(rows: Availability[]) {
  const days: Record<number, { startTime: string; endTime: string }[]> = {
    0: [],
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
  }
  for (const row of rows) {
    days[row.dayOfWeek].push({
      startTime: row.startTime,
      endTime: row.endTime,
    })
  }
  return days
}
