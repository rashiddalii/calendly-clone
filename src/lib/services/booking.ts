import { prisma } from "@/app/lib/db"
import { addMinutes } from "date-fns"
import { createHash, randomUUID } from "crypto"
import { isSlotStillAvailable } from "@/lib/services/slots"
import {
  createCalendarEvent,
  deleteCalendarEvent,
} from "@/lib/services/calendar"
import {
  createZoomMeeting,
  deleteZoomMeeting,
} from "@/lib/services/zoom"
import {
  createTeamsMeeting,
  deleteTeamsMeeting,
} from "@/lib/services/teams"
import {
  sendBookingConfirmationToBooker,
  sendBookingNotificationToHost,
  sendCancellationToBooker,
  sendCancellationToHost,
} from "@/lib/services/email"
import { APP_NAME } from "@/lib/brand"
import type { CreateBookingInput } from "@/lib/validators/booking"

export class SlotUnavailableError extends Error {
  constructor() {
    super("That time is no longer available. Please pick another slot.")
    this.name = "SlotUnavailableError"
  }
}

function advisoryLockKeys(value: string): [number, number] {
  const digest = createHash("sha256").update(value).digest()
  return [digest.readInt32BE(0), digest.readInt32BE(4)]
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

  // Atomic host-level lock + conflict check + insert. A host-level lock is
  // deliberately conservative: it prevents overlapping bookings across all of
  // the host's event types, not only identical slot starts.
  const booking = await prisma.$transaction(async (tx) => {
    const [lockA, lockB] = advisoryLockKeys(`booking-host:${eventType.userId}`)
    await tx.$queryRaw<{ locked: number }[]>`
      WITH lock AS (
        SELECT pg_advisory_xact_lock(${lockA}, ${lockB})
      )
      SELECT 1::int AS locked
      FROM lock
    `

    const conflict = await tx.booking.findFirst({
      where: {
        hostId: eventType.userId,
        status: { not: "CANCELLED" },
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
        bookerPhone: input.bookerPhone || null,
        bookerTimezone: input.bookerTimezone,
        startTime: startUtc,
        endTime: endUtc,
        icalUid: randomUUID(),
        icalSequence: 0,
      },
    })
  })

  // Post-booking side effects — never let these fail the booking.
  const hostName =
    eventType.user.name || eventType.user.username || "Your host"
  const description = input.bookerNotes
    ? `${input.bookerNotes}\n\nBooked via ${APP_NAME}.`
    : `Booked via ${APP_NAME}.`

  // Create provider-specific meeting link.
  let meetingUrl: string | null = null
  let meetingId: string | null = null
  let meetingPassword: string | null = null
  const meetingProvider = eventType.location ?? null

  if (eventType.location === "zoom") {
    const zoomResult = await createZoomMeeting({
      userId: eventType.userId,
      topic: `${eventType.title} with ${input.bookerName}`,
      startUtc,
      durationMin: eventType.duration,
    }).catch((err) => { console.warn("[booking] zoom meeting failed", err); return null })
    if (zoomResult) {
      meetingUrl = zoomResult.joinUrl
      meetingId = String(zoomResult.id)
      meetingPassword = zoomResult.password || null
    }
  } else if (eventType.location === "teams") {
    const teamsResult = await createTeamsMeeting({
      userId: eventType.userId,
      subject: `${eventType.title} with ${input.bookerName}`,
      description,
      startUtc,
      endUtc,
      attendeeEmail: input.bookerEmail,
      attendeeName: input.bookerName,
    }).catch((err) => { console.warn("[booking] teams meeting failed", err); return null })
    if (teamsResult) {
      meetingUrl = teamsResult.joinUrl
      meetingId = teamsResult.calendarEventId
    }
  }

  // Create Google Calendar event (includes Meet link when location=google_meet).
  const calendarDescriptionParts: (string | null | undefined)[] = []
  if (meetingUrl) calendarDescriptionParts.push(`Join: ${meetingUrl}`)
  if (eventType.location === "phone" && input.bookerPhone)
    calendarDescriptionParts.push(`Call: ${input.bookerPhone}`)
  if (eventType.location === "in_person" && eventType.locationAddress)
    calendarDescriptionParts.push(`Meeting at: ${eventType.locationAddress}`)
  if (input.bookerNotes) calendarDescriptionParts.push(input.bookerNotes)
  calendarDescriptionParts.push(`Booked via ${APP_NAME}.`)

  const calendarDescription = calendarDescriptionParts.filter(Boolean).join("\n\n")

  const calendarResult = await createCalendarEvent({
    userId: eventType.userId,
    summary: `${eventType.title} with ${input.bookerName}`,
    description: calendarDescription,
    startUtc,
    endUtc,
    attendeeEmail: input.bookerEmail,
    attendeeName: input.bookerName,
    requestMeetLink: eventType.location === "google_meet",
    physicalLocation:
      eventType.location === "in_person"
        ? (eventType.locationAddress ?? undefined)
        : undefined,
  })

  if (eventType.location === "google_meet") {
    meetingUrl = calendarResult?.meetingUrl ?? null
  }
  const calendarEventId = calendarResult?.id ?? null

  const emailCtx = {
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
    bookerPhone: input.bookerPhone || null,
    locationAddress: eventType.location === "in_person" ? (eventType.locationAddress ?? null) : null,
    bookingId: booking.id,
    icalUid: booking.icalUid!,
    icalSequence: booking.icalSequence,
    meetingUrl,
  }

  await sendBookingConfirmationToBooker(emailCtx).catch((err) =>
    console.warn("[booking] booker email failed", err),
  )
  await new Promise((r) => setTimeout(r, 4000))
  await sendBookingNotificationToHost(emailCtx).catch((err) =>
    console.warn("[booking] host email failed", err),
  )

  const updateData: Record<string, unknown> = {}
  if (calendarEventId) updateData.calendarEventId = calendarEventId
  if (meetingUrl) updateData.meetingUrl = meetingUrl
  if (meetingId) updateData.meetingId = meetingId
  if (meetingPassword) updateData.meetingPassword = meetingPassword
  if (meetingProvider) updateData.meetingProvider = meetingProvider

  if (Object.keys(updateData).length > 0) {
    await prisma.booking.update({ where: { id: booking.id }, data: updateData })
  }

  return { ...booking, calendarEventId, meetingUrl, meetingId, meetingPassword }
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

  const nextSequence = booking.icalSequence + 1
  const updated = await prisma.booking.update({
    where: { id: booking.id },
    data: {
      status: "CANCELLED",
      cancelledAt: new Date(),
      icalSequence: nextSequence,
      icalUid: booking.icalUid ?? randomUUID(),
    },
  })

  const hostName = booking.host.name || booking.host.username || "Your host"
  const emailCtx = {
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
    icalUid: updated.icalUid!,
    icalSequence: nextSequence,
  }

  await Promise.all([
    deleteCalendarEvent(booking.hostId, booking.calendarEventId),
    booking.meetingProvider === "zoom"
      ? deleteZoomMeeting(booking.hostId, booking.meetingId).catch((err) =>
          console.warn("[booking] zoom delete failed", err),
        )
      : booking.meetingProvider === "teams"
        ? deleteTeamsMeeting(booking.hostId, booking.meetingId).catch((err) =>
            console.warn("[booking] teams delete failed", err),
          )
        : Promise.resolve(),
    sendCancellationToBooker(emailCtx).catch((err) =>
      console.warn("[booking] cancel-booker email failed", err),
    ),
    sendCancellationToHost(emailCtx).catch((err) =>
      console.warn("[booking] cancel-host email failed", err),
    ),
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
