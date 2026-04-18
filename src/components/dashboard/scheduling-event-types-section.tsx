"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { ExternalLink, MoreVertical, Search } from "lucide-react"
import type { EventType } from "@/generated/prisma/client"
import { SchedulingEventRow } from "@/components/dashboard/scheduling-event-row"
import { EventTypeDetailDrawer } from "@/components/dashboard/event-type-detail-drawer"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

function getInitials(name?: string | null, email?: string | null): string {
  if (name) {
    const parts = name.trim().split(" ")
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    }
    return name.slice(0, 2).toUpperCase()
  }
  if (email) return email.slice(0, 2).toUpperCase()
  return "??"
}

export function SchedulingEventTypesSection({
  eventTypes,
  username,
  userName,
  userEmail,
  userImage,
  scheduleSummaryLine,
}: {
  eventTypes: EventType[]
  username: string | null
  userName: string | null
  userEmail: string | null
  userImage: string | null
  scheduleSummaryLine: string
}) {
  const [query, setQuery] = useState("")
  const [detailEvent, setDetailEvent] = useState<EventType | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return eventTypes
    return eventTypes.filter(
      (e) =>
        e.title.toLowerCase().includes(q) || e.slug.toLowerCase().includes(q),
    )
  }, [eventTypes, query])

  const landingHref = username ? `/${username}` : null

  return (
    <div className="space-y-5">
      <EventTypeDetailDrawer
        open={detailEvent !== null}
        onOpenChange={(next) => {
          if (!next) setDetailEvent(null)
        }}
        eventType={detailEvent}
        username={username}
        scheduleSummaryLine={scheduleSummaryLine}
      />
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search event types"
          className="h-11 w-full rounded-xl border border-[#E5E7EB] bg-white pl-10 pr-3 text-sm text-[#111827] outline-none ring-[#006BFF]/20 placeholder:text-[#9CA3AF] focus:border-[#006BFF] focus:ring-2"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Avatar className="h-8 w-8 border border-[#E5E7EB]">
            {userImage && (
              <AvatarImage src={userImage} alt={userName ?? "Host"} />
            )}
            <AvatarFallback className="bg-[#F3F4F6] text-xs font-semibold text-[#374151]">
              {getInitials(userName, userEmail)}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-semibold text-[#111827]">
            {userName ?? "Host"}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {landingHref ? (
            <Link
              href={landingHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[#006BFF] hover:underline"
            >
              View landing page
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          ) : (
            <Link
              href="/settings"
              className="text-sm font-medium text-[#006BFF] hover:underline"
            >
              Set username for landing page
            </Link>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex size-8 items-center justify-center rounded-md text-[#6B7280] outline-none hover:bg-[#F3F4F6] focus-visible:ring-2 focus-visible:ring-[#006BFF]/30">
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Host options</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem disabled className="opacity-60">
                Sort (soon)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#E5E7EB] bg-white px-6 py-14 text-center">
          <p className="text-sm font-medium text-[#111827]">
            {eventTypes.length === 0
              ? "No event types yet"
              : "No matches for your search"}
          </p>
          <p className="mt-1 text-sm text-[#6B7280]">
            {eventTypes.length === 0
              ? "Create an event type to share your booking link."
              : "Try a different search."}
          </p>
          {eventTypes.length === 0 && (
            <Link
              href="/events/new"
              className="mt-5 inline-flex h-10 items-center justify-center rounded-lg bg-[#006BFF] px-5 text-sm font-semibold text-white hover:bg-[#005FDB]"
            >
              Create event type
            </Link>
          )}
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {filtered.map((et) => (
            <li key={et.id}>
              <SchedulingEventRow
                eventType={et}
                username={username}
                scheduleSummaryLine={scheduleSummaryLine}
                onQuickView={() => setDetailEvent(et)}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
