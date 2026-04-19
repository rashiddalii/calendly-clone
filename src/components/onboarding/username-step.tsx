"use client"

import { useState, useTransition } from "react"
import { saveOnboardingUsernameAction } from "@/lib/actions/onboarding"
import { ArrowRight } from "lucide-react"

interface UsernameStepProps {
  defaultUsername: string
  appUrl: string
}

export function UsernameStep({ defaultUsername, appUrl }: UsernameStepProps) {
  const [value, setValue] = useState(defaultUsername)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      const result = await saveOnboardingUsernameAction(value)
      if (result && result.status === "error") setError(result.error)
    })
  }

  const preview = value.trim().toLowerCase() || "yourname"

  return (
    <div className="rounded-2xl p-8" style={{ backgroundColor: "#ffffff" }}>
      <h1
        className="mb-2 text-3xl font-semibold"
        style={{ color: "#1c2b4b", fontFamily: "var(--font-heading)" }}
      >
        Pick your username
      </h1>
      <p className="mb-8 text-base" style={{ color: "#4b5a6d" }}>
        This becomes your personal booking link. Choose something memorable.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* URL preview */}
        <div className="rounded-xl px-4 py-3" style={{ backgroundColor: "#f0f5ff" }}>
          <p className="mb-1 text-xs font-medium" style={{ color: "#4b5a6d" }}>
            Your booking link will be
          </p>
          <p className="text-sm font-medium break-all" style={{ color: "#006bff" }}>
            {appUrl}/
            <span style={{ fontWeight: 700 }}>{preview}</span>
          </p>
        </div>

        {/* Input */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="username"
            className="text-xs font-medium"
            style={{ color: "#4b5a6d" }}
          >
            Username
          </label>
          <div className="relative flex items-center">
            <span
              className="absolute left-3 text-sm pointer-events-none select-none"
              style={{ color: "#4b5a6d" }}
            >
              {appUrl.replace(/^https?:\/\//, "")}/
            </span>
            <input
              id="username"
              type="text"
              value={value}
              onChange={(e) => {
                setValue(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))
                setError(null)
              }}
              minLength={3}
              maxLength={32}
              required
              placeholder="yourname"
              className="w-full rounded-[0.75rem] py-2.5 pr-3 text-sm outline-none transition-all"
              style={{
                backgroundColor: error ? "#fff7f7" : "#dae6ff",
                color: "#1c2b4b",
                paddingLeft: `calc(0.75rem + ${(appUrl.replace(/^https?:\/\//, "").length + 1) * 0.52}rem)`,
                ...(error ? { boxShadow: "0 0 0 2px rgba(168,54,75,0.4)" } : {}),
              }}
            />
          </div>
          {error ? (
            <p className="text-xs" style={{ color: "#a8364b" }}>
              {error}
            </p>
          ) : (
            <p className="text-xs" style={{ color: "#6b7d94" }}>
              3–32 characters: letters, numbers, hyphens only
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isPending || value.length < 3}
          className="flex items-center justify-center gap-2 rounded-xl h-11 text-sm font-medium transition-opacity disabled:opacity-50"
          style={{
            background: "linear-gradient(135deg, #006bff, #4d94ff)",
            color: "#ffffff",
          }}
        >
          {isPending ? "Saving…" : "Continue"}
          {!isPending && <ArrowRight className="h-4 w-4" />}
        </button>
      </form>
    </div>
  )
}
