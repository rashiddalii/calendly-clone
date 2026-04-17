import { redirect } from "next/navigation"
import Link from "next/link"
import { auth } from "@/lib/auth"
import { getDashboardStats } from "@/lib/services/user"
import { StatCard } from "@/components/dashboard/stat-card"
import { Button } from "@/components/ui/button"
import { CalendarDays, Clock, TrendingUp, Plus } from "lucide-react"

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const stats = await getDashboardStats(session.user.id)

  const firstName = session.user.name?.split(" ")[0] ?? "there"

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Hello, {firstName}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Here&apos;s what&apos;s happening with your schedule.
          </p>
        </div>
        <Button render={<Link href="/events" />} className="flex items-center gap-1.5">
          <Plus className="h-4 w-4" />
          New Event Type
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Event Types"
          value={stats.totalEventTypes}
          description="Active event types"
          icon={CalendarDays}
        />
        <StatCard
          title="Upcoming Bookings"
          value={stats.upcomingBookings}
          description="Confirmed meetings ahead"
          icon={Clock}
        />
        <StatCard
          title="This Month"
          value={stats.bookingsThisMonth}
          description="Total bookings this month"
          icon={TrendingUp}
        />
      </div>

      {stats.totalEventTypes === 0 && (
        <div className="rounded-xl border border-dashed p-8 text-center">
          <CalendarDays className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
          <h2 className="text-base font-medium mb-1">No event types yet</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Create your first event type so people can start booking time with you.
          </p>
          <Button render={<Link href="/events" />} className="flex items-center gap-1.5">
            <Plus className="h-4 w-4" />
            Create Event Type
          </Button>
        </div>
      )}
    </div>
  )
}
