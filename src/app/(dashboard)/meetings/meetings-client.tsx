"use client"

import { useState } from "react"
import { Calendar, Clock, XCircle } from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { MeetingCard } from "@/components/dashboard/meeting-card"

export interface SerializedBooking {
  id: string
  status: "CONFIRMED" | "CANCELLED" | "COMPLETED"
  bookerName: string
  bookerEmail: string
  bookerNotes: string | null
  startTime: string
  endTime: string
  eventType: {
    title: string
    color: string
    duration: number
  }
  host: {
    timezone: string
  }
}

interface MeetingsClientProps {
  upcoming: SerializedBooking[]
  past: SerializedBooking[]
  cancelled: SerializedBooking[]
}

function EmptyState({
  icon: Icon,
  message,
}: {
  icon: React.ComponentType<{ className?: string }>
  message: string
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl brand-tint px-6 py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#ffffff]">
        <Icon className="h-5 w-5 text-[#4a4bd7]" />
      </div>
      <p className="text-sm text-[#5f5e68]">{message}</p>
    </div>
  )
}

export function MeetingsClient({
  upcoming: initialUpcoming,
  past,
  cancelled,
}: MeetingsClientProps) {
  const [upcoming, setUpcoming] = useState(initialUpcoming)

  const handleCancel = (id: string) => {
    setUpcoming((prev) => prev.filter((b) => b.id !== id))
  }

  return (
    <Tabs defaultValue="upcoming">
      <TabsList className="mb-6">
        <TabsTrigger value="upcoming">
          Upcoming {upcoming.length > 0 && `(${upcoming.length})`}
        </TabsTrigger>
        <TabsTrigger value="past">
          Past {past.length > 0 && `(${past.length})`}
        </TabsTrigger>
        <TabsTrigger value="cancelled">
          Cancelled {cancelled.length > 0 && `(${cancelled.length})`}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="upcoming">
        {upcoming.length === 0 ? (
          <EmptyState icon={Calendar} message="No upcoming meetings." />
        ) : (
          <div className="flex flex-col gap-3">
            {upcoming.map((booking) => (
              <MeetingCard
                key={booking.id}
                id={booking.id}
                eventTitle={booking.eventType.title}
                eventColor={booking.eventType.color}
                bookerName={booking.bookerName}
                bookerEmail={booking.bookerEmail}
                bookerNotes={booking.bookerNotes}
                startTime={booking.startTime}
                endTime={booking.endTime}
                hostTimezone={booking.host.timezone}
                status={booking.status}
                onCancel={handleCancel}
              />
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="past">
        {past.length === 0 ? (
          <EmptyState icon={Clock} message="No past meetings yet." />
        ) : (
          <div className="flex flex-col gap-3">
            {past.map((booking) => (
              <MeetingCard
                key={booking.id}
                id={booking.id}
                eventTitle={booking.eventType.title}
                eventColor={booking.eventType.color}
                bookerName={booking.bookerName}
                bookerEmail={booking.bookerEmail}
                bookerNotes={booking.bookerNotes}
                startTime={booking.startTime}
                endTime={booking.endTime}
                hostTimezone={booking.host.timezone}
                status={booking.status}
              />
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="cancelled">
        {cancelled.length === 0 ? (
          <EmptyState icon={XCircle} message="No cancelled meetings." />
        ) : (
          <div className="flex flex-col gap-3">
            {cancelled.map((booking) => (
              <MeetingCard
                key={booking.id}
                id={booking.id}
                eventTitle={booking.eventType.title}
                eventColor={booking.eventType.color}
                bookerName={booking.bookerName}
                bookerEmail={booking.bookerEmail}
                bookerNotes={booking.bookerNotes}
                startTime={booking.startTime}
                endTime={booking.endTime}
                hostTimezone={booking.host.timezone}
                status={booking.status}
              />
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  )
}
