"use client"

import { useActionState } from "react"
import { handleEmailSignIn, type EmailSignInState } from "@/lib/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

const initialState: EmailSignInState = { status: "idle" }

const marketingBlue = "#006BFF"
const marketingBlueHover = "#0055CC"

type EmailSignInFormProps = {
  variant?: "default" | "marketing"
}

export function EmailSignInForm({ variant = "default" }: EmailSignInFormProps) {
  const [state, formAction, isPending] = useActionState(handleEmailSignIn, initialState)
  const isMarketing = variant === "marketing"

  if (state.status === "success") {
    return (
      <div
        className={cn(
          "rounded-[10px] border px-4 py-3 text-sm text-center",
          isMarketing
            ? "border-[#E5E7EB] bg-[#F8F9FB] text-[#64748B]"
            : "border-border bg-muted/40 text-muted-foreground"
        )}
      >
        Check your email. We sent a sign-in link that expires in 10 minutes.
      </div>
    )
  }

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        {!isMarketing && <Label htmlFor="email">Email address</Label>}
        <Input
          id="email"
          name="email"
          type="email"
          placeholder={isMarketing ? "Enter your email" : "you@example.com"}
          autoComplete="email"
          required
          disabled={isPending}
          className={cn(
            isMarketing &&
              "h-11 rounded-[10px] border-[#E5E7EB] bg-white text-[15px] text-[#0F172A] shadow-none placeholder:text-[#94A3B8] focus-visible:border-[#006BFF] focus-visible:ring-[#006BFF]/25"
          )}
        />
        {state.status === "error" && (
          <p className="text-xs text-destructive">{state.error}</p>
        )}
      </div>
      {isMarketing ? (
        <button
          type="submit"
          disabled={isPending}
          className="flex h-11 w-full cursor-pointer items-center justify-center rounded-[10px] text-[15px] font-semibold text-white transition-colors disabled:pointer-events-none disabled:opacity-60"
          style={{ backgroundColor: marketingBlue }}
          onMouseEnter={(e) => {
            if (!isPending) (e.currentTarget as HTMLButtonElement).style.backgroundColor = marketingBlueHover
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = marketingBlue
          }}
        >
          {isPending ? "Sending…" : "Continue with email"}
        </button>
      ) : (
        <Button type="submit" variant="outline" className="w-full" disabled={isPending}>
          {isPending ? "Sending link…" : "Continue with Email"}
        </Button>
      )}
    </form>
  )
}
