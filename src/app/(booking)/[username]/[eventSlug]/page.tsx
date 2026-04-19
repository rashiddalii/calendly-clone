import { notFound } from "next/navigation"
import { auth } from "@/lib/auth"
import { systemFromAddress } from "@/lib/brand"
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
  const [raw, session] = await Promise.all([
    getPublicEventType(username, eventSlug),
    auth(),
  ])

  if (!raw) notFound()

  const eventType: PublicEventTypeView = {
    id: raw.id,
    title: raw.title,
    slug: raw.slug,
    description: raw.description,
    duration: raw.duration,
    color: raw.color,
    location: raw.location,
    locationAddress: raw.locationAddress,
    host: {
      name: raw.user.name,
      username: raw.user.username,
      bio: raw.user.bio,
      image: raw.user.image,
      timezone: raw.user.timezone,
      dateFormat: raw.user.dateFormat,
      timeFormat: raw.user.timeFormat,
      logoUrl: raw.user.logoUrl,
      useAppBranding: raw.user.useAppBranding,
    },
  }

  // raw.user.id is available from getPublicEventType (includes user.id)
  const hostId = raw.user.id

  return (
    <BookingFlow
      eventType={eventType}
      hostId={hostId}
      isAuthenticated={Boolean(session?.user?.id)}
      invitationSearchFrom={systemFromAddress()}
    />
  )
}
