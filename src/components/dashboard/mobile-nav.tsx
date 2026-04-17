"use client"

import { useState } from "react"
import { Menu, X, CalendarCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog"
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"
import { SidebarNav } from "@/components/dashboard/sidebar-nav"
import { cn } from "@/lib/utils"

export function MobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        className="md:hidden"
        aria-label="Open navigation menu"
      >
        <Menu className="h-5 w-5" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogPortal>
          <DialogOverlay />
          <DialogPrimitive.Popup
            className={cn(
              "fixed inset-y-0 left-0 z-50 flex h-full w-64 flex-col bg-card p-4 shadow-xl ring-1 ring-foreground/10",
              "duration-200 outline-none",
              "data-open:animate-in data-open:slide-in-from-left",
              "data-closed:animate-out data-closed:slide-out-to-left"
            )}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <CalendarCheck className="h-5 w-5 text-primary" />
                <span className="font-semibold text-sm">Calendly Clone</span>
              </div>
              <DialogClose
                render={
                  <Button variant="ghost" size="icon-sm" aria-label="Close menu" />
                }
              >
                <X className="h-4 w-4" />
              </DialogClose>
            </div>
            <DialogTitle className="sr-only">Navigation menu</DialogTitle>
            <SidebarNav onNavigate={() => setOpen(false)} />
          </DialogPrimitive.Popup>
        </DialogPortal>
      </Dialog>
    </>
  )
}
