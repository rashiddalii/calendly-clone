"use client"

import { useState } from "react"
import { CalendarDays, CircleHelp, Link2, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { CreateEventMenu } from "@/components/dashboard/create-event-menu"
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"

const GUIDE_STEPS = [
  {
    icon: CalendarDays,
    color: "#006BFF",
    bg: "#EFF6FF",
    title: "Create event types",
    body: "Each event type is a bookable page with its own duration, location, and availability. Create as many as you need: demos, check-ins, consultations.",
  },
  {
    icon: Link2,
    color: "#0D9488",
    bg: "#F0FDFA",
    title: "Share your link",
    body: "Every event type gets a unique booking link. Drop it in email, add it to your LinkedIn bio, or put it on your website. Invitees pick a time that works for them.",
  },
  {
    icon: CheckCircle2,
    color: "#7C3AED",
    bg: "#F5F3FF",
    title: "Meetings confirmed automatically",
    body: "When someone books you both get a confirmation email. Upcoming meetings appear under the Meetings tab. Connect Google Calendar to keep everything in sync.",
  },
]

function SchedulingGuideDialog({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose() }}>
      <DialogContent
        showCloseButton
        className="max-w-[calc(100%-2rem)] overflow-hidden p-0 sm:max-w-2xl"
      >
        {/* Title row */}
        <div className="border-b border-[#E5E7EB] px-6 py-4 pr-12">
          <DialogTitle className="text-base font-semibold text-[#111827]">
            How Scheduling works
          </DialogTitle>
          <p className="mt-0.5 text-sm text-[#6B7280]">
            Everything you need to start accepting meetings in minutes.
          </p>
        </div>

        {/* 3 horizontal steps */}
        <div className="grid grid-cols-1 divide-y divide-[#F3F4F6] px-6 py-2 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {GUIDE_STEPS.map((step, i) => {
            const Icon = step.icon
            return (
              <div key={i} className="flex flex-col gap-3 py-5 sm:px-5 sm:first:pl-0 sm:last:pr-0">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{ backgroundColor: step.bg }}
                >
                  <Icon className="h-5 w-5" style={{ color: step.color }} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#111827]">
                    {step.title}
                  </p>
                  <p className="mt-1 text-[13px] leading-relaxed text-[#6B7280]">
                    {step.body}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-[#E5E7EB] px-6 py-3">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 cursor-pointer items-center justify-center rounded-lg bg-[#006BFF] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#005FDB]"
          >
            Got it
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function SchedulingPageHeader({
  description,
  className,
}: {
  description?: string
  className?: string
}) {
  const [guideOpen, setGuideOpen] = useState(false)

  return (
    <>
      <SchedulingGuideDialog open={guideOpen} onClose={() => setGuideOpen(false)} />
      <header className={cn("mb-8", className)}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-[#111827] sm:text-[28px]">
                Scheduling
              </h1>
              <button
                type="button"
                onClick={() => setGuideOpen(true)}
                className="inline-flex size-7 cursor-pointer items-center justify-center rounded-full border border-[#E5E7EB] bg-white text-[#6B7280] shadow-sm transition-colors hover:border-[#006BFF]/30 hover:bg-[#EFF6FF] hover:text-[#006BFF]"
                aria-label="How scheduling works"
                title="How scheduling works"
              >
                <CircleHelp className="h-4 w-4" />
              </button>
            </div>
            {description ? (
              <p className="mt-1 max-w-2xl text-sm text-[#6B7280]">
                {description}
              </p>
            ) : null}
          </div>
          <div className="flex shrink-0 items-center gap-2 sm:pt-1">
            <CreateEventMenu variant="header" />
          </div>
        </div>
      </header>
    </>
  )
}
