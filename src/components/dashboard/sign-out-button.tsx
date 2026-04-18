"use client"

import { handleSignOut } from "@/lib/actions/auth"
import { LogOut } from "lucide-react"

export function SignOutButton() {
  return (
    <form action={handleSignOut}>
      <button
        type="submit"
        aria-label="Sign out"
        className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors"
        style={{ color: "#5f5e68" }}
        onMouseEnter={(e) => {
          ;(e.currentTarget as HTMLButtonElement).style.backgroundColor = "#e4e1ed"
          ;(e.currentTarget as HTMLButtonElement).style.color = "#32323b"
        }}
        onMouseLeave={(e) => {
          ;(e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"
          ;(e.currentTarget as HTMLButtonElement).style.color = "#5f5e68"
        }}
      >
        <LogOut className="h-4 w-4" />
      </button>
    </form>
  )
}
