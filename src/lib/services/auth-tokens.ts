import { createHash, randomBytes } from "crypto"
import { prisma } from "@/app/lib/db"

function generateRawToken(): string {
  return randomBytes(32).toString("hex")
}

function hashToken(raw: string): string {
  return createHash("sha256").update(raw).digest("hex")
}

// ─── Email verification ───────────────────────────────────────────────────────

export async function createEmailVerificationToken(
  userId: string,
): Promise<string> {
  // Delete any previous tokens for this user to keep the table clean
  await prisma.emailVerificationToken.deleteMany({ where: { userId } })

  const raw = generateRawToken()
  await prisma.emailVerificationToken.create({
    data: {
      userId,
      tokenHash: hashToken(raw),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    },
  })
  return raw
}

export async function consumeEmailVerificationToken(
  raw: string,
): Promise<string | null> {
  const tokenHash = hashToken(raw)
  const record = await prisma.emailVerificationToken.findUnique({
    where: { tokenHash },
  })

  if (!record) return null
  if (record.usedAt) return null
  if (record.expiresAt < new Date()) return null

  await prisma.emailVerificationToken.update({
    where: { id: record.id },
    data: { usedAt: new Date() },
  })

  return record.userId
}

// ─── Password reset ───────────────────────────────────────────────────────────

export async function createPasswordResetToken(
  userId: string,
): Promise<string> {
  // Invalidate any previous reset tokens
  await prisma.passwordResetToken.deleteMany({ where: { userId } })

  const raw = generateRawToken()
  await prisma.passwordResetToken.create({
    data: {
      userId,
      tokenHash: hashToken(raw),
      expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
    },
  })
  return raw
}

export async function consumePasswordResetToken(
  raw: string,
): Promise<string | null> {
  const tokenHash = hashToken(raw)
  const record = await prisma.passwordResetToken.findUnique({
    where: { tokenHash },
  })

  if (!record) return null
  if (record.usedAt) return null
  if (record.expiresAt < new Date()) return null

  await prisma.passwordResetToken.update({
    where: { id: record.id },
    data: { usedAt: new Date() },
  })

  // Delete all reset tokens for the user so they can't be reused
  await prisma.passwordResetToken.deleteMany({
    where: { userId: record.userId, id: { not: record.id } },
  })

  return record.userId
}

// ─── Rate-limit helper ────────────────────────────────────────────────────────

export async function canSendVerificationEmail(
  userId: string,
): Promise<boolean> {
  const latest = await prisma.emailVerificationToken.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
  })
  if (!latest) return true
  return latest.createdAt < new Date(Date.now() - 60 * 1000)
}

export async function canSendPasswordResetEmail(
  userId: string,
): Promise<boolean> {
  const latest = await prisma.passwordResetToken.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
  })
  if (!latest) return true
  return latest.createdAt < new Date(Date.now() - 60 * 1000)
}

// ─── Token validity check (without consuming) ────────────────────────────────

export async function isPasswordResetTokenValid(raw: string): Promise<boolean> {
  const tokenHash = hashToken(raw)
  const record = await prisma.passwordResetToken.findUnique({
    where: { tokenHash },
    select: { usedAt: true, expiresAt: true },
  })
  if (!record) return false
  if (record.usedAt) return false
  if (record.expiresAt < new Date()) return false
  return true
}
