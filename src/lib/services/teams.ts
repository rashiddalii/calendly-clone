import { prisma } from "@/app/lib/db"
import { APP_URL } from "@/lib/brand"

const MS_TOKEN_URL = "https://login.microsoftonline.com/common/oauth2/v2.0/token"
const GRAPH_API = "https://graph.microsoft.com/v1.0"

export interface TeamsMeeting {
  calendarEventId: string
  joinUrl: string
}

async function getMsAccessToken(userId: string): Promise<string | null> {
  const integration = await prisma.integration.findUnique({
    where: { userId_provider: { userId, provider: "MICROSOFT" } },
  })
  if (!integration?.refreshToken) return null

  const clientId = process.env.MICROSOFT_CLIENT_ID
  const clientSecret = process.env.MICROSOFT_CLIENT_SECRET
  if (!clientId || !clientSecret) {
    console.warn("[teams] Missing MICROSOFT_CLIENT_ID or MICROSOFT_CLIENT_SECRET")
    return null
  }

  // Reuse token if still valid (>60s remaining).
  if (
    integration.accessToken &&
    integration.expiresAt &&
    integration.expiresAt.getTime() - Date.now() > 60_000
  ) {
    return integration.accessToken
  }

  // Refresh.
  try {
    const body = new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: integration.refreshToken,
      client_id: clientId,
      client_secret: clientSecret,
      scope: "Calendars.ReadWrite OnlineMeetings.ReadWrite offline_access User.Read",
    })
    const res = await fetch(MS_TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    })
    if (!res.ok) {
      console.warn("[teams] Token refresh failed", res.status)
      await prisma.integration.update({
        where: { id: integration.id },
        data: {
          lastError: `Token refresh failed (HTTP ${res.status})`,
          lastErrorAt: new Date(),
        },
      }).catch(() => {/* ignore */})
      return null
    }
    const data = (await res.json()) as {
      access_token: string
      refresh_token?: string
      expires_in: number
    }
    await prisma.integration.update({
      where: { id: integration.id },
      data: {
        accessToken: data.access_token,
        ...(data.refresh_token ? { refreshToken: data.refresh_token } : {}),
        expiresAt: new Date(Date.now() + data.expires_in * 1000),
        lastVerifiedAt: new Date(),
        lastError: null,
        lastErrorAt: null,
      },
    })
    return data.access_token
  } catch (err) {
    console.warn("[teams] Token refresh errored", err)
    await prisma.integration.update({
      where: { id: integration.id },
      data: {
        lastError: err instanceof Error ? err.message : "Token refresh failed",
        lastErrorAt: new Date(),
      },
    }).catch(() => {/* ignore — record may already be gone */})
    return null
  }
}

/**
 * Create a Teams online meeting via a Graph calendar event.
 *
 * Note: personal Microsoft accounts (outlook.com, hotmail.com, live.com)
 * cannot create Teams meetings via Graph — the API returns `onlineMeeting: null`
 * for those accounts. The function returns null in that case and the booking
 * proceeds without a Teams link.
 */
export async function createTeamsMeeting(input: {
  userId: string
  subject: string
  description: string
  startUtc: Date
  endUtc: Date
  attendeeEmail: string
  attendeeName: string
}): Promise<TeamsMeeting | null> {
  const token = await getMsAccessToken(input.userId)
  if (!token) return null

  try {
    const res = await fetch(`${GRAPH_API}/me/events`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        subject: input.subject,
        body: { contentType: "text", content: input.description },
        start: {
          dateTime: input.startUtc.toISOString().replace("Z", ""),
          timeZone: "UTC",
        },
        end: {
          dateTime: input.endUtc.toISOString().replace("Z", ""),
          timeZone: "UTC",
        },
        attendees: [
          {
            emailAddress: {
              address: input.attendeeEmail,
              name: input.attendeeName,
            },
            type: "required",
          },
        ],
        isOnlineMeeting: true,
        onlineMeetingProvider: "teamsForBusiness",
      }),
    })
    if (!res.ok) {
      console.warn("[teams] create event failed", res.status)
      return null
    }
    const data = (await res.json()) as {
      id: string
      onlineMeeting?: { joinUrl?: string } | null
    }
    const joinUrl = data.onlineMeeting?.joinUrl
    if (!joinUrl) {
      // Personal MS accounts silently ignore isOnlineMeeting — store the
      // calendar event ID anyway so we can delete it on cancel, but signal
      // no join URL.
      console.warn("[teams] onlineMeeting.joinUrl is null (personal account?)")
      return null
    }
    return { calendarEventId: data.id, joinUrl }
  } catch (err) {
    console.warn("[teams] create event errored", err)
    return null
  }
}

/**
 * Delete a Teams calendar event. Safe to call with null eventId.
 */
export async function deleteTeamsMeeting(
  userId: string,
  eventId: string | null,
): Promise<void> {
  if (!eventId) return
  const token = await getMsAccessToken(userId)
  if (!token) return

  try {
    await fetch(`${GRAPH_API}/me/events/${encodeURIComponent(eventId)}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
  } catch (err) {
    console.warn("[teams] delete event errored", err)
  }
}

/**
 * Check whether a user has a connected Microsoft integration.
 */
export async function isTeamsConnected(userId: string): Promise<boolean> {
  const integration = await prisma.integration.findUnique({
    where: { userId_provider: { userId, provider: "MICROSOFT" } },
    select: { refreshToken: true },
  })
  return !!integration?.refreshToken
}

/** Build the Microsoft OAuth authorization URL. */
export function msOAuthUrl(): string {
  const clientId = process.env.MICROSOFT_CLIENT_ID ?? ""
  const redirectUri = `${APP_URL}/api/teams/callback`
  const params = new URLSearchParams({
    client_id: clientId,
    response_type: "code",
    redirect_uri: redirectUri,
    scope:
      "Calendars.ReadWrite OnlineMeetings.ReadWrite offline_access User.Read",
    response_mode: "query",
  })
  return `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?${params}`
}
