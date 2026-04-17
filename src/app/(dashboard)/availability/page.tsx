import { auth } from "@/lib/auth"
import {
  getWeeklyAvailability,
  getDateOverrides,
  normalizeWeeklySchedule,
} from "@/lib/services/availability"
import { WeeklyScheduleEditor } from "@/components/dashboard/weekly-schedule-editor"
import { DateOverrideCalendar } from "@/components/dashboard/date-override-calendar"

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
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="font-heading text-3xl font-semibold text-on-surface">
          Availability
        </h1>
        <p className="mt-1 text-sm text-on-surface-variant">
          Tell Fluid when you&apos;re free. Everything else flows from here.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
        <WeeklyScheduleEditor initial={normalized} />
        <DateOverrideCalendar initial={overrides} />
      </div>
    </div>
  )
}
