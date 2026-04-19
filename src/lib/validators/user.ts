import { z } from "zod"

// Username: lowercase letters, numbers, dashes. 3–32 chars. Used in booking URL.
const usernameSchema = z
  .string()
  .trim()
  .min(3, "Username must be at least 3 characters")
  .max(32, "Username must be at most 32 characters")
  .regex(
    /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/,
    "Username must be lowercase letters, numbers, and dashes only",
  )

export const LANGUAGES = ["en-US", "en-GB", "es", "fr", "de", "pt", "ja"] as const
export const DATE_FORMATS = ["MM/DD/YYYY", "DD/MM/YYYY", "YYYY-MM-DD"] as const
export const TIME_FORMATS = ["12h", "24h"] as const

export type Language = (typeof LANGUAGES)[number]
export type DateFormat = (typeof DATE_FORMATS)[number]
export type TimeFormat = (typeof TIME_FORMATS)[number]

export const updateProfileSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  username: usernameSchema,
  bio: z.string().trim().max(500).optional().or(z.literal("")),
  // IANA timezone string. We don't enumerate here — UI picks from Intl.supportedValuesOf("timeZone").
  timezone: z.string().min(1, "Timezone is required").max(80),
  language: z.enum(LANGUAGES).optional().default("en-US"),
  dateFormat: z.enum(DATE_FORMATS).optional().default("MM/DD/YYYY"),
  timeFormat: z.enum(TIME_FORMATS).optional().default("12h"),
  country: z
    .string()
    .trim()
    .length(2, "Country must be a 2-letter code")
    .optional()
    .nullable()
    .or(z.literal("")),
})

export type UpdateProfileInput = z.input<typeof updateProfileSchema>

export const updateBrandingSchema = z.object({
  // Accepts full URLs (Vercel Blob in prod) or relative paths (local dev /uploads/...)
  logoUrl: z
    .string()
    .max(2048)
    .refine(
      (v) => v.startsWith("/") || v.startsWith("https://") || v.startsWith("http://"),
      { message: "Invalid image URL" },
    )
    .nullable(),
  useAppBranding: z.boolean(),
})

export type UpdateBrandingInput = z.infer<typeof updateBrandingSchema>
