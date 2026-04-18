"use server"

import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { weeklyScheduleSchema } from "@/lib/validators/availability"
import { saveWeeklySchedule } from "@/lib/services/availability"
import { prisma } from "@/lib/db"
import {
  readOnboardingDataJson,
  writeOnboardingDataJson,
} from "@/lib/services/onboarding-json"
import type { WeeklyScheduleInput } from "@/lib/validators/availability"
import type { Prisma } from "@/generated/prisma/client"

async function requireUserId() {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Not authenticated")
  return session.user.id
}

/** Stale JWT after DB reset → user id not in DB → FK errors on child tables */
async function userMissingError(
  userId: string,
): Promise<{ status: "error"; error: string } | null> {
  const row = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true },
  })
  if (row) return null
  return {
    status: "error",
    error:
      "No account found for this session (often after a database reset). Please sign out and sign in again.",
  }
}

function mergeOnboardingJson(
  current: Prisma.JsonValue | null | undefined,
  patch: Record<string, unknown>,
): Prisma.InputJsonValue {
  const base =
    current &&
    typeof current === "object" &&
    !Array.isArray(current) &&
    current !== null
      ? { ...(current as Record<string, unknown>) }
      : {}
  return { ...base, ...patch } as Prisma.InputJsonValue
}

export async function saveOnboardingUsernameAction(
  username: string,
): Promise<{ status: "error"; error: string } | never> {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Not authenticated")

  const clean = username.trim().toLowerCase()
  if (!/^[a-z0-9-]{3,32}$/.test(clean)) {
    return { status: "error", error: "3–32 characters: letters, numbers, hyphens only" }
  }

  const existing = await prisma.user.findFirst({
    where: { username: clean, NOT: { id: session.user.id } },
    select: { id: true },
  })
  if (existing) {
    return { status: "error", error: "That username is already taken" }
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { username: clean },
  })

  redirect("/onboarding/availability")
}

export async function saveOnboardingTimezoneAction(
  timezone: string,
): Promise<{ status: "error"; error: string } | never> {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Not authenticated")

  if (!timezone || timezone.length > 80) {
    return { status: "error", error: "Invalid timezone" }
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { timezone },
  })

  redirect("/onboarding/availability")
}

/** Step 1 — usage + help goals */
export async function saveOnboardingStep1Action(input: {
  usageMode: "solo" | "team"
  helpGoals: string[]
}): Promise<{ status: "error"; error: string } | never> {
  const userId = await requireUserId()
  if (!input.usageMode) {
    return { status: "error", error: "Choose how you plan to use Fluid." }
  }
  if (!input.helpGoals?.length) {
    return { status: "error", error: "Select at least one goal." }
  }

  const current = await readOnboardingDataJson(userId)
  const onboardingData = mergeOnboardingJson(current, {
    usageMode: input.usageMode,
    helpGoals: input.helpGoals,
  })
  await writeOnboardingDataJson(userId, onboardingData)

  redirect("/onboarding/role")
}

/** Step 2 — role */
export async function saveOnboardingStep2Action(role: string): Promise<
  { status: "error"; error: string } | never
> {
  const userId = await requireUserId()
  if (!role?.trim()) {
    return { status: "error", error: "Please select your role to continue." }
  }

  const current = await readOnboardingDataJson(userId)
  const onboardingData = mergeOnboardingJson(current, {
    role: role.trim(),
  })
  await writeOnboardingDataJson(userId, onboardingData)

  redirect("/onboarding/calendars")
}

/** Step 3 — calendar preferences (UI is mostly informational) */
export async function saveOnboardingStep3Action(): Promise<never> {
  const userId = await requireUserId()
  const current = await readOnboardingDataJson(userId)
  const onboardingData = mergeOnboardingJson(current, {
    calendarsStepCompleted: true,
    calendarConflictCheck: true,
  })
  await writeOnboardingDataJson(userId, onboardingData)

  redirect("/onboarding/availability")
}

/** Step 4 — weekly hours + timezone */
export async function saveOnboardingScheduleAndTimezoneAction(
  timezone: string,
  schedule: WeeklyScheduleInput,
): Promise<{ status: "error"; error: string } | never> {
  const userId = await requireUserId()

  if (!timezone || timezone.length > 80) {
    return { status: "error", error: "Invalid timezone" }
  }

  const parsed = weeklyScheduleSchema.safeParse(schedule)
  if (!parsed.success) {
    return {
      status: "error",
      error: parsed.error.issues[0]?.message ?? "Invalid schedule",
    }
  }

  const missing = await userMissingError(userId)
  if (missing) return missing

  await saveWeeklySchedule(userId, parsed.data)
  await prisma.user.update({
    where: { id: userId },
    data: { timezone },
  })

  const current = await readOnboardingDataJson(userId)
  const onboardingData = mergeOnboardingJson(current, {
    availabilityStepCompleted: true,
  })
  await writeOnboardingDataJson(userId, onboardingData)

  redirect("/onboarding/location")
}

/** Step 5 — meeting location + finish */
export async function finalizeOnboardingAction(meetingLocation: string): Promise<
  { status: "error"; error: string } | never
> {
  const userId = await requireUserId()
  if (!meetingLocation?.trim()) {
    return { status: "error", error: "Choose how you'd like to meet." }
  }

  const current = await readOnboardingDataJson(userId)
  const onboardingData = mergeOnboardingJson(current, {
    meetingLocation: meetingLocation.trim(),
  })

  await prisma.user.update({
    where: { id: userId },
    data: { onboardingCompleted: true },
  })
  await writeOnboardingDataJson(userId, onboardingData)

  redirect("/events")
}

/** Legacy — used if schedule editor still calls finish directly */
export async function completeOnboardingAction(
  input: WeeklyScheduleInput,
): Promise<{ status: "error"; error: string } | never> {
  const userId = await requireUserId()

  const parsed = weeklyScheduleSchema.safeParse(input)
  if (!parsed.success) {
    return {
      status: "error",
      error: parsed.error.issues[0]?.message ?? "Invalid schedule",
    }
  }

  const missing = await userMissingError(userId)
  if (missing) return missing

  await saveWeeklySchedule(userId, parsed.data)
  await prisma.user.update({
    where: { id: userId },
    data: { onboardingCompleted: true },
  })

  redirect("/events")
}
