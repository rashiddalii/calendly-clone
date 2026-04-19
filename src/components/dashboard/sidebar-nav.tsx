"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  CalendarCheck,
  CalendarDays,
  Clock,
  Crown,
  LayoutDashboard,
  Puzzle,
  Settings,
  Users,
  Waypoints,
  Workflow,
} from "lucide-react"
import { cn } from "@/lib/utils"

const PRIMARY = "#006BFF"
const ACTIVE_BG = "rgba(0, 107, 255, 0.09)"

const mainNavItems = [
  {
    href: "/events",
    label: "Scheduling",
    icon: CalendarDays,
    disabled: false,
  },
  {
    href: "/meetings",
    label: "Meetings",
    icon: CalendarCheck,
    disabled: false,
  },
  {
    href: "/availability",
    label: "Availability",
    icon: Clock,
    disabled: false,
  },
  {
    href: "/integrations",
    label: "Integrations & apps",
    icon: Puzzle,
    disabled: false,
  },
  { href: "/events", label: "Contacts", icon: Users, disabled: true },
  { href: "/events", label: "Workflows", icon: Workflow, disabled: true },
  { href: "/events", label: "Routing", icon: Waypoints, disabled: true },
] as const

const footerNavItems = [
  { href: "/dashboard", label: "Analytics", icon: LayoutDashboard },
  { href: "/account/profile", label: "Account settings", icon: Settings },
] as const

interface SidebarNavProps {
  onNavigate?: () => void
  collapsed?: boolean
}

export function SidebarNav({
  onNavigate,
  collapsed = false,
}: SidebarNavProps) {
  const pathname = usePathname()

  const renderItem = (
    href: string,
    label: string,
    Icon: (typeof mainNavItems)[number]["icon"],
    options: { disabled?: boolean; isActive?: boolean } = {},
  ) => {
    const { disabled, isActive = false } = options

    if (disabled) {
      return (
        <div
          key={label}
          className={cn(
            "flex cursor-not-allowed items-center rounded-lg text-sm font-medium text-[#9CA3AF]",
            collapsed ? "justify-center px-2 py-2.5" : "gap-3 px-3 py-2",
          )}
          title={`${label} (coming soon)`}
        >
          <Icon className="h-4 w-4 shrink-0 opacity-60" />
          {collapsed ? (
            <span className="sr-only">{label}</span>
          ) : (
            label
          )}
        </div>
      )
    }

    return (
      <div
        key={href + label}
        className={cn(
          "flex items-center",
          collapsed ? "justify-center" : "",
        )}
      >
        <Link
          href={href}
          onClick={onNavigate}
          title={label}
          className={cn(
            "flex flex-1 items-center overflow-hidden rounded-lg text-sm font-medium transition-colors",
            collapsed
              ? "justify-center px-2 py-2.5"
              : isActive
                ? "py-2 pr-3 pl-0"
                : "gap-3 px-3 py-2",
            isActive
              ? "text-[#006BFF]"
              : "text-[#374151] hover:bg-[#F3F4F6]",
          )}
          style={isActive ? { backgroundColor: ACTIVE_BG } : undefined}
        >
          {isActive && !collapsed ? (
            <span
              className="w-1 shrink-0 self-stretch rounded-l-lg"
              style={{ backgroundColor: PRIMARY }}
              aria-hidden
            />
          ) : null}
          <span
            className={cn(
              "flex min-w-0 items-center gap-3",
              isActive && !collapsed && "pl-2",
            )}
          >
            <Icon
              className="h-4 w-4 shrink-0"
              style={{ color: isActive ? PRIMARY : undefined }}
            />
            {collapsed ? (
              <span className="sr-only">{label}</span>
            ) : (
              label
            )}
          </span>
        </Link>
      </div>
    )
  }

  return (
    <nav className="flex flex-col gap-1">
      <div className="flex flex-col gap-0.5">
        {mainNavItems.map((item) => {
          const isActive =
            !item.disabled &&
            (item.href === "/events"
              ? pathname.startsWith("/events")
              : pathname.startsWith(item.href))
          return renderItem(item.href, item.label, item.icon, {
            disabled: item.disabled,
            isActive,
          })
        })}
      </div>

      <Link
        href="/pricing"
        onClick={onNavigate}
        title="Upgrade plan"
        className={cn(
          "mt-4 flex items-center rounded-lg border border-[#BFDBFE] text-sm font-semibold text-[#006BFF] transition-colors hover:bg-[#EBF5FF]",
          collapsed
            ? "justify-center p-2.5"
            : "gap-2 px-3 py-2.5",
        )}
      >
        <Crown className="h-4 w-4 shrink-0" />
        {collapsed ? (
          <span className="sr-only">Upgrade plan</span>
        ) : (
          "Upgrade plan"
        )}
      </Link>

      <div className="mt-4 flex flex-col gap-0.5 border-t border-[#E5E7EB] pt-4">
        {footerNavItems.map((item) => {
          const isActive = pathname.startsWith(item.href)
          return renderItem(item.href, item.label, item.icon, { isActive })
        })}
      </div>
    </nav>
  )
}
