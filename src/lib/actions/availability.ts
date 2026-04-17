"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import {
  weeklyScheduleSchema,
  dateOverrideSchema,
} from "@/lib/validators/availability"
import {
  saveWeeklySchedule,
  upsertDateOverride,
  deleteDateOverride,
} from "@/lib/services/availability"
import type { WeeklyScheduleInput } from "@/lib/validators/availability"

export async function saveWeeklyScheduleAction(input: WeeklyScheduleInput) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Not authenticated")

  const parsed = weeklyScheduleSchema.safeParse(input)
  if (!parsed.success) {
    return {
      status: "error" as const,
      error: parsed.error.issues[0]?.message ?? "Invalid schedule",
    }
  }

  await saveWeeklySchedule(session.user.id, parsed.data)
  revalidatePath("/availability")
  return { status: "success" as const }
}

export async function upsertDateOverrideAction(input: {
  date: string
  startTime: string | null
  endTime: string | null
}) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Not authenticated")

  const parsed = dateOverrideSchema.safeParse(input)
  if (!parsed.success) {
    return {
      status: "error" as const,
      error: parsed.error.issues[0]?.message ?? "Invalid override",
    }
  }

  await upsertDateOverride(session.user.id, parsed.data)
  revalidatePath("/availability")
  return { status: "success" as const }
}

export async function deleteDateOverrideAction(date: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Not authenticated")
  await deleteDateOverride(session.user.id, date)
  revalidatePath("/availability")
  return { status: "success" as const }
}
