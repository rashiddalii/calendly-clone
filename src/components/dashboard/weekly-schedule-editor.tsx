"use client";

import { useState, useTransition } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { saveWeeklyScheduleAction } from "@/lib/actions/availability";

type Slot = { startTime: string; endTime: string };
type DayState = { enabled: boolean; slots: Slot[] };
type ScheduleState = Record<number, DayState>;

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const DEFAULT_SLOT: Slot = { startTime: "09:00", endTime: "17:00" };

function buildInitial(rowsByDay: Record<number, Slot[]>): ScheduleState {
  const state: ScheduleState = {} as ScheduleState;
  for (let d = 0; d < 7; d++) {
    const slots = rowsByDay[d] ?? [];
    state[d] = {
      enabled: slots.length > 0,
      slots: slots.length > 0 ? slots : [DEFAULT_SLOT],
    };
  }
  return state;
}

export function WeeklyScheduleEditor({
  initial,
}: {
  initial: Record<number, Slot[]>;
}) {
  const [state, setState] = useState<ScheduleState>(() =>
    buildInitial(initial)
  );
  const [isPending, startTransition] = useTransition();

  const toggleDay = (day: number) => {
    setState((s) => ({
      ...s,
      [day]: { ...s[day], enabled: !s[day].enabled },
    }));
  };

  const updateSlot = (
    day: number,
    index: number,
    field: "startTime" | "endTime",
    value: string
  ) => {
    setState((s) => {
      const next = { ...s };
      const slots = [...next[day].slots];
      slots[index] = { ...slots[index], [field]: value };
      next[day] = { ...next[day], slots };
      return next;
    });
  };

  const addSlot = (day: number) => {
    setState((s) => ({
      ...s,
      [day]: {
        ...s[day],
        slots: [...s[day].slots, { startTime: "09:00", endTime: "17:00" }],
      },
    }));
  };

  const removeSlot = (day: number, index: number) => {
    setState((s) => {
      const slots = s[day].slots.filter((_, i) => i !== index);
      return {
        ...s,
        [day]: {
          enabled: slots.length > 0 ? s[day].enabled : false,
          slots: slots.length > 0 ? slots : [DEFAULT_SLOT],
        },
      };
    });
  };

  const copyToWeekdays = (day: number) => {
    const source = state[day];
    setState((s) => {
      const next = { ...s };
      for (let d = 1; d <= 5; d++) {
        if (d === day) continue;
        next[d] = {
          enabled: source.enabled,
          slots: source.slots.map((slot) => ({ ...slot })),
        };
      }
      return next;
    });
    toast.success("Applied to weekdays");
  };

  const save = () => {
    startTransition(async () => {
      const payload = {
        days: Object.fromEntries(
          Object.entries(state).map(([d, cfg]) => [d, cfg])
        ),
      };
      const result = await saveWeeklyScheduleAction(payload);
      if (result.status === "success") {
        toast.success("Schedule saved");
      } else {
        toast.error(result.error);
      }
    });
  };

  return (
    <section className="flex flex-col gap-4 rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-sm sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-[#111827]">Weekly hours</h2>
          <p className="mt-1 text-sm text-[#6B7280]">
            Set when you&apos;re regularly available each week.
          </p>
        </div>
        <button
          type="button"
          onClick={save}
          disabled={isPending}
          className="inline-flex h-touch w-full cursor-pointer items-center justify-center rounded-lg bg-[#006BFF] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#005FDB] disabled:opacity-60 sm:w-auto"
        >
          {isPending ? "Saving…" : "Save"}
        </button>
      </div>

      <ul className="flex flex-col">
        {[1, 2, 3, 4, 5, 6, 0].map((day) => {
          const cfg = state[day];
          return (
            <li
              key={day}
              className="flex flex-col gap-3 py-3 sm:flex-row sm:items-start sm:gap-4 md:gap-6"
            >
              <div className="flex min-h-11 w-full shrink-0 items-center gap-3 sm:w-40">
                <input
                  type="checkbox"
                  checked={cfg.enabled}
                  onChange={() => toggleDay(day)}
                  className="h-4 w-4 rounded accent-[#006BFF]"
                  id={`day-${day}`}
                />
                <label
                  htmlFor={`day-${day}`}
                  className="text-sm font-medium text-[#111827]"
                >
                  {DAY_NAMES[day]}
                </label>
              </div>

              <div className="flex flex-1 flex-col gap-2">
                {cfg.enabled ? (
                  cfg.slots.map((slot, i) => (
                    <div
                      key={i}
                      className="flex flex-col gap-2 sm:flex-row sm:items-center"
                    >
                      <input
                        type="time"
                        value={slot.startTime}
                        step={300}
                        onChange={(e) =>
                          updateSlot(day, i, "startTime", e.target.value)
                        }
                        className="h-11 w-full rounded-md border border-[#E5E7EB] bg-[#F9FAFB] px-3 text-sm text-[#111827] outline-none focus:border-[#006BFF] focus:ring-2 focus:ring-[#006BFF]/20 sm:w-auto"
                      />
                      <span className="text-sm text-[#6B7280]">–</span>
                      <input
                        type="time"
                        value={slot.endTime}
                        step={300}
                        onChange={(e) =>
                          updateSlot(day, i, "endTime", e.target.value)
                        }
                        className="h-11 w-full rounded-md border border-[#E5E7EB] bg-[#F9FAFB] px-3 text-sm text-[#111827] outline-none focus:border-[#006BFF] focus:ring-2 focus:ring-[#006BFF]/20 sm:w-auto"
                      />
                      <button
                        type="button"
                        onClick={() => removeSlot(day, i)}
                        aria-label="Remove interval"
                        className="h-touch w-full cursor-pointer rounded-md p-2 text-[#6B7280] transition-colors hover:bg-[#F3F4F6] hover:text-[#111827] sm:w-auto"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="py-2 text-sm text-[#6B7280]">Unavailable</p>
                )}

                {cfg.enabled && (
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                    <button
                      type="button"
                      onClick={() => addSlot(day)}
                      className="h-touch inline-flex w-full cursor-pointer items-center justify-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-[#006BFF] transition-colors hover:bg-[#EBF5FF] sm:w-auto"
                    >
                      <Plus className="h-3 w-3" />
                      Add interval
                    </button>
                    {day >= 1 && day <= 5 && (
                      <button
                        type="button"
                        onClick={() => copyToWeekdays(day)}
                        className="h-touch w-full cursor-pointer rounded-md px-2 py-1 text-xs font-medium text-[#6B7280] transition-colors hover:bg-[#F3F4F6] hover:text-[#111827] sm:w-auto"
                      >
                        Copy to weekdays
                      </button>
                    )}
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
