"use client"

import Link from "next/link"
import { ChevronDown, Eye } from "lucide-react"
import type { EventType } from "@/generated/prisma/client"
import { Dialog, DrawerContent, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

function formatNoticeMinutes(mins: number): string {
  if (mins >= 1440) {
    const d = mins / 1440
    const n = Number.isInteger(d) ? d : Math.round(d * 10) / 10
    return `${n} day${n !== 1 ? "s" : ""}`
  }
  if (mins >= 60) {
    const h = mins / 60
    const n = Number.isInteger(h) ? h : Math.round(h * 10) / 10
    return `${n} hour${n !== 1 ? "s" : ""}`
  }
  return `${mins} minutes`
}

function AccordionRow({
  title,
  defaultOpen = false,
  children,
}: {
  title: string
  defaultOpen?: boolean
  children: React.ReactNode
}) {
  return (
    <details
      open={defaultOpen}
      className="group border-b border-[#E5E7EB] last:border-b-0 [&_summary::-webkit-details-marker]:hidden"
    >
      <summary
        className={cn(
          "flex cursor-pointer list-none items-center justify-between gap-2 py-3.5 text-sm font-semibold text-[#111827]",
          "outline-none focus-visible:ring-2 focus-visible:ring-[#006BFF]/25",
        )}
      >
        {title}
        <ChevronDown className="h-4 w-4 shrink-0 text-[#6B7280] transition-transform group-open:rotate-180" />
      </summary>
      <div className="pb-4 text-sm leading-relaxed text-[#6B7280]">
        {children}
      </div>
    </details>
  )
}

export function EventTypeDetailDrawer({
  open,
  onOpenChange,
  eventType,
  username,
  scheduleSummaryLine,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  eventType: EventType | null
  username: string | null
  scheduleSummaryLine: string
}) {
  const openPreview = () => {
    if (!username || !eventType) return
    const path = `/${username}/${eventType.slug}`
    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}${path}`
        : path
    window.open(url, "_blank", "noopener,noreferrer")
  }

  return (
    <Dialog
      open={open && !!eventType}
      onOpenChange={(next) => {
        if (!next) onOpenChange(false)
      }}
    >
      {eventType ? (
      <DrawerContent className="max-w-[min(100vw-1rem,26rem)]">
        <div className="border-b border-[#E5E7EB] px-5 pb-4 pt-14">
          <p className="text-xs font-medium uppercase tracking-wide text-[#9CA3AF]">
            Event type
          </p>
          <div className="mt-3 flex items-start gap-3">
            <span
              className="mt-0.5 size-10 shrink-0 rounded-full"
              style={{ backgroundColor: eventType.color }}
              aria-hidden
            />
            <div className="min-w-0">
              <DialogTitle className="font-heading text-lg font-semibold text-[#111827]">
                {eventType.title}
              </DialogTitle>
              <p className="mt-0.5 text-sm text-[#6B7280]">One-on-one</p>
            </div>
          </div>
        </div>

        <div className="flex-1 px-5">
          <AccordionRow title="Duration">
            <p>{eventType.duration} minutes</p>
          </AccordionRow>
          <AccordionRow title="Location">
            <p>Video call (invitees receive your standard meeting link)</p>
          </AccordionRow>
          <AccordionRow title="Availability" defaultOpen>
            <p>
              Invitees can schedule{" "}
              <span className="font-medium text-[#006BFF]">
                {eventType.maxDaysInFuture} days
              </span>{" "}
              into the future with at least{" "}
              <span className="font-medium text-[#006BFF]">
                {formatNoticeMinutes(eventType.minNotice)}
              </span>{" "}
              notice.
            </p>
            <p className="mt-3 rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] px-3 py-2.5">
              <span className="font-medium text-[#374151]">Weekly hours: </span>
              {scheduleSummaryLine}
            </p>
            <Link
              href="/availability"
              className="mt-3 inline-flex text-sm font-semibold text-[#006BFF] hover:underline"
              onClick={() => onOpenChange(false)}
            >
              Edit availability →
            </Link>
          </AccordionRow>
        </div>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-[#E5E7EB] bg-[#F9FAFB] px-5 py-4">
          <button
            type="button"
            onClick={openPreview}
            disabled={!username}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#006BFF] hover:underline disabled:cursor-not-allowed disabled:opacity-40 disabled:no-underline"
          >
            <Eye className="h-4 w-4" />
            Preview
          </button>
          <div className="flex items-center gap-2">
            <Link
              href={`/events/${eventType.id}/edit`}
              className="text-sm font-medium text-[#6B7280] hover:text-[#111827]"
              onClick={() => onOpenChange(false)}
            >
              Full editor
            </Link>
            <Link
              href={`/events/${eventType.id}/edit`}
              onClick={() => onOpenChange(false)}
              className="inline-flex h-9 items-center rounded-lg bg-[#006BFF] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#005FDB]"
            >
              Edit event type
            </Link>
          </div>
        </div>
      </DrawerContent>
      ) : null}
    </Dialog>
  )
}
