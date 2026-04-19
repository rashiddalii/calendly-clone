"use server"

import { revalidatePath } from "next/cache"
import { put } from "@vercel/blob"
import { auth } from "@/lib/auth"
import {
  updateProfileSchema,
  updateBrandingSchema,
} from "@/lib/validators/user"
import type { UpdateProfileInput, UpdateBrandingInput } from "@/lib/validators/user"
import { prisma } from "@/app/lib/db"

export type UpdateProfileResult =
  | { status: "success" }
  | { status: "error"; error: string; fieldErrors?: Record<string, string> }

export async function updateProfileAction(
  input: UpdateProfileInput,
): Promise<UpdateProfileResult> {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Not authenticated")

  const parsed = updateProfileSchema.safeParse(input)
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {}
    for (const issue of parsed.error.issues) {
      const key = issue.path[0]
      if (typeof key === "string" && !fieldErrors[key]) {
        fieldErrors[key] = issue.message
      }
    }
    return {
      status: "error",
      error: parsed.error.issues[0]?.message ?? "Invalid input",
      fieldErrors,
    }
  }

  const { name, username, bio, timezone, language, dateFormat, timeFormat, country } = parsed.data
  const userId = session.user.id

  // Check username uniqueness (exclude self)
  const existing = await prisma.user.findFirst({
    where: { username, NOT: { id: userId } },
    select: { id: true },
  })
  if (existing) {
    return {
      status: "error",
      error: "Username already taken",
      fieldErrors: { username: "Username already taken" },
    }
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        username,
        bio: bio || null,
        timezone,
        language,
        dateFormat,
        timeFormat,
        country: country || null,
      },
    })
  } catch (err) {
    const code = (err as { code?: string })?.code
    if (code === "P2002") {
      return {
        status: "error",
        error: "Username already taken",
        fieldErrors: { username: "Username already taken" },
      }
    }
    return {
      status: "error",
      error: err instanceof Error ? err.message : "Failed to update profile",
    }
  }

  revalidatePath("/settings")
  revalidatePath("/account/profile")
  revalidatePath("/events")
  return { status: "success" }
}

export async function updateUsernameAction(
  username: string,
): Promise<UpdateProfileResult> {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Not authenticated")

  const trimmed = username.trim()
  if (trimmed.length < 3 || trimmed.length > 32) {
    return {
      status: "error",
      error: "Username must be 3–32 characters",
      fieldErrors: { username: "Username must be 3–32 characters" },
    }
  }
  if (!/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(trimmed)) {
    return {
      status: "error",
      error: "Username must be lowercase letters, numbers, and dashes only",
      fieldErrors: { username: "Username must be lowercase letters, numbers, and dashes only" },
    }
  }

  const userId = session.user.id
  const existing = await prisma.user.findFirst({
    where: { username: trimmed, NOT: { id: userId } },
    select: { id: true },
  })
  if (existing) {
    return {
      status: "error",
      error: "Username already taken",
      fieldErrors: { username: "Username already taken" },
    }
  }

  try {
    await prisma.user.update({ where: { id: userId }, data: { username: trimmed } })
  } catch (err) {
    const code = (err as { code?: string })?.code
    if (code === "P2002") {
      return { status: "error", error: "Username already taken", fieldErrors: { username: "Username already taken" } }
    }
    return { status: "error", error: err instanceof Error ? err.message : "Failed to update username" }
  }

  revalidatePath("/account/my-link")
  revalidatePath("/events")
  return { status: "success" }
}

export async function updateBrandingAction(
  input: UpdateBrandingInput,
): Promise<UpdateProfileResult> {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Not authenticated")

  const parsed = updateBrandingSchema.safeParse(input)
  if (!parsed.success) {
    return {
      status: "error",
      error: parsed.error.issues[0]?.message ?? "Invalid input",
    }
  }

  const { logoUrl, useAppBranding } = parsed.data
  const userId = session.user.id

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { logoUrl, useAppBranding },
    })
  } catch (err) {
    return {
      status: "error",
      error: err instanceof Error ? err.message : "Failed to update branding",
    }
  }

  revalidatePath("/account/branding")
  return { status: "success" }
}

export async function uploadImageAction(
  formData: FormData,
  kind: "avatar" | "logo",
): Promise<{ url: string } | { error: string }> {
  const session = await auth()
  if (!session?.user?.id) return { error: "Not authenticated" }

  const file = formData.get("file")
  if (!(file instanceof File)) return { error: "No file provided" }

  const ALLOWED = ["image/jpeg", "image/png", "image/gif", "image/webp"]
  if (!ALLOWED.includes(file.type)) return { error: "Only JPG, PNG, GIF or WebP allowed" }
  if (file.size > 5 * 1024 * 1024) return { error: "File must be under 5 MB" }

  try {
    const ext = file.name.split(".").pop() ?? "jpg"
    const userId = session.user.id
    const prefix = kind === "avatar" ? "avatars" : "logos"
    const filename = `${prefix}/${userId}/${Date.now()}.${ext}`

    let url: string

    if (process.env.BLOB_READ_WRITE_TOKEN) {
      // Production: Vercel Blob
      const result = await put(filename, file, {
        access: "public",
        contentType: file.type,
      })
      url = result.url
    } else {
      // Dev fallback: save to public/uploads/
      const { writeFile, mkdir } = await import("fs/promises")
      const { join } = await import("path")
      const dir = join(process.cwd(), "public", "uploads", prefix, userId)
      await mkdir(dir, { recursive: true })
      const localFilename = `${Date.now()}.${ext}`
      const dest = join(dir, localFilename)
      const buffer = Buffer.from(await file.arrayBuffer())
      await writeFile(dest, buffer)
      url = `/uploads/${prefix}/${userId}/${localFilename}`
    }

    // Persist URL immediately
    if (kind === "avatar") {
      await prisma.user.update({ where: { id: userId }, data: { image: url } })
      revalidatePath("/account/profile")
    } else {
      await prisma.user.update({ where: { id: userId }, data: { logoUrl: url } })
      revalidatePath("/account/branding")
    }

    return { url }
  } catch (err) {
    console.error("[uploadImageAction]", err)
    return { error: err instanceof Error ? err.message : "Upload failed" }
  }
}

export async function disconnectGoogleCalendarAction(): Promise<{
  status: "success" | "error"
}> {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Not authenticated")

  try {
    await prisma.account.deleteMany({
      where: { userId: session.user.id, provider: "google" },
    })
    revalidatePath("/integrations")
    return { status: "success" }
  } catch (err) {
    console.error("[integrations] disconnect google failed", err)
    return { status: "error" }
  }
}

export async function disconnectZoomAction(): Promise<{
  status: "success" | "error"
}> {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Not authenticated")

  try {
    await prisma.integration.deleteMany({
      where: { userId: session.user.id, provider: "ZOOM" },
    })
    revalidatePath("/integrations")
    return { status: "success" }
  } catch (err) {
    console.error("[integrations] disconnect zoom failed", err)
    return { status: "error" }
  }
}

export async function disconnectTeamsAction(): Promise<{
  status: "success" | "error"
}> {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Not authenticated")

  try {
    await prisma.integration.deleteMany({
      where: { userId: session.user.id, provider: "MICROSOFT" },
    })
    revalidatePath("/integrations")
    return { status: "success" }
  } catch (err) {
    console.error("[integrations] disconnect teams failed", err)
    return { status: "error" }
  }
}
