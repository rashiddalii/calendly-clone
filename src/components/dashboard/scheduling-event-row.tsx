"use client"

import Link from "next/link"
import { useState, useTransition } from "react"
import {
  Check,
  Copy,
  ExternalLink,
  MoreVertical,
  Pencil,
  SlidersHorizontal,
  Share2,
  Trash2,
} from "lucide-react"
import { toast } from "sonner"
import type { EventType } from "@/generated/prisma/client"
import {
  deleteEventTypeAction,
  toggleEventTypeActiveAction,
} from "@/lib/actions/event-type"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

export function SchedulingEventRow({
  eventType,
  username,
  scheduleSummaryLine,
  onQuickView,
}: {
  eventType: EventType
  username: string | null
  scheduleSummaryLine: string
  onQuickView?: () => void
}) {
  const [isPending, startTransition] = useTransition()
  const [copied, setCopied] = useState(false)

  const bookingUrl =
    typeof window !== "undefined" && username
      ? `${window.location.origin}/${username}/${eventType.slug}`
      : username
        ? `/${username}/${eventType.slug}`
        : ""

  const handleCopy = async () => {
    if (!username) {
      toast.error("Set a username in Settings before sharing.")
      return
    }
    await navigator.clipboard.writeText(bookingUrl)
    setCopied(true)
    toast.success("Booking link copied")
    setTimeout(() => setCopied(false), 1600)
  }

  const openBookingPage = () => {
    if (!username) {
      toast.error("Set a username in Settings first.")
      return
    }
    window.open(bookingUrl, "_blank", "noopener,noreferrer")
  }

  const handleShare = async () => {
    if (!username) {
      toast.error("Set a username in Settings before sharing.")
      return
    }
    try {
      if (navigator.share) {
        await navigator.share({
          title: eventType.title,
          url: bookingUrl,
        })
      } else {
        await navigator.clipboard.writeText(bookingUrl)
        toast.success("Link copied")
      }
    } catch {
      /* user cancelled share */
    }
  }

  const handleToggle = () => {
    startTransition(async () => {
      await toggleEventTypeActiveAction(eventType.id)
    })
  }

  const handleDelete = () => {
    if (!confirm(`Delete "${eventType.title}"? This can't be undone.`)) return
    startTransition(async () => {
      await deleteEventTypeAction(eventType.id)
      toast.success("Event type deleted")
    })
  }

  const metaLine = `${eventType.duration} min · Video call · One-on-one`

  return (
    <article className="flex flex-col gap-3 overflow-hidden rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-sm sm:flex-row sm:items-stretch sm:gap-0 sm:p-0 sm:pr-4">
      <div
        className="hidden w-1 shrink-0 self-stretch rounded-l-xl sm:block"
        style={{ backgroundColor: eventType.color }}
        aria-hidden
      />
      <div className="flex min-w-0 flex-1 items-start gap-3 sm:items-center sm:gap-3 sm:py-4 sm:pl-4">
        <input
          type="checkbox"
          className="mt-1 size-4 shrink-0 rounded border-[#D1D5DB] text-[#006BFF] focus:ring-[#006BFF] sm:mt-0"
          disabled
          aria-label="Select row"
          title="Bulk actions coming soon"
        />
        <div className="min-w-0 flex-1">
          <h3 className="text-[15px] font-semibold leading-tight text-[#111827]">
            {eventType.title}
          </h3>
          <p className="mt-1 text-xs text-[#6B7280]">{metaLine}</p>
          <p className="mt-0.5 text-xs text-[#6B7280]">{scheduleSummaryLine}</p>
        </div>
      </div>

      <div className="flex shrink-0 flex-wrap items-center justify-end gap-2 sm:gap-1.5 sm:py-4">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-9 gap-1.5 rounded-full border-[#E5E7EB] bg-white px-3.5 text-xs font-semibold text-[#374151] hover:bg-[#F9FAFB]"
          onClick={handleCopy}
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              Copy link
            </>
          )}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="text-[#6B7280] hover:bg-[#F3F4F6]"
          aria-label="Share"
          onClick={handleShare}
        >
          <Share2 className="h-4 w-4" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex size-8 items-center justify-center rounded-md text-[#6B7280] outline-none hover:bg-[#F3F4F6] focus-visible:ring-2 focus-visible:ring-[#006BFF]/30">
            <MoreVertical className="h-4 w-4" />
            <span className="sr-only">More options</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuItem onClick={openBookingPage}>
              <ExternalLink className="h-4 w-4 text-[#6B7280]" />
              View booking page
            </DropdownMenuItem>
            {onQuickView ? (
              <DropdownMenuItem onClick={onQuickView}>
                <SlidersHorizontal className="h-4 w-4 text-[#6B7280]" />
                Quick view
              </DropdownMenuItem>
            ) : null}
            <DropdownMenuItem>
              <Link
                href={`/events/${eventType.id}/edit`}
                className="flex w-full items-center gap-1.5 text-[#111827] no-underline outline-none"
              >
                <Pencil className="h-4 w-4 text-[#6B7280]" />
                Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled className="opacity-50">
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              onClick={handleDelete}
              disabled={isPending}
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleToggle}
              disabled={isPending}
              className="justify-between"
            >
              <span>{eventType.isActive ? "Pause" : "Activate"}</span>
              <span
                className={
                  eventType.isActive ? "text-xs text-[#006BFF]" : "text-xs text-[#9CA3AF]"
                }
              >
                {eventType.isActive ? "On" : "Off"}
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </article>
  )
}
