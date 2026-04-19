import { prisma } from "@/app/lib/db"
import { isGoogleCalendarConnected, isGoogleLinked } from "@/lib/services/calendar"

export type IntegrationStatus = "connected" | "needs_reconnect" | "not_connected"

export interface IntegrationHealth {
  provider: "google-calendar" | "google-meet" | "zoom" | "teams"
  status: IntegrationStatus
  accountEmail?: string | null
  lastVerifiedAt?: Date | null
  lastError?: string | null
  needsReconnectReason?: string
  warning?: string
  connectedAt?: Date | null
  lastErrorAt?: Date | null
}

async function getGoogleCalendarHealth(userId: string): Promise<IntegrationHealth> {
  const [calendarConnected, googleLinked] = await Promise.all([
    isGoogleCalendarConnected(userId),
    isGoogleLinked(userId),
  ])

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true },
  })

  if (calendarConnected) {
    return {
      provider: "google-calendar",
      status: "connected",
      accountEmail: user?.email ?? null,
    }
  }

  if (googleLinked) {
    return {
      provider: "google-calendar",
      status: "needs_reconnect",
      accountEmail: user?.email ?? null,
      needsReconnectReason:
        "Google account is linked but calendar permissions were not granted. Reconnect to restore access.",
    }
  }

  return { provider: "google-calendar", status: "not_connected" }
}

function getGoogleMeetHealth(calHealth: IntegrationHealth): IntegrationHealth {
  return {
    provider: "google-meet",
    status: calHealth.status,
    accountEmail: calHealth.accountEmail,
    needsReconnectReason:
      calHealth.status === "needs_reconnect"
        ? "Google Meet requires Google Calendar to be connected."
        : undefined,
  }
}

async function getZoomHealth(userId: string): Promise<IntegrationHealth> {
  const integration = await prisma.integration.findUnique({
    where: { userId_provider: { userId, provider: "ZOOM" } },
    select: {
      refreshToken: true,
      accountEmail: true,
      lastVerifiedAt: true,
      lastError: true,
      lastErrorAt: true,
      createdAt: true,
    },
  })

  if (!integration?.refreshToken) {
    return { provider: "zoom", status: "not_connected" }
  }

  if (integration.lastError) {
    return {
      provider: "zoom",
      status: "needs_reconnect",
      accountEmail: integration.accountEmail,
      lastVerifiedAt: integration.lastVerifiedAt,
      lastError: integration.lastError,
      lastErrorAt: integration.lastErrorAt,
      connectedAt: integration.createdAt,
      needsReconnectReason: "The Zoom connection has an error. Reconnect to restore access.",
    }
  }

  return {
    provider: "zoom",
    status: "connected",
    accountEmail: integration.accountEmail,
    lastVerifiedAt: integration.lastVerifiedAt,
    connectedAt: integration.createdAt,
  }
}

async function getTeamsHealth(userId: string): Promise<IntegrationHealth> {
  const integration = await prisma.integration.findUnique({
    where: { userId_provider: { userId, provider: "MICROSOFT" } },
    select: {
      refreshToken: true,
      accountEmail: true,
      lastVerifiedAt: true,
      lastError: true,
      lastErrorAt: true,
      createdAt: true,
    },
  })

  if (!integration?.refreshToken) {
    return { provider: "teams", status: "not_connected" }
  }

  const isPersonalAccount =
    !!integration.accountEmail &&
    /^.+@(outlook|hotmail|live|msn)\.(com|co\.\w+)$/i.test(integration.accountEmail)

  if (integration.lastError) {
    return {
      provider: "teams",
      status: "needs_reconnect",
      accountEmail: integration.accountEmail,
      lastVerifiedAt: integration.lastVerifiedAt,
      lastError: integration.lastError,
      lastErrorAt: integration.lastErrorAt,
      connectedAt: integration.createdAt,
      needsReconnectReason:
        "The Microsoft Teams connection has an error. Reconnect to restore access.",
      warning: isPersonalAccount
        ? "Teams meetings require a work or school Microsoft account. Personal accounts cannot create Teams meetings."
        : undefined,
    }
  }

  return {
    provider: "teams",
    status: "connected",
    accountEmail: integration.accountEmail,
    lastVerifiedAt: integration.lastVerifiedAt,
    connectedAt: integration.createdAt,
    warning: isPersonalAccount
      ? "Teams meetings require a work or school Microsoft account. Personal accounts cannot create Teams meetings."
      : undefined,
  }
}

export async function getAllIntegrationHealth(
  userId: string,
): Promise<Record<string, IntegrationHealth>> {
  const [gcal, zoom, teams] = await Promise.all([
    getGoogleCalendarHealth(userId),
    getZoomHealth(userId),
    getTeamsHealth(userId),
  ])

  const meet = getGoogleMeetHealth(gcal)

  return {
    "google-calendar": gcal,
    "google-meet": meet,
    zoom,
    teams,
  }
}

export async function getIntegrationHealth(
  userId: string,
  provider: string,
): Promise<IntegrationHealth | null> {
  switch (provider) {
    case "google-calendar": {
      return getGoogleCalendarHealth(userId)
    }
    case "google-meet": {
      const gcal = await getGoogleCalendarHealth(userId)
      return getGoogleMeetHealth(gcal)
    }
    case "zoom": {
      return getZoomHealth(userId)
    }
    case "teams": {
      return getTeamsHealth(userId)
    }
    default:
      return null
  }
}
