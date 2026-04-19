"use client";

import { formatInTimeZone } from "date-fns-tz";
import { timeFnsFormatFor } from "@/lib/utils/format";
import type { TimeSlot } from "@/types";

interface TimeSlotGridProps {
  slots: TimeSlot[];
  selectedSlot: TimeSlot | null;
  selectedDateLabel: string;
  notice?: string | null;
  onSelectSlot: (slot: TimeSlot) => void;
  onConfirmSlot: () => void;
  bookerTimezone: string;
  onBack: () => void;
  timeFormat?: string;
}

export function TimeSlotGrid({
  slots,
  selectedSlot,
  selectedDateLabel,
  notice,
  onSelectSlot,
  onConfirmSlot,
  bookerTimezone,
  onBack,
  timeFormat = "12h",
}: TimeSlotGridProps) {
  const timeFmt = timeFnsFormatFor(timeFormat);
  const formattedSlots = slots.map((slot) => ({
    ...slot,
    displayLabel: formatInTimeZone(
      new Date(slot.startUtc),
      bookerTimezone,
      timeFmt
    ),
  }));

  return (
    <div className="flex h-full flex-col">
      <button
        type="button"
        onClick={onBack}
        aria-label="Go back to calendar"
        className="mb-4 inline-flex h-touch cursor-pointer items-center gap-1.5 self-start rounded-lg pr-3 text-sm font-medium text-[#4b5a6d] transition-colors hover:text-[#006bff] lg:hidden"
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
        Back
      </button>

      <h2 className="font-heading text-lg font-semibold text-[#1c2b4b]">
        {selectedDateLabel}
      </h2>
      <p className="mt-2 text-sm text-[#4b5a6d]">
        Times shown in {bookerTimezone}
      </p>

      {notice && (
        <div
          role="status"
          className="mt-4 rounded-[0.75rem] bg-[#fff7f7] px-4 py-3 text-sm font-medium text-[#a8364b] ring-1 ring-[#a8364b]/20"
        >
          {notice}
        </div>
      )}

      {formattedSlots.length === 0 ? (
        <div className="mt-6 flex flex-col items-center rounded-[0.75rem] bg-[#f0f5ff] px-5 py-7 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white">
            <svg
              className="h-6 w-6 text-[#9dafc5]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" strokeWidth="1.5" />
              <path d="M12 6v6l4 2" strokeLinecap="round" strokeWidth="1.5" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-[#1c2b4b]">
            No times available
          </p>
          <p className="mt-1 text-xs text-[#4b5a6d]">
            Please select a different date.
          </p>
        </div>
      ) : (
        <div
          className="mt-6 flex max-h-[60vh] flex-col gap-2.5 overflow-y-auto pr-1 lg:max-h-[390px]"
          role="listbox"
          aria-label="Available time slots"
        >
          {formattedSlots.map((slot) => {
            const isSelected = selectedSlot?.startUtc === slot.startUtc;

            if (isSelected) {
              return (
                <div
                  key={slot.startUtc}
                  className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-2 transition-all duration-200 ease-out"
                >
                  <button
                    type="button"
                    role="option"
                    aria-selected="true"
                    onClick={() => onSelectSlot(slot)}
                    className="min-h-11 cursor-pointer rounded-[0.5rem] bg-[#6b7280] px-3 py-2.5 text-center text-base font-semibold text-white transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006bff]/35 focus-visible:ring-offset-2"
                  >
                    {slot.displayLabel}
                  </button>
                  <button
                    type="button"
                    onClick={onConfirmSlot}
                    className="min-h-11 cursor-pointer rounded-[0.5rem] bg-[#006bff] px-3 py-2.5 text-center text-base font-semibold text-white transition-all duration-150 hover:bg-[#005edb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006bff]/35 focus-visible:ring-offset-2"
                  >
                    Next
                  </button>
                </div>
              );
            }

            return (
              <button
                key={slot.startUtc}
                role="option"
                aria-selected="false"
                onClick={() => onSelectSlot(slot)}
                className={[
                  "min-h-11 cursor-pointer rounded-[0.5rem] px-4 py-2.5 text-center text-base font-semibold transition-all duration-150",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006bff]/35 focus-visible:ring-offset-2",
                  "border border-[#006bff]/45 bg-white text-[#006bff] hover:border-[#006bff] hover:bg-[#f0f5ff]",
                ].join(" ")}
              >
                {slot.displayLabel}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
