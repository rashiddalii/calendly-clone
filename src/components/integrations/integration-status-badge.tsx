import type { IntegrationStatus } from "@/lib/services/integrations"
import { cn } from "@/lib/utils"

interface IntegrationStatusBadgeProps {
  status: IntegrationStatus
  className?: string
}

export function IntegrationStatusBadge({ status, className }: IntegrationStatusBadgeProps) {
  if (status === "connected") {
    return (
      <span
        className={cn(
          "rounded-md border border-[#BBF7D0] bg-[#F0FFF4] px-2.5 py-0.5 text-xs font-semibold text-[#15803D]",
          className,
        )}
      >
        Connected
      </span>
    )
  }

  if (status === "needs_reconnect") {
    return (
      <span
        className={cn(
          "rounded-md border border-[#FDE68A] bg-[#FFFBEB] px-2.5 py-0.5 text-xs font-semibold text-[#92400E]",
          className,
        )}
      >
        Reconnect needed
      </span>
    )
  }

  return null
}
