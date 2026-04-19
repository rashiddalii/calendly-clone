"use client"

import { useActionState } from "react"
import Link from "next/link"
import { Mail } from "lucide-react"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"
import {
  signinWithPasswordAction,
  resendVerificationAction,
  type SignInState,
  type ResendState,
} from "@/lib/actions/auth"
import { cn } from "@/lib/utils"

const BLUE = "#006BFF"
const BLUE_HOVER = "#0055CC"

const initialSignIn: SignInState = { status: "idle" }
const initialResend: ResendState = { status: "idle" }

export function PasswordSignInForm() {
  const [state, formAction, isPending] = useActionState(
    signinWithPasswordAction,
    initialSignIn,
  )
  const [resendState, resendAction, resendPending] = useActionState(
    resendVerificationAction,
    initialResend,
  )

  if (state.status === "unverified") {
    return (
      <div className="flex flex-col gap-4">
        <div
          role="alert"
          className="rounded-[12px] border border-amber-200 bg-amber-50 px-4 py-4"
        >
          <div className="flex gap-3">
            <Mail className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" aria-hidden />
            <div>
              <p className="text-[15px] font-semibold text-amber-900">
                Please verify your email first
              </p>
              <p className="mt-1 text-[13px] text-amber-700">
                We sent a verification link to{" "}
                <span className="font-medium">{state.email}</span>. Check your
                inbox and click the link to activate your account.
              </p>
            </div>
          </div>
        </div>

        {resendState.status === "success" ? (
          <p className="text-center text-[13px] text-[#64748B]">
            Verification email sent. Check your inbox.
          </p>
        ) : (
          <form action={resendAction} className="flex flex-col gap-2">
            <input type="hidden" name="email" value={state.email} />
            {resendState.status === "error" && (
              <p className="text-center text-[13px] text-red-600">
                {resendState.error}
              </p>
            )}
            <button
              type="submit"
              disabled={resendPending}
              className="cursor-pointer text-center text-[14px] font-semibold disabled:pointer-events-none disabled:opacity-60"
              style={{ color: BLUE }}
            >
              {resendPending ? "Sending…" : "Resend verification email"}
            </button>
          </form>
        )}
      </div>
    )
  }

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <Input
          name="email"
          type="email"
          placeholder="Email address"
          autoComplete="email"
          required
          disabled={isPending}
          className="h-11 rounded-[10px] border-[#E5E7EB] bg-white text-[15px] text-[#0F172A] shadow-none placeholder:text-[#94A3B8] focus-visible:border-[#006BFF] focus-visible:ring-[#006BFF]/25"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <PasswordInput
          name="password"
          placeholder="Password"
          autoComplete="current-password"
          required
          disabled={isPending}
          className="h-11 rounded-[10px] border-[#E5E7EB] bg-white text-[15px] text-[#0F172A] shadow-none placeholder:text-[#94A3B8] focus-visible:border-[#006BFF] focus-visible:ring-[#006BFF]/25"
        />
      </div>

      {state.status === "error" && (
        <div
          role="alert"
          className="rounded-[10px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          {state.error}
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className={cn(
          "mt-1 flex h-11 w-full cursor-pointer items-center justify-center rounded-[10px] text-[15px] font-semibold text-white transition-colors disabled:pointer-events-none disabled:opacity-60",
        )}
        style={{ backgroundColor: BLUE }}
        onMouseEnter={(e) => {
          if (!isPending)
            (e.currentTarget as HTMLButtonElement).style.backgroundColor =
              BLUE_HOVER
        }}
        onMouseLeave={(e) => {
          ;(e.currentTarget as HTMLButtonElement).style.backgroundColor = BLUE
        }}
      >
        {isPending ? "Signing in…" : "Sign in"}
      </button>

      <div className="text-center">
        <Link
          href="/forgot-password"
          className="text-[13px] font-medium no-underline hover:underline"
          style={{ color: BLUE }}
        >
          Forgot password?
        </Link>
      </div>
    </form>
  )
}
