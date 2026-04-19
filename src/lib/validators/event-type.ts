import { z } from "zod"

// Slug: lowercase letters, numbers, dashes. 1–60 chars. Safe for URLs.
const slugSchema = z
  .string()
  .trim()
  .min(1, "Slug is required")
  .max(60, "Slug must be at most 60 characters")
  .regex(
    /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/,
    "Slug must be lowercase letters, numbers, and dashes only",
  )

// Hex color like #006bff — 7 chars with leading #.
const hexColorSchema = z
  .string()
  .regex(/^#[0-9a-fA-F]{6}$/, "Color must be a hex code like #006bff")

export const LOCATION_VALUES = [
  "google_meet",
  "zoom",
  "teams",
  "phone",
  "in_person",
  "other",
] as const

export type LocationValue = (typeof LOCATION_VALUES)[number]

export const LOCATION_LABELS: Record<LocationValue, string> = {
  google_meet: "Google Meet",
  zoom: "Zoom",
  teams: "Microsoft Teams",
  phone: "Phone call",
  in_person: "In person",
  other: "Custom link",
}

export const createEventTypeSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(120),
  slug: slugSchema,
  description: z.string().trim().max(2000).optional().or(z.literal("")),
  duration: z
    .number()
    .int()
    .min(5, "Meetings must be at least 5 minutes")
    .max(480, "Meetings must be at most 8 hours"),
  color: hexColorSchema.default("#006bff"),
  location: z.enum(LOCATION_VALUES).default("google_meet"),
  locationAddress: z.string().trim().max(500).optional().or(z.literal("")),
  bufferBefore: z.number().int().min(0).max(240).default(0),
  bufferAfter: z.number().int().min(0).max(240).default(0),
  minNotice: z.number().int().min(0).max(10080).default(240), // up to 1 week in minutes
  maxDaysInFuture: z.number().int().min(1).max(365).default(60),
  isActive: z.boolean().default(true),
})

export const updateEventTypeSchema = createEventTypeSchema.partial().extend({
  id: z.string().min(1),
})

export type CreateEventTypeInput = z.infer<typeof createEventTypeSchema>
export type UpdateEventTypeInput = z.infer<typeof updateEventTypeSchema>
