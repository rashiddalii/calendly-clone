"use client"

import { useState, useTransition, type ReactNode } from "react"
import { Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { completeOnboardingAction } from "@/lib/actions/onboarding"
import type { WeeklyScheduleInput } from "@/lib/validators/availability"
import { cn } from "@/lib/utils"

type Slot = { startTime: string; endTime: string }
type DayState = { enabled: boolean; slots: Slot[] }
type ScheduleState = Record<number, DayState>

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
]

const DEFAULT_SLOT: Slot = { startTime: "09:00", endTime: "17:00" }

function buildInitial(rowsByDay: Record<number, Slot[]>): ScheduleState {
  const state: ScheduleState = {} as ScheduleState
  for (let d = 0; d < 7; d++) {
    const slots = rowsByDay[d] ?? []
    if (slots.length > 0) {
      state[d] = { enabled: true, slots }
    } else {
      // Pre-enable Mon–Fri (1–5) with 9–5 for new users
      state[d] = {
        enabled: d >= 1 && d <= 5,
        slots: [DEFAULT_SLOT],
      }
    }
  }
  return state
}

function buildWeeklyPayload(state: ScheduleState): WeeklyScheduleInput {
  return {
    days: Object.fromEntries(
      Object.entries(state).map(([d, cfg]) => [d, cfg]),
    ) as WeeklyScheduleInput["days"],
  }
}

export function OnboardingScheduleEditor({
  initial,
  onContinue,
  submitLabel = "Finish setup",
  accentColor = "#4a4bd7",
  headerExtra,
  footerExtra,
  surfaceClassName,
}: {
  initial: Record<number, Slot[]>
  onContinue?: (
    payload: WeeklyScheduleInput,
  ) => Promise<{ status: "error"; error: string } | undefined | void>
  submitLabel?: string
  accentColor?: string
  headerExtra?: ReactNode
  footerExtra?: ReactNode
  surfaceClassName?: string
}) {
  const [state, setState] = useState<ScheduleState>(() => buildInitial(initial))
  const [isPending, startTransition] = useTransition()

  const toggleDay = (day: number) => {
    setState((s) => ({
      ...s,
      [day]: { ...s[day], enabled: !s[day].enabled },
    }))
  }

  const updateSlot = (
    day: number,
    index: number,
    field: "startTime" | "endTime",
    value: string,
  ) => {
    setState((s) => {
      const next = { ...s }
      const slots = [...next[day].slots]
      slots[index] = { ...slots[index], [field]: value }
      next[day] = { ...next[day], slots }
      return next
    })
  }

  const addSlot = (day: number) => {
    setState((s) => ({
      ...s,
      [day]: {
        ...s[day],
        slots: [...s[day].slots, { startTime: "09:00", endTime: "17:00" }],
      },
    }))
  }

  const removeSlot = (day: number, index: number) => {
    setState((s) => {
      const slots = s[day].slots.filter((_, i) => i !== index)
      return {
        ...s,
        [day]: {
          enabled: slots.length > 0 ? s[day].enabled : false,
          slots: slots.length > 0 ? slots : [DEFAULT_SLOT],
        },
      }
    })
  }

  const finish = () => {
    startTransition(async () => {
      const payload = buildWeeklyPayload(state)
      if (onContinue) {
        const result = await onContinue(payload)
        if (result && result.status === "error") toast.error(result.error)
        return
      }
      const result = await completeOnboardingAction(payload)
      if (result && result.status === "error") {
        toast.error(result.error)
      }
    })
  }

  return (
    <div
      className={cn("rounded-2xl p-8", surfaceClassName)}
      style={{ backgroundColor: "#ffffff" }}
    >
      {headerExtra ? <div className="mb-6">{headerExtra}</div> : null}
      <div className="mb-6 flex flex-col gap-4">
        {[1, 2, 3, 4, 5, 6, 0].map((day) => {
          const cfg = state[day]
          return (
            <div
              key={day}
              className="flex flex-col gap-2 md:flex-row md:items-start md:gap-6"
            >
              <div className="flex w-36 shrink-0 items-center gap-3">
                <input
                  type="checkbox"
                  id={`day-${day}`}
                  checked={cfg.enabled}
                  onChange={() => toggleDay(day)}
                  className="h-4 w-4 rounded"
                  style={{ accentColor: accentColor }}
                />
                <label
                  htmlFor={`day-${day}`}
                  className="text-sm font-medium"
                  style={{ color: "#32323b" }}
                >
                  {DAY_NAMES[day]}
                </label>
              </div>

              <div className="flex flex-1 flex-col gap-2">
                {cfg.enabled ? (
                  cfg.slots.map((slot, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        type="time"
                        value={slot.startTime}
                        step={300}
                        onChange={(e) =>
                          updateSlot(day, i, "startTime", e.target.value)
                        }
                        className="h-9 rounded-lg px-3 text-sm outline-none"
                        style={{
                          backgroundColor: "#eae7f1",
                          color: "#32323b",
                          border: "none",
                        }}
                      />
                      <span className="text-sm" style={{ color: "#5f5e68" }}>
                        –
                      </span>
                      <input
                        type="time"
                        value={slot.endTime}
                        step={300}
                        onChange={(e) =>
                          updateSlot(day, i, "endTime", e.target.value)
                        }
                        className="h-9 rounded-lg px-3 text-sm outline-none"
                        style={{
                          backgroundColor: "#eae7f1",
                          color: "#32323b",
                          border: "none",
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => removeSlot(day, i)}
                        aria-label="Remove interval"
                        className="rounded-lg p-2 transition-colors"
                        style={{ color: "#5f5e68" }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="py-2 text-sm" style={{ color: "#5f5e68" }}>
                    Unavailable
                  </p>
                )}

                {cfg.enabled && (
                  <button
                    type="button"
                    onClick={() => addSlot(day)}
                    className="inline-flex w-fit items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium transition-colors"
                    style={{ color: accentColor }}
                  >
                    <Plus className="h-3 w-3" />
                    Add interval
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {footerExtra ? <div className="mb-6">{footerExtra}</div> : null}

      <button
        type="button"
        onClick={finish}
        disabled={isPending}
        className="flex w-full items-center justify-center gap-2 rounded-xl h-11 text-sm font-medium transition-opacity disabled:opacity-60"
        style={{
          backgroundColor: accentColor,
          color: "#ffffff",
        }}
      >
        {isPending ? "Saving…" : submitLabel}
      </button>
    </div>
  )
}
