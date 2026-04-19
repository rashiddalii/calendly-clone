/**
 * Google Calendar integration — two-way sync.
 *
 * All functions degrade gracefully: if a user has no Google account linked,
 * or their refresh token has been revoked, the functions return safe defaults
 * and log a warning. The booking flow must continue to work without Calendar.
 */

import { prisma } from "@/app/lib/db"
import type { TimeInterval } from "@/types"

const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"
const FREEBUSY_URL = "https://www.googleapis.com/calendar/v3/freeBusy"
const EVENTS_URL = "https://www.googleapis.com/calendar/v3/calendars/primary/events"

/**
 * Result of loading + refreshing an access token for a user.
 */
interface GoogleToken {
  accessToken: string
  /** The Account row ID for persisting updated tokens. */
  accountId: string
}

const CALENDAR_SCOPES = [
  "https://www.googleapis.com/auth/calendar",
  "https://www.googleapis.com/auth/calendar.events",
]

function hasCalendarScope(scope: string | null | undefined): boolean {
  if (!scope) return false
  return CALENDAR_SCOPES.some((s) => scope.includes(s))
}

async function getGoogleAccessToken(userId: string): Promise<GoogleToken | null> {
  const account = await prisma.account.findFirst({
    where: { userId, provider: "google" },
  })
  if (!account?.refresh_token) return null

  // Token exists but was granted without calendar scope — treat as not connected.
  if (!hasCalendarScope(account.scope)) {
    console.warn("[calendar] Google account lacks calendar scope. Stored scope:", account.scope)
    return null
  }

  // If the stored access token is still valid (>60s remaining), reuse it.
  const now = Math.floor(Date.now() / 1000)
  if (account.access_token && account.expires_at && account.expires_at - now > 60) {
    return { accessToken: account.access_token, accountId: account.id }
  }

  // Otherwise refresh.
  const clientId = process.env.AUTH_GOOGLE_ID
  const clientSecret = process.env.AUTH_GOOGLE_SECRET
  if (!clientId || !clientSecret) {
    console.warn("[calendar] Missing Google OAuth credentials")
    return null
  }

  try {
    const res = await fetch(GOOGLE_TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: account.refresh_token,
        grant_type: "refresh_token",
      }),
    })
    if (!res.ok) {
      console.warn("[calendar] Token refresh failed", res.status)
      return null
    }
    const data = (await res.json()) as {
      access_token: string
      expires_in: number
    }
    await prisma.account.update({
      where: { id: account.id },
      data: {
        access_token: data.access_token,
        expires_at: Math.floor(Date.now() / 1000) + data.expires_in,
      },
    })
    return { accessToken: data.access_token, accountId: account.id }
  } catch (err) {
    console.warn("[calendar] Token refresh errored", err)
    return null
  }
}

/**
 * Return the user's busy intervals from their primary Google Calendar.
 * Returns an empty array if Calendar is not connected or the call fails.
 */
export async function getBusyTimes(
  userId: string,
  from: Date,
  to: Date,
): Promise<TimeInterval[]> {
  const token = await getGoogleAccessToken(userId)
  if (!token) return []

  try {
    const res = await fetch(FREEBUSY_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        timeMin: from.toISOString(),
        timeMax: to.toISOString(),
        items: [{ id: "primary" }],
      }),
    })
    if (!res.ok) {
      const body = await res.text().catch(() => "")
      console.warn("[calendar] freeBusy failed", res.status, body)
      return []
    }
    const data = (await res.json()) as {
      calendars: Record<string, { busy: Array<{ start: string; end: string }> }>
    }
    const busy = data.calendars?.primary?.busy ?? []
    return busy.map((b) => ({ start: new Date(b.start), end: new Date(b.end) }))
  } catch (err) {
    console.warn("[calendar] freeBusy errored", err)
    return []
  }
}

/**
 * Create a Google Calendar event for a booking.
 *
 * When `requestMeetLink` is true (i.e. the event type location is google_meet),
 * the Google Calendar API auto-provisions a Meet conference and returns the
 * join URL. Requires `conferenceDataVersion=1` in the query string.
 *
 * Returns `{ id, meetingUrl }` on success, or null if Calendar isn't connected.
 */
export async function createCalendarEvent(input: {
  userId: string
  summary: string
  description: string
  startUtc: Date
  endUtc: Date
  attendeeEmail: string
  attendeeName: string
  requestMeetLink?: boolean
  physicalLocation?: string
}): Promise<{ id: string; meetingUrl: string | null } | null> {
  const token = await getGoogleAccessToken(input.userId)
  if (!token) return null

  const params = new URLSearchParams({ sendUpdates: "all" })
  if (input.requestMeetLink) params.set("conferenceDataVersion", "1")

  const body: Record<string, unknown> = {
    summary: input.summary,
    description: input.description,
    start: { dateTime: input.startUtc.toISOString() },
    end: { dateTime: input.endUtc.toISOString() },
    attendees: [{ email: input.attendeeEmail, displayName: input.attendeeName }],
    reminders: { useDefault: true },
    ...(input.physicalLocation ? { location: input.physicalLocation } : {}),
  }
  if (input.requestMeetLink) {
    body.conferenceData = {
      createRequest: {
        requestId: `fluid-${Date.now()}`,
        conferenceSolutionKey: { type: "hangoutsMeet" },
      },
    }
  }

  try {
    const res = await fetch(`${EVENTS_URL}?${params}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
    if (!res.ok) {
      const body = await res.text().catch(() => "")
      console.warn("[calendar] events.insert failed", res.status, body)
      return null
    }
    const data = (await res.json()) as {
      id: string
      hangoutLink?: string
      conferenceData?: { entryPoints?: Array<{ entryPointType: string; uri: string }> }
    }
    const meetingUrl =
      data.hangoutLink ??
      data.conferenceData?.entryPoints?.find((e) => e.entryPointType === "video")
        ?.uri ??
      null
    return { id: data.id, meetingUrl }
  } catch (err) {
    console.warn("[calendar] events.insert errored", err)
    return null
  }
}

/**
 * Delete a previously-created calendar event. Safe to call with null.
 */
export async function deleteCalendarEvent(
  userId: string,
  eventId: string | null,
): Promise<void> {
  if (!eventId) return
  const token = await getGoogleAccessToken(userId)
  if (!token) return

  try {
    await fetch(
      `${EVENTS_URL}/${encodeURIComponent(eventId)}?sendUpdates=all`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token.accessToken}` },
      },
    )
  } catch (err) {
    console.warn("[calendar] events.delete errored", err)
  }
}

/**
 * Check whether a user has a linked Google account that we can use for
 * Calendar operations. Used by the Settings page.
 */
export async function isGoogleCalendarConnected(userId: string): Promise<boolean> {
  const account = await prisma.account.findFirst({
    where: { userId, provider: "google" },
    select: { refresh_token: true, scope: true },
  })
  return !!account?.refresh_token && hasCalendarScope(account.scope)
}

/**
 * Returns true if the user has any Google account linked, regardless of whether
 * the calendar scope was granted. Used to show "Reconnect" vs "Connect" in Settings.
 */
export async function isGoogleLinked(userId: string): Promise<boolean> {
  const account = await prisma.account.findFirst({
    where: { userId, provider: "google" },
    select: { id: true },
  })
  return !!account
}
