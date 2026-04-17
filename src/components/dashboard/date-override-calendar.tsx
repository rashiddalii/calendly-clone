"use client"

import { useState, useTransition } from "react"
import { CalendarX, Clock, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"
import type { DateOverride } from "@/generated/prisma/client"
import {
  upsertDateOverrideAction,
  deleteDateOverrideAction,
} from "@/lib/actions/availability"

type Mode = "block" | "custom"

function formatDateHuman(dateStr: string) {
  const d = new Date(`${dateStr}T00:00:00`)
  return d.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

function toIsoDate(d: Date): string {
  const y = d.getUTCFullYear()
  const m = String(d.getUTCMonth() + 1).padStart(2, "0")
  const day = String(d.getUTCDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

export function DateOverrideCalendar({
  initial,
}: {
  initial: DateOverride[]
}) {
  const [overrides, setOverrides] = useState<DateOverride[]>(initial)
  const [date, setDate] = useState("")
  const [mode, setMode] = useState<Mode>("block")
  const [startTime, setStartTime] = useState("09:00")
  const [endTime, setEndTime] = useState("17:00")
  const [isPending, startTransition] = useTransition()

  const minDate = toIsoDate(new Date())

  const addOverride = () => {
    if (!date) {
      toast.error("Please pick a date")
      return
    }
    startTransition(async () => {
      const payload =
        mode === "block"
          ? { date, startTime: null, endTime: null }
          : { date, startTime, endTime }
      const result = await upsertDateOverrideAction(payload)
      if (result.status === "success") {
        toast.success("Override added")
        // Optimistic local update — refresh will re-fetch
        setOverrides((prev) => {
          const filtered = prev.filter(
            (o) => toIsoDate(new Date(o.date)) !== date,
          )
          return [
            ...filtered,
            {
              id: `temp-${date}`,
              userId: "",
              date: new Date(`${date}T00:00:00.000Z`),
              startTime: mode === "block" ? null : startTime,
              endTime: mode === "block" ? null : endTime,
              createdAt: new Date(),
            } as DateOverride,
          ].sort(
            (a, b) =>
              new Date(a.date).getTime() - new Date(b.date).getTime(),
          )
        })
        setDate("")
      } else {
        toast.error(result.error)
      }
    })
  }

  const removeOverride = (isoDate: string) => {
    startTransition(async () => {
      const result = await deleteDateOverrideAction(isoDate)
      if (result.status === "success") {
        setOverrides((prev) =>
          prev.filter((o) => toIsoDate(new Date(o.date)) !== isoDate),
        )
        toast.success("Override removed")
      }
    })
  }

  return (
    <section className="flex flex-col gap-4 rounded-xl bg-surface-lowest p-6">
      <div>
        <h2 className="font-heading text-xl font-semibold">Date overrides</h2>
        <p className="mt-1 text-sm text-on-surface-variant">
          Block a date, or replace your weekly hours for a specific day.
        </p>
      </div>

      {/* Add form */}
      <div className="flex flex-col gap-3 rounded-lg bg-surface-low p-4">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-on-surface-variant">
            Date
          </label>
          <input
            type="date"
            min={minDate}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="h-9 rounded-md border-0 bg-surface-lowest px-3 text-sm text-on-surface outline-none focus:ring-2 focus:ring-[color:var(--brand)]/30"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-on-surface-variant">
            Action
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setMode("block")}
              className={`flex-1 rounded-md px-3 py-2 text-sm transition-colors ${
                mode === "block"
                  ? "bg-surface-lowest text-on-surface"
                  : "text-on-surface-variant hover:bg-surface-lowest/50"
              }`}
            >
              <CalendarX className="mr-1.5 inline h-3.5 w-3.5" />
              Block day
            </button>
            <button
              type="button"
              onClick={() => setMode("custom")}
              className={`flex-1 rounded-md px-3 py-2 text-sm transition-colors ${
                mode === "custom"
                  ? "bg-surface-lowest text-on-surface"
                  : "text-on-surface-variant hover:bg-surface-lowest/50"
              }`}
            >
              <Clock className="mr-1.5 inline h-3.5 w-3.5" />
              Custom hours
            </button>
          </div>
        </div>

        {mode === "custom" && (
          <div className="flex items-center gap-2">
            <input
              type="time"
              step={300}
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="h-9 flex-1 rounded-md border-0 bg-surface-lowest px-3 text-sm text-on-surface outline-none focus:ring-2 focus:ring-[color:var(--brand)]/30"
            />
            <span className="text-sm text-on-surface-variant">–</span>
            <input
              type="time"
              step={300}
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="h-9 flex-1 rounded-md border-0 bg-surface-lowest px-3 text-sm text-on-surface outline-none focus:ring-2 focus:ring-[color:var(--brand)]/30"
            />
          </div>
        )}

        <button
          type="button"
          onClick={addOverride}
          disabled={isPending || !date}
          className="cta-gradient inline-flex h-9 items-center justify-center gap-1.5 rounded-md px-4 text-sm font-medium disabled:opacity-50"
        >
          <Plus className="h-3.5 w-3.5" />
          Add override
        </button>
      </div>

      {/* Existing list */}
      <div className="flex flex-col gap-2">
        {overrides.length === 0 ? (
          <p className="py-8 text-center text-sm text-on-surface-variant">
            No overrides yet. Your weekly schedule applies to every day.
          </p>
        ) : (
          overrides.map((o) => {
            const iso = toIsoDate(new Date(o.date))
            const isBlock = !o.startTime || !o.endTime
            return (
              <div
                key={o.id}
                className="flex items-center justify-between gap-3 rounded-lg bg-surface-low px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-on-surface">
                    {formatDateHuman(iso)}
                  </p>
                  <p className="text-xs text-on-surface-variant">
                    {isBlock
                      ? "Blocked — no bookings accepted"
                      : `${o.startTime} – ${o.endTime}`}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeOverride(iso)}
                  disabled={isPending}
                  aria-label="Remove override"
                  className="rounded-md p-2 text-on-surface-variant transition-colors hover:bg-[color:var(--error)]/10 hover:text-[color:var(--error)] disabled:opacity-50"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            )
          })
        )}
      </div>
    </section>
  )
}
