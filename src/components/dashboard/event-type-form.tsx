"use client"

import { useActionState, useId, useState } from "react"
import Link from "next/link"
import { ChevronDown, Globe, Lock, MapPin, Phone } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  createEventTypeAction,
  updateEventTypeAction,
  type FormState,
} from "@/lib/actions/event-type"
import { LOCATION_VALUES, type LocationValue } from "@/lib/validators/event-type"
import { GoogleMeetIcon, TeamsIcon, ZoomIcon } from "@/components/icons/brand"

type SchedulingPreset = {
  id: string
  label: string
  tagline: string
  recommended?: boolean
  values: { bufferBefore: number; bufferAfter: number; minNotice: number; maxDaysInFuture: number }
  pills: string[]
}

const SCHEDULING_PRESETS: SchedulingPreset[] = [
  {
    id: "relaxed",
    label: "Relaxed",
    tagline: "No buffers, book anytime",
    values: { bufferBefore: 0, bufferAfter: 0, minNotice: 0, maxDaysInFuture: 90 },
    pills: ["No prep time", "Book anytime", "Up to 3 months"],
  },
  {
    id: "standard",
    label: "Standard",
    tagline: "Balanced for most meetings",
    recommended: true,
    values: { bufferBefore: 10, bufferAfter: 10, minNotice: 240, maxDaysInFuture: 60 },
    pills: ["10 min buffer", "4 hrs notice", "Up to 2 months"],
  },
  {
    id: "strict",
    label: "Strict",
    tagline: "Protect your focus time",
    values: { bufferBefore: 15, bufferAfter: 15, minNotice: 1440, maxDaysInFuture: 30 },
    pills: ["15 min buffer", "24 hrs notice", "Up to 1 month"],
  },
]

function minutesToHuman(minutes: number): string {
  if (minutes === 0) return "None"
  if (minutes < 60) return `${minutes} min`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m === 0 ? `${h} hr${h > 1 ? "s" : ""}` : `${h} hr ${m} min`
}

// Rich icon badges for non-platform options
function PhoneRichIcon() {
  return (
    <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#D1FAE5]">
      <Phone className="h-4 w-4 text-[#059669]" aria-hidden />
    </span>
  )
}

function InPersonRichIcon() {
  return (
    <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#FEF3C7]">
      <MapPin className="h-4 w-4 text-[#D97706]" aria-hidden />
    </span>
  )
}

function CustomLinkRichIcon() {
  return (
    <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#EDE9FE]">
      <Globe className="h-4 w-4 text-[#7C3AED]" aria-hidden />
    </span>
  )
}

const LOCATION_OPTIONS: {
  value: LocationValue
  label: string
  sublabel: string
  icon: React.ReactNode
}[] = [
  { value: "google_meet", label: "Google Meet",      sublabel: "Auto-generated link",   icon: <GoogleMeetIcon className="h-8 w-8 shrink-0" /> },
  { value: "zoom",        label: "Zoom",             sublabel: "Auto-generated link",   icon: <ZoomIcon className="h-8 w-8 shrink-0" /> },
  { value: "teams",       label: "Microsoft Teams",  sublabel: "Auto-generated link",   icon: <TeamsIcon className="h-8 w-8 shrink-0" /> },
  { value: "phone",       label: "Phone call",       sublabel: "Invitee provides number", icon: <PhoneRichIcon /> },
  { value: "in_person",   label: "In person",        sublabel: "Provide address",       icon: <InPersonRichIcon /> },
  { value: "other",       label: "Custom link",      sublabel: "Paste any meeting URL", icon: <CustomLinkRichIcon /> },
]

type InitialValues = {
  id?: string
  title?: string
  slug?: string
  description?: string | null
  duration?: number
  color?: string
  location?: string
  locationAddress?: string | null
  bufferBefore?: number
  bufferAfter?: number
  minNotice?: number
  maxDaysInFuture?: number
  isActive?: boolean
}

type ConnectedLocations = {
  googleMeet: boolean
  zoom: boolean
  teams: boolean
}

const LOCATION_INTEGRATION_REQUIRED: Partial<Record<LocationValue, {
  connectKey: keyof ConnectedLocations
  integrationName: string
  provider: string
  inProgress?: boolean
}>> = {
  google_meet: { connectKey: "googleMeet", integrationName: "Google Calendar", provider: "google-calendar" },
  zoom: { connectKey: "zoom", integrationName: "Zoom", provider: "zoom" },
  teams: { connectKey: "teams", integrationName: "Microsoft Teams", provider: "teams", inProgress: true },
}

const initialState: FormState = { status: "idle" }

const PRESET_COLORS = [
  "#006BFF",
  "#006bff",
  "#2d8a5e",
  "#a8364b",
  "#2f7d5b",
  "#d98020",
]

export function EventTypeForm({
  mode,
  initial = {},
  connectedLocations = { googleMeet: true, zoom: false, teams: false },
}: {
  mode: "create" | "edit"
  initial?: InitialValues
  connectedLocations?: ConnectedLocations
}) {
  const id = useId()
  const [color, setColor] = useState(initial.color ?? "#006BFF")
  const rawLocation = (initial.location ?? "google_meet") as LocationValue
  const [location, setLocation] = useState<LocationValue>(
    LOCATION_VALUES.includes(rawLocation) ? rawLocation : "google_meet"
  )
  const [blockedLocation, setBlockedLocation] = useState<LocationValue | null>(null)

  const [bufferBefore, setBufferBefore] = useState(initial.bufferBefore ?? 10)
  const [bufferAfter, setBufferAfter] = useState(initial.bufferAfter ?? 10)
  const [minNotice, setMinNotice] = useState(initial.minNotice ?? 240)
  const [maxDaysInFuture, setMaxDaysInFuture] = useState(initial.maxDaysInFuture ?? 60)
  const [selectedPreset, setSelectedPreset] = useState<string | null>(() => {
    const preset = SCHEDULING_PRESETS.find(
      (p) =>
        p.values.bufferBefore === (initial.bufferBefore ?? 10) &&
        p.values.bufferAfter === (initial.bufferAfter ?? 10) &&
        p.values.minNotice === (initial.minNotice ?? 240) &&
        p.values.maxDaysInFuture === (initial.maxDaysInFuture ?? 60)
    )
    return preset?.id ?? null
  })
  const [showAdvanced, setShowAdvanced] = useState(false)

  function applyPreset(preset: SchedulingPreset) {
    setSelectedPreset(preset.id)
    setBufferBefore(preset.values.bufferBefore)
    setBufferAfter(preset.values.bufferAfter)
    setMinNotice(preset.values.minNotice)
    setMaxDaysInFuture(preset.values.maxDaysInFuture)
  }

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
                  className={`h-8 w-8 cursor-pointer rounded-full transition-transform hover:scale-110 ${
                    color === c ? "ring-2 ring-[#006BFF] ring-offset-2 ring-offset-white" : ""
                  }`}
                  style={{ background: c }}
                />
              ))}
              <input type="hidden" name="color" value={color} />
            </div>
          </div>
        </div>

        {/* Location picker */}
        <div className="flex flex-col gap-2">
          <Label className="text-on-surface-variant">Location</Label>
          <input type="hidden" name="location" value={location} />
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {LOCATION_OPTIONS.map((opt) => {
              const selected = location === opt.value
              const integration = LOCATION_INTEGRATION_REQUIRED[opt.value]
              const isLocked = integration
                ? !connectedLocations[integration.connectKey]
                : false

              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    if (isLocked) {
                      setBlockedLocation(opt.value)
                    } else {
                      setLocation(opt.value)
                      setBlockedLocation(null)
                    }
                  }}
                  className={cn(
                    "relative flex cursor-pointer items-center gap-2.5 rounded-lg border-2 px-3 py-2.5 text-left transition-all",
                    selected
                      ? "border-[#006BFF] bg-[#EEF4FF]"
                      : isLocked
                        ? "border-[#E5E7EB] bg-[#F9FAFB] opacity-70 hover:border-[#FDE68A]"
                        : "border-[#E5E7EB] bg-white hover:border-[#006BFF]/30 hover:bg-[#F9FAFB]"
                  )}
                >
                  <span className="shrink-0">{opt.icon}</span>
                  <div className="min-w-0 flex-1">
                    <p className={cn("truncate text-xs font-semibold", selected ? "text-[#006BFF]" : "text-[#111827]")}>
                      {opt.label}
                    </p>
                    <p className="truncate text-[10px] text-[#6B7280]">{opt.sublabel}</p>
                  </div>
                  {isLocked && (
                    <Lock className="h-3 w-3 shrink-0 text-[#9CA3AF]" />
                  )}
                </button>
              )
            })}
          </div>

          {/* In-person address input */}
          {location === "in_person" && (
            <div className="mt-2 flex flex-col gap-1.5">
              <Label htmlFor={`${id}-locationAddress`} className="text-on-surface-variant">
                Meeting address <span className="text-xs font-normal text-[#6B7280]">(shown to invitees)</span>
              </Label>
              <Input
                id={`${id}-locationAddress`}
                name="locationAddress"
                defaultValue={initial.locationAddress ?? ""}
                placeholder="123 Main St, Suite 100, City, State 12345"
              />
            </div>
          )}

          {/* Phone info callout */}
          {location === "phone" && (
            <div className="mt-2 rounded-lg border border-[#D1FAE5] bg-[#F0FDF4] px-3 py-2.5 text-sm text-[#065F46]">
              Invitees will be asked to provide their phone number when booking.
            </div>
          )}

          {/* Integration gate callout */}
          {blockedLocation && (() => {
            const integration = LOCATION_INTEGRATION_REQUIRED[blockedLocation]
            if (!integration) return null
            if (integration.inProgress) {
              return (
                <div className="mt-1 rounded-lg border border-[#FDE68A] bg-[#FFFBEB] px-3 py-2.5 text-sm text-[#92400E]">
                  <span className="font-medium">{integration.integrationName} is being set up.</span> This integration is currently in progress and will be available soon.
                </div>
              )
            }
            return (
              <div className="mt-1 flex items-center justify-between gap-3 rounded-lg border border-[#BFDBFE] bg-[#EFF6FF] px-3 py-2.5">
                <p className="text-sm text-[#1D4ED8]">
                  Connect <span className="font-semibold">{integration.integrationName}</span> to use this location.
                </p>
                <Link
                  href={`/integrations/${integration.provider}`}
                  className="cursor-pointer whitespace-nowrap text-sm font-semibold text-[#006BFF] hover:underline"
                >
                  Connect now
                </Link>
              </div>
            )
          })()}
          {errors.location && (
            <p className="text-xs text-[color:var(--error)]">{errors.location}</p>
          )}
        </div>
      </section>

      {/* Scheduling rules */}
      <section className="flex flex-col gap-6 rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
        <div>
          <h2 className="text-lg font-semibold text-[#111827]">Scheduling rules</h2>
          <p className="text-sm text-[#6B7280]">
            Choose how much control you want over when people can book you.
          </p>
        </div>

        {/* Preset cards */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {SCHEDULING_PRESETS.map((preset) => {
            const isSelected = selectedPreset === preset.id
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => applyPreset(preset)}
                className={cn(
                  "relative flex flex-col gap-3 rounded-xl border-2 p-4 text-left transition-all",
                  isSelected
                    ? "border-[#006BFF] bg-[#EEF4FF]"
                    : "border-[#E5E7EB] bg-white hover:border-[#006BFF]/40 hover:bg-[#F9FAFB]"
                )}
              >
                {preset.recommended && (
                  <span className="absolute right-3 top-3 rounded-full bg-[#006BFF] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                    Recommended
                  </span>
                )}
                <div>
                  <p className={cn("text-sm font-semibold", isSelected ? "text-[#006BFF]" : "text-[#111827]")}>
                    {preset.label}
                  </p>
                  <p className="mt-0.5 text-xs text-[#6B7280]">{preset.tagline}</p>
                </div>
                <ul className="flex flex-col gap-1">
                  {preset.pills.map((pill) => (
                    <li
                      key={pill}
                      className={cn(
                        "w-fit rounded-full px-2 py-0.5 text-[11px] font-medium",
                        isSelected
                          ? "bg-[#006BFF]/10 text-[#006BFF]"
                          : "bg-[#F3F4F6] text-[#374151]"
                      )}
                    >
                      {pill}
                    </li>
                  ))}
                </ul>
              </button>
            )
          })}
        </div>

        {/* Custom badge shown when none of the presets match */}
        {selectedPreset === null && (
          <p className="text-xs text-[#6B7280]">
            Custom settings applied.{" "}
            <button
              type="button"
              className="text-[#006BFF] underline underline-offset-2"
              onClick={() => setShowAdvanced(true)}
            >
              View details
            </button>
          </p>
        )}

        {/* Hidden inputs — always submitted */}
        <input type="hidden" name="bufferBefore" value={bufferBefore} />
        <input type="hidden" name="bufferAfter" value={bufferAfter} />
        <input type="hidden" name="minNotice" value={minNotice} />
        <input type="hidden" name="maxDaysInFuture" value={maxDaysInFuture} />

        {/* Advanced toggle */}
        <div className="border-t border-[#F3F4F6] pt-4">
          <button
            type="button"
            onClick={() => setShowAdvanced((v) => !v)}
            className="flex items-center gap-1.5 text-sm font-medium text-[#374151] hover:text-[#111827]"
          >
            <ChevronDown
              className={cn(
                "h-4 w-4 text-[#6B7280] transition-transform",
                showAdvanced && "rotate-180"
              )}
            />
            Advanced settings
          </button>

          {showAdvanced && (
            <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Buffer before */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor={`${id}-bufferBefore`} className="text-[#111827]">
                  Prep time before meeting
                </Label>
                <p className="text-xs text-[#6B7280]">
                  Blocked before each meeting so you can prepare.
                </p>
                <div className="flex items-center gap-2">
                  <Input
                    id={`${id}-bufferBefore`}
                    type="number"
                    min={0}
                    max={240}
                    step={5}
                    value={bufferBefore}
                    onChange={(e) => {
                      setBufferBefore(Number(e.target.value))
                      setSelectedPreset(null)
                    }}
                    className="w-24"
                  />
                  <span className="text-sm text-[#6B7280]">
                    min&nbsp;·&nbsp;{minutesToHuman(bufferBefore)}
                  </span>
                </div>
              </div>

              {/* Buffer after */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor={`${id}-bufferAfter`} className="text-[#111827]">
                  Recovery time after meeting
                </Label>
                <p className="text-xs text-[#6B7280]">
                  Gap before the next meeting can start, so you can wrap up.
                </p>
                <div className="flex items-center gap-2">
                  <Input
                    id={`${id}-bufferAfter`}
                    type="number"
                    min={0}
                    max={240}
                    step={5}
                    value={bufferAfter}
                    onChange={(e) => {
                      setBufferAfter(Number(e.target.value))
                      setSelectedPreset(null)
                    }}
                    className="w-24"
                  />
                  <span className="text-sm text-[#6B7280]">
                    min&nbsp;·&nbsp;{minutesToHuman(bufferAfter)}
                  </span>
                </div>
              </div>

              {/* Min notice */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor={`${id}-minNotice`} className="text-[#111827]">
                  Earliest someone can book
                </Label>
                <p className="text-xs text-[#6B7280]">
                  How far in advance a booking must be made. Prevents last-minute surprises.
                </p>
                <div className="flex items-center gap-2">
                  <Input
                    id={`${id}-minNotice`}
                    type="number"
                    min={0}
                    max={10080}
                    step={15}
                    value={minNotice}
                    onChange={(e) => {
                      setMinNotice(Number(e.target.value))
                      setSelectedPreset(null)
                    }}
                    className="w-24"
                  />
                  <span className="text-sm text-[#6B7280]">
                    min&nbsp;·&nbsp;{minutesToHuman(minNotice)} from now
                  </span>
                </div>
              </div>

              {/* Max days */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor={`${id}-maxDaysInFuture`} className="text-[#111827]">
                  How far ahead can people book?
                </Label>
                <p className="text-xs text-[#6B7280]">
                  Invitees only see availability within this window.
                </p>
                <div className="flex items-center gap-2">
                  <Input
                    id={`${id}-maxDaysInFuture`}
                    type="number"
                    min={1}
                    max={365}
                    value={maxDaysInFuture}
                    onChange={(e) => {
                      setMaxDaysInFuture(Number(e.target.value))
                      setSelectedPreset(null)
                    }}
                    className="w-24"
                  />
                  <span className="text-sm text-[#6B7280]">
                    days&nbsp;·&nbsp;~{Math.round(maxDaysInFuture / 30)} month{Math.round(maxDaysInFuture / 30) !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <label className="flex items-center gap-3 text-sm text-on-surface">
          <input
            type="checkbox"
            name="isActive"
            defaultChecked={initial.isActive ?? true}
            className="h-4 w-4 rounded accent-[#006BFF]"
          />
          Active: the booking link is publicly reachable
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
