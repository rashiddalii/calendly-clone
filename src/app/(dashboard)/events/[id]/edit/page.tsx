import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { auth } from "@/lib/auth"
import { getEventTypeById } from "@/lib/services/event-type"
import { EventTypeForm } from "@/components/dashboard/event-type-form"

export const metadata = { title: "Edit event type" }

export default async function EditEventTypePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const session = await auth()
  if (!session?.user?.id) return null

  const eventType = await getEventTypeById(session.user.id, id)
  if (!eventType) notFound()

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
          Edit event type
        </h1>
        <p className="mt-1 text-sm text-on-surface-variant">
          Tweak the details, scheduling rules, or pause if you need a break.
        </p>
      </div>

      <EventTypeForm
        mode="edit"
        initial={{
          id: eventType.id,
          title: eventType.title,
          slug: eventType.slug,
          description: eventType.description,
          duration: eventType.duration,
          color: eventType.color,
          bufferBefore: eventType.bufferBefore,
          bufferAfter: eventType.bufferAfter,
          minNotice: eventType.minNotice,
          maxDaysInFuture: eventType.maxDaysInFuture,
          isActive: eventType.isActive,
        }}
      />
    </div>
  )
}
