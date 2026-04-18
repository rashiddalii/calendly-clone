"use client"

import { Mail } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export function InviteTeamDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton
        className="max-w-[calc(100%-2rem)] gap-0 p-0 sm:max-w-lg"
      >
        <div className="border-b border-[#E5E7EB] px-6 py-4">
          <DialogTitle className="text-lg font-semibold text-[#111827]">
            Invite team members
          </DialogTitle>
          <p className="mt-1 text-sm text-[#6B7280]">
            You can invite collaborators once team scheduling is enabled.
          </p>
        </div>
        <div className="space-y-4 px-6 py-4">
          <div
            className="rounded-lg border border-[#BFDBFE] px-4 py-3"
            style={{ backgroundColor: "#EBF5FF" }}
          >
            <p className="text-sm font-semibold text-[#111827]">
              Empower you and your team with seamless scheduling
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-[#374151]">
              <li>Shared event types and booking links</li>
              <li>Team availability and routing</li>
              <li>Centralized meetings and reporting</li>
            </ul>
          </div>
          <div>
            <label className="sr-only" htmlFor="invite-emails">
              Email addresses
            </label>
            <input
              id="invite-emails"
              readOnly
              placeholder="Enter emails, separated by a comma"
              className="w-full rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] px-3 py-2.5 text-sm text-[#6B7280] outline-none"
            />
          </div>
        </div>
        <div className="flex justify-end border-t border-[#E5E7EB] px-6 py-4">
          <Button
            type="button"
            variant="outline"
            disabled
            className="pointer-events-none gap-2 border-[#BFDBFE] text-[#93C5FD]"
          >
            <Mail className="h-4 w-4" />
            Send invite
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
