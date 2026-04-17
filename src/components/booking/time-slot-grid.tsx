"use client"

import { formatInTimeZone } from "date-fns-tz"
import { TimezonePickerSelect } from "@/components/booking/timezone-picker"
import type { TimeSlot } from "@/types"

interface TimeSlotGridProps {
  slots: TimeSlot[]
  selectedSlot: TimeSlot | null
  onSelectSlot: (slot: TimeSlot) => void
  bookerTimezone: string
  onTimezoneChange: (tz: string) => void
  onBack: () => void
}

export function TimeSlotGrid({
  slots,
  selectedSlot,
  onSelectSlot,
  bookerTimezone,
  onTimezoneChange,
  onBack,
}: TimeSlotGridProps) {
  // Re-format labels in the current booker timezone (instant — no fetch)
  const formattedSlots = slots.map((slot) => ({
    ...slot,
    displayLabel: formatInTimeZone(
      new Date(slot.startUtc),
      bookerTimezone,
      "h:mm a",
    ),
  }))

  return (
    <div className="rounded-[1rem] bg-[#ffffff] p-5 sm:p-6">
      {/* Back button */}
      <button
        onClick={onBack}
        aria-label="Go back to calendar"
        className="mb-5 flex items-center gap-1.5 text-sm text-[#5f5e68] transition-colors duration-150 hover:text-[#4a4bd7]"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.8}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to calendar
      </button>

      <h2 className="mb-1 font-heading text-base font-semibold text-[#32323b]">
        Select a time
      </h2>
      <p className="mb-5 text-xs text-[#5f5e68]">
        All times shown in{" "}
        <span className="font-medium">{bookerTimezone}</span>
      </p>

      {formattedSlots.length === 0 ? (
        <div className="flex flex-col items-center py-10 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#f6f2fb]">
            <svg
              className="h-6 w-6 text-[#b3b0bc]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" strokeWidth="1.5" />
              <path
                d="M12 6v6l4 2"
                strokeLinecap="round"
                strokeWidth="1.5"
              />
            </svg>
          </div>
          <p className="text-sm font-medium text-[#32323b]">No times available</p>
          <p className="mt-1 text-xs text-[#5f5e68]">
            Please select a different date.
          </p>
        </div>
      ) : (
        <div
          className="grid grid-cols-2 gap-2 sm:grid-cols-3 overflow-y-auto max-h-[420px] pr-1"
          role="listbox"
          aria-label="Available time slots"
        >
          {formattedSlots.map((slot) => {
            const isSelected =
              selectedSlot?.startUtc === slot.startUtc

            return (
              <button
                key={slot.startUtc}
                role="option"
                aria-selected={isSelected}
                onClick={() => onSelectSlot(slot)}
                className={[
                  "relative rounded-[0.75rem] px-3 py-3 text-sm font-medium transition-all duration-150",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(74,75,215,0.4)] focus-visible:ring-offset-1",
                  isSelected
                    ? "text-[#fbf7ff]"
                    : "bg-[#f6f2fb] text-[#32323b] hover:scale-[1.02] hover:text-[#4a4bd7] hover:shadow-[0_4px_16px_rgba(50,50,59,0.04)]",
                ].join(" ")}
                style={
                  isSelected
                    ? { background: "linear-gradient(135deg, #4a4bd7, #7073ff)" }
                    : undefined
                }
              >
                {slot.displayLabel}
              </button>
            )
          })}
        </div>
      )}

      {/* Timezone selector */}
      <div className="mt-6 pt-5" style={{ borderTop: "1px solid rgba(179,176,188,0.15)" }}>
        <label
          htmlFor="timezone-select"
          className="mb-1.5 block text-xs font-medium text-[#5f5e68]"
        >
          Time zone
        </label>
        <TimezonePickerSelect
          id="timezone-select"
          value={bookerTimezone}
          onChange={onTimezoneChange}
        />
      </div>
    </div>
  )
}
