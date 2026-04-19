"use client"

import { useState } from "react"
import { Check, Link2 } from "lucide-react"

export function BookingCopyLinkButton() {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-full border border-[#9dafc5]/40 bg-white px-5 text-sm font-semibold text-[#1c2b4b] transition-colors hover:bg-[#f0f5ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006bff]/30"
      aria-live="polite"
    >
      {copied ? (
        <Check className="h-4 w-4 text-[#2d8a5e]" aria-hidden="true" />
      ) : (
        <Link2 className="h-4 w-4" aria-hidden="true" />
      )}
      {copied ? "Copied" : "Copy link"}
    </button>
  )
}
