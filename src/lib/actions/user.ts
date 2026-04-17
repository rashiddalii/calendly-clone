"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import { updateProfileSchema } from "@/lib/validators/user"
import type { UpdateProfileInput } from "@/lib/validators/user"
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

  const { name, username, bio, timezone } = parsed.data
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
      data: { name, username, bio: bio || null, timezone },
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
  return { status: "success" }
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
    revalidatePath("/settings")
    return { status: "success" }
  } catch (err) {
    console.error("[settings] disconnect google failed", err)
    return { status: "error" }
  }
}
