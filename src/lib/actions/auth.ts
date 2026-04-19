"use server"

import { redirect } from "next/navigation"
import { signIn, signOut } from "@/lib/auth"
import { prisma } from "@/app/lib/db"
import { emailSignInSchema, passwordSignUpSchema, passwordSignInSchema, requestPasswordResetSchema, resetPasswordSchema } from "@/lib/validators/auth"
import { hashPassword } from "@/lib/services/password"
import {
  createEmailVerificationToken,
  consumeEmailVerificationToken,
  createPasswordResetToken,
  consumePasswordResetToken,
  canSendVerificationEmail,
  canSendPasswordResetEmail,
} from "@/lib/services/auth-tokens"
import {
  sendEmailVerificationEmail,
  sendPasswordResetEmail,
} from "@/lib/services/email"
import { APP_URL } from "@/lib/brand"
import { generateUsername } from "@/lib/services/user"

// ─── OAuth ────────────────────────────────────────────────────────────────────

export async function handleOAuthSignIn(formData: FormData) {
  const raw = formData.get("provider")
  if (raw === "google") {
    await signIn("google", { redirectTo: "/events" })
    return
  }
  if (raw === "microsoft-entra-id") {
    await signIn("microsoft-entra-id", { redirectTo: "/events" })
    return
  }
  throw new Error("Invalid provider")
}

export async function handleOAuthSignUp(formData: FormData) {
  const raw = formData.get("provider")
  if (raw === "google") {
    await signIn("google", { redirectTo: "/onboarding" })
    return
  }
  if (raw === "microsoft-entra-id") {
    await signIn("microsoft-entra-id", { redirectTo: "/onboarding" })
    return
  }
  throw new Error("Invalid provider")
}

// ─── Magic link ───────────────────────────────────────────────────────────────

export type EmailSignInState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "error"; error: string }

export async function handleEmailSignIn(
  _prevState: EmailSignInState,
  formData: FormData
): Promise<EmailSignInState> {
  const raw = { email: formData.get("email") }
  const parsed = emailSignInSchema.safeParse(raw)

  if (!parsed.success) {
    return {
      status: "error",
      error: parsed.error.issues[0]?.message ?? "Invalid email address",
    }
  }

  try {
    await signIn("nodemailer", {
      email: parsed.data.email,
      redirect: false,
    })
    return { status: "success" }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to send magic link"
    return { status: "error", error: message }
  }
}

// ─── Email + password signup ──────────────────────────────────────────────────

export type SignupState =
  | { status: "idle" }
  | { status: "success"; email: string }
  | { status: "error"; error: string }

export async function signupWithPasswordAction(
  _prevState: SignupState,
  formData: FormData
): Promise<SignupState> {
  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  }
  const parsed = passwordSignUpSchema.safeParse(raw)

  if (!parsed.success) {
    return {
      status: "error",
      error: parsed.error.issues[0]?.message ?? "Invalid input",
    }
  }

  const { name, email, password } = parsed.data

  try {
    const existing = await prisma.user.findUnique({
      where: { email },
      select: { id: true, password: true, emailVerified: true },
    })

    if (existing?.password) {
      return {
        status: "error",
        error: "An account with this email already exists. Please sign in.",
      }
    }

    const hashedPw = await hashPassword(password)

    let userId: string

    if (existing) {
      // OAuth/magic-link user adding a password — link it
      await prisma.user.update({
        where: { id: existing.id },
        data: { name, password: hashedPw },
      })
      userId = existing.id
    } else {
      // Brand new user
      const username = await generateUsername({ name, email })
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPw,
          emailVerified: null,
          onboardingCompleted: false,
          username,
        },
      })
      userId = user.id
    }

    // Only send verification if email is not already verified
    const needsVerify = !existing?.emailVerified
    if (needsVerify) {
      const rawToken = await createEmailVerificationToken(userId)
      const url = `${APP_URL}/verify-email?token=${rawToken}`
      await sendEmailVerificationEmail({ to: email, url, userName: name })
    }

    return { status: "success", email }
  } catch {
    return { status: "error", error: "Something went wrong. Please try again." }
  }
}

// ─── Email + password sign-in ─────────────────────────────────────────────────

export type SignInState =
  | { status: "idle" }
  | { status: "unverified"; email: string }
  | { status: "error"; error: string }

export async function signinWithPasswordAction(
  _prevState: SignInState,
  formData: FormData
): Promise<SignInState> {
  const raw = {
    email: formData.get("email"),
    password: formData.get("password"),
  }
  const parsed = passwordSignInSchema.safeParse(raw)

  if (!parsed.success) {
    return {
      status: "error",
      error: parsed.error.issues[0]?.message ?? "Invalid input",
    }
  }

  // Pre-check: detect unverified email before handing off to NextAuth.
  // NextAuth v5 wraps authorize() errors inside CredentialsSignin, making
  // custom error messages unreliable — so we query the DB directly here.
  try {
    const existing = await prisma.user.findUnique({
      where: { email: parsed.data.email },
      select: { password: true, emailVerified: true },
    })
    if (existing?.password && !existing.emailVerified) {
      return { status: "unverified", email: parsed.data.email }
    }
  } catch {
    // If the pre-check fails, proceed to signIn which will surface the error
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirect: false,
    })
    redirect("/events")
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)

    if (message.includes("NEXT_REDIRECT")) {
      throw err
    }

    return {
      status: "error",
      error: "Invalid email or password.",
    }
  }
}

// ─── Resend verification email ────────────────────────────────────────────────

export type ResendState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "error"; error: string }

export async function resendVerificationAction(
  _prevState: ResendState,
  formData: FormData
): Promise<ResendState> {
  const email = String(formData.get("email") ?? "").trim()
  if (!email) return { status: "error", error: "Email is required." }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true, emailVerified: true },
    })

    if (!user || user.emailVerified) {
      return { status: "success" }
    }

    const canSend = await canSendVerificationEmail(user.id)
    if (!canSend) {
      return {
        status: "error",
        error: "Please wait a moment before requesting another email.",
      }
    }

    const rawToken = await createEmailVerificationToken(user.id)
    const url = `${APP_URL}/verify-email?token=${rawToken}`
    await sendEmailVerificationEmail({
      to: email,
      url,
      userName: user.name ?? email,
    })

    return { status: "success" }
  } catch {
    return { status: "error", error: "Failed to send email. Please try again." }
  }
}

// ─── Verify email (called from /verify-email page) ───────────────────────────

export async function verifyEmailAction(token: string): Promise<void> {
  const userId = await consumeEmailVerificationToken(token)

  if (!userId) {
    // Throw so the page's catch block shows the error UI (returning void
    // would leave the page blank).
    throw new Error("InvalidToken")
  }

  await prisma.user.update({
    where: { id: userId },
    data: { emailVerified: new Date() },
  })

  // Redirect to login — we cannot call signIn() here because this function
  // is invoked during server-component render, not a form-action context.
  // Next.js only allows cookie writes inside Server Actions / Route Handlers,
  // so calling signIn() here would throw "Cookies can only be modified in a
  // Server Action or Route Handler" and show a false "link expired" error.
  redirect("/login?verified=1")
}

// ─── Request password reset ───────────────────────────────────────────────────

export type RequestResetState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "error"; error: string }

export async function requestPasswordResetAction(
  _prevState: RequestResetState,
  formData: FormData
): Promise<RequestResetState> {
  const raw = { email: formData.get("email") }
  const parsed = requestPasswordResetSchema.safeParse(raw)

  if (!parsed.success) {
    return { status: "error", error: "Please enter a valid email address." }
  }

  // Always respond with success to prevent email enumeration
  try {
    const user = await prisma.user.findUnique({
      where: { email: parsed.data.email },
      select: { id: true, name: true, password: true },
    })

    if (user?.password) {
      const canSend = await canSendPasswordResetEmail(user.id)
      if (canSend) {
        const rawToken = await createPasswordResetToken(user.id)
        const url = `${APP_URL}/reset-password?token=${rawToken}`
        await sendPasswordResetEmail({
          to: parsed.data.email,
          url,
          userName: user.name ?? parsed.data.email,
        })
      }
    }
  } catch {
    // Swallow errors — return generic success regardless
  }

  return { status: "success" }
}

// ─── Reset password ───────────────────────────────────────────────────────────

export type ResetPasswordState =
  | { status: "idle" }
  | { status: "error"; error: string }

export async function resetPasswordAction(
  _prevState: ResetPasswordState,
  formData: FormData
): Promise<ResetPasswordState> {
  const raw = {
    token: formData.get("token"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  }
  const parsed = resetPasswordSchema.safeParse(raw)

  if (!parsed.success) {
    return {
      status: "error",
      error: parsed.error.issues[0]?.message ?? "Invalid input",
    }
  }

  const { token, password } = parsed.data

  try {
    const userId = await consumePasswordResetToken(token)
    if (!userId) {
      return {
        status: "error",
        error: "This reset link is invalid or has expired. Please request a new one.",
      }
    }

    const hashedPw = await hashPassword(password)
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPw },
    })

    redirect("/login?reset=1")
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    if (message.includes("NEXT_REDIRECT")) throw err
    return {
      status: "error",
      error: "Something went wrong. Please try again.",
    }
  }
}

// ─── Sign out ─────────────────────────────────────────────────────────────────

export async function handleSignOut() {
  await signOut({ redirectTo: "/login" })
}
