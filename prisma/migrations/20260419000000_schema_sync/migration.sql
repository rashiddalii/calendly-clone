-- Align committed migrations with the current Prisma schema.
-- This migration is intentionally idempotent because some local/dev databases
-- were already brought in line with `prisma db push`.

ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "language" TEXT NOT NULL DEFAULT 'en-US';
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "dateFormat" TEXT NOT NULL DEFAULT 'MM/DD/YYYY';
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "timeFormat" TEXT NOT NULL DEFAULT '12h';
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "country" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "logoUrl" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "useAppBranding" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "password" TEXT;

ALTER TABLE "EventType" ADD COLUMN IF NOT EXISTS "location" TEXT NOT NULL DEFAULT 'google_meet';
ALTER TABLE "EventType" ADD COLUMN IF NOT EXISTS "locationAddress" TEXT;

ALTER TABLE "Booking" ADD COLUMN IF NOT EXISTS "bookerPhone" TEXT;
ALTER TABLE "Booking" ADD COLUMN IF NOT EXISTS "meetingUrl" TEXT;
ALTER TABLE "Booking" ADD COLUMN IF NOT EXISTS "meetingId" TEXT;
ALTER TABLE "Booking" ADD COLUMN IF NOT EXISTS "meetingPassword" TEXT;
ALTER TABLE "Booking" ADD COLUMN IF NOT EXISTS "meetingProvider" TEXT;
ALTER TABLE "Booking" ADD COLUMN IF NOT EXISTS "icalUid" TEXT;
ALTER TABLE "Booking" ADD COLUMN IF NOT EXISTS "icalSequence" INTEGER NOT NULL DEFAULT 0;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'IntegrationProvider') THEN
    CREATE TYPE "IntegrationProvider" AS ENUM ('ZOOM', 'MICROSOFT');
  END IF;
END
$$;

CREATE TABLE IF NOT EXISTS "EmailVerificationToken" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "tokenHash" TEXT NOT NULL,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "usedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "EmailVerificationToken_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "EmailVerificationToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "PasswordResetToken" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "tokenHash" TEXT NOT NULL,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "usedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "PasswordResetToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "EmailSuppression" (
  "id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "reason" TEXT NOT NULL,
  "suppressedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "EmailSuppression_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Integration" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "provider" "IntegrationProvider" NOT NULL,
  "providerAccountId" TEXT NOT NULL,
  "accessToken" TEXT NOT NULL,
  "refreshToken" TEXT,
  "expiresAt" TIMESTAMP(3),
  "scope" TEXT,
  "accountEmail" TEXT,
  "lastVerifiedAt" TIMESTAMP(3),
  "lastError" TEXT,
  "lastErrorAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Integration_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Integration_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "Booking_icalUid_key" ON "Booking"("icalUid");
CREATE UNIQUE INDEX IF NOT EXISTS "EmailVerificationToken_tokenHash_key" ON "EmailVerificationToken"("tokenHash");
CREATE INDEX IF NOT EXISTS "EmailVerificationToken_userId_idx" ON "EmailVerificationToken"("userId");
CREATE INDEX IF NOT EXISTS "EmailVerificationToken_expiresAt_idx" ON "EmailVerificationToken"("expiresAt");
CREATE UNIQUE INDEX IF NOT EXISTS "PasswordResetToken_tokenHash_key" ON "PasswordResetToken"("tokenHash");
CREATE INDEX IF NOT EXISTS "PasswordResetToken_userId_idx" ON "PasswordResetToken"("userId");
CREATE INDEX IF NOT EXISTS "PasswordResetToken_expiresAt_idx" ON "PasswordResetToken"("expiresAt");
CREATE UNIQUE INDEX IF NOT EXISTS "EmailSuppression_email_key" ON "EmailSuppression"("email");
CREATE INDEX IF NOT EXISTS "EmailSuppression_email_idx" ON "EmailSuppression"("email");
CREATE UNIQUE INDEX IF NOT EXISTS "Integration_userId_provider_key" ON "Integration"("userId", "provider");
CREATE INDEX IF NOT EXISTS "Integration_userId_idx" ON "Integration"("userId");
