import { notFound } from "next/navigation"
import { getPublicEventType } from "@/lib/services/event-type"
import { BookingFlow } from "@/components/booking/booking-flow"
import type { PublicEventTypeView } from "@/types"
import type { Metadata } from "next"

interface PageProps {
  params: Promise<{ username: string; eventSlug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username, eventSlug } = await params
  const et = await getPublicEventType(username, eventSlug)
  if (!et) return {}
  return {
    title: `Book: ${et.title} with ${et.user.name ?? username}`,
    description:
      et.description ??
      `Schedule a ${et.duration}-minute meeting with ${et.user.name ?? username}`,
  }
}

export default async function EventBookingPage({ params }: PageProps) {
  const { username, eventSlug } = await params
  const raw = await getPublicEventType(username, eventSlug)

  if (!raw) notFound()

  const eventType: PublicEventTypeView = {
    id: raw.id,
    title: raw.title,
    slug: raw.slug,
    description: raw.description,
    duration: raw.duration,
    color: raw.color,
    host: {
      name: raw.user.name,
      username: raw.user.username,
      bio: raw.user.bio,
      image: raw.user.image,
      timezone: raw.user.timezone,
    },
  }

  // raw.user.id is available from getPublicEventType (includes user.id)
  const hostId = raw.user.id

  return <BookingFlow eventType={eventType} hostId={hostId} />
}
