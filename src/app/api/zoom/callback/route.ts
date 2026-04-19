import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/app/lib/db"
import { APP_URL } from "@/lib/brand"

const ZOOM_TOKEN_URL = "https://zoom.us/oauth/token"
const ZOOM_API = "https://api.zoom.us/v2"

export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.redirect(new URL("/login", APP_URL))
  }

  const { searchParams } = request.nextUrl
  const code = searchParams.get("code")
  const error = searchParams.get("error")

  if (error || !code) {
    return NextResponse.redirect(new URL("/integrations?error=zoom_denied", APP_URL))
  }

  const clientId = process.env.ZOOM_CLIENT_ID
  const clientSecret = process.env.ZOOM_CLIENT_SECRET
  if (!clientId || !clientSecret) {
    return NextResponse.redirect(
      new URL("/integrations?error=zoom_not_configured", APP_URL),
    )
  }

  const redirectUri = `${APP_URL}/api/zoom/callback`

  try {
    // Exchange authorization code for tokens.
    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64")
    const tokenRes = await fetch(
      `${ZOOM_TOKEN_URL}?grant_type=authorization_code&code=${code}&redirect_uri=${encodeURIComponent(redirectUri)}`,
      {
        method: "POST",
        headers: { Authorization: `Basic ${credentials}` },
      },
    )
    if (!tokenRes.ok) {
      console.error("[zoom/callback] token exchange failed", tokenRes.status)
      return NextResponse.redirect(
        new URL("/integrations?error=zoom_token_failed", APP_URL),
      )
    }
    const tokens = (await tokenRes.json()) as {
      access_token: string
      refresh_token: string
      expires_in: number
      scope: string
    }

    // Get the Zoom user's ID and email.
    const userRes = await fetch(`${ZOOM_API}/users/me`, {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    })
    const zoomUser = userRes.ok
      ? ((await userRes.json()) as { id: string; email?: string })
      : { id: "me" }

    // Upsert the integration row.
    await prisma.integration.upsert({
      where: {
        userId_provider: { userId: session.user.id, provider: "ZOOM" },
      },
      create: {
        userId: session.user.id,
        provider: "ZOOM",
        providerAccountId: zoomUser.id,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        expiresAt: new Date(Date.now() + tokens.expires_in * 1000),
        scope: tokens.scope,
        accountEmail: zoomUser.email,
        lastVerifiedAt: new Date(),
        lastError: null,
        lastErrorAt: null,
      },
      update: {
        providerAccountId: zoomUser.id,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        expiresAt: new Date(Date.now() + tokens.expires_in * 1000),
        scope: tokens.scope,
        accountEmail: zoomUser.email,
        lastVerifiedAt: new Date(),
        lastError: null,
        lastErrorAt: null,
      },
    })
  } catch (err) {
    console.error("[zoom/callback] error", err)
    return NextResponse.redirect(
      new URL("/integrations?error=zoom_token_failed", APP_URL),
    )
  }

  return NextResponse.redirect(new URL("/integrations?connected=zoom", APP_URL))
}
