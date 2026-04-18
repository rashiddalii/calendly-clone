import type { NextAuthConfig } from "next-auth"

export const authConfig: NextAuthConfig = {
  pages: { signIn: "/login" },
  providers: [], // providers added in auth.ts only
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnDashboard =
        nextUrl.pathname.startsWith("/dashboard") ||
        nextUrl.pathname.startsWith("/events") ||
        nextUrl.pathname.startsWith("/availability") ||
        nextUrl.pathname.startsWith("/settings") ||
        nextUrl.pathname.startsWith("/meetings") ||
        nextUrl.pathname.startsWith("/onboarding")
      if (isOnDashboard) {
        if (isLoggedIn) return true
        return false // redirect to login
      }
      return true
    },
  },
}
