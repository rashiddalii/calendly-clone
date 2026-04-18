import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import MicrosoftEntraId from "next-auth/providers/microsoft-entra-id"
import Resend from "next-auth/providers/resend"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/db"
import { authConfig } from "@/lib/auth.config"
import { generateUsername } from "@/lib/services/user"
import { sendMagicLinkEmail } from "@/lib/services/email"

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
  // JWT strategy: sessions live in encrypted cookies, no DB lookup needed in middleware
  session: { strategy: "jwt" },
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
    ...(process.env.AUTH_MICROSOFT_ENTRA_ID_ID &&
    process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET
      ? [
          MicrosoftEntraId({
            clientId: process.env.AUTH_MICROSOFT_ENTRA_ID_ID,
            clientSecret: process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET,
            ...(process.env.AUTH_MICROSOFT_ENTRA_ID_ISSUER
              ? { issuer: process.env.AUTH_MICROSOFT_ENTRA_ID_ISSUER }
              : {}),
          }),
        ]
      : []),
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
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.username = (user as { username?: string | null }).username ?? null
        if (user.name) token.name = user.name
        if (user.email) token.email = user.email
        if (user.image) token.picture = user.image
      }

      // JWT sessions do not auto-refresh when the User row changes (e.g. Settings).
      if (token.id) {
        const row = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { username: true, name: true, image: true },
        })
        if (row) {
          token.username = row.username ?? null
          if (row.name != null) token.name = row.name
          if (row.image != null) token.picture = row.image
        }
      }

      return token
    },
    async session({ session, token }) {
      if (token.id) {
        session.user.id = token.id as string
      }
      session.user.username = (token.username as string | null) ?? null
      if (token.picture) {
        session.user.image = token.picture as string
      }
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
            data: { username, onboardingCompleted: false },
          })
        } catch (err) {
          const code = (err as { code?: string })?.code
          if (code !== "P2002") throw err
        }
      }
    },
  },
})
