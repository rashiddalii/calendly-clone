"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import {
  createEventTypeSchema,
  updateEventTypeSchema,
} from "@/lib/validators/event-type"
import {
  createEventType,
  updateEventType,
  softDeleteEventType,
  toggleEventTypeActive,
  SlugConflictError,
} from "@/lib/services/event-type"

export type FormState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "error"; error: string; fieldErrors?: Record<string, string> }

function coerceInt(value: FormDataEntryValue | null, fallback: number): number {
  if (value === null) return fallback
  const n = Number.parseInt(String(value), 10)
  return Number.isFinite(n) ? n : fallback
}

function extractInput(formData: FormData) {
  return {
    title: String(formData.get("title") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    description: String(formData.get("description") ?? ""),
    duration: coerceInt(formData.get("duration"), 30),
    color: String(formData.get("color") ?? "#4a4bd7"),
    bufferBefore: coerceInt(formData.get("bufferBefore"), 0),
    bufferAfter: coerceInt(formData.get("bufferAfter"), 0),
    minNotice: coerceInt(formData.get("minNotice"), 240),
    maxDaysInFuture: coerceInt(formData.get("maxDaysInFuture"), 60),
    isActive: formData.get("isActive") === "on" || formData.get("isActive") === "true",
  }
}

export async function createEventTypeAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const session = await auth()
  if (!session?.user?.id) return { status: "error", error: "Not authenticated" }

  const parsed = createEventTypeSchema.safeParse(extractInput(formData))
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
      error: "Please fix the errors below",
      fieldErrors,
    }
  }

  try {
    await createEventType(session.user.id, parsed.data)
  } catch (err) {
    if (err instanceof SlugConflictError) {
      return {
        status: "error",
        error: err.message,
        fieldErrors: { slug: err.message },
      }
    }
    return {
      status: "error",
      error: err instanceof Error ? err.message : "Something went wrong",
    }
  }

  revalidatePath("/events")
  redirect("/events")
}

export async function updateEventTypeAction(
  id: string,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const session = await auth()
  if (!session?.user?.id) return { status: "error", error: "Not authenticated" }

  const parsed = updateEventTypeSchema.safeParse({ id, ...extractInput(formData) })
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
      error: "Please fix the errors below",
      fieldErrors,
    }
  }

  try {
    await updateEventType(session.user.id, parsed.data)
  } catch (err) {
    if (err instanceof SlugConflictError) {
      return {
        status: "error",
        error: err.message,
        fieldErrors: { slug: err.message },
      }
    }
    return {
      status: "error",
      error: err instanceof Error ? err.message : "Something went wrong",
    }
  }

  revalidatePath("/events")
  revalidatePath(`/events/${id}/edit`)
  redirect("/events")
}

export async function deleteEventTypeAction(id: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Not authenticated")
  await softDeleteEventType(session.user.id, id)
  revalidatePath("/events")
}

export async function toggleEventTypeActiveAction(id: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Not authenticated")
  await toggleEventTypeActive(session.user.id, id)
  revalidatePath("/events")
}
