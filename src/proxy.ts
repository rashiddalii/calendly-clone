/**
 * Next.js 16+ request proxy (lightweight middleware).
 * Uses authConfig only — no Prisma/db import — so it compiles cleanly for
 * the Edge Runtime. Sessions are JWT-encoded in the cookie, so auth.user
 * is populated without any database lookup here.
 */
import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth.config"
import { NextResponse } from "next/server"

const { auth } = NextAuth(authConfig)

export const proxy = auth((req) => {
  const { pathname, search } = req.nextUrl
  const method = req.method
  const user = req.auth?.user?.email ?? "guest"
  const ts = new Date().toISOString()

  console.log(`[${ts}] ${method} ${pathname}${search} | ${user}`)

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
