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
        style={{ color: "#4b5a6d" }}
        onMouseEnter={(e) => {
          ;(e.currentTarget as HTMLButtonElement).style.backgroundColor = "#d0deff"
          ;(e.currentTarget as HTMLButtonElement).style.color = "#1c2b4b"
        }}
        onMouseLeave={(e) => {
          ;(e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"
          ;(e.currentTarget as HTMLButtonElement).style.color = "#4b5a6d"
        }}
      >
        <LogOut className="h-4 w-4" />
      </button>
    </form>
  )
}
