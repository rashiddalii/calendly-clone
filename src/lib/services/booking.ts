import { prisma } from "@/app/lib/db"
import { addMinutes } from "date-fns"
import { isSlotStillAvailable } from "@/lib/services/slots"
import {
  createCalendarEvent,
  deleteCalendarEvent,
} from "@/lib/services/calendar"
import {
  sendBookingConfirmationToBooker,
  sendBookingNotificationToHost,
  sendCancellationToBooker,
  sendCancellationToHost,
} from "@/lib/services/email"
import type { CreateBookingInput } from "@/lib/validators/booking"

export class SlotUnavailableError extends Error {
  constructor() {
    super("That time is no longer available. Please pick another slot.")
    this.name = "SlotUnavailableError"
  }
}

/**
 * Create a booking. Re-verifies availability inside the transaction so two
 * simultaneous bookers can't take the same slot.
 */
export async function createBooking(input: CreateBookingInput) {
  const eventType = await prisma.eventType.findFirst({
    where: { id: input.eventTypeId, deletedAt: null, isActive: true },
    include: { user: true },
  })
  if (!eventType) throw new Error("Event type not found")

  const startUtc = new Date(input.startTime)
  if (Number.isNaN(startUtc.getTime())) throw new Error("Invalid start time")
  const endUtc = addMinutes(startUtc, eventType.duration)

  // Re-check availability. Note: this is a best-effort guard; the DB-level
  // conflict check below is the true source of truth.
  const stillFree = await isSlotStillAvailable(
    eventType.userId,
    eventType.id,
    startUtc.toISOString(),
  )
  if (!stillFree) throw new SlotUnavailableError()

  // Atomic conflict check + insert.
  const booking = await prisma.$transaction(async (tx) => {
    const conflict = await tx.booking.findFirst({
      where: {
        hostId: eventType.userId,
        status: "CONFIRMED",
        // Overlap: existing.start < new.end AND existing.end > new.start
        startTime: { lt: endUtc },
        endTime: { gt: startUtc },
      },
      select: { id: true },
    })
    if (conflict) throw new SlotUnavailableError()

    return tx.booking.create({
      data: {
        eventTypeId: eventType.id,
        hostId: eventType.userId,
        bookerName: input.bookerName,
        bookerEmail: input.bookerEmail,
        bookerNotes: input.bookerNotes || null,
        bookerTimezone: input.bookerTimezone,
        startTime: startUtc,
        endTime: endUtc,
      },
    })
  })

  // Post-booking side effects — never let these fail the booking.
  const hostName =
    eventType.user.name || eventType.user.username || "Your host"
  const description = input.bookerNotes
    ? `${input.bookerNotes}\n\nBooked via Fluid.`
    : "Booked via Fluid."

  const [calendarEventId] = await Promise.all([
    createCalendarEvent({
      userId: eventType.userId,
      summary: `${eventType.title} with ${input.bookerName}`,
      description,
      startUtc,
      endUtc,
      attendeeEmail: input.bookerEmail,
      attendeeName: input.bookerName,
    }),
    sendBookingConfirmationToBooker({
      eventTitle: eventType.title,
      hostName,
      hostEmail: eventType.user.email,
      bookerName: input.bookerName,
      bookerEmail: input.bookerEmail,
      startUtc,
      endUtc,
      hostTimezone: eventType.user.timezone,
      bookerTimezone: input.bookerTimezone,
      bookerNotes: input.bookerNotes,
      bookingId: booking.id,
    }).catch((err) => console.warn("[booking] booker email failed", err)),
    sendBookingNotificationToHost({
      eventTitle: eventType.title,
      hostName,
      hostEmail: eventType.user.email,
      bookerName: input.bookerName,
      bookerEmail: input.bookerEmail,
      startUtc,
      endUtc,
      hostTimezone: eventType.user.timezone,
      bookerTimezone: input.bookerTimezone,
      bookerNotes: input.bookerNotes,
      bookingId: booking.id,
    }).catch((err) => console.warn("[booking] host email failed", err)),
  ])

  if (calendarEventId) {
    await prisma.booking.update({
      where: { id: booking.id },
      data: { calendarEventId },
    })
  }

  return { ...booking, calendarEventId: calendarEventId ?? null }
}

export async function cancelBooking(bookingId: string, actorUserId: string) {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { eventType: true, host: true },
  })
  if (!booking || booking.hostId !== actorUserId) {
    throw new Error("Booking not found")
  }
  if (booking.status === "CANCELLED") return booking

  const updated = await prisma.booking.update({
    where: { id: booking.id },
    data: { status: "CANCELLED", cancelledAt: new Date() },
  })

  const hostName = booking.host.name || booking.host.username || "Your host"
  await Promise.all([
    deleteCalendarEvent(booking.hostId, booking.calendarEventId),
    sendCancellationToBooker({
      eventTitle: booking.eventType.title,
      hostName,
      hostEmail: booking.host.email,
      bookerName: booking.bookerName,
      bookerEmail: booking.bookerEmail,
      startUtc: booking.startTime,
      endUtc: booking.endTime,
      hostTimezone: booking.host.timezone,
      bookerTimezone: booking.bookerTimezone,
      bookingId: booking.id,
    }).catch((err) => console.warn("[booking] cancel-booker email failed", err)),
    sendCancellationToHost({
      eventTitle: booking.eventType.title,
      hostName,
      hostEmail: booking.host.email,
      bookerName: booking.bookerName,
      bookerEmail: booking.bookerEmail,
      startUtc: booking.startTime,
      endUtc: booking.endTime,
      hostTimezone: booking.host.timezone,
      bookerTimezone: booking.bookerTimezone,
      bookingId: booking.id,
    }).catch((err) => console.warn("[booking] cancel-host email failed", err)),
  ])

  return updated
}

export async function listBookings(userId: string) {
  return prisma.booking.findMany({
    where: { hostId: userId },
    include: { eventType: true, host: true },
    orderBy: { startTime: "desc" },
  })
}
