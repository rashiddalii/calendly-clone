import { redirect } from "next/navigation"
import Link from "next/link"
import { auth } from "@/lib/auth"
import { getDashboardStats } from "@/lib/services/user"
import { StatCard } from "@/components/dashboard/stat-card"
import { Button } from "@/components/ui/button"
import { CalendarDays, Clock, TrendingUp, Plus } from "lucide-react"
import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header"

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const stats = await getDashboardStats(session.user.id)

  const firstName = session.user.name?.split(" ")[0] ?? "there"

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <DashboardPageHeader
          className="mb-0 sm:flex-1"
          title="Analytics"
          description={`Hello, ${firstName} — here's what's happening with your schedule.`}
        />
        <Button
          render={<Link href="/events" />}
          className="h-10 shrink-0 bg-[#006BFF] px-4 text-sm font-semibold text-white hover:bg-[#005FDB]"
        >
          <Plus className="h-4 w-4" />
          Event types
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Event types"
          value={stats.totalEventTypes}
          description="Active event types"
          icon={CalendarDays}
        />
        <StatCard
          title="Upcoming bookings"
          value={stats.upcomingBookings}
          description="Confirmed meetings ahead"
          icon={Clock}
        />
        <StatCard
          title="This month"
          value={stats.bookingsThisMonth}
          description="Total bookings this month"
          icon={TrendingUp}
        />
      </div>

      {stats.totalEventTypes === 0 && (
        <div className="mt-8 rounded-xl border border-dashed border-[#E5E7EB] bg-white p-8 text-center shadow-sm">
          <CalendarDays className="mx-auto mb-3 h-10 w-10 text-[#9CA3AF]" />
          <h2 className="mb-1 text-base font-semibold text-[#111827]">
            No event types yet
          </h2>
          <p className="mb-4 text-sm text-[#6B7280]">
            Create your first event type so people can start booking time with
            you.
          </p>
          <Button
            render={<Link href="/events/new" />}
            className="bg-[#006BFF] px-5 text-sm font-semibold text-white hover:bg-[#005FDB]"
          >
            <Plus className="h-4 w-4" />
            Create event type
          </Button>
        </div>
      )}
    </div>
  )
}
