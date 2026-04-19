#!/usr/bin/env node
/**
 * Smart migration deploy for Vercel + Neon.
 *
 * The Neon database was bootstrapped with `prisma db push`, which creates all
 * tables but writes no rows to _prisma_migrations. When `prisma migrate deploy`
 * runs for the first time it sees a non-empty DB with no history and throws
 * P3005. This script detects that case and baselines every known migration
 * (marks them as already applied without re-running their SQL), then retries.
 *
 * On all subsequent deploys the baseline rows are already there, so
 * `prisma migrate deploy` succeeds on the first try and this script is a no-op.
 */

import { execSync } from "node:child_process"

const MIGRATIONS = [
  "20260417120000_init",
  "20260417120001_add_user_onboarding_data",
  "20260419000000_schema_sync",
]

function run(cmd, opts = {}) {
  execSync(cmd, { stdio: "inherit", ...opts })
}

function tryRun(cmd) {
  try {
    run(cmd)
    return true
  } catch {
    return false
  }
}

console.log("▶ Running prisma migrate deploy…")
const deployed = tryRun("npx prisma migrate deploy")

if (deployed) {
  console.log("✓ Migrations applied successfully.")
  process.exit(0)
}

// P3005: DB exists but has no migration history — baseline each migration.
console.log("⚠ Detected unbaselined database. Baselining migrations…")
for (const name of MIGRATIONS) {
  const ok = tryRun(`npx prisma migrate resolve --applied "${name}"`)
  console.log(`  ${ok ? "✓" : "⚑ (already recorded)"} ${name}`)
}

// Retry — should succeed now that all migrations are marked as applied.
console.log("▶ Retrying prisma migrate deploy after baseline…")
run("npx prisma migrate deploy")
console.log("✓ Migrations applied successfully.")
