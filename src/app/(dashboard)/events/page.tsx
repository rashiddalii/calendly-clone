import { Filter, Search } from "lucide-react"
import { auth } from "@/lib/auth"
import { listEventTypes } from "@/lib/services/event-type"
import { getWeeklyAvailability } from "@/lib/services/availability"
import { summarizeWeeklyAvailability } from "@/lib/utils/weekly-availability-summary"
import { SchedulingTabs } from "@/components/dashboard/scheduling-tabs"
import { SchedulingEventTypesSection } from "@/components/dashboard/scheduling-event-types-section"
import { SchedulingPageHeader } from "@/components/dashboard/scheduling-page-header"
import {
  MeetingPollsIllustration,
  SingleUseLinksIllustration,
} from "@/components/dashboard/scheduling-empty-illustrations"

export const metadata = { title: "Scheduling" }

type Tab = "event-types" | "single-use" | "polls"

function SingleUsePlaceholder() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-[200px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
          <input
            readOnly
            placeholder="Search single use links"
            className="h-11 w-full cursor-default rounded-xl border border-[#E5E7EB] bg-white pl-10 pr-3 text-sm text-[#111827] outline-none"
          />
        </div>
        <button
          type="button"
          className="inline-flex h-11 shrink-0 items-center gap-2 rounded-xl border border-[#E5E7EB] bg-white px-4 text-sm font-medium text-[#374151] hover:bg-[#F9FAFB]"
        >
          <Filter className="h-4 w-4" />
          Filter
        </button>
      </div>
      <div className="flex flex-col gap-6 rounded-xl border border-[#E5E7EB] bg-white p-8 shadow-sm md:flex-row md:items-center md:justify-between md:p-10">
        <div className="max-w-lg">
          <h2 className="text-lg font-semibold text-[#111827]">
            Control how often you get booked
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[#6B7280]">
            Single-use links can only be booked once. Create a single-use link
            from an event type and it will appear here.
          </p>
          <span className="mt-3 inline-block text-sm font-semibold text-[#006BFF]">
            Learn more →
          </span>
        </div>
        <SingleUseLinksIllustration />
      </div>
    </div>
  )
}

function MeetingPollsPlaceholder() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-[200px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
          <input
            readOnly
            placeholder="Search meeting polls"
            className="h-11 w-full cursor-default rounded-xl border border-[#E5E7EB] bg-white pl-10 pr-3 text-sm text-[#111827] outline-none"
          />
        </div>
        <button
          type="button"
          className="inline-flex h-11 shrink-0 items-center gap-2 rounded-xl border border-[#E5E7EB] bg-white px-4 text-sm font-medium text-[#374151] hover:bg-[#F9FAFB]"
        >
          <Filter className="h-4 w-4" />
          Filter
        </button>
      </div>
      <div className="flex flex-col gap-6 rounded-xl border border-[#E5E7EB] bg-white p-8 shadow-sm md:flex-row md:items-center md:justify-between md:p-10">
        <div className="max-w-lg">
          <h2 className="text-lg font-semibold text-[#1e3461]">
            Find the best time for everyone
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[#6B7280]">
            Gather everyone&apos;s availability to pick the best time for the
            group. Track votes as they come in, and book the most popular time.
          </p>
          <span className="mt-3 inline-block text-sm font-semibold text-[#006BFF]">
            Learn more →
          </span>
          <div className="mt-5">
            <button
              type="button"
              disabled
              className="inline-flex h-10 cursor-not-allowed items-center gap-2 rounded-lg bg-[#006BFF]/50 px-4 text-sm font-semibold text-white"
            >
              + Create meeting poll
            </button>
          </div>
        </div>
        <MeetingPollsIllustration />
      </div>
    </div>
  )
}

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>
}) {
  const session = await auth()
  if (!session?.user?.id) return null

  const sp = await searchParams
  const raw = sp.tab
  const tab: Tab =
    raw === "single-use" || raw === "polls" ? raw : "event-types"

  const [eventTypes, availability] = await Promise.all([
    listEventTypes(session.user.id),
    getWeeklyAvailability(session.user.id),
  ])

  const scheduleSummaryLine = summarizeWeeklyAvailability(availability)

  return (
    <div className="mx-auto max-w-4xl">
      <SchedulingPageHeader
        description={
          tab === "event-types"
            ? "Create and manage the event types people can book."
            : undefined
        }
      />

      <div className="mb-8">
        <SchedulingTabs active={tab} />
      </div>

      {tab === "event-types" && (
        <SchedulingEventTypesSection
          eventTypes={eventTypes}
          username={session.user.username ?? null}
          userName={session.user.name ?? null}
          userEmail={session.user.email ?? null}
          userImage={session.user.image ?? null}
          scheduleSummaryLine={scheduleSummaryLine}
        />
      )}

      {tab === "single-use" && <SingleUsePlaceholder />}

      {tab === "polls" && <MeetingPollsPlaceholder />}
    </div>
  )
}
