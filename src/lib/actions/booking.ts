"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import { createBookingSchema } from "@/lib/validators/booking"
import {
  createBooking,
  cancelBooking,
  SlotUnavailableError,
} from "@/lib/services/booking"
import { getAvailableSlots } from "@/lib/services/slots"
import type { CreateBookingInput } from "@/lib/validators/booking"

export type CreateBookingResult =
  | { status: "success"; bookingId: string }
  | { status: "error"; error: string; fieldErrors?: Record<string, string> }

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
      return { status: "error", error: err.message }
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
  return getAvailableSlots(input)
}
