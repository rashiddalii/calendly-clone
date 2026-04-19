"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AlertTriangle, CheckCircle2, Clock, Info, Mail } from "lucide-react"
import { IntegrationStatusBadge } from "@/components/integrations/integration-status-badge"
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog"
import { handleOAuthSignIn } from "@/lib/actions/auth"
import type { IntegrationHealth } from "@/lib/services/integrations"

interface IntegrationDetailProps {
  health: IntegrationHealth
  icon: React.ReactNode
  name: string
  tagline: string
  bullets: string[]
  disconnectAction?: () => Promise<{ status: "success" | "error" }>
  reconnectHref?: string
  reconnectIsOAuth?: boolean
  inProgress?: boolean
  isBundled?: boolean
  bundledNote?: string
}

function formatDate(d: Date | null | undefined): string {
  if (!d) return "Unknown"
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(d))
}

export function IntegrationDetail({
  health,
  icon,
  name,
  tagline,
  bullets,
  disconnectAction,
  reconnectHref,
  reconnectIsOAuth = false,
  inProgress = false,
  isBundled = false,
  bundledNote,
}: IntegrationDetailProps) {
  const router = useRouter()
  const [isDisconnecting, startDisconnect] = useTransition()
  const [disconnectConfirmOpen, setDisconnectConfirmOpen] = useState(false)

  const handleDisconnect = () => {
    if (!disconnectAction) return
    startDisconnect(async () => {
      await disconnectAction()
      setDisconnectConfirmOpen(false)
      router.push("/integrations")
    })
  }

  const {
    status,
    accountEmail,
    lastVerifiedAt,
    needsReconnectReason,
    warning,
    lastErrorAt,
  } = health

  return (
    <div className="mx-auto max-w-2xl">
      <ConfirmationDialog
        open={disconnectConfirmOpen}
        onOpenChange={setDisconnectConfirmOpen}
        title={`Disconnect ${name}?`}
        description="This removes the integration from your account. You can reconnect it later from Integrations."
        confirmLabel="Disconnect"
        cancelLabel="Stay connected"
        isPending={isDisconnecting}
        onConfirm={handleDisconnect}
      />
      {/* Header card */}
      <div className="rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            {icon}
            <div>
              <h1 className="text-xl font-bold text-[#111827]">{name}</h1>
              <p className="mt-0.5 text-sm text-[#6B7280]">{tagline}</p>
              {accountEmail && (
                <p className="mt-1 flex items-center gap-1 text-xs text-[#9CA3AF]">
                  <Mail className="h-3 w-3" />
                  {accountEmail}
                </p>
              )}
            </div>
          </div>
          <IntegrationStatusBadge
            status={status}
            className="shrink-0 self-start"
          />
        </div>
      </div>

      {/* Reconnect needed banner */}
      {status === "needs_reconnect" && needsReconnectReason && (
        <div className="mt-4 flex items-start gap-3 rounded-xl border border-[#FDE68A] bg-[#FFFBEB] px-4 py-3">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#D97706]" />
          <div>
            <p className="text-sm font-medium text-[#92400E]">
              Connection needs attention
            </p>
            <p className="mt-0.5 text-sm text-[#92400E]">
              {needsReconnectReason}
            </p>
            {lastErrorAt && (
              <p className="mt-1 text-xs text-[#B45309]">
                Error detected: {formatDate(lastErrorAt)}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Warning banner (e.g. Teams personal account) */}
      {warning && status !== "needs_reconnect" && (
        <div className="mt-4 flex items-start gap-3 rounded-xl border border-[#FDE68A] bg-[#FFFBEB] px-4 py-3">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#D97706]" />
          <p className="text-sm text-[#92400E]">{warning}</p>
        </div>
      )}

      {/* Bundled note */}
      {isBundled && bundledNote && (
        <div className="mt-4 flex items-start gap-3 rounded-xl border border-[#BFDBFE] bg-[#EFF6FF] px-4 py-3">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#3B82F6]" />
          <p className="text-sm text-[#1D4ED8]">{bundledNote}</p>
        </div>
      )}

      {inProgress && (
        <div className="mt-4 flex items-start gap-3 rounded-xl border border-[#FDE68A] bg-[#FFFBEB] px-4 py-3">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#D97706]" />
          <div>
            <p className="text-sm font-medium text-[#92400E]">
              {name} is being set up
            </p>
            <p className="mt-0.5 text-sm text-[#92400E]">
              This integration is currently in progress and will be available
              soon.
            </p>
          </div>
        </div>
      )}

      {/* Status panel */}
      {status !== "not_connected" && (
        <div className="mt-4 rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-[#111827]">
            Connection status
          </h2>
          <dl className="flex flex-col gap-2.5">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-[#16A34A]" />
              <dt className="text-[#6B7280]">Status:</dt>
              <dd className="font-medium text-[#111827]">
                {status === "connected" ? "Active" : "Needs reconnection"}
              </dd>
            </div>
            {accountEmail && (
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 shrink-0 text-[#9CA3AF]" />
                <dt className="text-[#6B7280]">Account:</dt>
                <dd className="font-medium text-[#111827]">{accountEmail}</dd>
              </div>
            )}
            {lastVerifiedAt && (
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 shrink-0 text-[#9CA3AF]" />
                <dt className="text-[#6B7280]">Last verified:</dt>
                <dd className="font-medium text-[#111827]">
                  {formatDate(lastVerifiedAt)}
                </dd>
              </div>
            )}
          </dl>
        </div>
      )}

      {/* What this integration does */}
      <div className="mt-4 rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold text-[#111827]">
          What this integration does
        </h2>
        <ul className="flex flex-col gap-2">
          {bullets.map((b) => (
            <li
              key={b}
              className="flex items-start gap-2 text-sm text-[#374151]"
            >
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#006BFF]" />
              {b}
            </li>
          ))}
        </ul>
      </div>

      {/* Actions */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        {!isBundled && !inProgress && status !== "not_connected" && (
          <button
            type="button"
            onClick={() => setDisconnectConfirmOpen(true)}
            disabled={isDisconnecting}
            className="cursor-pointer rounded-lg border border-[#E5E7EB] bg-white px-5 py-2.5 text-sm font-medium text-[#374151] transition-colors hover:bg-[#F9FAFB] disabled:opacity-50"
          >
            {isDisconnecting ? "Disconnecting..." : "Disconnect"}
          </button>
        )}

        {!isBundled &&
          !inProgress &&
          status === "not_connected" &&
          reconnectHref &&
          !reconnectIsOAuth && (
            <a
              href={reconnectHref}
              className="cursor-pointer rounded-lg bg-[#006BFF] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#005FDB]"
            >
              Connect
            </a>
          )}

        {!isBundled &&
          !inProgress &&
          status === "not_connected" &&
          reconnectIsOAuth && (
            <form action={handleOAuthSignIn}>
              <input type="hidden" name="provider" value="google" />
              <button
                type="submit"
                className="cursor-pointer rounded-lg bg-[#006BFF] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#005FDB]"
              >
                Connect
              </button>
            </form>
          )}

        {!inProgress &&
          (status === "connected" || status === "needs_reconnect") && (
            <>
              {reconnectIsOAuth ? (
                <form action={handleOAuthSignIn}>
                  <input type="hidden" name="provider" value="google" />
                  <button
                    type="submit"
                    className="cursor-pointer rounded-lg bg-[#006BFF] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#005FDB]"
                  >
                    Reconnect
                  </button>
                </form>
              ) : reconnectHref ? (
                <a
                  href={reconnectHref}
                  className="cursor-pointer rounded-lg bg-[#006BFF] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#005FDB]"
                >
                  Reconnect
                </a>
              ) : null}
            </>
          )}

        {isBundled && (
          <Link
            href="/integrations/google-calendar"
            className="cursor-pointer rounded-lg bg-[#006BFF] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#005FDB]"
          >
            {status === "connected"
              ? "Manage Google Calendar"
              : "Connect Google Calendar"}
          </Link>
        )}
      </div>
    </div>
  )
}
