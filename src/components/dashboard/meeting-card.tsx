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
    bg: "bg-[#EBF5FF]",
    text: "text-[#006BFF]",
    label: "Confirmed",
  },
  CANCELLED: {
    bg: "bg-[#F3F4F6]",
    text: "text-[#6B7280]",
    label: "Cancelled",
  },
  COMPLETED: {
    bg: "bg-[#F3F4F6]",
    text: "text-[#374151]",
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
    <article className="flex gap-4 rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
      <div
        aria-hidden
        className="w-1 shrink-0 self-stretch rounded-full"
        style={{ backgroundColor: eventColor }}
      />

      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate font-semibold leading-tight text-[#111827]">
              {eventTitle}
            </h3>
            <p className="mt-0.5 text-sm text-[#6B7280]">{formattedTime}</p>
          </div>
          <span
            className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${badge.bg} ${badge.text}`}
          >
            {badge.label}
          </span>
        </div>

        <div className="flex flex-col gap-0.5">
          <p className="text-sm font-medium text-[#111827]">{bookerName}</p>
          <p className="text-sm text-[#6B7280]">{bookerEmail}</p>
        </div>

        {bookerNotes && (
          <div className="rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] p-3 text-sm text-[#6B7280]">
            {bookerNotes}
          </div>
        )}

        {status === "CONFIRMED" && (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isPending}
              className="text-xs font-medium text-[#6B7280] transition-colors hover:text-[#a8364b] disabled:opacity-50"
            >
              {isPending ? "Cancelling…" : "Cancel booking"}
            </button>
          </div>
        )}
      </div>
    </article>
  )
}
