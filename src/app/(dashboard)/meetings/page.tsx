import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { listBookings } from "@/lib/services/booking"
import { MeetingsClient } from "./meetings-client"
import type { SerializedBooking } from "./meetings-client"
import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header"

export const metadata = { title: "Meetings | Fluid" }

export default async function MeetingsPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const bookings = await listBookings(session.user.id)
  const now = new Date()

  const upcoming: SerializedBooking[] = []
  const past: SerializedBooking[] = []
  const cancelled: SerializedBooking[] = []

  for (const booking of bookings) {
    const serialized: SerializedBooking = {
      id: booking.id,
      status: booking.status as "CONFIRMED" | "CANCELLED" | "COMPLETED",
      bookerName: booking.bookerName,
      bookerEmail: booking.bookerEmail,
      bookerNotes: booking.bookerNotes,
      startTime: booking.startTime.toISOString(),
      endTime: booking.endTime.toISOString(),
      eventType: {
        title: booking.eventType.title,
        color: booking.eventType.color,
        duration: booking.eventType.duration,
      },
      host: {
        timezone: booking.host.timezone,
      },
    }

    if (booking.status === "CANCELLED") {
      cancelled.push(serialized)
    } else if (booking.status === "CONFIRMED" && booking.startTime > now) {
      upcoming.push(serialized)
    } else {
      past.push(serialized)
    }
  }

  return (
    <div className="mx-auto max-w-4xl">
      <DashboardPageHeader
        title="Meetings"
        showHelp
        description="All your scheduled and past bookings in one place."
      />

      <MeetingsClient
        upcoming={upcoming}
        past={past}
        cancelled={cancelled}
      />
    </div>
  )
}
