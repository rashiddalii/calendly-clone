import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { EventTypeForm } from "@/components/dashboard/event-type-form"
import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header"

export const metadata = { title: "New event type" }

export default function NewEventTypePage() {
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

      <EventTypeForm mode="create" />
    </div>
  )
}
