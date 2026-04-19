import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { getAllIntegrationHealth } from "@/lib/services/integrations"
import { IntegrationsPage } from "@/components/dashboard/integrations-page"

export const metadata = { title: "Integrations & apps | Fluid" }

const ERROR_MESSAGES: Record<string, string> = {
  zoom_in_progress: "Zoom integration is currently in progress.",
  zoom_denied: "Zoom connection was cancelled.",
  zoom_not_configured: "Zoom integration is not configured on this server.",
  zoom_token_failed: "Failed to connect Zoom. Please try again.",
  teams_denied: "Microsoft Teams connection was cancelled.",
  teams_not_configured: "Teams integration is not configured on this server.",
  teams_token_failed: "Failed to connect Teams. Please try again.",
}

const SUCCESS_MESSAGES: Record<string, string> = {
  zoom: "Zoom connected successfully.",
  teams: "Microsoft Teams connected successfully.",
}

const WARNING_MESSAGES: Record<string, string> = {
  personal_account:
    "Connected, but Teams meetings require a work or school Microsoft account. Personal accounts cannot create Teams meetings.",
}

export default async function IntegrationsRoute({
  searchParams,
}: {
  searchParams: Promise<{ connected?: string; error?: string; warning?: string }>
}) {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const { connected, error, warning } = await searchParams

  const healthMap = await getAllIntegrationHealth(session.user.id)

  const errorMessage = error ? (ERROR_MESSAGES[error] ?? null) : null
  const successMessage = connected ? (SUCCESS_MESSAGES[connected] ?? null) : null
  const warningMessage = warning ? (WARNING_MESSAGES[warning] ?? null) : null

  return (
    <IntegrationsPage
      healthMap={healthMap}
      errorMessage={errorMessage}
      successMessage={successMessage}
      warningMessage={warningMessage}
    />
  )
}
