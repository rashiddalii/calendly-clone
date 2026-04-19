"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { auth } from "@/lib/auth"
import { createBookingSchema } from "@/lib/validators/booking"
import {
  createBooking,
  cancelBooking,
  SlotUnavailableError,
} from "@/lib/services/booking"
import { getAvailableSlots } from "@/lib/services/slots"
import type { CreateBookingInput } from "@/lib/validators/booking"

const MAX_AVAILABILITY_RANGE_DAYS = 62

function isValidIsoDate(value: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!match) return false

  const year = Number.parseInt(match[1]!, 10)
  const month = Number.parseInt(match[2]!, 10)
  const day = Number.parseInt(match[3]!, 10)
  const date = new Date(Date.UTC(year, month - 1, day))

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  )
}

function dayNumber(value: string): number {
  const [year, month, day] = value
    .split("-")
    .map((part) => Number.parseInt(part, 10))
  return Math.floor(Date.UTC(year!, month! - 1, day!) / 86_400_000)
}

function isValidTimeZone(value: string): boolean {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: value }).format(new Date())
    return true
  } catch {
    return false
  }
}

const availabilityQuerySchema = z
  .object({
    userId: z.string().min(1),
    eventTypeId: z.string().min(1),
    bookerTimezone: z.string().min(1).max(80).refine(isValidTimeZone),
    from: z.string().refine(isValidIsoDate),
    to: z.string().refine(isValidIsoDate),
  })
  .superRefine((value, ctx) => {
    const fromDay = dayNumber(value.from)
    const toDay = dayNumber(value.to)
    const span = toDay - fromDay

    if (span < 0) {
      ctx.addIssue({
        code: "custom",
        path: ["to"],
        message: "End date must be on or after start date",
      })
    }

    if (span > MAX_AVAILABILITY_RANGE_DAYS) {
      ctx.addIssue({
        code: "custom",
        path: ["to"],
        message: "Date range is too large",
      })
    }
  })

export type CreateBookingResult =
  | { status: "success"; bookingId: string }
  | {
      status: "error"
      error: string
      fieldErrors?: Record<string, string>
      code?: "SLOT_UNAVAILABLE"
    }

/**
 * Public, unauthenticated action. Called by the booker form.
 */
export async function createBookingAction(
  input: CreateBookingInput,
): Promise<CreateBookingResult> {
  const parsed = createBookingSchema.safeParse(input)
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {}
    for (const issue of parsed.error.issues) {
      const key = issue.path[0]
      if (typeof key === "string" && !fieldErrors[key]) {
        fieldErrors[key] = issue.message
      }
    }
    return {
      status: "error",
      error: parsed.error.issues[0]?.message ?? "Invalid booking",
      fieldErrors,
    }
  }

  try {
    const booking = await createBooking(parsed.data)
    return { status: "success", bookingId: booking.id }
  } catch (err) {
    if (err instanceof SlotUnavailableError) {
      return { status: "error", error: err.message, code: "SLOT_UNAVAILABLE" }
    }
    return {
      status: "error",
      error: err instanceof Error ? err.message : "Something went wrong",
    }
  }
}

export async function cancelBookingAction(bookingId: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Not authenticated")
  await cancelBooking(bookingId, session.user.id)
  revalidatePath("/meetings")
  revalidatePath("/dashboard")
  revalidatePath("/events")
  return { status: "success" as const }
}

/**
 * Fetches availability for the booking page. Called from the client as a
 * server action (cheaper than building a REST endpoint).
 */
export async function getAvailabilityAction(input: {
  userId: string
  eventTypeId: string
  bookerTimezone: string
  from: string
  to: string
}) {
  const parsed = availabilityQuerySchema.safeParse(input)
  if (!parsed.success) return []

  return getAvailableSlots(parsed.data)
}
