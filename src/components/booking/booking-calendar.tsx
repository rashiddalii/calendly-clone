"use client"

import { useState, useCallback, useRef } from "react"
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  addDays,
  isSameMonth,
  isBefore,
  isToday,
} from "date-fns"
import type { AvailableDay } from "@/types"

interface BookingCalendarProps {
  availableDays: AvailableDay[]
  selectedDate: string | null
  onSelectDate: (date: string) => void
  isLoading: boolean
}

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

function toIso(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

export function BookingCalendar({
  availableDays,
  selectedDate,
  onSelectDate,
  isLoading,
}: BookingCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), 1)
  })

  const gridRef = useRef<HTMLDivElement>(null)

  const availableSet = new Set(availableDays.map((d) => d.date))
  const today = new Date()
  const todayIso = toIso(today)

  // Build grid cells for the current month view
  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 0 })

  const cells: Date[] = []
  let cur = gridStart
  while (cur <= monthEnd || cells.length % 7 !== 0) {
    cells.push(cur)
    cur = addDays(cur, 1)
    if (cells.length > 42) break // max 6 rows × 7 cols
  }

  function prevMonth() {
    setCurrentMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1))
  }

  function nextMonth() {
    setCurrentMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1))
  }

  const isPrevDisabled =
    currentMonth.getFullYear() === today.getFullYear() &&
    currentMonth.getMonth() === today.getMonth()

  // Keyboard navigation within the grid
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const focused = document.activeElement as HTMLElement
      if (!gridRef.current?.contains(focused)) return

      const buttons = Array.from(
        gridRef.current.querySelectorAll<HTMLButtonElement>("button[data-date]"),
      )
      const idx = buttons.indexOf(focused as HTMLButtonElement)
      if (idx === -1) return

      let next = idx
      switch (e.key) {
        case "ArrowRight":
          next = idx + 1
          break
        case "ArrowLeft":
          next = idx - 1
          break
        case "ArrowDown":
          next = idx + 7
          break
        case "ArrowUp":
          next = idx - 7
          break
        default:
          return
      }
      e.preventDefault()
      const target = buttons[next]
      if (target) {
        target.focus()
      } else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        nextMonth()
      } else {
        prevMonth()
      }
    },
    [],
  )

  return (
    <div className="rounded-[1rem] bg-[#ffffff] p-5 sm:p-6">
      {/* Month navigation header */}
      <div className="mb-5 flex items-center justify-between">
        <button
          onClick={prevMonth}
          disabled={isPrevDisabled}
          aria-label="Previous month"
          className="flex h-8 w-8 items-center justify-center rounded-[0.75rem] text-[#5f5e68] transition-colors duration-150 hover:bg-[#f6f2fb] disabled:cursor-not-allowed disabled:opacity-30"
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

        <h2 className="font-heading text-base font-semibold text-[#32323b]">
          {format(currentMonth, "MMMM yyyy")}
        </h2>

        <button
          onClick={nextMonth}
          aria-label="Next month"
          className="flex h-8 w-8 items-center justify-center rounded-[0.75rem] text-[#5f5e68] transition-colors duration-150 hover:bg-[#f6f2fb]"
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

      {/* Weekday header row */}
      <div
        className="mb-2 grid grid-cols-7 text-center"
        role="row"
        aria-label="Days of the week"
      >
        {WEEKDAY_LABELS.map((label) => (
          <div
            key={label}
            className="py-1 text-xs font-medium text-[#5f5e68]"
            aria-label={label}
          >
            {label}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div
        ref={gridRef}
        onKeyDown={handleKeyDown}
        role="grid"
        aria-label={`Calendar for ${format(currentMonth, "MMMM yyyy")}`}
        className="grid grid-cols-7 gap-y-1"
      >
        {isLoading
          ? cells.map((_, i) => (
              <div
                key={i}
                className="mx-auto h-9 w-9 animate-pulse rounded-full bg-[#f0ecf6]"
                aria-hidden="true"
              />
            ))
          : cells.map((date) => {
              const iso = toIso(date)
              const isCurrentMonth = isSameMonth(date, currentMonth)
              const isPast = isBefore(date, today) && !isToday(date)
              const isAvailable = availableSet.has(iso) && !isPast
              const isSelected = iso === selectedDate
              const isTodayDate = iso === todayIso

              if (!isCurrentMonth) {
                return (
                  <div key={iso} className="h-9 w-9" aria-hidden="true" />
                )
              }

              const isDisabled = !isAvailable

              let cellClass =
                "mx-auto flex h-9 w-9 items-center justify-center rounded-full text-sm transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(74,75,215,0.4)] focus-visible:ring-offset-1"

              if (isSelected) {
                cellClass +=
                  " text-[#fbf7ff] font-semibold"
              } else if (isAvailable) {
                cellClass +=
                  " font-semibold text-[#4a4bd7] hover:bg-[#e2e0f9] cursor-pointer"
              } else if (isTodayDate && !isAvailable) {
                cellClass += " font-medium text-[#5f5e68] opacity-40 cursor-default"
              } else {
                cellClass += " text-[#b3b0bc] cursor-default"
              }

              return (
                <div key={iso} role="gridcell" className="flex justify-center">
                  <button
                    data-date={iso}
                    disabled={isDisabled}
                    onClick={() => !isDisabled && onSelectDate(iso)}
                    aria-label={format(date, "MMMM d, yyyy")}
                    aria-selected={isSelected}
                    aria-disabled={isDisabled}
                    tabIndex={isSelected ? 0 : isAvailable ? 0 : -1}
                    style={
                      isSelected
                        ? {
                            background:
                              "linear-gradient(135deg, #4a4bd7, #7073ff)",
                          }
                        : isTodayDate && !isSelected
                          ? { boxShadow: "inset 0 0 0 1.5px #4a4bd7" }
                          : undefined
                    }
                    className={cellClass}
                  >
                    {date.getDate()}
                  </button>
                </div>
              )
            })}
      </div>

      {/* Legend */}
      {!isLoading && (
        <div className="mt-5 flex items-center gap-4 text-xs text-[#5f5e68]">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded-full bg-[#4a4bd7] opacity-80" />
            Available
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded-full bg-[#dbd8e4]" />
            Unavailable
          </span>
        </div>
      )}
    </div>
  )
}
