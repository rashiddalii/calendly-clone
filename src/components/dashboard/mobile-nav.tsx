"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X } from "lucide-react"
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
import { CreateEventMenu } from "@/components/dashboard/create-event-menu"
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
        <Menu className="h-5 w-5 text-[#374151]" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogPortal>
          <DialogOverlay />
          <DialogPrimitive.Popup
            className={cn(
              "fixed inset-y-0 left-0 z-50 flex h-full w-[min(100vw-3rem,280px)] flex-col border-r border-[#E5E7EB] bg-white p-4 shadow-xl",
              "duration-200 outline-none",
              "data-open:animate-in data-open:slide-in-from-left",
              "data-closed:animate-out data-closed:slide-out-to-left",
            )}
          >
            <div className="mb-4 flex items-center justify-between gap-2">
              <Link
                href="/events"
                className="flex min-w-0 items-center gap-2"
                onClick={() => setOpen(false)}
              >
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg"
                  style={{ backgroundColor: "#1e3461" }}
                >
                  <Image
                    src="/logo-fluid-icon.svg"
                    alt=""
                    width={24}
                    height={24}
                    className="h-6 w-6 object-contain"
                  />
                </div>
                <span
                  className="truncate font-semibold text-[#111827]"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Fluid
                </span>
              </Link>
              <DialogClose
                render={
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Close menu"
                  />
                }
              >
                <X className="h-4 w-4" />
              </DialogClose>
            </div>
            <div className="mb-3">
              <CreateEventMenu variant="sidebar" />
            </div>
            <DialogTitle className="sr-only">Navigation menu</DialogTitle>
            <div className="flex-1 overflow-y-auto">
              <SidebarNav onNavigate={() => setOpen(false)} />
            </div>
          </DialogPrimitive.Popup>
        </DialogPortal>
      </Dialog>
    </>
  )
}
