"use client"

import { useActionState } from "react"
import { handleEmailSignIn, type EmailSignInState } from "@/lib/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const initialState: EmailSignInState = { status: "idle" }

export function EmailSignInForm() {
  const [state, formAction, isPending] = useActionState(handleEmailSignIn, initialState)

  if (state.status === "success") {
    return (
      <div className="rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm text-center text-muted-foreground">
        Check your email — we sent a sign-in link. It expires in 10 minutes.
      </div>
    )
  }

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">Email address</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          required
          disabled={isPending}
        />
        {state.status === "error" && (
          <p className="text-xs text-destructive">{state.error}</p>
        )}
      </div>
      <Button type="submit" variant="outline" className="w-full" disabled={isPending}>
        {isPending ? "Sending link…" : "Continue with Email"}
      </Button>
    </form>
  )
}
