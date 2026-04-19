import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/app/lib/db"
import { APP_URL } from "@/lib/brand"

const MS_TOKEN_URL = "https://login.microsoftonline.com/common/oauth2/v2.0/token"
const GRAPH_API = "https://graph.microsoft.com/v1.0"

export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.redirect(new URL("/login", APP_URL))
  }

  const { searchParams } = request.nextUrl
  const code = searchParams.get("code")
  const error = searchParams.get("error")

  if (error || !code) {
    return NextResponse.redirect(new URL("/integrations?error=teams_denied", APP_URL))
  }

  const clientId = process.env.MICROSOFT_CLIENT_ID
  const clientSecret = process.env.MICROSOFT_CLIENT_SECRET
  if (!clientId || !clientSecret) {
    return NextResponse.redirect(
      new URL("/integrations?error=teams_not_configured", APP_URL),
    )
  }

  const redirectUri = `${APP_URL}/api/teams/callback`

  try {
    // Exchange authorization code for tokens.
    const tokenRes = await fetch(MS_TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
        client_id: clientId,
        client_secret: clientSecret,
        scope:
          "Calendars.ReadWrite OnlineMeetings.ReadWrite offline_access User.Read",
      }),
    })
    if (!tokenRes.ok) {
      console.error("[teams/callback] token exchange failed", tokenRes.status)
      return NextResponse.redirect(
        new URL("/integrations?error=teams_token_failed", APP_URL),
      )
    }
    const tokens = (await tokenRes.json()) as {
      access_token: string
      refresh_token?: string
      expires_in: number
      scope: string
    }

    // Get Microsoft user profile.
    const userRes = await fetch(
      `${GRAPH_API}/me?$select=id,displayName,mail,userPrincipalName`,
      { headers: { Authorization: `Bearer ${tokens.access_token}` } },
    )
    const msUser = userRes.ok
      ? ((await userRes.json()) as {
          id: string
          mail?: string
          userPrincipalName?: string
        })
      : { id: "me" }

    const accountEmail = msUser.mail ?? msUser.userPrincipalName ?? undefined

    // Detect personal MS accounts (Teams meetings won't work for these).
    const isPersonal =
      accountEmail
        ? /^.+@(outlook|hotmail|live|msn)\.(com|co\.\w+)$/i.test(accountEmail)
        : false

    await prisma.integration.upsert({
      where: {
        userId_provider: { userId: session.user.id, provider: "MICROSOFT" },
      },
      create: {
        userId: session.user.id,
        provider: "MICROSOFT",
        providerAccountId: msUser.id,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token ?? null,
        expiresAt: new Date(Date.now() + tokens.expires_in * 1000),
        scope: tokens.scope,
        accountEmail,
        lastVerifiedAt: new Date(),
        lastError: null,
        lastErrorAt: null,
      },
      update: {
        providerAccountId: msUser.id,
        accessToken: tokens.access_token,
        ...(tokens.refresh_token ? { refreshToken: tokens.refresh_token } : {}),
        expiresAt: new Date(Date.now() + tokens.expires_in * 1000),
        scope: tokens.scope,
        accountEmail,
        lastVerifiedAt: new Date(),
        lastError: null,
        lastErrorAt: null,
      },
    })

    if (isPersonal) {
      return NextResponse.redirect(
        new URL("/integrations?connected=teams&warning=personal_account", APP_URL),
      )
    }
  } catch (err) {
    console.error("[teams/callback] error", err)
    return NextResponse.redirect(
      new URL("/integrations?error=teams_token_failed", APP_URL),
    )
  }

  return NextResponse.redirect(new URL("/integrations?connected=teams", APP_URL))
}
