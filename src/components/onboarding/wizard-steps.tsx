"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import {
  ChevronDown,
  ChevronLeft,
  User,
  Users,
  CreditCard,
  Mail,
  CalendarDays,
  Video,
  DollarSign,
  TrendingUp,
  HeartHandshake,
  Briefcase,
  Megaphone,
  GraduationCap,
  Lightbulb,
  Ellipsis,
  BookUser,
  Building2,
  Phone,
} from "lucide-react";
import { GoogleMeetIcon, TeamsIcon, ZoomIcon } from "@/components/icons/brand";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import {
  saveOnboardingStep1Action,
  saveOnboardingStep2Action,
  saveOnboardingStep3Action,
  saveOnboardingScheduleAndTimezoneAction,
  finalizeOnboardingAction,
} from "@/lib/actions/onboarding";
import { OnboardingScheduleEditor } from "@/components/onboarding/onboarding-schedule-editor";
import {
  ALL_TIMEZONES,
  ALL_TIMEZONES_SORTED,
} from "@/components/booking/timezone-picker";
import type { WeeklyScheduleInput } from "@/lib/validators/availability";
import type { LucideIcon } from "lucide-react";

const BLUE = "#006BFF";

/* ─────────────────────────────────────────────
   Rich icon badge — coloured square container
───────────────────────────────────────────── */
function RichIcon({
  Icon,
  color,
  bg,
}: {
  Icon: LucideIcon;
  color: string;
  bg: string;
}) {
  return (
    <div
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
      style={{ backgroundColor: bg }}
    >
      <Icon className="h-[18px] w-[18px]" style={{ color }} aria-hidden />
    </div>
  );
}

/* ─────────────────────────────────────────────
   Step 1 data
───────────────────────────────────────────── */
const USAGE_OPTIONS: {
  id: "solo" | "team";
  Icon: LucideIcon;
  label: string;
  iconColor: string;
  iconBg: string;
}[] = [
  {
    id: "solo",
    Icon: User,
    label: "On my own",
    iconColor: "#1A73E8",
    iconBg: "#E8F0FE",
  },
  {
    id: "team",
    Icon: Users,
    label: "With my team",
    iconColor: "#7C3AED",
    iconBg: "#EDE9FE",
  },
];

const HELP_GOALS: {
  id: string;
  Icon: LucideIcon;
  label: string;
  iconColor: string;
  iconBg: string;
}[] = [
  {
    id: "collect_payment",
    Icon: CreditCard,
    label: "Collect payment",
    iconColor: "#059669",
    iconBg: "#D1FAE5",
  },
  {
    id: "automate_emails",
    Icon: Mail,
    label: "Automate pre/post meeting emails",
    iconColor: "#D97706",
    iconBg: "#FEF3C7",
  },
  {
    id: "multi_attendees",
    Icon: Users,
    label: "Meet with multiple attendees",
    iconColor: "#1A73E8",
    iconBg: "#E8F0FE",
  },
  {
    id: "crm",
    Icon: BookUser,
    label: "Manage contact records",
    iconColor: "#7C3AED",
    iconBg: "#EDE9FE",
  },
  {
    id: "schedule",
    Icon: CalendarDays,
    label: "Schedule meetings",
    iconColor: "#006BFF",
    iconBg: "#EBF2FF",
  },
  {
    id: "record",
    Icon: Video,
    label: "Record and transcribe meetings",
    iconColor: "#DC2626",
    iconBg: "#FEE2E2",
  },
];

/* ─────────────────────────────────────────────
   Step 2 data
───────────────────────────────────────────── */
const ROLES: {
  id: string;
  Icon: LucideIcon;
  label: string;
  iconColor: string;
  iconBg: string;
}[] = [
  {
    id: "finance",
    Icon: DollarSign,
    label: "Finance",
    iconColor: "#059669",
    iconBg: "#D1FAE5",
  },
  {
    id: "sales",
    Icon: TrendingUp,
    label: "Sales",
    iconColor: "#1A73E8",
    iconBg: "#E8F0FE",
  },
  {
    id: "customer_success",
    Icon: HeartHandshake,
    label: "Customer success",
    iconColor: "#DB2777",
    iconBg: "#FCE7F3",
  },
  {
    id: "recruiting",
    Icon: Briefcase,
    label: "Recruiting",
    iconColor: "#4338CA",
    iconBg: "#EEF2FF",
  },
  {
    id: "marketing",
    Icon: Megaphone,
    label: "Marketing",
    iconColor: "#EA580C",
    iconBg: "#FFF7ED",
  },
  {
    id: "education",
    Icon: GraduationCap,
    label: "Education",
    iconColor: "#7C3AED",
    iconBg: "#EDE9FE",
  },
  {
    id: "consulting",
    Icon: Lightbulb,
    label: "Consulting",
    iconColor: "#B45309",
    iconBg: "#FFFBEB",
  },
  {
    id: "other",
    Icon: Ellipsis,
    label: "Other",
    iconColor: "#6B7280",
    iconBg: "#F3F4F6",
  },
];

/* ─────────────────────────────────────────────
   Step 5 — non-platform location icons
───────────────────────────────────────────── */
function InPersonIcon() {
  return (
    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#EBF2FF]">
      <Building2 className="h-4 w-4 text-[#1A73E8]" aria-hidden />
    </div>
  );
}

function PhoneIcon() {
  return (
    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F3F4F6]">
      <Phone className="h-4 w-4 text-[#6B7280]" aria-hidden />
    </div>
  );
}

const LOCATIONS: { id: string; label: string; icon: React.ReactNode }[] = [
  { id: "zoom", label: "Zoom", icon: <ZoomIcon className="h-7 w-7" /> },
  {
    id: "google_meet",
    label: "Google Meet",
    icon: <GoogleMeetIcon className="h-7 w-7" />,
  },
  {
    id: "microsoft_teams",
    label: "Microsoft Teams",
    icon: <TeamsIcon className="h-7 w-7" />,
  },
  { id: "in_person", label: "In-person", icon: <InPersonIcon /> },
  { id: "phone", label: "Phone call", icon: <PhoneIcon /> },
];

/* ─────────────────────────────────────────────
   Shared card + nav helpers
───────────────────────────────────────────── */
function selectCardClass(selected: boolean) {
  return [
    "flex cursor-pointer items-center gap-3 rounded-xl border-2 bg-white px-4 py-3.5 text-left transition-colors",
    selected
      ? "border-[#006BFF] shadow-[0_0_0_1px_#006BFF]"
      : "border-[#E5E7EB] hover:border-[#CBD5E1]",
  ].join(" ");
}

function WizardNav({
  backHref,
  onNext,
  nextLabel,
  disabled,
  pending,
}: {
  backHref?: string;
  onNext: () => void;
  nextLabel: string;
  disabled?: boolean;
  pending?: boolean;
}) {
  return (
    <div className="mt-10 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      {backHref ? (
        <Link
          href={backHref}
          className="flex h-touch items-center justify-center gap-1.5 text-sm font-medium text-[#64748B] no-underline hover:text-[#0F172A] sm:justify-start"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </Link>
      ) : (
        <span />
      )}
      <button
        type="button"
        onClick={onNext}
        disabled={disabled || pending}
        className="h-touch w-full cursor-pointer rounded-full px-10 py-3 text-[14px] font-semibold text-white transition-opacity disabled:opacity-50 sm:w-auto"
        style={{ backgroundColor: BLUE }}
      >
        {pending ? "…" : nextLabel}
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Step 1 — Usage & Goals
───────────────────────────────────────────── */
export function WizardStep1({
  firstName,
  initialUsage = null,
  initialGoals = [],
}: {
  firstName: string;
  initialUsage?: "solo" | "team" | null;
  initialGoals?: string[];
}) {
  const [usage, setUsage] = useState<"solo" | "team" | null>(initialUsage);
  const [goals, setGoals] = useState<string[]>(initialGoals);
  const [pending, startTransition] = useTransition();

  const toggleGoal = (id: string) => {
    setGoals((g) => (g.includes(id) ? g.filter((x) => x !== id) : [...g, id]));
  };

  const next = () => {
    if (!usage) {
      toast.error("Choose how you plan to use Fluid.");
      return;
    }
    if (goals.length === 0) {
      toast.error("Select at least one goal.");
      return;
    }
    startTransition(async () => {
      await saveOnboardingStep1Action({ usageMode: usage, helpGoals: goals });
    });
  };

  return (
    <>
      <p className="text-sm font-medium" style={{ color: BLUE }}>
        Welcome, {firstName}!
      </p>
      <h1 className="font-[family-name:var(--font-manrope)] mt-3 text-xl font-bold tracking-tight">
        How do you plan on using Fluid?
      </h1>
      <p className="mt-2 max-w-xl text-sm text-[#64748B]">
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
            <RichIcon Icon={o.Icon} color={o.iconColor} bg={o.iconBg} />
            <span className="text-[13px] font-medium text-[#0F172A]">
              {o.label}
            </span>
          </button>
        ))}
      </div>

      <h2 className="font-[family-name:var(--font-manrope)] mt-10 text-base font-bold text-[#0F172A]">
        How can Fluid help you?
      </h2>
      <p className="mt-1 text-sm text-[#64748B]">Select all that apply:</p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {HELP_GOALS.map((g) => (
          <button
            key={g.id}
            type="button"
            onClick={() => toggleGoal(g.id)}
            className={selectCardClass(goals.includes(g.id))}
          >
            <RichIcon Icon={g.Icon} color={g.iconColor} bg={g.iconBg} />
            <span className="text-[13px] font-medium text-[#0F172A]">
              {g.label}
            </span>
          </button>
        ))}
      </div>

      <WizardNav onNext={next} nextLabel="Next" pending={pending} />

      <p className="mt-8 max-w-xl text-xs leading-relaxed text-[#64748B]">
        Fluid will use this and your calendar information to customize your
        experience.{" "}
        <a
          href="#"
          className="font-medium text-[#006BFF] no-underline hover:underline"
        >
          Learn more
        </a>
        .
      </p>
    </>
  );
}

/* ─────────────────────────────────────────────
   Step 2 — Role
───────────────────────────────────────────── */
export function WizardStep2({
  initialRole = null,
}: {
  initialRole?: string | null;
}) {
  const [role, setRole] = useState<string | null>(initialRole);
  const [pending, startTransition] = useTransition();

  const next = () => {
    if (!role) {
      toast.error("Please select your role to continue.");
      return;
    }
    startTransition(async () => {
      await saveOnboardingStep2Action(role);
    });
  };

  return (
    <>
      <h1 className="font-[family-name:var(--font-manrope)] text-xl font-bold tracking-tight">
        What is your role?
      </h1>
      <p className="mt-2 max-w-xl text-sm text-[#64748B]">
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
            <RichIcon Icon={r.Icon} color={r.iconColor} bg={r.iconBg} />
            <span className="text-[13px] font-medium text-[#0F172A]">
              {r.label}
            </span>
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
  );
}

/* ─────────────────────────────────────────────
   Step 3 — Calendar connection
───────────────────────────────────────────── */
function GoogleCalGlyph({ connected }: { connected?: boolean }) {
  return (
    <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-[#E5E7EB]">
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
      {connected && (
        <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-white">
          <svg
            className="h-2.5 w-2.5 text-white"
            viewBox="0 0 10 10"
            fill="none"
            aria-hidden
          >
            <path
              d="M1.5 5l2.5 2.5 4.5-4.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      )}
    </div>
  );
}

/*
  Calendar step — mirrors how Calendly works:
  • Users who signed in with Google are ALREADY connected (we request calendar
    scopes during OAuth). hasGoogle=true means tokens are stored in Account table.
  • Users who signed up with email/GitHub see a "Connect Google Calendar" CTA.
  • Clicking "Connect" triggers Google OAuth with callbackUrl back to this page.
  • After the redirect, hasGoogle will be true and this page re-renders connected.
  • "Next" always works — calendar is optional but we save the preference to DB.
*/
export function WizardStep3({
  email,
  hasGoogle,
}: {
  email: string;
  hasGoogle: boolean;
}) {
  const [connecting, setConnecting] = useState(false);
  const [pending, startTransition] = useTransition();

  const handleConnect = () => {
    setConnecting(true);
    signIn("google", { callbackUrl: "/onboarding/calendars" });
  };

  const next = () => {
    startTransition(async () => {
      await saveOnboardingStep3Action({
        calendarProvider: hasGoogle ? "google" : null,
        calendarToAddMeetings: hasGoogle ? "primary" : null,
      });
    });
  };

  return (
    <>
      <h1 className="font-[family-name:var(--font-manrope)] text-xl font-bold tracking-tight">
        Connect your calendar
      </h1>
      <p className="mt-2 max-w-xl text-sm text-[#64748B]">
        Fluid checks your calendar for conflicts so you&apos;re never
        double-booked.
      </p>

      {/* ── Section 1: Calendars to check for conflicts ─────────────── */}
      <div className="mt-8 rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
        <h2 className="font-[family-name:var(--font-manrope)] text-sm font-semibold text-[#0F172A]">
          Calendars to check for conflicts
        </h2>
        <p className="mt-1 text-xs text-[#64748B]">
          Up to 6 work/personal calendars can be used to prevent
          double-bookings.
        </p>

        {hasGoogle ? (
          /* ── Connected state ──────────────────────────────────────── */
          <>
            <div className="mt-5 flex flex-col gap-3 rounded-xl border border-[#E5E7EB] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-3">
                <GoogleCalGlyph connected />
                <div className="min-w-0">
                  <p className="text-[13px] font-semibold text-[#0F172A]">
                    Google Calendar
                  </p>
                  <p className="truncate text-xs text-[#64748B]">{email}</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                <svg
                  className="h-3 w-3"
                  viewBox="0 0 12 12"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M2 6l2.5 2.5L10 3.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Connected
              </span>
            </div>
            <button
              type="button"
              onClick={handleConnect}
              disabled={connecting}
              className="mt-3 w-full cursor-pointer rounded-xl border border-dashed border-[#CBD5E1] bg-white py-2.5 text-[13px] font-medium text-[#006BFF] transition-colors hover:bg-[#F0F5FF] disabled:opacity-60"
            >
              {connecting ? "Redirecting…" : "+ Add another Google account"}
            </button>
          </>
        ) : (
          /* ── Not connected state ──────────────────────────────────── */
          <>
            <div className="mt-5 flex flex-col gap-3 rounded-xl border border-dashed border-[#E5E7EB] bg-[#FAFAFA] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white ring-1 ring-[#E5E7EB]">
                  <GoogleCalGlyph />
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-[#0F172A]">
                    Google Calendar
                  </p>
                  <p className="text-xs text-[#94A3B8]">Not connected</p>
                </div>
              </div>
              <span className="text-xs font-medium text-amber-600">
                Disconnected
              </span>
            </div>
            <button
              type="button"
              onClick={handleConnect}
              disabled={connecting}
              className="mt-4 flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-xl border border-[#E5E7EB] bg-white py-3 text-[13px] font-semibold text-[#0F172A] shadow-sm transition-colors hover:bg-[#F8F9FB] disabled:opacity-60"
            >
              <GoogleCalGlyph />
              {connecting
                ? "Redirecting to Google…"
                : "Connect Google Calendar"}
            </button>
            <p className="mt-2 text-center text-xs text-[#94A3B8]">
              You can also skip this and connect later in Settings.
            </p>
          </>
        )}
      </div>

      {/* ── Section 2: Calendar to add meetings to ──────────────────── */}
      <div className="mt-5 rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
        <h2 className="font-[family-name:var(--font-manrope)] text-sm font-semibold text-[#0F172A]">
          Calendar to add new meetings to
        </h2>
        <p className="mt-1 text-xs text-[#64748B]">
          New bookings will appear in this calendar.
        </p>

        <div className="mt-4 flex flex-col gap-3 rounded-xl border border-[#E5E7EB] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <GoogleCalGlyph connected={hasGoogle} />
            <div className="min-w-0">
              <p className="text-[13px] font-semibold text-[#0F172A]">
                {hasGoogle
                  ? "Google Calendar (primary)"
                  : "No calendar connected"}
              </p>
              <p className="truncate text-xs text-[#64748B]">
                {hasGoogle ? email : "Connect above to enable this"}
              </p>
            </div>
          </div>
          {hasGoogle && (
            <ChevronDown className="h-4 w-4 text-[#94A3B8]" aria-hidden />
          )}
        </div>
      </div>

      <WizardNav
        backHref="/onboarding/role"
        onNext={next}
        nextLabel="Next"
        pending={pending}
      />
    </>
  );
}

/* ─────────────────────────────────────────────
   Step 4 — Availability / Schedule
───────────────────────────────────────────── */
function formatNowInTz(tz: string) {
  try {
    return new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date());
  } catch {
    return "";
  }
}

export function WizardStep4({
  initialSchedule,
  defaultTimezone,
}: {
  initialSchedule: Record<number, { startTime: string; endTime: string }[]>;
  defaultTimezone: string;
}) {
  const [timezone, setTimezone] = useState(defaultTimezone);

  const tzLine =
    ALL_TIMEZONES.find((z) => z.value === timezone)?.label ?? timezone;
  const localNow = formatNowInTz(timezone);

  const footerExtra = (
    <div className="rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] p-5">
      <p className="font-[family-name:var(--font-manrope)] text-sm font-bold text-[#0F172A]">
        Time zone
      </p>
      <div className="relative mt-3">
        <select
          value={timezone}
          onChange={(e) => setTimezone(e.target.value)}
          className="w-full cursor-pointer appearance-none rounded-xl border border-[#E5E7EB] bg-white py-3 pl-4 pr-10 text-[13px] text-[#0F172A] outline-none focus:border-[#006BFF]"
        >
          {ALL_TIMEZONES_SORTED.map((zone) => (
            <option key={zone.value} value={zone.value}>
              {zone.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#94A3B8]" />
      </div>
      {localNow ? (
        <p className="mt-2 text-xs text-[#64748B]">
          {tzLine} ({localNow})
        </p>
      ) : null}
    </div>
  );

  return (
    <>
      <h1 className="font-[family-name:var(--font-manrope)] text-xl font-bold tracking-tight">
        When are you available to meet with people?
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-[#64748B]">
        You&apos;ll only be booked during these times (you can change these
        times and add other schedules later).
      </p>

      <div className="mt-8 overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-sm">
        <div className="border-b border-[#F1F5F9] px-6 py-5">
          <p className="font-[family-name:var(--font-manrope)] text-sm font-semibold text-[#0F172A]">
            Weekly hours
          </p>
          <p className="text-xs text-[#64748B]">
            Set when you are typically available for meetings
          </p>
        </div>
        <OnboardingScheduleEditor
          initial={initialSchedule}
          accentColor={BLUE}
          submitLabel="Next"
          surfaceClassName="rounded-none border-0 p-6 pt-2 shadow-none"
          footerExtra={footerExtra}
          backHref="/onboarding/calendars"
          onContinue={(payload: WeeklyScheduleInput) =>
            saveOnboardingScheduleAndTimezoneAction(timezone, payload)
          }
        />
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────
   Step 5 — Meeting location
───────────────────────────────────────────── */
export function WizardStep5({
  initialLocation = null,
}: {
  initialLocation?: string | null;
}) {
  const [loc, setLoc] = useState<string | null>(
    initialLocation ?? "google_meet"
  );
  const [pending, startTransition] = useTransition();

  const finish = () => {
    if (!loc) {
      toast.error("Choose how you'd like to meet.");
      return;
    }
    startTransition(async () => {
      const result = await finalizeOnboardingAction(loc);
      if (result && result.status === "error") toast.error(result.error);
    });
  };

  return (
    <>
      <h1 className="font-[family-name:var(--font-manrope)] text-xl font-bold tracking-tight">
        How would you like to meet with people?
      </h1>
      <p className="mt-2 max-w-xl text-sm text-[#64748B]">
        Set a meeting location for your first scheduling link. You can always
        change this later.
      </p>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {LOCATIONS.map((l) => (
          <button
            key={l.id}
            type="button"
            onClick={() => setLoc(l.id)}
            className={selectCardClass(loc === l.id)}
          >
            <div aria-hidden className="shrink-0">
              {l.icon}
            </div>
            <span className="text-[13px] font-medium text-[#0F172A]">
              {l.label}
            </span>
          </button>
        ))}
      </div>

      <WizardNav
        backHref="/onboarding/availability"
        onNext={finish}
        nextLabel="Next"
        pending={pending}
      />
    </>
  );
}
