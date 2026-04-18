"use client"

import Link from "next/link"
import { useCallback } from "react"
import { toast } from "sonner"
import { handleSignOut } from "@/lib/actions/auth"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  BookOpen,
  ChevronDown,
  ExternalLink,
  HelpCircle,
  Link2,
  LogOut,
  MoreHorizontal,
  Star,
  User,
} from "lucide-react"

interface UserMenuProps {
  name?: string | null
  email?: string | null
  image?: string | null
  username?: string | null
  marketingHref: string
}

function getInitials(name?: string | null, email?: string | null): string {
  if (name) {
    const parts = name.trim().split(" ")
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    }
    return name.slice(0, 2).toUpperCase()
  }
  if (email) return email.slice(0, 2).toUpperCase()
  return "??"
}

export function UserMenu({
  name,
  email,
  image,
  username,
  marketingHref,
}: UserMenuProps) {
  const copyMyLink = useCallback(() => {
    if (!username) {
      toast.error("Set a username in Settings to get a booking link.")
      return
    }
    const url = `${window.location.origin}/${username}`
    void navigator.clipboard.writeText(url)
    toast.success("Your link copied")
  }, [username])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            className="h-auto min-h-10 gap-1 rounded-full px-1 py-0.5 pr-1.5 shadow-none hover:bg-[#F3F4F6] focus-visible:ring-2 focus-visible:ring-[#006BFF]/30 focus-visible:ring-offset-2"
          />
        }
      >
        <Avatar className="h-9 w-9 border border-[#E5E7EB]">
          {image ? (
            <AvatarImage
              src={image}
              alt={name ?? "User avatar"}
              referrerPolicy="no-referrer"
            />
          ) : null}
          <AvatarFallback className="bg-[#F3F4F6] text-sm font-semibold text-[#374151]">
            {getInitials(name, email)}
          </AvatarFallback>
        </Avatar>
        <ChevronDown className="hidden h-4 w-4 text-[#6B7280] sm:block" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        side="bottom"
        sideOffset={8}
        className="w-64 p-1.5"
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel className="px-2 py-2">
            <span className="text-base font-semibold text-[#111827]">
              {name ?? "Account"}
            </span>
            {email && (
              <span className="mt-0.5 block text-xs font-normal text-[#6B7280]">
                {email}
              </span>
            )}
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel className="px-2 py-1 text-[11px] font-medium uppercase tracking-wide text-[#9CA3AF]">
            Account settings
          </DropdownMenuLabel>
          <DropdownMenuItem>
            <Link
              href="/settings"
              className="flex w-full items-center gap-2 text-[#111827] no-underline"
            >
              <User className="h-4 w-4 text-[#6B7280]" />
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link
              href="/settings"
              className="flex w-full items-center gap-2 text-[#111827] no-underline"
            >
              <Star className="h-4 w-4 text-[#6B7280]" />
              Branding
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={copyMyLink}>
            <span className="flex items-center gap-2">
              <Link2 className="h-4 w-4 text-[#6B7280]" />
              My link
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link
              href="/settings"
              className="flex w-full items-center gap-2 text-[#111827] no-underline"
            >
              <MoreHorizontal className="h-4 w-4 text-[#6B7280]" />
              All settings
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel className="px-2 py-1 text-[11px] font-medium uppercase tracking-wide text-[#9CA3AF]">
            Resources
          </DropdownMenuLabel>
          <DropdownMenuItem disabled className="opacity-60">
            <span className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-[#6B7280]" />
              Getting started guide
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem disabled className="opacity-60">
            <span className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-[#6B7280]" />
              Community
            </span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <a
              href={marketingHref}
              target="_blank"
              rel="noreferrer"
              className="flex w-full items-center gap-2 text-[#111827] no-underline"
            >
              <ExternalLink className="h-4 w-4 text-[#6B7280]" />
              Visit site
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem variant="destructive">
            <form action={handleSignOut} className="w-full">
              <button
                type="submit"
                className="flex w-full items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Log out
              </button>
            </form>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
