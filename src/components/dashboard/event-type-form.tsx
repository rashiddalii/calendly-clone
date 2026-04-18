"use client"

import { useActionState, useId, useState } from "react"
import Link from "next/link"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  createEventTypeAction,
  updateEventTypeAction,
  type FormState,
} from "@/lib/actions/event-type"

type InitialValues = {
  id?: string
  title?: string
  slug?: string
  description?: string | null
  duration?: number
  color?: string
  bufferBefore?: number
  bufferAfter?: number
  minNotice?: number
  maxDaysInFuture?: number
  isActive?: boolean
}

const initialState: FormState = { status: "idle" }

const PRESET_COLORS = [
  "#006BFF",
  "#6366f1",
  "#745479",
  "#a8364b",
  "#2f7d5b",
  "#d98020",
]

export function EventTypeForm({
  mode,
  initial = {},
}: {
  mode: "create" | "edit"
  initial?: InitialValues
}) {
  const id = useId()
  const [color, setColor] = useState(initial.color ?? "#006BFF")

  const action =
    mode === "create"
      ? createEventTypeAction
      : updateEventTypeAction.bind(null, initial.id!)

  const [state, formAction, isPending] = useActionState(action, initialState)
  const errors = state.status === "error" ? state.fieldErrors ?? {} : {}

  return (
    <form action={formAction} className="flex flex-col gap-8">
      {/* Banner for top-level errors */}
      {state.status === "error" && !Object.keys(errors).length && (
        <div className="rounded-md bg-error/10 px-4 py-3 text-sm text-[color:var(--error)]">
          {state.error}
        </div>
      )}

      {/* Main details */}
      <section className="flex flex-col gap-6 rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-2">
          <Label htmlFor={`${id}-title`} className="text-on-surface-variant">
            Title
          </Label>
          <Input
            id={`${id}-title`}
            name="title"
            defaultValue={initial.title ?? ""}
            placeholder="30 minute meeting"
            aria-invalid={!!errors.title}
            required
          />
          {errors.title && (
            <p className="text-xs text-[color:var(--error)]">{errors.title}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor={`${id}-slug`} className="text-on-surface-variant">
            URL slug
          </Label>
          <div className="flex items-center gap-2">
            <span className="text-sm text-on-surface-variant">fluid.app/you/</span>
            <Input
              id={`${id}-slug`}
              name="slug"
              defaultValue={initial.slug ?? ""}
              placeholder="30min"
              aria-invalid={!!errors.slug}
              pattern="[a-z0-9](?:[a-z0-9-]*[a-z0-9])?"
              required
            />
          </div>
          {errors.slug && (
            <p className="text-xs text-[color:var(--error)]">{errors.slug}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label
            htmlFor={`${id}-description`}
            className="text-on-surface-variant"
          >
            Description <span className="text-xs">(optional)</span>
          </Label>
          <textarea
            id={`${id}-description`}
            name="description"
            defaultValue={initial.description ?? ""}
            rows={3}
            maxLength={2000}
            placeholder="What should invitees know about this meeting?"
            className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label
              htmlFor={`${id}-duration`}
              className="text-on-surface-variant"
            >
              Duration (minutes)
            </Label>
            <Input
              id={`${id}-duration`}
              name="duration"
              type="number"
              min={5}
              max={480}
              step={5}
              defaultValue={initial.duration ?? 30}
              aria-invalid={!!errors.duration}
              required
            />
            {errors.duration && (
              <p className="text-xs text-[color:var(--error)]">
                {errors.duration}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-on-surface-variant">Color</Label>
            <div className="flex items-center gap-2">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  aria-label={`Pick ${c}`}
                  className={`h-8 w-8 rounded-full transition-transform hover:scale-110 ${
                    color === c ? "ring-2 ring-[#006BFF] ring-offset-2 ring-offset-white" : ""
                  }`}
                  style={{ background: c }}
                />
              ))}
              <input type="hidden" name="color" value={color} />
            </div>
          </div>
        </div>
      </section>

      {/* Scheduling rules */}
      <section className="flex flex-col gap-6 rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
        <div>
          <h2 className="text-lg font-semibold text-[#111827]">Scheduling rules</h2>
          <p className="text-sm text-[#6B7280]">
            Control how and when people can book.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label
              htmlFor={`${id}-bufferBefore`}
              className="text-on-surface-variant"
            >
              Buffer before (minutes)
            </Label>
            <Input
              id={`${id}-bufferBefore`}
              name="bufferBefore"
              type="number"
              min={0}
              max={240}
              step={5}
              defaultValue={initial.bufferBefore ?? 0}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label
              htmlFor={`${id}-bufferAfter`}
              className="text-on-surface-variant"
            >
              Buffer after (minutes)
            </Label>
            <Input
              id={`${id}-bufferAfter`}
              name="bufferAfter"
              type="number"
              min={0}
              max={240}
              step={5}
              defaultValue={initial.bufferAfter ?? 0}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label
              htmlFor={`${id}-minNotice`}
              className="text-on-surface-variant"
            >
              Minimum notice (minutes)
            </Label>
            <Input
              id={`${id}-minNotice`}
              name="minNotice"
              type="number"
              min={0}
              max={10080}
              step={15}
              defaultValue={initial.minNotice ?? 240}
            />
            <p className="text-xs text-on-surface-variant">
              Invitees can&apos;t book within this many minutes of the start time.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Label
              htmlFor={`${id}-maxDaysInFuture`}
              className="text-on-surface-variant"
            >
              Max days in future
            </Label>
            <Input
              id={`${id}-maxDaysInFuture`}
              name="maxDaysInFuture"
              type="number"
              min={1}
              max={365}
              defaultValue={initial.maxDaysInFuture ?? 60}
            />
          </div>
        </div>

        <label className="flex items-center gap-3 text-sm text-on-surface">
          <input
            type="checkbox"
            name="isActive"
            defaultChecked={initial.isActive ?? true}
            className="h-4 w-4 rounded accent-[#006BFF]"
          />
          Active — the booking link is publicly reachable
        </label>
      </section>

      <div className="flex items-center justify-end gap-3">
        <Link
          href="/events"
          className={cn(buttonVariants({ variant: "ghost", size: "lg" }))}
        >
          Cancel
        </Link>
        <Button
          type="submit"
          disabled={isPending}
          className="h-10 bg-[#006BFF] px-6 text-base font-semibold text-white hover:bg-[#005FDB]"
        >
          {isPending
            ? mode === "create"
              ? "Creating…"
              : "Saving…"
            : mode === "create"
              ? "Create event type"
              : "Save changes"}
        </Button>
      </div>
    </form>
  )
}
