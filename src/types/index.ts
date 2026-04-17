import type {
  Booking,
  EventType,
  User,
  Availability,
  DateOverride,
} from "@/generated/prisma/client"

/** An interval in UTC. */
export interface TimeInterval {
  start: Date
  end: Date
}

/** A bookable slot presented to a booker, already converted to their timezone. */
export interface TimeSlot {
  /** UTC instant of the start — send this back to the server when booking. */
  startUtc: string
  /** UTC instant of the end (start + duration). */
  endUtc: string
  /** Human label in booker's timezone, e.g. "9:30 AM". */
  label: string
}

/** A date (YYYY-MM-DD in host timezone) plus its available slots. */
export interface AvailableDay {
  date: string
  slots: TimeSlot[]
}

/** Weekly availability normalized into a day->slots map (0=Sunday..6=Saturday). */
export interface WeeklySchedule {
  [dayOfWeek: number]: Array<{ startTime: string; endTime: string }>
}

/** Booking + relations needed for emails and dashboard cards. */
export type BookingWithRelations = Booking & {
  eventType: EventType
  host: User
}

/** Shape returned by the public booking page loader. */
export interface PublicEventTypeView {
  id: string
  title: string
  slug: string
  description: string | null
  duration: number
  color: string
  host: {
    name: string | null
    username: string | null
    bio: string | null
    image: string | null
    timezone: string
  }
}

export type { Availability, DateOverride, EventType, Booking, User }
