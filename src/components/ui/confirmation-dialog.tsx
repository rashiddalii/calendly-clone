"use client"

import { Loader2, TriangleAlert } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

type ConfirmationDialogVariant = "destructive" | "primary"

interface ConfirmationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmLabel: string
  cancelLabel?: string
  isPending?: boolean
  variant?: ConfirmationDialogVariant
  onConfirm: () => void
}

export function ConfirmationDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  cancelLabel = "Keep it",
  isPending = false,
  variant = "destructive",
  onConfirm,
}: ConfirmationDialogProps) {
  const isDestructive = variant === "destructive"

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!isPending) onOpenChange(nextOpen)
      }}
    >
      <DialogContent
        showCloseButton={!isPending}
        className="max-w-[calc(100%-2rem)] gap-0 overflow-hidden rounded-2xl bg-white/80 p-0 text-[#1c2b4b] shadow-[0_12px_40px_rgba(28,43,75,0.06)] ring-1 ring-[#9dafc5]/15 backdrop-blur-2xl sm:max-w-md"
      >
        <div className="px-6 pb-5 pt-6">
          <div
            className={cn(
              "mb-5 flex size-12 items-center justify-center rounded-full",
              isDestructive
                ? "bg-[#f97386]/15 text-[#a8364b]"
                : "bg-[#d9e8ff] text-[#006bff]"
            )}
          >
            <TriangleAlert className="size-5" />
          </div>
          <DialogTitle className="font-heading text-xl font-semibold leading-tight text-[#1c2b4b]">
            {title}
          </DialogTitle>
          <DialogDescription className="mt-3 text-sm leading-6 text-[#4b5a6d]">
            {description}
          </DialogDescription>
        </div>

        <div className="flex flex-col-reverse gap-3 bg-[#f0f5ff]/70 px-6 py-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            disabled={isPending}
            onClick={() => onOpenChange(false)}
            className="inline-flex h-10 cursor-pointer items-center justify-center rounded-xl px-4 text-sm font-semibold text-[#1c2b4b] transition-colors hover:bg-white/80 disabled:pointer-events-none disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={onConfirm}
            className={cn(
              "inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold text-white transition-all disabled:pointer-events-none disabled:opacity-70",
              isDestructive
                ? "bg-[#a8364b] hover:bg-[#902b3e]"
                : "bg-[linear-gradient(135deg,#006bff,#4d94ff)] hover:brightness-95"
            )}
          >
            {isPending && <Loader2 className="size-4 animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
