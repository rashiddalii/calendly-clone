import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Resend from "next-auth/providers/resend"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/db"
import { authConfig } from "@/lib/auth.config"
import { generateUsername } from "@/lib/services/user"
import { sendMagicLinkEmail } from "@/lib/services/email"

/** Auth.js UntrustedHost: set AUTH_TRUST_HOST=true in .env, or we trust in development by default. */
function isTrustHost(): boolean {
  const raw = (process.env.AUTH_TRUST_HOST ?? "").toLowerCase()
  if (raw === "false" || raw === "0" || raw === "no") return false
  if (raw === "true" || raw === "1" || raw === "yes") return true
  if (process.env.VERCEL === "1") return true
  return process.env.NODE_ENV === "development"
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  ...authConfig,
  trustHost: isTrustHost(),
  secret: process.env.AUTH_SECRET,
  adapter: PrismaAdapter(prisma),
  session: { strategy: "database" },
  providers: [
    Google({
      authorization: {
        params: {
          scope: [
            "openid",
            "email",
            "profile",
            "https://www.googleapis.com/auth/calendar",
            "https://www.googleapis.com/auth/calendar.events",
          ].join(" "),
          access_type: "offline",
          prompt: "consent",
        },
      },
    }),
    Resend({
      apiKey: process.env.RESEND_API_KEY,
      from: process.env.AUTH_RESEND_FROM ?? "noreply@example.com",
      maxAge: 600,
      sendVerificationRequest: async ({ identifier, url }) => {
        await sendMagicLinkEmail({ to: identifier, url })
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async session({ session, user }) {
      if (user?.id) {
        session.user.id = user.id
      }
      session.user.username = (user as { username?: string | null }).username ?? null
      return session
    },
  },
  events: {
    async createUser({ user }) {
      if (user.id && user.email) {
        try {
          const username = await generateUsername({
            name: user.name,
            email: user.email,
          })
          await prisma.user.update({
            where: { id: user.id },
            data: { username },
          })
        } catch (err) {
          // P2002 = unique constraint violation (race condition on username)
          // Non-fatal: user can set username manually in settings
          const code = (err as { code?: string })?.code
          if (code !== "P2002") throw err
        }
      }
    },
  },
})
