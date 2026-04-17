/**
 * Next.js 16+ request proxy (replaces middleware). Must use the same Auth.js
 * instance as `src/lib/auth.ts` so database sessions resolve (adapter + providers).
 * A minimal NextAuth here breaks Google + email sign-in: cookies are set, but
 * the proxy still thinks the user is logged out on /dashboard, /events, etc.
 */
import { auth } from "@/lib/auth"

export const proxy = auth

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
