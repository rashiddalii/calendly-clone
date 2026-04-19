"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { updateUsernameAction } from "@/lib/actions/user"

interface MyLinkFormProps {
  username: string
}

export function MyLinkForm({ username: initialUsername }: MyLinkFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [username, setUsername] = useState(initialUsername)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const appUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_APP_URL ?? "https://fluid.app"

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!username.trim() || username.trim().length < 3) {
      setError("Username must be at least 3 characters.")
      return
    }
    setError(null)
    setSuccess(false)

    startTransition(async () => {
      const result = await updateUsernameAction(username.trim())
      if (result.status === "error") {
        setError(result.fieldErrors?.username ?? result.error)
      } else {
        setSuccess(true)
        router.refresh()
      }
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm text-[#6B7280]">
        Changing your link will mean that all of your copied links will no longer work and will need to be updated.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center overflow-hidden rounded-lg border border-[#E5E7EB] bg-white focus-within:border-[#006BFF] focus-within:ring-2 focus-within:ring-[rgba(0,107,255,0.2)]">
            <span className="select-none border-r border-[#E5E7EB] bg-[#F9FAFB] px-3 py-2.5 text-sm text-[#6B7280] whitespace-nowrap">
              {appUrl.replace(/^https?:\/\//, "")}/
            </span>
            <input
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))
                setError(null)
                setSuccess(false)
              }}
              minLength={3}
              maxLength={32}
              placeholder="yourname"
              className="flex-1 bg-transparent px-3 py-2.5 text-sm text-[#1c2b4b] outline-none placeholder:text-[#9CA3AF]"
            />
          </div>
          {error && <p className="text-xs text-[#a8364b]">{error}</p>}
        </div>

        {success && (
          <p className="rounded-lg bg-[rgba(0,107,255,0.08)] px-3 py-2.5 text-sm text-[#006BFF]">
            Your link has been updated.
          </p>
        )}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={isPending}
            className="cursor-pointer rounded-lg bg-[#006BFF] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#0056CC] disabled:opacity-60"
          >
            {isPending ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  )
}
