import Link from "next/link"
import { Plus, CalendarDays } from "lucide-react"
import { auth } from "@/lib/auth"
import { listEventTypes } from "@/lib/services/event-type"
import { EventTypeCard } from "@/components/dashboard/event-type-card"

export const metadata = { title: "Event types" }

export default async function EventsPage() {
  const session = await auth()
  if (!session?.user?.id) return null

  const [eventTypes, username] = await Promise.all([
    listEventTypes(session.user.id),
    Promise.resolve(session.user.username ?? null),
  ])

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-semibold text-on-surface">
            Event types
          </h1>
          <p className="mt-1 text-sm text-on-surface-variant">
            Every booking link you share starts life as an event type.
          </p>
        </div>
        <Link
          href="/events/new"
          className="cta-gradient inline-flex h-10 items-center gap-2 rounded-md px-5 text-sm font-medium"
        >
          <Plus className="h-4 w-4" />
          New event type
        </Link>
      </header>

      {eventTypes.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-xl brand-tint px-6 py-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-lowest">
            <CalendarDays className="h-5 w-5 text-[color:var(--brand)]" />
          </div>
          <div className="max-w-md">
            <h2 className="font-heading text-xl font-semibold">
              No event types yet
            </h2>
            <p className="mt-1 text-sm text-on-surface-variant">
              Create your first event type to start accepting bookings.
            </p>
          </div>
          <Link
            href="/events/new"
            className="cta-gradient inline-flex h-10 items-center gap-2 rounded-md px-5 text-sm font-medium"
          >
            <Plus className="h-4 w-4" />
            Create your first event type
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {eventTypes.map((eventType) => (
            <EventTypeCard
              key={eventType.id}
              eventType={eventType}
              username={username}
            />
          ))}
        </div>
      )}
    </div>
  )
}
