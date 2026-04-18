-- AlterTable (align User + Booking with schema — init migration predates these fields)
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "onboardingCompleted" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "onboardingData" JSONB;
ALTER TABLE "Booking" ADD COLUMN IF NOT EXISTS "bookerTimezone" TEXT NOT NULL DEFAULT 'UTC';
