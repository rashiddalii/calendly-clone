"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronsLeft, ChevronsRight } from "lucide-react"
import { SidebarNav } from "@/components/dashboard/sidebar-nav"
import { CreateEventMenu } from "@/components/dashboard/create-event-menu"
import { cn } from "@/lib/utils"

const STORAGE_KEY = "fluid-sidebar-collapsed"

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    try {
      if (localStorage.getItem(STORAGE_KEY) === "1") {
        setCollapsed(true)
      }
    } catch {
      /* private mode / SSR */
    }
  }, [])

  const toggle = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev
      try {
        localStorage.setItem(STORAGE_KEY, next ? "1" : "0")
      } catch {
        /* ignore */
      }
      return next
    })
  }, [])

  const isCollapsed = mounted && collapsed

  return (
    <aside
      className={cn(
        "sticky top-0 hidden h-screen shrink-0 flex-col border-r border-[#E5E7EB] bg-white transition-[width] duration-200 ease-out md:flex",
        isCollapsed ? "w-[72px]" : "w-[260px]",
      )}
    >
      <div
        className={cn(
          "flex pb-3 pt-4",
          isCollapsed
            ? "flex-col items-center gap-2 px-2"
            : "items-center justify-between gap-2 px-4",
        )}
      >
        <Link
          href="/events"
          className={cn(
            "flex items-center rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-[#006BFF]/30",
            isCollapsed
              ? "justify-center p-1.5"
              : "min-w-0 flex-1 gap-2.5",
          )}
          title="Fluid — Scheduling"
        >
          <div
            className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg"
            style={{ backgroundColor: "#1e3461" }}
          >
            <Image
              src="/logo-fluid-icon.svg"
              alt=""
              width={24}
              height={24}
              className="h-6 w-6 object-contain"
            />
          </div>
          {!isCollapsed && (
            <span
              className="truncate font-semibold text-[#111827]"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Fluid
            </span>
          )}
        </Link>
        <button
          type="button"
          onClick={toggle}
          className="flex size-8 shrink-0 items-center justify-center rounded-md text-[#9CA3AF] transition-colors hover:bg-[#F3F4F6] hover:text-[#374151]"
          aria-expanded={!isCollapsed}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronsRight className="h-4 w-4" />
          ) : (
            <ChevronsLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      <div className={cn("pb-3", isCollapsed ? "px-2" : "px-4")}>
        <CreateEventMenu
          variant={isCollapsed ? "sidebar-collapsed" : "sidebar"}
        />
      </div>

      <div
        className={cn(
          "flex-1 overflow-y-auto overflow-x-hidden pb-6",
          isCollapsed ? "px-1.5" : "px-3",
        )}
      >
        <SidebarNav collapsed={isCollapsed} />
      </div>
    </aside>
  )
}
