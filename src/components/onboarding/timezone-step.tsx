"use client"

import { useState, useTransition } from "react"
import { saveOnboardingTimezoneAction } from "@/lib/actions/onboarding"
import { ArrowRight } from "lucide-react"
import { TIMEZONE_GROUPS, ALL_TIMEZONES } from "@/components/booking/timezone-picker"

interface TimezoneStepProps {
  defaultTimezone: string
}

function initialTimezone(defaultTimezone: string): string {
  if (defaultTimezone !== "UTC") return defaultTimezone
  try {
    const detected = Intl.DateTimeFormat().resolvedOptions().timeZone
    if (detected && ALL_TIMEZONES.some((z) => z.value === detected)) {
      return detected
    }
  } catch {
    /* keep UTC */
  }
  return defaultTimezone
}

export function TimezoneStep({ defaultTimezone }: TimezoneStepProps) {
  const [timezone, setTimezone] = useState(() =>
    initialTimezone(defaultTimezone),
  )
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      const result = await saveOnboardingTimezoneAction(timezone)
      if (result && result.status === "error") setError(result.error)
    })
  }

  const inList = ALL_TIMEZONES.some((z) => z.value === timezone)

  return (
    <div className="rounded-2xl p-8" style={{ backgroundColor: "#ffffff" }}>
      <h1
        className="mb-2 text-3xl font-semibold"
        style={{ color: "#32323b", fontFamily: "var(--font-heading)" }}
      >
        Your timezone
      </h1>
      <p className="mb-8 text-base" style={{ color: "#5f5e68" }}>
        We&apos;ve detected your timezone automatically — confirm or change it below.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="timezone"
            className="text-xs font-medium"
            style={{ color: "#5f5e68" }}
          >
            Timezone
          </label>
          <div className="relative">
            <select
              id="timezone"
              value={timezone}
              onChange={(e) => {
                setTimezone(e.target.value)
                setError(null)
              }}
              className="w-full appearance-none rounded-[0.75rem] px-3 py-2.5 pr-9 text-sm outline-none transition-all"
              style={{ backgroundColor: "#eae7f1", color: "#32323b" }}
            >
              {!inList && (
                <option value={timezone}>{timezone}</option>
              )}
              {TIMEZONE_GROUPS.map((group) => (
                <optgroup key={group.label} label={group.label}>
                  {group.zones.map((zone) => (
                    <option key={zone.value} value={zone.value}>
                      {zone.label}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            <div
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
              aria-hidden="true"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                style={{ color: "#5f5e68" }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
          {error && (
            <p className="text-xs" style={{ color: "#a8364b" }}>
              {error}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="flex items-center justify-center gap-2 rounded-xl h-11 text-sm font-medium transition-opacity disabled:opacity-50"
          style={{
            background: "linear-gradient(135deg, #4a4bd7, #7073ff)",
            color: "#fbf7ff",
          }}
        >
          {isPending ? "Saving…" : "Continue"}
          {!isPending && <ArrowRight className="h-4 w-4" />}
        </button>
      </form>
    </div>
  )
}
