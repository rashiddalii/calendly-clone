import { prisma } from "@/lib/db"
import type { Prisma } from "@/generated/prisma/client"

/**
 * Read/write `User.onboardingData` via raw SQL so the app keeps working if the
 * generated Prisma client is temporarily out of sync with `schema.prisma` (e.g.
 * before `prisma generate` runs in CI/Docker).
 *
 * Requires the `onboardingData` column to exist (run migrations).
 */
export async function readOnboardingDataJson(
  userId: string,
): Promise<Prisma.JsonValue | null> {
  const rows = await prisma.$queryRaw<{ onboardingData: Prisma.JsonValue | null }[]>`
    SELECT "onboardingData" FROM "User" WHERE id = ${userId} LIMIT 1
  `
  return rows[0]?.onboardingData ?? null
}

export async function writeOnboardingDataJson(
  userId: string,
  value: Prisma.InputJsonValue,
): Promise<void> {
  const json = JSON.stringify(value)
  await prisma.$executeRawUnsafe(
    `UPDATE "User" SET "onboardingData" = $1::jsonb WHERE id = $2`,
    json,
    userId,
  )
}
