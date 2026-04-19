import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { zoomOAuthUrl } from "@/lib/services/zoom"
import { APP_URL } from "@/lib/brand"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.redirect(new URL("/login", APP_URL))
  }

  if (!process.env.ZOOM_CLIENT_ID) {
    return NextResponse.redirect(
      new URL("/integrations?error=zoom_not_configured", APP_URL),
    )
  }

  const state = crypto.randomUUID()
  const response = NextResponse.redirect(zoomOAuthUrl(state))
  response.cookies.set("zoom_oauth_state", state, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 600,
    path: "/",
    secure: process.env.NODE_ENV === "production",
  })
  return response
}
