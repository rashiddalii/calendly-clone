import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { auth } from "@/lib/auth"
import { getIntegrationHealth } from "@/lib/services/integrations"
import {
  disconnectGoogleCalendarAction,
  disconnectZoomAction,
  disconnectTeamsAction,
} from "@/lib/actions/user"
import {
  GoogleCalendarIcon,
  GoogleMeetIcon,
  ZoomIcon,
  TeamsIcon,
} from "@/components/icons/brand"
import { IntegrationDetail } from "@/components/integrations/integration-detail"

const PROVIDER_META: Record<
  string,
  {
    name: string
    tagline: string
    bullets: string[]
    reconnectHref?: string
    reconnectIsOAuth?: boolean
    inProgress?: boolean
    isBundled?: boolean
    bundledNote?: string
    icon: React.ReactNode
    metaTitle: string
  }
> = {
  "google-calendar": {
    name: "Google Calendar",
    tagline: "Sync your calendar to block busy times and auto-create meeting events.",
    bullets: [
      "Reads your Google Calendar to detect busy times and prevent double-booking.",
      "Automatically creates a calendar event when someone books a meeting with you.",
      "Sends calendar invites to both you and your attendee.",
      "Deletes the calendar event if a booking is cancelled.",
    ],
    reconnectIsOAuth: true,
    icon: <GoogleCalendarIcon className="h-14 w-14 shrink-0" />,
    metaTitle: "Google Calendar",
  },
  "google-meet": {
    name: "Google Meet",
    tagline: "Auto-generate Google Meet links for your video meetings.",
    bullets: [
      "Automatically provisions a unique Google Meet link for each booking.",
      "The meeting link is included in the booking confirmation email.",
      "Powered by Google Calendar — no separate setup required.",
    ],
    isBundled: true,
    bundledNote:
      "Google Meet is provisioned through your Google Calendar connection. Connect Google Calendar to enable Meet links.",
    icon: <GoogleMeetIcon className="h-14 w-14 shrink-0" />,
    metaTitle: "Google Meet",
  },
  zoom: {
    name: "Zoom",
    tagline: "Auto-create Zoom meetings when someone books a Zoom event with you.",
    bullets: [
      "Automatically creates a Zoom meeting for each booking that uses Zoom as the location.",
      "Meeting link and password are included in the confirmation email.",
      "Cancelling a booking deletes the associated Zoom meeting.",
    ],
    inProgress: true,
    icon: <ZoomIcon className="h-14 w-14 shrink-0" />,
    metaTitle: "Zoom",
  },
  teams: {
    name: "Microsoft Teams",
    tagline: "Auto-create Teams meetings when someone books a Teams event with you.",
    bullets: [
      "Automatically creates a Microsoft Teams meeting for each booking using Teams as the location.",
      "The Teams join link is included in the confirmation email.",
      "Cancelling a booking removes the associated calendar event.",
      "Requires a work or school Microsoft account (not a personal Outlook or Hotmail account).",
    ],
    reconnectHref: "/api/teams/connect",
    inProgress: true,
    icon: <TeamsIcon className="h-14 w-14 shrink-0" />,
    metaTitle: "Microsoft Teams",
  },
}

const DISCONNECT_ACTIONS: Partial<Record<string, () => Promise<{ status: "success" | "error" }>>> = {
  "google-calendar": disconnectGoogleCalendarAction,
  zoom: disconnectZoomAction,
  teams: disconnectTeamsAction,
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ provider: string }>
}) {
  const { provider } = await params
  const meta = PROVIDER_META[provider]
  if (!meta) return {}
  return { title: `${meta.metaTitle} | Integrations` }
}

export default async function IntegrationProviderPage({
  params,
}: {
  params: Promise<{ provider: string }>
}) {
  const { provider } = await params

  if (!PROVIDER_META[provider]) notFound()

  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const health = await getIntegrationHealth(session.user.id, provider)
  if (!health) notFound()

  const meta = PROVIDER_META[provider]

  return (
    <div className="mx-auto max-w-2xl">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-1.5 text-sm text-[#6B7280]">
        <Link href="/integrations" className="cursor-pointer hover:text-[#111827]">
          Integrations &amp; apps
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="font-medium text-[#111827]">{meta.name}</span>
      </nav>

      <IntegrationDetail
        health={health}
        icon={meta.icon}
        name={meta.name}
        tagline={meta.tagline}
        bullets={meta.bullets}
        disconnectAction={DISCONNECT_ACTIONS[provider] ?? undefined}
        reconnectHref={meta.reconnectHref}
        reconnectIsOAuth={meta.reconnectIsOAuth}
        inProgress={meta.inProgress}
        isBundled={meta.isBundled}
        bundledNote={meta.bundledNote}
      />
    </div>
  )
}
