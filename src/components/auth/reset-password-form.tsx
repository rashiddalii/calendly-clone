"use client"

import { useActionState } from "react"
import Link from "next/link"
import { PasswordInput } from "@/components/ui/password-input"
import { resetPasswordAction, type ResetPasswordState } from "@/lib/actions/auth"
import { cn } from "@/lib/utils"

const BLUE = "#006BFF"
const BLUE_HOVER = "#0055CC"

const initialState: ResetPasswordState = { status: "idle" }

interface ResetPasswordFormProps {
  token: string
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [state, formAction, isPending] = useActionState(
    resetPasswordAction,
    initialState,
  )

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <input type="hidden" name="token" value={token} />

      <div className="flex flex-col gap-1.5">
        <PasswordInput
          name="password"
          placeholder="New password (8+ chars, letter + number)"
          autoComplete="new-password"
          required
          disabled={isPending}
          className="h-11 rounded-[10px] border-[#E5E7EB] bg-white text-[15px] text-[#0F172A] shadow-none placeholder:text-[#94A3B8] focus-visible:border-[#006BFF] focus-visible:ring-[#006BFF]/25"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <PasswordInput
          name="confirmPassword"
          placeholder="Confirm new password"
          autoComplete="new-password"
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
          {state.error}{" "}
          {state.error.toLowerCase().includes("expired") && (
            <Link
              href="/forgot-password"
              className="font-medium underline"
              style={{ color: "#991B1B" }}
            >
              Request a new link
            </Link>
          )}
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
        {isPending ? "Resetting…" : "Reset password"}
      </button>
    </form>
  )
}
