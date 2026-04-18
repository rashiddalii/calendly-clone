"use client"

import Link from "next/link"
import { ChevronDown, Plus } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

const PRIMARY = "#006BFF"

export function CreateEventMenu({
  variant = "header",
}: {
  variant?: "header" | "sidebar" | "sidebar-collapsed"
}) {
  const isCollapsedSidebar = variant === "sidebar-collapsed"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "inline-flex items-center justify-center gap-1.5 rounded-lg text-sm font-semibold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-offset-2",
          variant === "sidebar"
            ? "w-full border border-[#E5E7EB] bg-white py-2.5 text-[#111827] hover:bg-[#F9FAFB]"
            : isCollapsedSidebar
              ? "size-10 shrink-0 rounded-lg border border-[#E5E7EB] bg-white text-[#111827] hover:bg-[#F9FAFB] focus-visible:ring-[#006BFF]/30"
              : "bg-[#006BFF] px-3.5 py-2 text-white hover:bg-[#005FDB] focus-visible:ring-[#006BFF]/40",
        )}
        style={variant === "header" ? { backgroundColor: PRIMARY } : undefined}
        title={isCollapsedSidebar ? "Create" : undefined}
        aria-label={isCollapsedSidebar ? "Create" : undefined}
      >
        <Plus className="h-4 w-4 shrink-0" />
        {!isCollapsedSidebar && (
          <>
            Create
            <ChevronDown className="h-4 w-4 shrink-0 opacity-80" />
          </>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={isCollapsedSidebar ? "start" : "end"}
        side={isCollapsedSidebar ? "right" : "bottom"}
        sideOffset={isCollapsedSidebar ? 8 : 4}
        className="w-80 p-2"
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel className="px-2 py-1.5 text-xs font-medium text-[#6B7280]">
            Event type
          </DropdownMenuLabel>
          <DropdownMenuItem>
            <Link
              href="/events/new"
              className="flex w-full flex-col gap-0.5 py-0.5 no-underline outline-none"
            >
              <span className="font-medium text-[#111827]">One-on-one</span>
              <span className="text-xs font-normal text-[#6B7280]">
                1 host → 1 invitee
              </span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem disabled className="flex flex-col gap-0.5 py-2 opacity-60">
            <span className="font-medium">Group</span>
            <span className="text-xs font-normal text-[#6B7280]">
              1 host → multiple invitees
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem disabled className="flex flex-col gap-0.5 py-2 opacity-60">
            <span className="font-medium">Round robin</span>
            <span className="text-xs font-normal text-[#6B7280]">
              Rotating hosts → 1 invitee
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem disabled className="flex flex-col gap-0.5 py-2 opacity-60">
            <span className="font-medium">Collective</span>
            <span className="text-xs font-normal text-[#6B7280]">
              Multiple hosts → 1 invitee
            </span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel className="px-2 py-1.5 text-xs font-medium text-[#6B7280]">
            More ways to meet
          </DropdownMenuLabel>
          <DropdownMenuItem disabled className="opacity-60">
            One-off meeting
          </DropdownMenuItem>
          <DropdownMenuItem disabled className="opacity-60">
            Meeting poll
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
