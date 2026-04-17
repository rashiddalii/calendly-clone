import { z } from "zod"

export const createBookingSchema = z.object({
  eventTypeId: z.string().min(1, "Event type is required"),
  bookerName: z.string().trim().min(1, "Please enter your name").max(120),
  bookerEmail: z.string().email("Please enter a valid email address"),
  bookerNotes: z.string().trim().max(2000).optional().or(z.literal("")),
  // ISO 8601 UTC timestamps. The server re-derives endTime from duration and
  // re-checks availability before insert.
  startTime: z.string().datetime({ message: "Invalid start time" }),
  // IANA timezone string like "America/New_York". Used only for email display.
  bookerTimezone: z
    .string()
    .min(1, "Timezone is required")
    .max(80, "Timezone looks invalid"),
})

export const cancelBookingSchema = z.object({
  bookingId: z.string().min(1),
})

export type CreateBookingInput = z.infer<typeof createBookingSchema>
export type CancelBookingInput = z.infer<typeof cancelBookingSchema>
