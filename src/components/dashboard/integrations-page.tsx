"use client"

import { useState } from "react"
import Link from "next/link"
import { Ban, CheckCircle2, Search, X } from "lucide-react"
import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header"
import { IntegrationStatusBadge } from "@/components/integrations/integration-status-badge"
import { handleOAuthSignIn } from "@/lib/actions/auth"
import { cn } from "@/lib/utils"
import type { IntegrationHealth, IntegrationStatus } from "@/lib/services/integrations"
import {
  ChromeIcon,
  GoogleCalendarIcon,
  GoogleMeetIcon,
  HubSpotIcon,
  OutlookIcon,
  PayPalIcon,
  SalesforceIcon,
  SlackIcon,
  StripeIcon,
  TeamsIcon,
  ZapierIcon,
  ZoomIcon,
} from "@/components/icons/brand"

const ICON_SIZE = "h-12 w-12 shrink-0"

const icons: Record<string, React.ReactNode> = {
  zoom: <ZoomIcon className={ICON_SIZE} />,
  salesforce: <SalesforceIcon className={ICON_SIZE} />,
  "google-meet": <GoogleMeetIcon className={ICON_SIZE} />,
  hubspot: <HubSpotIcon className={ICON_SIZE} />,
  "google-calendar": <GoogleCalendarIcon className={ICON_SIZE} />,
  outlook: <OutlookIcon className={ICON_SIZE} />,
  teams: <TeamsIcon className={ICON_SIZE} />,
  chrome: <ChromeIcon className={ICON_SIZE} />,
  stripe: <StripeIcon className={ICON_SIZE} />,
  zapier: <ZapierIcon className={ICON_SIZE} />,
  paypal: <PayPalIcon className={ICON_SIZE} />,
  slack: <SlackIcon className={ICON_SIZE} />,
}

interface IntegrationDef {
  id: string
  name: string
  description: string
  connectHref?: string
  isOAuth?: boolean
  disabled: boolean
  inProgress?: boolean
}

const INTEGRATIONS: IntegrationDef[] = [
  {
    id: "zoom",
    name: "Zoom",
    description: "Include Zoom details in your Fluid events.",
    connectHref: "/api/zoom/connect",
    disabled: false,
    inProgress: true,
  },
  {
    id: "salesforce",
    name: "Salesforce",
    description:
      "Create and update records as meetings are scheduled. Plus, route meetings via real time Salesforce lookup.",
    disabled: true,
  },
  {
    id: "google-meet",
    name: "Google Meet",
    description: "Include Google Meet details in your Fluid events.",
    isOAuth: true,
    disabled: false,
  },
  {
    id: "hubspot",
    name: "HubSpot",
    description:
      "Sync meeting data to your CRM. Add instant, account-matched scheduling to your routing forms.",
    disabled: true,
  },
  {
    id: "google-calendar",
    name: "Google Calendar",
    description: "Add events to your calendar and prevent double-booking.",
    isOAuth: true,
    disabled: false,
  },
  {
    id: "outlook",
    name: "Outlook Calendar Plug-in",
    description: "Add events to your desktop calendar and prevent double-booking.",
    disabled: true,
  },
  {
    id: "teams",
    name: "Microsoft Teams Conferencing",
    description: "Include Teams conferencing details in your Fluid events.",
    connectHref: "/api/teams/connect",
    disabled: false,
    inProgress: true,
  },
  {
    id: "chrome",
    name: "Fluid for Chrome",
    description: "Access and share availability on any web page.",
    disabled: true,
  },
  {
    id: "stripe",
    name: "Stripe",
    description: "Collect payment before your meetings.",
    disabled: true,
  },
  {
    id: "zapier",
    name: "Zapier",
    description: "Create no-code automations between Fluid and 1000+ apps.",
    disabled: true,
  },
  {
    id: "paypal",
    name: "PayPal",
    description: "Collect payment before the meeting.",
    disabled: true,
  },
  {
    id: "slack",
    name: "Slack",
    description: "Access and share your availability and booking links from Slack.",
    disabled: true,
  },
]

function ConnectButton({
  integration,
}: {
  integration: IntegrationDef
}) {
  if (integration.isOAuth) {
    return (
      <form action={handleOAuthSignIn}>
        <input type="hidden" name="provider" value="google" />
        <button
          type="submit"
          className="mt-auto w-full cursor-pointer rounded-lg bg-[#006BFF] py-2 text-sm font-semibold text-white transition-colors hover:bg-[#005FDB]"
        >
          Connect
        </button>
      </form>
    )
  }
  if (integration.connectHref) {
    return (
      <a
        href={integration.connectHref}
        className="mt-auto block w-full cursor-pointer rounded-lg bg-[#006BFF] py-2 text-center text-sm font-semibold text-white transition-colors hover:bg-[#005FDB]"
      >
        Connect
      </a>
    )
  }
  return null
}

function IntegrationCard({
  integration,
  health,
  manageMode,
}: {
  integration: IntegrationDef
  health?: IntegrationHealth
  manageMode: boolean
}) {
  const status: IntegrationStatus = health?.status ?? "not_connected"
  const isLive = !integration.disabled
  const isConnectedOrReconnect = status === "connected" || status === "needs_reconnect"

  if (integration.disabled) {
    return (
      <div className="group relative flex cursor-not-allowed flex-col gap-4 overflow-hidden rounded-xl border border-[#E5E7EB] bg-white p-5 opacity-60 transition-shadow">
        <div className="absolute right-4 top-4">
          <Ban className="h-5 w-5 text-red-400 opacity-0 transition-opacity group-hover:opacity-100" strokeWidth={1.5} />
        </div>
        {icons[integration.id]}
        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold text-[#1c2b4b]">{integration.name}</p>
          <p className="text-xs leading-relaxed text-[#6B7280]">{integration.description}</p>
          <span className="mt-1 text-xs font-medium text-[#9CA3AF]">Coming soon</span>
        </div>
      </div>
    )
  }

  if (integration.inProgress) {
    return (
      <div className="relative flex flex-col gap-4 overflow-hidden rounded-xl border border-[#FDE68A] bg-white p-5">
        <div className="absolute right-4 top-4">
          <span className="rounded-md border border-[#FDE68A] bg-[#FFFBEB] px-2.5 py-0.5 text-xs font-semibold text-[#92400E]">
            In progress
          </span>
        </div>
        {icons[integration.id]}
        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold text-[#1c2b4b]">{integration.name}</p>
          <p className="text-xs leading-relaxed text-[#6B7280]">{integration.description}</p>
          <span className="mt-1 text-xs font-medium text-[#D97706]">Setup in progress</span>
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "relative flex flex-col gap-4 overflow-hidden rounded-xl border bg-white p-5 transition-shadow hover:shadow-md",
        status === "needs_reconnect"
          ? "border-[#FDE68A]"
          : "border-[#E5E7EB]",
      )}
    >
      {/* Status badge top-right */}
      <div className="absolute right-4 top-4">
        <IntegrationStatusBadge status={status} />
      </div>

      {icons[integration.id]}

      <div className="flex flex-col gap-1">
        <p className="text-sm font-semibold text-[#1c2b4b]">{integration.name}</p>
        <p className="text-xs leading-relaxed text-[#6B7280]">{integration.description}</p>
        {health?.accountEmail && (
          <p className="mt-0.5 text-xs text-[#9CA3AF]">{health.accountEmail}</p>
        )}
      </div>

      {/* Action buttons */}
      {isLive && isConnectedOrReconnect && (
        <div className="mt-auto flex gap-2">
          <Link
            href={`/integrations/${integration.id}`}
            className="flex-1 cursor-pointer rounded-lg border border-[#E5E7EB] bg-white py-2 text-center text-sm font-medium text-[#374151] transition-colors hover:bg-[#F9FAFB]"
          >
            Manage
          </Link>
          {status === "needs_reconnect" && (integration.connectHref || integration.isOAuth) && (
            integration.isOAuth ? (
              <form action={handleOAuthSignIn} className="flex-1">
                <input type="hidden" name="provider" value="google" />
                <button
                  type="submit"
                  className="w-full cursor-pointer rounded-lg bg-[#D97706] py-2 text-sm font-semibold text-white transition-colors hover:bg-[#B45309]"
                >
                  Reconnect
                </button>
              </form>
            ) : (
              <a
                href={integration.connectHref}
                className="flex-1 cursor-pointer rounded-lg bg-[#D97706] py-2 text-center text-sm font-semibold text-white transition-colors hover:bg-[#B45309]"
              >
                Reconnect
              </a>
            )
          )}
        </div>
      )}

      {isLive && !manageMode && status === "not_connected" && (
        <ConnectButton integration={integration} />
      )}
    </div>
  )
}

interface IntegrationsPageProps {
  healthMap: Record<string, IntegrationHealth>
  errorMessage?: string | null
  successMessage?: string | null
  warningMessage?: string | null
}

export function IntegrationsPage({
  healthMap,
  errorMessage,
  successMessage,
  warningMessage,
}: IntegrationsPageProps) {
  const [tab, setTab] = useState<"discover" | "manage">("discover")
  const [bannerDismissed, setBannerDismissed] = useState(false)
  const [search, setSearch] = useState("")

  const connectedCount = INTEGRATIONS.filter((i) => {
    if (i.disabled) return false
    const h = healthMap[i.id]
    return h?.status === "connected" || h?.status === "needs_reconnect"
  }).length

  const filtered = search.trim()
    ? INTEGRATIONS.filter(
        (i) =>
          i.name.toLowerCase().includes(search.toLowerCase()) ||
          i.description.toLowerCase().includes(search.toLowerCase()),
      )
    : INTEGRATIONS

  const displayList =
    tab === "manage"
      ? filtered.filter((i) => {
          if (i.disabled || i.inProgress) return false
          const h = healthMap[i.id]
          return h?.status === "connected" || h?.status === "needs_reconnect"
        })
      : filtered

  return (
    <div>
      <DashboardPageHeader title="Integrations & apps" />

      {/* Flash banners */}
      {errorMessage && (
        <div className="mb-6 rounded-lg border border-[#FEE2E2] bg-[#FEF2F2] px-4 py-3 text-sm text-[#DC2626]">
          {errorMessage}
        </div>
      )}
      {warningMessage && (
        <div className="mb-6 rounded-lg border border-[#FEF3C7] bg-[#FFFBEB] px-4 py-3 text-sm text-[#92400E]">
          {warningMessage}
        </div>
      )}
      {successMessage && !warningMessage && (
        <div className="mb-6 rounded-lg border border-[#D1FAE5] bg-[#ECFDF5] px-4 py-3 text-sm text-[#065F46]">
          {successMessage}
        </div>
      )}

      {/* Tabs */}
      <div className="mb-6 flex gap-6 border-b border-[#E5E7EB]">
        {(["discover", "manage"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={cn(
              "flex cursor-pointer items-center gap-1.5 pb-3 text-sm font-medium transition-colors",
              tab === t
                ? "-mb-px border-b-2 border-[#006BFF] text-[#006BFF]"
                : "text-[#6B7280] hover:text-[#374151]",
            )}
          >
            {t === "discover"
              ? `Discover (${INTEGRATIONS.length})`
              : `Manage (${connectedCount})`}
            {t === "manage" && connectedCount > 0 && (
              <CheckCircle2 className="h-3.5 w-3.5 text-[#006BFF]" />
            )}
          </button>
        ))}
      </div>

      {/* Getting started banner */}
      {tab === "discover" && !bannerDismissed && (
        <div className="mb-6 flex items-start gap-5 rounded-xl border border-[#BFDBFE] bg-[#EFF6FF] p-5">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white">
            <svg viewBox="0 0 80 60" className="h-full w-full p-2">
              <rect x="8" y="10" width="64" height="40" rx="4" fill="#f0f5ff" stroke="#BFDBFE" strokeWidth="1.5" />
              <rect x="16" y="22" width="32" height="6" rx="2" fill="#BFDBFE" />
              <rect x="52" y="22" width="14" height="6" rx="2" fill="#006BFF" />
              <rect x="16" y="32" width="32" height="6" rx="2" fill="#BFDBFE" />
              <rect x="52" y="32" width="14" height="6" rx="2" fill="#d1fae5" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="mb-0.5 text-xs font-semibold uppercase tracking-wide text-[#006BFF]">
              Getting Started
            </p>
            <h3 className="mb-1 text-base font-bold text-[#1c2b4b]">
              Fluid works where you work
            </h3>
            <p className="text-sm text-[#4b5a6d]">
              Connect Fluid to your favorite calendars, tools, and apps to enhance your scheduling automations.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setBannerDismissed(true)}
            className="cursor-pointer rounded-md p-1 text-[#6B7280] transition-colors hover:bg-[#DBEAFE] hover:text-[#1c2b4b]"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Search — discover only */}
      {tab === "discover" && (
        <div className="mb-6">
          <div className="relative max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Find integrations and apps"
              className="w-full rounded-lg border border-[#E5E7EB] py-2.5 pl-9 pr-3 text-sm text-[#1c2b4b] outline-none transition focus:border-[#006BFF] focus:ring-2 focus:ring-[rgba(0,107,255,0.2)] placeholder:text-[#9CA3AF]"
            />
          </div>
        </div>
      )}

      {/* Grid */}
      {displayList.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {displayList.map((integration) => (
            <IntegrationCard
              key={integration.id}
              integration={integration}
              health={healthMap[integration.id]}
              manageMode={tab === "manage"}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-sm font-medium text-[#374151]">No integrations found</p>
          <p className="mt-1 text-sm text-[#9CA3AF]">
            {tab === "manage"
              ? "Connect an integration from the Discover tab to manage it here."
              : "Try a different search term."}
          </p>
        </div>
      )}
    </div>
  )
}
