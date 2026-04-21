import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { listEventTypes } from "@/lib/services/event-type"
import { getWeeklyAvailability } from "@/lib/services/availability"
import { summarizeWeeklyAvailability } from "@/lib/utils/weekly-availability-summary"
import { SchedulingTabs } from "@/components/dashboard/scheduling-tabs"
import { SchedulingEventTypesSection } from "@/components/dashboard/scheduling-event-types-section"
import { SchedulingPageHeader } from "@/components/dashboard/scheduling-page-header"
import {
  SingleUsePlaceholder,
  MeetingPollsPlaceholder,
} from "@/components/dashboard/scheduling-tab-placeholders"

export const metadata = { title: "Scheduling" }

type Tab = "event-types" | "single-use" | "polls"


export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; error?: string }>
}) {
  const session = await auth()
  if (!session?.user?.id) return null

  const sp = await searchParams
  const raw = sp.tab
  const oauthError = sp.error
  const tab: Tab =
    raw === "single-use" || raw === "polls" ? raw : "event-types"

  const [eventTypes, availability, userRecord, googleAccount] = await Promise.all([
    listEventTypes(session.user.id),
    getWeeklyAvailability(session.user.id),
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { onboardingData: true },
    }),
    prisma.account.findFirst({
      where: { userId: session.user.id, provider: "google" },
      select: { id: true },
    }),
  ])

  const scheduleSummaryLine = summarizeWeeklyAvailability(availability)
  const od = (userRecord?.onboardingData ?? {}) as Record<string, unknown>
  const isFirstTime = !od.hasSeenEventsGuide

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
          isFirstTime={isFirstTime}
          hasGoogleConnected={!!googleAccount}
          oauthError={oauthError}
        />
      )}

      {tab === "single-use" && <SingleUsePlaceholder />}

      {tab === "polls" && <MeetingPollsPlaceholder />}
    </div>
  )
}
