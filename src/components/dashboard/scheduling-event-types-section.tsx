"use client"

import { useEffect, useMemo, useState, useSyncExternalStore } from "react"
import Link from "next/link"
import { ExternalLink, MoreVertical, Search, Sparkles, X } from "lucide-react"
import type { EventType } from "@/generated/prisma/client"
import { SchedulingEventRow } from "@/components/dashboard/scheduling-event-row"
import { EventTypeDetailDrawer } from "@/components/dashboard/event-type-detail-drawer"
import { markEventsGuideSeenAction } from "@/lib/actions/onboarding"
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
  isFirstTime = false,
  hasGoogleConnected,
  oauthError,
}: {
  eventTypes: EventType[]
  username: string | null
  userName: string | null
  userEmail: string | null
  userImage: string | null
  scheduleSummaryLine: string
  isFirstTime?: boolean
  hasGoogleConnected: boolean
  oauthError?: string
}) {
  const [query, setQuery] = useState("")
  const [detailEvent, setDetailEvent] = useState<EventType | null>(null)
  const [showBanner, setShowBanner] = useState(isFirstTime)
  const [showOAuthConflictBanner] = useState(
    oauthError === "OAuthAccountNotLinked",
  )
  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  )

  useEffect(() => {
    if (isFirstTime) {
      markEventsGuideSeenAction().catch(() => {})
    }
  }, [isFirstTime])

  useEffect(() => {
    if (!showOAuthConflictBanner) return
    const url = new URL(window.location.href)
    if (url.searchParams.has("error")) {
      url.searchParams.delete("error")
      const next = `${url.pathname}${url.search}${url.hash}`
      window.history.replaceState({}, "", next)
    }
  }, [showOAuthConflictBanner])

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

      {/* First-time welcome banner */}
      {showBanner && (
        <div className="flex items-start gap-3 rounded-xl border border-[#BFDBFE] bg-[#EFF6FF] p-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#006BFF]/10">
            <Sparkles className="h-4 w-4 text-[#006BFF]" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-[#1e3461]">
              Your first event type is ready to share!
            </p>
            <p className="mt-0.5 text-sm text-[#374151]">
              Copy your booking link and share it anywhere: email, LinkedIn, or
              your website, to start accepting meetings.
            </p>
            <div className="mt-3 flex flex-col gap-2 text-xs text-[#6B7280]">
              <span className="flex items-center gap-2">
                <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#006BFF] text-[10px] font-bold text-white">
                  1
                </span>
                Click&nbsp;<strong className="text-[#374151]">Copy link</strong>&nbsp;on the event below
              </span>
              <span className="flex items-center gap-2">
                <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#006BFF] text-[10px] font-bold text-white">
                  2
                </span>
                Share it with anyone to book time with you
              </span>
              <span className="flex items-center gap-2">
                <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#006BFF] text-[10px] font-bold text-white">
                  3
                </span>
                View confirmed bookings under&nbsp;<strong className="text-[#374151]">Meetings</strong>
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowBanner(false)}
            className="inline-flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-md text-[#6B7280] transition-colors hover:bg-[#DBEAFE] hover:text-[#1e3461]"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {showOAuthConflictBanner && (
        <div className="flex flex-col gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-rose-900">
              This Google account is already connected to another Fluid account.
            </p>
            <p className="mt-1 text-sm text-rose-800">
              Use a different Google account, or sign in with the account that already has this Google connection.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Link
              href="/integrations/google-calendar"
              className="inline-flex h-9 items-center justify-center rounded-md bg-rose-900 px-3 text-xs font-semibold text-white transition-colors hover:bg-rose-950"
            >
              Try another Google account
            </Link>
            <Link
              href="/login"
              className="inline-flex h-9 items-center justify-center rounded-md border border-rose-300 bg-white px-3 text-xs font-semibold text-rose-900 transition-colors hover:bg-rose-100"
            >
              Go to login
            </Link>
          </div>
        </div>
      )}

      {!hasGoogleConnected && !showOAuthConflictBanner && (
        <div className="flex items-start justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-amber-900">
              Connect Google to generate auto Google Meet links.
            </p>
            <p className="mt-1 text-sm text-amber-800">
              Bookings will still work, but Google Meet links will not be auto-generated until you connect Google.
            </p>
          </div>
          <Link
            href="/integrations/google-calendar"
            className="inline-flex h-9 shrink-0 items-center justify-center rounded-md bg-amber-900 px-3 text-xs font-semibold text-white transition-colors hover:bg-amber-950"
          >
            Connect Google
          </Link>
        </div>
      )}

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
              href="/account/profile"
              className="text-sm font-medium text-[#006BFF] hover:underline"
            >
              Set username for landing page
            </Link>
          )}
          {isMounted ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex size-8 cursor-pointer items-center justify-center rounded-md text-[#6B7280] outline-none hover:bg-[#F3F4F6] focus-visible:ring-2 focus-visible:ring-[#006BFF]/30">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Host options</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem disabled className="opacity-60">
                  Sort (soon)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <button
              type="button"
              disabled
              className="inline-flex size-8 items-center justify-center rounded-md text-[#6B7280] opacity-60"
              aria-label="Host options loading"
            >
              <MoreVertical className="h-4 w-4" />
            </button>
          )}
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
              className="mt-5 inline-flex h-10 cursor-pointer items-center justify-center rounded-lg bg-[#006BFF] px-5 text-sm font-semibold text-white hover:bg-[#005FDB]"
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
