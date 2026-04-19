import { z } from "zod"

// "HH:MM" 24h, e.g. "09:00", "17:30"
const timeStringSchema = z
  .string()
  .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Time must be HH:MM in 24-hour format")

function timeToMinutes(t: string): number {
  const [h, m] = t.split(":").map(Number)
  return h * 60 + m
}

const daySlotSchema = z
  .object({
    startTime: timeStringSchema,
    endTime: timeStringSchema,
  })
  .refine((v) => v.startTime < v.endTime, {
    message: "Start time must be before end time",
    path: ["endTime"],
  })
  .refine(
    (v) => timeToMinutes(v.endTime) - timeToMinutes(v.startTime) >= 15,
    {
      message: "Each slot must be at least 15 minutes",
      path: ["endTime"],
    },
  )

const dayConfigSchema = z
  .object({
    enabled: z.boolean(),
    slots: z.array(daySlotSchema).max(6, "Maximum 6 intervals per day"),
  })
  .superRefine((day, ctx) => {
    if (!day.enabled || day.slots.length < 2) return

    // Sort by start time and check adjacent pairs for overlap
    const sorted = [...day.slots].sort(
      (a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime),
    )

    for (let i = 1; i < sorted.length; i++) {
      if (timeToMinutes(sorted[i].startTime) < timeToMinutes(sorted[i - 1].endTime)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Intervals overlap: ${sorted[i].startTime} starts before ${sorted[i - 1].endTime} ends`,
          path: ["slots"],
        })
        return
      }
    }
  })

export const weeklyScheduleSchema = z.object({
  // Key: dayOfWeek 0..6 (0=Sun). Value: enabled + slots for that day.
  days: z.record(
    z.string().regex(/^[0-6]$/, "Day must be 0-6"),
    dayConfigSchema,
  ),
})

export const dateOverrideSchema = z
  .object({
    // YYYY-MM-DD in host's timezone; service layer converts to DateTime.
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
    // Null start+end means "block this whole date".
    startTime: timeStringSchema.nullable(),
    endTime: timeStringSchema.nullable(),
  })
  .refine(
    (v) =>
      (v.startTime === null && v.endTime === null) ||
      (v.startTime !== null &&
        v.endTime !== null &&
        v.startTime < v.endTime &&
        timeToMinutes(v.endTime) - timeToMinutes(v.startTime) >= 15),
    {
      message:
        "Either both times are empty (to block the date) or start must be before end with at least 15 minutes",
      path: ["endTime"],
    },
  )

export type WeeklyScheduleInput = z.infer<typeof weeklyScheduleSchema>
export type DateOverrideInput = z.infer<typeof dateOverrideSchema>
export type DaySlotInput = z.infer<typeof daySlotSchema>

// Export helper so components can reuse without re-implementing
export { timeToMinutes }
