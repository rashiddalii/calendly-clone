"use server"

import { signIn, signOut } from "@/lib/auth"
import { emailSignInSchema } from "@/lib/validators/auth"

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
    await signIn("resend", {
      email: parsed.data.email,
      redirect: false,
    })
    return { status: "success" }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to send magic link"
    return { status: "error", error: message }
  }
}

export async function handleSignOut() {
  await signOut({ redirectTo: "/login" })
}
