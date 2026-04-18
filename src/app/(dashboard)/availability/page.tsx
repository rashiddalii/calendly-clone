import { auth } from "@/lib/auth"
import {
  getWeeklyAvailability,
  getDateOverrides,
  normalizeWeeklySchedule,
} from "@/lib/services/availability"
import { WeeklyScheduleEditor } from "@/components/dashboard/weekly-schedule-editor"
import { DateOverrideCalendar } from "@/components/dashboard/date-override-calendar"
import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header"

export const metadata = { title: "Availability" }

export default async function AvailabilityPage() {
  const session = await auth()
  if (!session?.user?.id) return null

  const [availability, overrides] = await Promise.all([
    getWeeklyAvailability(session.user.id),
    getDateOverrides(session.user.id),
  ])

  const normalized = normalizeWeeklySchedule(availability)

  return (
    <div className="mx-auto max-w-4xl">
      <DashboardPageHeader
        title="Availability"
        showHelp
        description="Tell Fluid when you're free. Everything else flows from here."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
        <WeeklyScheduleEditor initial={normalized} />
        <DateOverrideCalendar initial={overrides} />
      </div>
    </div>
  )
}
