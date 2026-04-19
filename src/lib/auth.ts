import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import MicrosoftEntraId from "next-auth/providers/microsoft-entra-id"
import Nodemailer from "next-auth/providers/nodemailer"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/db"
import { authConfig } from "@/lib/auth.config"
import { generateUsername } from "@/lib/services/user"
import { sendMagicLinkEmail } from "@/lib/services/email"
import { verifyPassword } from "@/lib/services/password"
import { passwordSignInSchema } from "@/lib/validators/auth"


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
    ...(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS
      ? [
          Nodemailer({
            server: {
              host: process.env.SMTP_HOST,
              port: Number(process.env.SMTP_PORT ?? 587),
              secure: process.env.SMTP_SECURE === "true",
              auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
              },
            },
            from: process.env.SMTP_FROM ?? "noreply@example.com",
            maxAge: 600,
            sendVerificationRequest: async ({ identifier, url }) => {
              await sendMagicLinkEmail({ to: identifier, url })
            },
          }),
        ]
      : []),
    // Email + password sign-in
    Credentials({
      id: "credentials",
      name: "Email and Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = passwordSignInSchema.safeParse(credentials)
        if (!parsed.success) return null

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email },
          select: {
            id: true,
            email: true,
            name: true,
            image: true,
            username: true,
            password: true,
            emailVerified: true,
          },
        })

        if (!user || !user.password) return null

        const valid = await verifyPassword(parsed.data.password, user.password)
        if (!valid) return null

        if (!user.emailVerified) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          username: user.username,
        }
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
