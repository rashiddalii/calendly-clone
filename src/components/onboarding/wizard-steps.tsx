"use client"

import Link from "next/link"
import { useState, useTransition } from "react"
import { ChevronDown } from "lucide-react"
import { toast } from "sonner"
import {
  saveOnboardingStep1Action,
  saveOnboardingStep2Action,
  saveOnboardingStep3Action,
  saveOnboardingScheduleAndTimezoneAction,
  finalizeOnboardingAction,
} from "@/lib/actions/onboarding"
import { OnboardingScheduleEditor } from "@/components/onboarding/onboarding-schedule-editor"
import { ALL_TIMEZONES } from "@/components/booking/timezone-picker"
import type { WeeklyScheduleInput } from "@/lib/validators/availability"

const BLUE = "#006BFF"

const USAGE_OPTIONS = [
  { id: "solo" as const, emoji: "\u{261D}\u{FE0F}", label: "On my own" },
  { id: "team" as const, emoji: "\u{1F91D}", label: "With my team" },
]

const HELP_GOALS = [
  { id: "collect_payment", emoji: "\u{1F4B0}", label: "Collect payment" },
  {
    id: "automate_emails",
    emoji: "\u{1F557}",
    label: "Automate pre/post meeting emails",
  },
  {
    id: "multi_attendees",
    emoji: "\u{1F465}",
    label: "Meet with multiple attendees",
  },
  { id: "crm", emoji: "\u{1F4CB}", label: "Manage contact records" },
  { id: "schedule", emoji: "\u{1F4C5}", label: "Schedule meetings" },
  { id: "record", emoji: "\u{1F3A5}", label: "Record and transcribe meetings" },
]

const ROLES = [
  { id: "finance", emoji: "\u{1F4B0}", label: "Finance" },
  { id: "sales", emoji: "\u{1F4C8}", label: "Sales" },
  { id: "customer_success", emoji: "\u{1F9F1}", label: "Customer success" },
  { id: "recruiting", emoji: "\u{1F4CB}", label: "Recruiting" },
  { id: "marketing", emoji: "\u{1F680}", label: "Marketing" },
  { id: "education", emoji: "\u{1F4DA}", label: "Education" },
  { id: "consulting", emoji: "\u{1F4BC}", label: "Consulting" },
  { id: "other", emoji: "\u{1F984}", label: "Other" },
]

const LOCATIONS = [
  { id: "zoom", label: "Zoom", emoji: "\u{1F3A5}" },
  { id: "google_meet", label: "Google Meet", emoji: "\u{1F4F9}" },
  { id: "microsoft_teams", label: "Microsoft Teams", emoji: "\u{1F4BB}" },
  { id: "in_person", label: "In-person", emoji: "\u{1F3E2}" },
  { id: "phone", label: "Phone call", emoji: "\u{260E}\u{FE0F}" },
]

function selectCardClass(selected: boolean) {
  return [
    "flex cursor-pointer items-center gap-3 rounded-xl border-2 bg-white px-4 py-4 text-left transition-colors",
    selected
      ? "border-[#006BFF] shadow-[0_0_0_1px_#006BFF]"
      : "border-[#E5E7EB] hover:border-[#CBD5E1]",
  ].join(" ")
}

function WizardNav({
  backHref,
  onNext,
  nextLabel,
  disabled,
  pending,
}: {
  backHref?: string
  onNext: () => void
  nextLabel: string
  disabled?: boolean
  pending?: boolean
}) {
  return (
    <div className="mt-10 flex items-center justify-between gap-4">
      {backHref ? (
        <Link
          href={backHref}
          className="text-[15px] font-medium text-[#64748B] no-underline hover:text-[#0F172A]"
        >
          &lt; Back
        </Link>
      ) : (
        <span />
      )}
      <button
        type="button"
        onClick={onNext}
        disabled={disabled || pending}
        className="rounded-full px-10 py-3 text-[15px] font-semibold text-white transition-opacity disabled:opacity-50"
        style={{ backgroundColor: BLUE }}
      >
        {pending ? "…" : nextLabel}
      </button>
    </div>
  )
}

export function WizardStep1({ firstName }: { firstName: string }) {
  const [usage, setUsage] = useState<"solo" | "team" | null>(null)
  const [goals, setGoals] = useState<string[]>([])
  const [pending, startTransition] = useTransition()

  const toggleGoal = (id: string) => {
    setGoals((g) => (g.includes(id) ? g.filter((x) => x !== id) : [...g, id]))
  }

  const next = () => {
    if (!usage) {
      toast.error("Choose how you plan to use Fluid.")
      return
    }
    if (goals.length === 0) {
      toast.error("Select at least one goal.")
      return
    }
    startTransition(async () => {
      await saveOnboardingStep1Action({ usageMode: usage, helpGoals: goals })
    })
  }

  return (
    <>
      <p className="text-[17px] font-medium" style={{ color: BLUE }}>
        Welcome, {firstName}!
      </p>
      <h1 className="font-[family-name:var(--font-manrope)] mt-3 text-3xl font-bold tracking-tight sm:text-[2rem] sm:leading-tight">
        How do you plan on using Fluid?
      </h1>
      <p className="mt-2 max-w-xl text-[17px] text-[#64748B]">
        Your responses will help us tailor your experience to your needs.
      </p>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {USAGE_OPTIONS.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => setUsage(o.id)}
            className={selectCardClass(usage === o.id)}
          >
            <span className="text-2xl" aria-hidden>
              {o.emoji}
            </span>
            <span className="text-[17px] font-medium text-[#0F172A]">{o.label}</span>
          </button>
        ))}
      </div>

      <h2 className="font-[family-name:var(--font-manrope)] mt-10 text-xl font-bold text-[#0F172A]">
        How can Fluid help you?
      </h2>
      <p className="mt-1 text-[15px] text-[#64748B]">Select all that apply:</p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {HELP_GOALS.map((g) => (
          <button
            key={g.id}
            type="button"
            onClick={() => toggleGoal(g.id)}
            className={selectCardClass(goals.includes(g.id))}
          >
            <span className="text-xl" aria-hidden>
              {g.emoji}
            </span>
            <span className="text-[15px] font-medium text-[#0F172A]">{g.label}</span>
          </button>
        ))}
      </div>

      <WizardNav onNext={next} nextLabel="Next" pending={pending} />

      <p className="mt-8 max-w-xl text-[13px] leading-relaxed text-[#64748B]">
        Fluid will use this and your calendar information to customize your experience.{" "}
        <a href="#" className="font-medium text-[#006BFF] no-underline hover:underline">
          Learn more
        </a>
        .
      </p>
    </>
  )
}

export function WizardStep2() {
  const [role, setRole] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  const next = () => {
    if (!role) {
      toast.error("Please select your role to continue.")
      return
    }
    startTransition(async () => {
      await saveOnboardingStep2Action(role)
    })
  }

  return (
    <>
      <h1 className="font-[family-name:var(--font-manrope)] text-3xl font-bold tracking-tight sm:text-[2rem] sm:leading-tight">
        What is your role?
      </h1>
      <p className="mt-2 max-w-xl text-[17px] text-[#64748B]">
        Understanding your role will help us set up your first scheduling link.
      </p>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {ROLES.map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => setRole(r.id)}
            className={selectCardClass(role === r.id)}
          >
            <span className="text-xl" aria-hidden>
              {r.emoji}
            </span>
            <span className="text-[15px] font-medium text-[#0F172A]">{r.label}</span>
          </button>
        ))}
      </div>

      <WizardNav
        backHref="/onboarding"
        onNext={next}
        nextLabel="Next"
        pending={pending}
      />
    </>
  )
}

function GoogleCalGlyph() {
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-[#E5E7EB]">
      <svg className="h-6 w-6" viewBox="0 0 24 24" aria-hidden>
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="#FBBC05"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
          fill="#EA4335"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>
    </div>
  )
}

export function WizardStep3({ email, hasGoogle }: { email: string; hasGoogle: boolean }) {
  const [pending, startTransition] = useTransition()

  const next = () => {
    startTransition(async () => {
      await saveOnboardingStep3Action()
    })
  }

  return (
    <>
      <h1 className="font-[family-name:var(--font-manrope)] text-2xl font-bold leading-snug tracking-tight sm:text-[1.75rem]">
        Set which calendars we use to check for busy times
      </h1>

      <div className="mt-8 rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
        <h2 className="font-[family-name:var(--font-manrope)] text-lg font-bold text-[#0F172A]">
          Calendars to check for conflicts
        </h2>
        <p className="mt-1 text-[15px] text-[#64748B]">
          Up to 6 work/personal calendars can be used to prevent double bookings
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#E5E7EB] px-4 py-3">
          <div className="flex items-center gap-3">
            <GoogleCalGlyph />
            <div>
              <p className="text-[15px] font-semibold text-[#0F172A]">Google</p>
              <p className="text-[13px] text-[#64748B]">{email}</p>
            </div>
          </div>
          {hasGoogle ? (
            <span className="text-[14px] font-medium text-emerald-600">Connected</span>
          ) : (
            <span className="text-[14px] font-medium text-amber-600">Connect in settings</span>
          )}
        </div>

        <p className="mt-3 text-[14px] text-[#64748B]">Checking 1/5 sub-calendars</p>

        <button
          type="button"
          className="mt-4 w-full rounded-xl border border-[#E5E7EB] bg-white py-3 text-[15px] font-medium text-[#0F172A] transition-colors hover:bg-[#F8F9FB]"
        >
          + Connect to your calendars
        </button>
      </div>

      <div className="mt-6 rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
        <h2 className="font-[family-name:var(--font-manrope)] text-lg font-bold text-[#0F172A]">
          Calendar to add meetings to
        </h2>
        <p className="mt-1 text-[15px] text-[#64748B]">
          Choose one calendar to view all of your meetings
        </p>
        <div className="mt-4 flex items-center justify-between rounded-xl border border-[#E5E7EB] px-4 py-3">
          <div className="flex items-center gap-3">
            <GoogleCalGlyph />
            <div>
              <p className="text-[15px] font-semibold text-[#0F172A]">Google Calendar</p>
              <p className="text-[13px] text-[#64748B]">Gmail, G Suite</p>
            </div>
          </div>
          <ChevronDown className="h-5 w-5 text-[#94A3B8]" aria-hidden />
        </div>
      </div>

      <WizardNav
        backHref="/onboarding/role"
        onNext={next}
        nextLabel="Next"
        pending={pending}
      />
    </>
  )
}

function formatNowInTz(tz: string) {
  try {
    return new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date())
  } catch {
    return ""
  }
}

export function WizardStep4({
  initialSchedule,
  defaultTimezone,
}: {
  initialSchedule: Record<number, { startTime: string; endTime: string }[]>
  defaultTimezone: string
}) {
  const [timezone, setTimezone] = useState(defaultTimezone)

  const tzLine = ALL_TIMEZONES.find((z) => z.value === timezone)?.label ?? timezone
  const localNow = formatNowInTz(timezone)

  const footerExtra = (
    <div className="rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] p-5">
      <p className="font-[family-name:var(--font-manrope)] text-sm font-bold text-[#0F172A]">
        Time zone
      </p>
      <div className="relative mt-3">
        <select
          value={timezone}
          onChange={(e) => setTimezone(e.target.value)}
          className="w-full appearance-none rounded-xl border border-[#E5E7EB] bg-white py-3 pl-4 pr-10 text-[15px] text-[#0F172A] outline-none focus:border-[#006BFF]"
        >
          {ALL_TIMEZONES.map((zone) => (
            <option key={zone.value} value={zone.value}>
              {zone.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#94A3B8]" />
      </div>
      {localNow ? (
        <p className="mt-2 text-[13px] text-[#64748B]">
          {tzLine} ({localNow})
        </p>
      ) : null}
    </div>
  )

  return (
    <>
      <h1 className="font-[family-name:var(--font-manrope)] text-2xl font-bold leading-snug tracking-tight sm:text-[1.85rem]">
        When are you available to meet with people?
      </h1>
      <p className="mt-2 max-w-2xl text-[17px] text-[#64748B]">
        You&apos;ll only be booked during these times (you can change these times and add
        other schedules later).
      </p>

      <div className="mt-8 overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-sm">
        <div className="border-b border-[#F1F5F9] px-6 py-5">
          <p className="font-[family-name:var(--font-manrope)] text-lg font-bold text-[#0F172A]">
            Weekly hours
          </p>
          <p className="text-[15px] text-[#64748B]">
            Set when you are typically available for meetings
          </p>
        </div>
        <OnboardingScheduleEditor
          initial={initialSchedule}
          accentColor={BLUE}
          submitLabel="Next"
          surfaceClassName="rounded-none border-0 p-6 pt-2 shadow-none"
          footerExtra={footerExtra}
          onContinue={(payload: WeeklyScheduleInput) =>
            saveOnboardingScheduleAndTimezoneAction(timezone, payload)
          }
        />
      </div>

      <div className="mt-6">
        <Link
          href="/onboarding/calendars"
          className="text-[15px] font-medium text-[#64748B] no-underline hover:text-[#0F172A]"
        >
          &lt; Back
        </Link>
      </div>
    </>
  )
}

export function WizardStep5() {
  const [loc, setLoc] = useState<string | null>("google_meet")
  const [pending, startTransition] = useTransition()

  const finish = () => {
    if (!loc) {
      toast.error("Choose how you'd like to meet.")
      return
    }
    startTransition(async () => {
      const result = await finalizeOnboardingAction(loc)
      if (result && result.status === "error") toast.error(result.error)
    })
  }

  return (
    <>
      <h1 className="font-[family-name:var(--font-manrope)] text-2xl font-bold leading-snug tracking-tight sm:text-[1.85rem]">
        How would you like to meet with people?
      </h1>
      <p className="mt-2 max-w-xl text-[17px] text-[#64748B]">
        Set a meeting location for your first scheduling link. You can always change this
        later.
      </p>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {LOCATIONS.map((l) => (
          <button
            key={l.id}
            type="button"
            onClick={() => setLoc(l.id)}
            className={selectCardClass(loc === l.id)}
          >
            <span className="text-xl" aria-hidden>
              {l.emoji}
            </span>
            <span className="text-[15px] font-medium text-[#0F172A]">{l.label}</span>
          </button>
        ))}
      </div>

      <WizardNav
        backHref="/onboarding/availability"
        onNext={finish}
        nextLabel="Continue"
        pending={pending}
      />
    </>
  )
}
