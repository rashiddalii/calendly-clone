import { z } from "zod"

// "HH:MM" 24h, e.g. "09:00", "17:30". Minute must be multiple of 5 for UX sanity.
const timeStringSchema = z
  .string()
  .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Time must be HH:MM in 24-hour format")

const daySlotSchema = z
  .object({
    startTime: timeStringSchema,
    endTime: timeStringSchema,
  })
  .refine((v) => v.startTime < v.endTime, {
    message: "Start time must be before end time",
    path: ["endTime"],
  })

export const weeklyScheduleSchema = z.object({
  // Key: dayOfWeek 0..6 (0=Sun). Value: enabled + slots for that day.
  days: z.record(
    z
      .string()
      .regex(/^[0-6]$/, "Day must be 0-6"),
    z.object({
      enabled: z.boolean(),
      // Allow multiple intervals per day (e.g. 9-12, 13-17).
      slots: z.array(daySlotSchema).max(6),
    }),
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
      (v.startTime !== null && v.endTime !== null && v.startTime < v.endTime),
    {
      message:
        "Either both times are empty (to block the date) or start must be before end",
      path: ["endTime"],
    },
  )

export type WeeklyScheduleInput = z.infer<typeof weeklyScheduleSchema>
export type DateOverrideInput = z.infer<typeof dateOverrideSchema>
export type DaySlotInput = z.infer<typeof daySlotSchema>
