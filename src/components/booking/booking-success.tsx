"use client"

import Link from "next/link"
import { formatInTimeZone } from "date-fns-tz"
import { format } from "date-fns"
import type { PublicEventTypeView, TimeSlot } from "@/types"

interface BookingSuccessProps {
  eventType: PublicEventTypeView
  slot: TimeSlot
  bookerTimezone: string
  bookerName: string
}

/**
 * Format a Date to Google Calendar's compact UTC format: `20240315T090000Z`
 */
function toGCalDate(isoUtc: string): string {
  const d = new Date(isoUtc)
  const y = d.getUTCFullYear()
  const mo = String(d.getUTCMonth() + 1).padStart(2, "0")
  const day = String(d.getUTCDate()).padStart(2, "0")
  const h = String(d.getUTCHours()).padStart(2, "0")
  const mi = String(d.getUTCMinutes()).padStart(2, "0")
  const s = String(d.getUTCSeconds()).padStart(2, "0")
  return `${y}${mo}${day}T${h}${mi}${s}Z`
}

export function BookingSuccess({
  eventType,
  slot,
  bookerTimezone,
  bookerName,
}: BookingSuccessProps) {
  const slotDate = new Date(slot.startUtc)

  const dateLabel = format(
    new Date(
      formatInTimeZone(slotDate, bookerTimezone, "yyyy-MM-dd") + "T12:00:00",
    ),
    "EEEE, MMMM d, yyyy",
  )
  const startLabel = formatInTimeZone(slotDate, bookerTimezone, "h:mm a")
  const endLabel = formatInTimeZone(
    new Date(slot.endUtc),
    bookerTimezone,
    "h:mm a",
  )

  // Google Calendar URL
  const gcalTitle = encodeURIComponent(eventType.title)
  const gcalDates = `${toGCalDate(slot.startUtc)}/${toGCalDate(slot.endUtc)}`
  const gcalDetails = encodeURIComponent(
    `Meeting with ${eventType.host.name ?? eventType.host.username}`,
  )
  const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${gcalTitle}&dates=${gcalDates}&details=${gcalDetails}`

  const hostName = eventType.host.name ?? eventType.host.username ?? "the host"
  const username = eventType.host.username ?? ""

  return (
    <div className="flex w-full max-w-lg flex-col items-center py-12 text-center">
      {/* Animated checkmark */}
      <div
        className="mb-8 flex h-20 w-20 items-center justify-center rounded-full"
        style={{ background: "linear-gradient(135deg, #4a4bd7, #7073ff)" }}
        aria-hidden="true"
      >
        <svg
          className="h-10 w-10 text-[#fbf7ff]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M5 13l4 4L19 7"
            style={{
              strokeDasharray: 30,
              strokeDashoffset: 0,
              animation: "draw-check 0.5s ease-out forwards",
            }}
          />
        </svg>
      </div>

      <style>{`
        @keyframes draw-check {
          from { stroke-dashoffset: 30; }
          to { stroke-dashoffset: 0; }
        }
      `}</style>

      <h1 className="font-heading text-2xl font-semibold text-[#32323b]">
        You&apos;re booked, {bookerName.split(" ")[0]}!
      </h1>
      <p className="mt-2 text-sm text-[#5f5e68]">
        A confirmation will be sent to your email.
      </p>

      {/* Meeting details card */}
      <div className="mt-8 w-full rounded-[1rem] bg-[#ffffff] p-6 text-left">
        <div className="mb-4 flex items-start gap-2">
          <div
            className="mt-1 h-3 w-3 shrink-0 rounded-full"
            style={{ backgroundColor: eventType.color }}
            aria-hidden="true"
          />
          <h2 className="font-heading text-base font-semibold text-[#32323b]">
            {eventType.title}
          </h2>
        </div>

        <dl className="space-y-3">
          <div className="flex gap-3">
            <dt className="w-16 shrink-0 text-xs font-medium text-[#5f5e68]">
              Host
            </dt>
            <dd className="text-sm text-[#32323b]">{hostName}</dd>
          </div>
          <div className="flex gap-3">
            <dt className="w-16 shrink-0 text-xs font-medium text-[#5f5e68]">
              Date
            </dt>
            <dd className="text-sm text-[#32323b]">{dateLabel}</dd>
          </div>
          <div className="flex gap-3">
            <dt className="w-16 shrink-0 text-xs font-medium text-[#5f5e68]">
              Time
            </dt>
            <dd className="text-sm text-[#32323b]">
              {startLabel} – {endLabel}
            </dd>
          </div>
          <div className="flex gap-3">
            <dt className="w-16 shrink-0 text-xs font-medium text-[#5f5e68]">
              Duration
            </dt>
            <dd className="text-sm text-[#32323b]">{eventType.duration} minutes</dd>
          </div>
          <div className="flex gap-3">
            <dt className="w-16 shrink-0 text-xs font-medium text-[#5f5e68]">
              Timezone
            </dt>
            <dd className="text-sm text-[#32323b]">{bookerTimezone}</dd>
          </div>
        </dl>
      </div>

      {/* Actions */}
      <div className="mt-5 flex w-full flex-col gap-3 sm:flex-row">
        <a
          href={gcalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-1 items-center justify-center gap-2 rounded-[0.75rem] px-5 py-3 text-sm font-semibold text-[#fbf7ff] transition-all duration-150 hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(74,75,215,0.4)] focus-visible:ring-offset-2"
          style={{ background: "linear-gradient(135deg, #4a4bd7, #7073ff)" }}
          aria-label="Add this event to Google Calendar"
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M19 3h-1V1h-2v2H8V1H6v2H5C3.89 2 3 2.9 3 4v16c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 18H5V8h14v13z" />
            <path d="M7 10h5v5H7z" />
          </svg>
          Add to Google Calendar
        </a>

        {username && (
          <Link
            href={`/${username}`}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-[0.75rem] bg-[#f6f2fb] px-5 py-3 text-sm font-medium text-[#32323b] transition-colors duration-150 hover:bg-[#eae7f1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(74,75,215,0.3)]"
          >
            Book another time
          </Link>
        )}
      </div>
    </div>
  )
}
