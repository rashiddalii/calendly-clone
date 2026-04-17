"use client"

import Link from "next/link"
import { useState, useTransition } from "react"
import { Copy, Pencil, Trash2, Check } from "lucide-react"
import { toast } from "sonner"
import type { EventType } from "@/generated/prisma/client"
import {
  deleteEventTypeAction,
  toggleEventTypeActiveAction,
} from "@/lib/actions/event-type"

export function EventTypeCard({
  eventType,
  username,
}: {
  eventType: EventType
  username: string | null
}) {
  const [isPending, startTransition] = useTransition()
  const [copied, setCopied] = useState(false)

  const bookingUrl =
    typeof window !== "undefined" && username
      ? `${window.location.origin}/${username}/${eventType.slug}`
      : username
        ? `/${username}/${eventType.slug}`
        : ""

  const handleCopy = async () => {
    if (!username) {
      toast.error("Set a username in Settings before sharing.")
      return
    }
    await navigator.clipboard.writeText(bookingUrl)
    setCopied(true)
    toast.success("Booking link copied")
    setTimeout(() => setCopied(false), 1600)
  }

  const handleToggle = () => {
    startTransition(async () => {
      await toggleEventTypeActiveAction(eventType.id)
    })
  }

  const handleDelete = () => {
    if (!confirm(`Delete "${eventType.title}"? This can't be undone.`)) return
    startTransition(async () => {
      await deleteEventTypeAction(eventType.id)
      toast.success("Event type deleted")
    })
  }

  return (
    <article className="hover-lift group relative flex flex-col gap-4 rounded-xl bg-surface-lowest p-6">
      <div className="flex items-start gap-3">
        <span
          aria-hidden
          className="mt-1 h-3 w-3 shrink-0 rounded-full"
          style={{ background: eventType.color }}
        />
        <div className="min-w-0 flex-1">
          <h3 className="font-heading text-lg font-semibold leading-tight text-on-surface">
            {eventType.title}
          </h3>
          <p className="mt-1 text-xs text-on-surface-variant">
            /{eventType.slug} · {eventType.duration} min
          </p>
        </div>
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
            eventType.isActive
              ? "bg-secondary-container text-[color:var(--on-secondary-container)]"
              : "bg-surface-container text-on-surface-variant"
          }`}
        >
          {eventType.isActive ? "Active" : "Paused"}
        </span>
      </div>

      {eventType.description && (
        <p className="line-clamp-2 text-sm text-on-surface-variant">
          {eventType.description}
        </p>
      )}

      <div className="mt-auto flex items-center justify-between gap-2 pt-2">
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 rounded-md bg-surface-low px-3 py-1.5 text-xs font-medium text-on-surface transition-colors hover:bg-surface-container"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              Copy link
            </>
          )}
        </button>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleToggle}
            disabled={isPending}
            className="rounded-md px-2 py-1.5 text-xs font-medium text-on-surface-variant transition-colors hover:bg-surface-low hover:text-on-surface disabled:opacity-50"
          >
            {eventType.isActive ? "Pause" : "Activate"}
          </button>
          <Link
            href={`/events/${eventType.id}/edit`}
            aria-label={`Edit ${eventType.title}`}
            className="rounded-md p-1.5 text-on-surface-variant transition-colors hover:bg-surface-low hover:text-on-surface"
          >
            <Pencil className="h-3.5 w-3.5" />
          </Link>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isPending}
            aria-label={`Delete ${eventType.title}`}
            className="rounded-md p-1.5 text-on-surface-variant transition-colors hover:bg-[color:var(--error)]/10 hover:text-[color:var(--error)] disabled:opacity-50"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </article>
  )
}
