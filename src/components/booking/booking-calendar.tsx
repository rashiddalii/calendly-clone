"use client";

import { useCallback, useRef, useState } from "react";
import {
  addDays,
  endOfMonth,
  format,
  isBefore,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import type { AvailableDay } from "@/types";

interface BookingCalendarProps {
  availableDays: AvailableDay[];
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
  isLoading: boolean;
}

const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function toIso(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function BookingCalendar({
  availableDays,
  selectedDate,
  onSelectDate,
  isLoading,
}: BookingCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const gridRef = useRef<HTMLDivElement>(null);

  const availableSet = new Set(availableDays.map((d) => d.date));
  const today = new Date();
  const todayIso = toIso(today);
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });

  const cells: Date[] = [];
  let cur = gridStart;
  while (cur <= monthEnd || cells.length % 7 !== 0) {
    cells.push(cur);
    cur = addDays(cur, 1);
    if (cells.length > 42) break;
  }

  function prevMonth() {
    setCurrentMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1));
  }

  function nextMonth() {
    setCurrentMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1));
  }

  const isPrevDisabled =
    currentMonth.getFullYear() === today.getFullYear() &&
    currentMonth.getMonth() === today.getMonth();

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const focused = document.activeElement as HTMLElement;
      if (!gridRef.current?.contains(focused)) return;

      const buttons = Array.from(
        gridRef.current.querySelectorAll<HTMLButtonElement>("button[data-date]")
      );
      const idx = buttons.indexOf(focused as HTMLButtonElement);
      if (idx === -1) return;

      let next = idx;
      switch (e.key) {
        case "ArrowRight":
          next = idx + 1;
          break;
        case "ArrowLeft":
          next = idx - 1;
          break;
        case "ArrowDown":
          next = idx + 7;
          break;
        case "ArrowUp":
          next = idx - 7;
          break;
        default:
          return;
      }

      e.preventDefault();
      const target = buttons[next];
      if (target) {
        target.focus();
      } else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        nextMonth();
      } else {
        prevMonth();
      }
    },
    []
  );

  return (
    <div className="mx-auto w-full max-w-[320px] sm:max-w-[360px]">
      <div className="mb-5 flex items-center justify-center gap-4 sm:gap-6">
        <button
          onClick={prevMonth}
          disabled={isPrevDisabled}
          aria-label="Previous month"
          className="flex h-touch w-11 cursor-pointer items-center justify-center rounded-full text-[#6b7280] transition-colors hover:bg-[#f0f5ff] disabled:cursor-not-allowed disabled:opacity-30 sm:h-10 sm:w-10"
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
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <h2 className="min-w-28 text-center font-heading text-lg font-semibold text-[#1c2b4b] sm:min-w-36">
          {format(currentMonth, "MMMM yyyy")}
        </h2>

        <button
          onClick={nextMonth}
          aria-label="Next month"
          className="flex h-touch w-11 cursor-pointer items-center justify-center rounded-full bg-[#f0f5ff] text-[#006bff] transition-colors hover:bg-[#d9e8ff] sm:h-10 sm:w-10"
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
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      <div
        className="mb-2 grid grid-cols-7 text-center"
        role="row"
        aria-label="Days of the week"
      >
        {WEEKDAY_LABELS.map((label) => (
          <div
            key={label}
            className="py-1 text-xs font-semibold uppercase tracking-wide text-[#1c2b4b]"
            aria-label={label}
          >
            {label}
          </div>
        ))}
      </div>

      <div
        ref={gridRef}
        onKeyDown={handleKeyDown}
        role="grid"
        aria-label={`Calendar for ${format(currentMonth, "MMMM yyyy")}`}
        className="grid grid-cols-7 gap-x-1 gap-y-2"
      >
        {isLoading
          ? cells.map((_, i) => (
              <div
                key={i}
                className="aspect-square w-full max-w-10 shrink-0 animate-pulse rounded-full bg-[#e5edff]"
                aria-hidden="true"
              />
            ))
          : cells.map((date) => {
              const iso = toIso(date);
              const isCurrentMonth = isSameMonth(date, currentMonth);
              const isPast = isBefore(date, today) && !isToday(date);
              const isAvailable = availableSet.has(iso) && !isPast;
              const isSelected = iso === selectedDate;
              const isTodayDate = iso === todayIso;

              if (!isCurrentMonth) {
                return (
                  <div
                    key={iso}
                    className="aspect-square w-full max-w-10"
                    aria-hidden="true"
                  />
                );
              }

              const isDisabled = !isAvailable;
              let cellClass =
                "flex aspect-square w-full max-w-10 shrink-0 items-center justify-center rounded-full text-base transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006bff]/35 focus-visible:ring-offset-2";

              if (isSelected) {
                cellClass += " bg-[#006bff] font-semibold text-white";
              } else if (isAvailable) {
                cellClass +=
                  " cursor-pointer bg-[#f0f5ff] font-semibold text-[#006bff] hover:bg-[#d9e8ff]";
              } else if (isTodayDate) {
                cellClass +=
                  " cursor-default font-medium text-[#4b5a6d] opacity-40";
              } else {
                cellClass += " cursor-default text-[#667085]";
              }

              return (
                <div
                  key={iso}
                  role="gridcell"
                  className="flex items-center justify-center"
                >
                  <button
                    data-date={iso}
                    disabled={isDisabled}
                    onClick={() => !isDisabled && onSelectDate(iso)}
                    aria-label={format(date, "MMMM d, yyyy")}
                    aria-disabled={isDisabled}
                    aria-pressed={isSelected}
                    tabIndex={isSelected ? 0 : isAvailable ? 0 : -1}
                    className={cellClass}
                    style={
                      isTodayDate && !isSelected
                        ? { boxShadow: "inset 0 0 0 1.5px #006bff" }
                        : undefined
                    }
                  >
                    {date.getDate()}
                  </button>
                </div>
              );
            })}
      </div>
    </div>
  );
}
