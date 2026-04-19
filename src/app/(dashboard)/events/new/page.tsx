import Link from "next/link"
import { redirect } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { auth } from "@/lib/auth"
import { getAllIntegrationHealth } from "@/lib/services/integrations"
import { EventTypeForm } from "@/components/dashboard/event-type-form"
import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header"

export const metadata = { title: "New event type" }

export default async function NewEventTypePage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const healthMap = await getAllIntegrationHealth(session.user.id)

  const connectedLocations = {
    googleMeet:
      healthMap["google-meet"]?.status === "connected" ||
      healthMap["google-calendar"]?.status === "connected",
    zoom: false,
    teams: healthMap["teams"]?.status === "connected",
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
      <div>
        <Link
          href="/events"
          className="inline-flex items-center gap-1 text-sm font-medium text-[#006BFF] hover:underline"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to scheduling
        </Link>
        <DashboardPageHeader
          className="mb-0 mt-6"
          title="New event type"
          description="Give your meeting a name and decide how long it runs."
        />
      </div>

      <EventTypeForm mode="create" connectedLocations={connectedLocations} />
    </div>
  )
}
