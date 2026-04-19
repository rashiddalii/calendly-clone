"use client"

import { useActionState } from "react"
import { Mail } from "lucide-react"
import { Input } from "@/components/ui/input"
import { requestPasswordResetAction, type RequestResetState } from "@/lib/actions/auth"
import { cn } from "@/lib/utils"

const BLUE = "#006BFF"
const BLUE_HOVER = "#0055CC"

const initialState: RequestResetState = { status: "idle" }

export function ForgotPasswordForm() {
  const [state, formAction, isPending] = useActionState(
    requestPasswordResetAction,
    initialState,
  )

  if (state.status === "success") {
    return (
      <div className="flex flex-col items-center gap-4 rounded-[12px] border border-[#E5E7EB] bg-[#F8FBFF] px-6 py-8 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EEF4FF]">
          <Mail className="h-6 w-6" style={{ color: BLUE }} aria-hidden />
        </span>
        <p className="text-[17px] font-semibold text-[#0F172A]">
          Check your email
        </p>
        <p className="text-[15px] leading-relaxed text-[#64748B]">
          If that email is registered, we sent a password reset link. It expires in 1 hour.
        </p>
      </div>
    )
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
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
          "flex h-11 w-full cursor-pointer items-center justify-center rounded-[10px] text-[15px] font-semibold text-white transition-colors disabled:pointer-events-none disabled:opacity-60",
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
        {isPending ? "Sending…" : "Send reset link"}
      </button>
    </form>
  )
}
