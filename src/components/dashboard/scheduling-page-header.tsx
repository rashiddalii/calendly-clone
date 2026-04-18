"use client"

import { CircleHelp } from "lucide-react"
import { cn } from "@/lib/utils"
import { CreateEventMenu } from "@/components/dashboard/create-event-menu"

export function SchedulingPageHeader({
  description,
  className,
}: {
  description?: string
  className?: string
}) {
  return (
    <header className={cn("mb-8", className)}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-[#111827] sm:text-[28px]">
              Scheduling
            </h1>
            <button
              type="button"
              className="inline-flex size-7 items-center justify-center rounded-full border border-[#E5E7EB] bg-white text-[#6B7280] shadow-sm transition-colors hover:bg-[#F9FAFB]"
              aria-label="Help"
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
  )
}
