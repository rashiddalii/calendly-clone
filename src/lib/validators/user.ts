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

export const updateProfileSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  username: usernameSchema,
  bio: z.string().trim().max(500).optional().or(z.literal("")),
  // IANA timezone string. We don't enumerate here — UI picks from Intl.supportedValuesOf("timeZone").
  timezone: z.string().min(1, "Timezone is required").max(80),
})

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>
