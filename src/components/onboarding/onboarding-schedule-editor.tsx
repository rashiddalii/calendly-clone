"use client";

import { useState, useTransition, type ReactNode } from "react";
import Link from "next/link";
import { Plus, Trash2, ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import { completeOnboardingAction } from "@/lib/actions/onboarding";
import {
  weeklyScheduleSchema,
  timeToMinutes,
} from "@/lib/validators/availability";
import type { WeeklyScheduleInput } from "@/lib/validators/availability";
import { cn } from "@/lib/utils";

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
    state[d] =
      slots.length > 0
        ? { enabled: true, slots }
        : { enabled: d >= 1 && d <= 5, slots: [DEFAULT_SLOT] };
  }
  return state;
}

function buildWeeklyPayload(state: ScheduleState): WeeklyScheduleInput {
  return {
    days: Object.fromEntries(
      Object.entries(state).map(([d, cfg]) => [d, cfg])
    ) as WeeklyScheduleInput["days"],
  };
}

/* Returns an error string for a day's slots, or null if valid. */
function validateDaySlots(slots: Slot[]): string | null {
  for (const slot of slots) {
    if (!slot.startTime || !slot.endTime) continue;
    if (slot.startTime >= slot.endTime)
      return "Start time must be before end time.";
    if (timeToMinutes(slot.endTime) - timeToMinutes(slot.startTime) < 15)
      return "Each slot must be at least 15 minutes.";
  }

  if (slots.length >= 2) {
    const sorted = [...slots].sort(
      (a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime)
    );
    for (let i = 1; i < sorted.length; i++) {
      if (
        timeToMinutes(sorted[i].startTime) <
        timeToMinutes(sorted[i - 1].endTime)
      ) {
        return `Intervals overlap: ${sorted[i].startTime} starts before ${sorted[i - 1].endTime} ends.`;
      }
    }
  }

  return null;
}

export function OnboardingScheduleEditor({
  initial,
  onContinue,
  submitLabel = "Finish setup",
  accentColor = "#006bff",
  headerExtra,
  footerExtra,
  surfaceClassName,
  backHref,
}: {
  initial: Record<number, Slot[]>;
  onContinue?: (
    payload: WeeklyScheduleInput
  ) => Promise<{ status: "error"; error: string } | undefined | void>;
  submitLabel?: string;
  accentColor?: string;
  headerExtra?: ReactNode;
  footerExtra?: ReactNode;
  surfaceClassName?: string;
  backHref?: string;
}) {
  const [state, setState] = useState<ScheduleState>(() =>
    buildInitial(initial)
  );
  const [isPending, startTransition] = useTransition();

  const toggleDay = (day: number) => {
    setState((s) => ({ ...s, [day]: { ...s[day], enabled: !s[day].enabled } }));
  };

  const updateSlot = (
    day: number,
    index: number,
    field: "startTime" | "endTime",
    value: string
  ) => {
    setState((s) => {
      const slots = [...s[day].slots];
      slots[index] = { ...slots[index], [field]: value };
      return { ...s, [day]: { ...s[day], slots } };
    });
  };

  const addSlot = (day: number) => {
    const existing = state[day].slots;
    // Default new slot to end of last slot + 1h gap, capped to 23:45
    const lastEnd = existing[existing.length - 1]?.endTime ?? "09:00";
    const lastEndMins = timeToMinutes(lastEnd);
    const newStart = Math.min(lastEndMins + 60, 23 * 60 + 30);
    const newEnd = Math.min(newStart + 60, 23 * 60 + 45);
    const pad = (n: number) =>
      `${String(Math.floor(n / 60)).padStart(2, "0")}:${String(n % 60).padStart(2, "0")}`;

    setState((s) => ({
      ...s,
      [day]: {
        ...s[day],
        slots: [
          ...s[day].slots,
          { startTime: pad(newStart), endTime: pad(newEnd) },
        ],
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

  const finish = () => {
    // Client-side validation before hitting the server
    for (const [dayStr, cfg] of Object.entries(state)) {
      if (!cfg.enabled) continue;
      const err = validateDaySlots(cfg.slots);
      if (err) {
        toast.error(`${DAY_NAMES[Number(dayStr)]}: ${err}`);
        return;
      }
    }

    const payload = buildWeeklyPayload(state);
    const parsed = weeklyScheduleSchema.safeParse(payload);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Invalid schedule");
      return;
    }

    startTransition(async () => {
      if (onContinue) {
        const result = await onContinue(parsed.data);
        if (result && result.status === "error") toast.error(result.error);
        return;
      }
      const result = await completeOnboardingAction(parsed.data);
      if (result && result.status === "error") toast.error(result.error);
    });
  };

  return (
    <div
      className={cn("rounded-2xl p-4 sm:p-6 lg:p-8", surfaceClassName)}
      style={{ backgroundColor: "#ffffff" }}
    >
      {headerExtra ? <div className="mb-6">{headerExtra}</div> : null}

      <div className="mb-6 flex flex-col gap-4">
        {[1, 2, 3, 4, 5, 6, 0].map((day) => {
          const cfg = state[day];
          const dayError = cfg.enabled ? validateDaySlots(cfg.slots) : null;

          return (
            <div key={day} className="flex flex-col gap-1.5">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-4 md:gap-6">
                {/* Day toggle */}
                <div className="flex min-h-11 w-full shrink-0 items-center gap-3 sm:w-36">
                  <input
                    type="checkbox"
                    id={`day-${day}`}
                    checked={cfg.enabled}
                    onChange={() => toggleDay(day)}
                    className="h-4 w-4 cursor-pointer rounded"
                    style={{ accentColor }}
                  />
                  <label
                    htmlFor={`day-${day}`}
                    className="cursor-pointer text-sm font-medium"
                    style={{ color: "#1c2b4b" }}
                  >
                    {DAY_NAMES[day]}
                  </label>
                </div>

                {/* Slots */}
                <div className="flex flex-1 flex-col gap-2">
                  {cfg.enabled ? (
                    cfg.slots.map((slot, i) => {
                      const slotErr =
                        slot.startTime && slot.endTime
                          ? slot.startTime >= slot.endTime
                            ? "end ≤ start"
                            : timeToMinutes(slot.endTime) -
                                  timeToMinutes(slot.startTime) <
                                15
                              ? "< 15 min"
                              : null
                          : null;

                      return (
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
                            className={cn(
                              "h-11 w-full rounded-lg px-3 text-sm outline-none transition-colors sm:w-auto",
                              slotErr ? "ring-1 ring-[#a8364b]" : ""
                            )}
                            style={{
                              backgroundColor: slotErr ? "#fff0f0" : "#dae6ff",
                              color: "#1c2b4b",
                              border: "none",
                            }}
                          />
                          <span
                            className="text-sm"
                            style={{ color: "#4b5a6d" }}
                          >
                            –
                          </span>
                          <input
                            type="time"
                            value={slot.endTime}
                            step={300}
                            onChange={(e) =>
                              updateSlot(day, i, "endTime", e.target.value)
                            }
                            className={cn(
                              "h-11 w-full rounded-lg px-3 text-sm outline-none transition-colors sm:w-auto",
                              slotErr ? "ring-1 ring-[#a8364b]" : ""
                            )}
                            style={{
                              backgroundColor: slotErr ? "#fff0f0" : "#dae6ff",
                              color: "#1c2b4b",
                              border: "none",
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => removeSlot(day, i)}
                            aria-label="Remove interval"
                            className="h-touch w-full cursor-pointer rounded-lg p-2 transition-colors hover:text-[#a8364b] sm:w-auto"
                            style={{ color: "#4b5a6d" }}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                          {slotErr && (
                            <span className="text-xs font-medium text-[#a8364b]">
                              {slotErr}
                            </span>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <p className="py-2 text-sm" style={{ color: "#4b5a6d" }}>
                      Unavailable
                    </p>
                  )}

                  {cfg.enabled && cfg.slots.length < 6 && (
                    <button
                      type="button"
                      onClick={() => addSlot(day)}
                      className="h-touch inline-flex w-full cursor-pointer items-center justify-center gap-1 rounded-lg px-2 py-1 text-xs font-medium transition-colors sm:w-fit"
                      style={{ color: accentColor }}
                    >
                      <Plus className="h-3 w-3" />
                      Add interval
                    </button>
                  )}
                </div>
              </div>

              {/* Per-day overlap/error banner */}
              {dayError && (
                <p className="ml-0 rounded-lg bg-[#fff0f0] px-3 py-1.5 text-xs font-medium text-[#a8364b] md:ml-[9.75rem]">
                  {dayError}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {footerExtra ? <div className="mb-6">{footerExtra}</div> : null}

      <div className="mt-2 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        {backHref ? (
          <Link
            href={backHref}
            className="flex h-touch items-center justify-center gap-1.5 text-sm font-medium text-[#64748B] no-underline hover:text-[#1c2b4b] sm:justify-start"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </Link>
        ) : (
          <span />
        )}
        <button
          type="button"
          onClick={finish}
          disabled={isPending}
          className="h-touch w-full cursor-pointer rounded-full px-10 py-3 text-[14px] font-semibold text-white transition-opacity disabled:opacity-50 sm:w-auto"
          style={{ backgroundColor: accentColor }}
        >
          {isPending ? "Saving…" : submitLabel}
        </button>
      </div>
    </div>
  );
}
