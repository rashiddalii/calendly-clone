import { prisma } from "@/app/lib/db"
import { APP_URL } from "@/lib/brand"

const ZOOM_TOKEN_URL = "https://zoom.us/oauth/token"
const ZOOM_API = "https://api.zoom.us/v2"

export interface ZoomMeeting {
  id: number
  joinUrl: string
  password: string
}

async function getZoomAccessToken(userId: string): Promise<string | null> {
  const integration = await prisma.integration.findUnique({
    where: { userId_provider: { userId, provider: "ZOOM" } },
  })
  if (!integration?.refreshToken) return null

  const clientId = process.env.ZOOM_CLIENT_ID
  const clientSecret = process.env.ZOOM_CLIENT_SECRET
  if (!clientId || !clientSecret) {
    console.warn("[zoom] Missing ZOOM_CLIENT_ID or ZOOM_CLIENT_SECRET")
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
    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64")
    const res = await fetch(
      `${ZOOM_TOKEN_URL}?grant_type=refresh_token&refresh_token=${encodeURIComponent(integration.refreshToken)}`,
      {
        method: "POST",
        headers: { Authorization: `Basic ${credentials}` },
      },
    )
    if (!res.ok) {
      console.warn("[zoom] Token refresh failed", res.status)
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
      refresh_token: string
      expires_in: number
    }
    await prisma.integration.update({
      where: { id: integration.id },
      data: {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresAt: new Date(Date.now() + data.expires_in * 1000),
        lastVerifiedAt: new Date(),
        lastError: null,
        lastErrorAt: null,
      },
    })
    return data.access_token
  } catch (err) {
    console.warn("[zoom] Token refresh errored", err)
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
 * Create a Zoom meeting on behalf of the host.
 * Returns meeting details, or null if Zoom is not connected or the call fails.
 */
export async function createZoomMeeting(input: {
  userId: string
  topic: string
  startUtc: Date
  durationMin: number
}): Promise<ZoomMeeting | null> {
  const token = await getZoomAccessToken(input.userId)
  if (!token) return null

  try {
    const res = await fetch(`${ZOOM_API}/users/me/meetings`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        topic: input.topic,
        type: 2,
        start_time: input.startUtc.toISOString().replace(".000Z", "Z"),
        duration: input.durationMin,
        timezone: "UTC",
        settings: {
          join_before_host: true,
          waiting_room: false,
          meeting_authentication: false,
        },
      }),
    })
    if (!res.ok) {
      console.warn("[zoom] create meeting failed", res.status)
      return null
    }
    const data = (await res.json()) as {
      id: number
      join_url: string
      password: string
    }
    return { id: data.id, joinUrl: data.join_url, password: data.password }
  } catch (err) {
    console.warn("[zoom] create meeting errored", err)
    return null
  }
}

/**
 * Delete a Zoom meeting. Safe to call with null meetingId.
 */
export async function deleteZoomMeeting(
  userId: string,
  meetingId: string | null,
): Promise<void> {
  if (!meetingId) return
  const token = await getZoomAccessToken(userId)
  if (!token) return

  try {
    await fetch(`${ZOOM_API}/meetings/${meetingId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
  } catch (err) {
    console.warn("[zoom] delete meeting errored", err)
  }
}

/**
 * Check whether a user has a connected Zoom integration.
 */
export async function isZoomConnected(userId: string): Promise<boolean> {
  const integration = await prisma.integration.findUnique({
    where: { userId_provider: { userId, provider: "ZOOM" } },
    select: { refreshToken: true },
  })
  return !!integration?.refreshToken
}

/** Build the Zoom OAuth authorization URL. */
export function zoomOAuthUrl(state: string): string {
  const clientId = process.env.ZOOM_CLIENT_ID ?? ""
  const redirectUri = `${APP_URL}/api/zoom/callback`
  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    redirect_uri: redirectUri,
    state,
  })
  return `https://zoom.us/oauth/authorize?${params}`
}
