"use client"

import { useState } from "react"
import { Filter, Rocket, Search, X } from "lucide-react"
import {
  SingleUseLinksIllustration,
  MeetingPollsIllustration,
} from "@/components/dashboard/scheduling-empty-illustrations"
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"

function ComingSoonModal({
  open,
  onClose,
  feature,
}: {
  open: boolean
  onClose: () => void
  feature: string
}) {
  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose() }}>
      <DialogContent showCloseButton className="max-w-sm p-0 overflow-hidden">
        <div className="flex flex-col items-center px-6 pb-6 pt-8 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#EFF6FF]">
            <Rocket className="h-6 w-6 text-[#006BFF]" />
          </div>
          <DialogTitle className="text-base font-semibold text-[#111827]">
            {feature} is coming soon
          </DialogTitle>
          <p className="mt-2 text-sm leading-relaxed text-[#6B7280]">
            This feature is currently in progress. We&apos;re working hard to
            bring it to you. Check back soon!
          </p>
          <button
            type="button"
            onClick={onClose}
            className="mt-5 inline-flex h-9 w-full cursor-pointer items-center justify-center rounded-lg bg-[#006BFF] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#005FDB]"
          >
            Got it
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function SingleUsePlaceholder() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      <ComingSoonModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        feature="Single-use links"
      />
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-[200px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
            <input
              readOnly
              placeholder="Search single use links"
              className="h-11 w-full cursor-default rounded-xl border border-[#E5E7EB] bg-white pl-10 pr-3 text-sm text-[#111827] outline-none"
            />
          </div>
          <button
            type="button"
            className="inline-flex h-11 shrink-0 items-center gap-2 rounded-xl border border-[#E5E7EB] bg-white px-4 text-sm font-medium text-[#374151]"
          >
            <Filter className="h-4 w-4" />
            Filter
          </button>
        </div>
        <div className="flex flex-col gap-6 rounded-xl border border-[#E5E7EB] bg-white p-8 shadow-sm md:flex-row md:items-center md:justify-between md:p-10">
          <div className="max-w-lg">
            <h2 className="text-lg font-semibold text-[#111827]">
              Control how often you get booked
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[#6B7280]">
              Single-use links can only be booked once. Create a single-use link
              from an event type and it will appear here.
            </p>
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="mt-3 cursor-pointer text-sm font-semibold text-[#006BFF] hover:underline"
            >
              Learn more →
            </button>
            <div className="mt-5">
              <button
                type="button"
                disabled
                className="inline-flex h-10 cursor-not-allowed items-center gap-2 rounded-lg bg-[#006BFF]/50 px-4 text-sm font-semibold text-white"
              >
                + Create single-use link
              </button>
            </div>
          </div>
          <SingleUseLinksIllustration />
        </div>
      </div>
    </>
  )
}

export function MeetingPollsPlaceholder() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      <ComingSoonModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        feature="Meeting polls"
      />
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-[200px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
            <input
              readOnly
              placeholder="Search meeting polls"
              className="h-11 w-full cursor-default rounded-xl border border-[#E5E7EB] bg-white pl-10 pr-3 text-sm text-[#111827] outline-none"
            />
          </div>
          <button
            type="button"
            className="inline-flex h-11 shrink-0 items-center gap-2 rounded-xl border border-[#E5E7EB] bg-white px-4 text-sm font-medium text-[#374151]"
          >
            <Filter className="h-4 w-4" />
            Filter
          </button>
        </div>
        <div className="flex flex-col gap-6 rounded-xl border border-[#E5E7EB] bg-white p-8 shadow-sm md:flex-row md:items-center md:justify-between md:p-10">
          <div className="max-w-lg">
            <h2 className="text-lg font-semibold text-[#1e3461]">
              Find the best time for everyone
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[#6B7280]">
              Gather everyone&apos;s availability to pick the best time for the
              group. Track votes as they come in, and book the most popular time.
            </p>
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="mt-3 cursor-pointer text-sm font-semibold text-[#006BFF] hover:underline"
            >
              Learn more →
            </button>
            <div className="mt-5">
              <button
                type="button"
                disabled
                className="inline-flex h-10 cursor-not-allowed items-center gap-2 rounded-lg bg-[#006BFF]/50 px-4 text-sm font-semibold text-white"
              >
                + Create meeting poll
              </button>
            </div>
          </div>
          <MeetingPollsIllustration />
        </div>
      </div>
    </>
  )
}
