import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { EventTypeForm } from "@/components/dashboard/event-type-form"

export const metadata = { title: "New event type" }

export default function NewEventTypePage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
      <div>
        <Link
          href="/events"
          className="inline-flex items-center gap-1 text-sm text-on-surface-variant transition-colors hover:text-on-surface"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to event types
        </Link>
        <h1 className="mt-4 font-heading text-3xl font-semibold">
          New event type
        </h1>
        <p className="mt-1 text-sm text-on-surface-variant">
          Give your meeting a name and decide how long it runs.
        </p>
      </div>

      <EventTypeForm mode="create" />
    </div>
  )
}
