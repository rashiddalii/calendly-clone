"use client";

import { useState, useTransition } from "react";
import { formatInTimeZone } from "date-fns-tz";
import { cancelBookingAction } from "@/lib/actions/booking";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";

interface MeetingCardProps {
  id: string;
  eventTitle: string;
  eventColor: string;
  bookerName: string;
  bookerEmail: string;
  bookerNotes: string | null;
  startTime: Date | string;
  endTime: Date | string;
  hostTimezone: string;
  status: "CONFIRMED" | "CANCELLED" | "COMPLETED";
  onCancel?: (id: string) => void;
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
};

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
  const [isPending, startTransition] = useTransition();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const start = new Date(startTime);
  const end = new Date(endTime);

  const datePart = formatInTimeZone(start, hostTimezone, "EEEE, MMM d");
  const startTimePart = formatInTimeZone(start, hostTimezone, "h:mm");
  const endTimePart = formatInTimeZone(end, hostTimezone, "h:mm a zzz");
  const formattedTime = `${datePart} · ${startTimePart} – ${endTimePart}`;

  const badge = STATUS_STYLES[status];

  const handleCancel = () => {
    startTransition(async () => {
      const result = await cancelBookingAction(id);
      if (result.status === "success") {
        setConfirmOpen(false);
        onCancel?.(id);
      }
    });
  };

  return (
    <>
      <ConfirmationDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Cancel this booking?"
        description={`This will cancel ${eventTitle} with ${bookerName}. The meeting will move out of your upcoming schedule.`}
        confirmLabel="Cancel booking"
        cancelLabel="Keep booking"
        isPending={isPending}
        onConfirm={handleCancel}
      />
      <article className="flex gap-3 rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-sm sm:gap-4 sm:p-5">
        <div
          aria-hidden
          className="w-1 shrink-0 self-stretch rounded-full"
          style={{ backgroundColor: eventColor }}
        />

        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
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

          <div className="flex min-w-0 flex-col gap-0.5">
            <p className="truncate text-sm font-medium text-[#111827]">
              {bookerName}
            </p>
            <p className="truncate text-sm text-[#6B7280]">{bookerEmail}</p>
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
                onClick={() => setConfirmOpen(true)}
                disabled={isPending}
                className="h-touch w-full cursor-pointer rounded-lg text-xs font-medium text-[#6B7280] transition-colors hover:bg-[#F3F4F6] hover:text-[#a8364b] disabled:opacity-50 sm:w-auto sm:px-3"
              >
                {isPending ? "Cancelling…" : "Cancel booking"}
              </button>
            </div>
          )}
        </div>
      </article>
    </>
  );
}
