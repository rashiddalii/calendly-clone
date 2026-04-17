"use client"

import { useTransition } from "react"
import { formatInTimeZone } from "date-fns-tz"
import { cancelBookingAction } from "@/lib/actions/booking"

interface MeetingCardProps {
  id: string
  eventTitle: string
  eventColor: string
  bookerName: string
  bookerEmail: string
  bookerNotes: string | null
  startTime: Date | string
  endTime: Date | string
  hostTimezone: string
  status: "CONFIRMED" | "CANCELLED" | "COMPLETED"
  onCancel?: (id: string) => void
}

const STATUS_STYLES: Record<
  "CONFIRMED" | "CANCELLED" | "COMPLETED",
  { bg: string; text: string; label: string }
> = {
  CONFIRMED: {
    bg: "bg-[#e2e0f9]",
    text: "text-[#505064]",
    label: "Confirmed",
  },
  CANCELLED: {
    bg: "bg-[#eae7f1]",
    text: "text-[#5f5e68]",
    label: "Cancelled",
  },
  COMPLETED: {
    bg: "bg-[#f0ecf6]",
    text: "text-[#5f5e68]",
    label: "Completed",
  },
}

export function MeetingCard({
  id,
  eventTitle,
  eventColor,
  bookerName,
  bookerEmail,
  bookerNotes,
  startTime,
  endTime,
  hostTimezone,
  status,
  onCancel,
}: MeetingCardProps) {
  const [isPending, startTransition] = useTransition()

  const start = new Date(startTime)
  const end = new Date(endTime)

  // Format: "Tuesday, Apr 22 · 2:00 – 2:30 PM EDT"
  const datePart = formatInTimeZone(start, hostTimezone, "EEEE, MMM d")
  const startTimePart = formatInTimeZone(start, hostTimezone, "h:mm")
  const endTimePart = formatInTimeZone(end, hostTimezone, "h:mm a zzz")
  const formattedTime = `${datePart} · ${startTimePart} – ${endTimePart}`

  const badge = STATUS_STYLES[status]

  const handleCancel = () => {
    if (!window.confirm("Cancel this booking?")) return
    startTransition(async () => {
      const result = await cancelBookingAction(id)
      if (result.status === "success") {
        onCancel?.(id)
      }
    })
  }

  return (
    <article className="flex gap-4 rounded-xl bg-[#ffffff] p-5">
      {/* Left color bar */}
      <div
        aria-hidden
        className="w-[3px] shrink-0 rounded-full self-stretch"
        style={{ backgroundColor: eventColor }}
      />

      <div className="flex flex-1 flex-col gap-3 min-w-0">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-heading font-semibold text-[#32323b] leading-tight truncate">
              {eventTitle}
            </h3>
            <p className="mt-0.5 text-sm text-[#5f5e68]">{formattedTime}</p>
          </div>
          <span
            className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${badge.bg} ${badge.text}`}
          >
            {badge.label}
          </span>
        </div>

        {/* Booker info */}
        <div className="flex flex-col gap-0.5">
          <p className="text-sm font-medium text-[#32323b]">{bookerName}</p>
          <p className="text-sm text-[#5f5e68]">{bookerEmail}</p>
        </div>

        {/* Notes */}
        {bookerNotes && (
          <div className="rounded-lg bg-[#f6f2fb] p-3 text-sm text-[#5f5e68]">
            {bookerNotes}
          </div>
        )}

        {/* Cancel action */}
        {status === "CONFIRMED" && (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isPending}
              className="text-xs text-[#5f5e68] transition-colors hover:text-[#a8364b] disabled:opacity-50"
            >
              {isPending ? "Cancelling…" : "Cancel booking"}
            </button>
          </div>
        )}
      </div>
    </article>
  )
}
