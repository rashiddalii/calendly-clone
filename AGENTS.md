<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This project uses Next.js 16.2.3. APIs, conventions, and file structure may differ from older Next.js versions. Before changing Next.js code, read the relevant guide in `node_modules/next/dist/docs/` and heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project Operating Memory

Act like a ruthless mentor: challenge weak assumptions, call out risky thinking, and prefer working fixes over comforting explanations.

## What This Project Is

This repo is `calendly-clone`, a scheduling platform called Fluid. Users sign in, create event types, set weekly availability and date overrides, share public booking links, receive bookings, send confirmation/cancellation emails, and optionally sync with calendar/video integrations.

## Source Of Truth

- Read `CLIENT_DEMO_BUILD_PLAN.md` at the start of each session. It is the authoritative roadmap and progress tracker.
- Read `DESIGN.md` before UI work. It defines the "Fluid Architect" visual language: Calendly blue `#006bff`, Manrope headlines, Inter body text, tonal surfaces, gradient CTAs, and no unnecessary divider lines.
- `PROJECT_PLAN.md` is the older full-product vision. Use it for context, not as current scope.
- `CLAUDE.md` has useful rules, but verify versions against `package.json`; it may be stale.
- Before architecture/codebase answers, read `graphify-out/GRAPH_REPORT.md` if present.

## Current Stack

- Next.js `16.2.3`, React `19.2.4`, TypeScript strict mode.
- Auth.js/NextAuth v5 with Prisma adapter.
- Prisma `7.7.0`, PostgreSQL, generated client under `src/generated/prisma`.
- Tailwind CSS v4 and shadcn-style UI components.
- Email uses `nodemailer` currently.
- Dates use `date-fns` and `date-fns-tz`. Store timestamps in UTC and convert at UI boundaries.

## Core Architecture

- App routes live under `src/app`.
- Protected dashboard routes live under `src/app/(dashboard)`.
- Public booking routes live under `src/app/(booking)`.
- Auth routes live under `src/app/(auth)`.
- Business logic belongs in `src/lib/services`.
- Mutations belong in server actions under `src/lib/actions`.
- Validation belongs in `src/lib/validators` with Zod.
- UI components are grouped under `src/components`.

## Product Rules

- Server Components by default. Add `"use client"` only for actual interactivity.
- All database access should go through service files, not directly from components.
- Validate all external/form input with Zod.
- Use Prisma transactions for multi-step writes.
- Use soft deletes (`deletedAt`) for user-facing records.
- All clickable UI must include `cursor-pointer`.
- Do not use em dashes in user-facing text. Use a colon, comma, period, or rewrite.
- Do not invent new colors or spacing for UI. Use `DESIGN.md` unless explicitly asked to redesign.

## Integration Status

- Google Calendar and Google Meet are the primary supported integrations.
- Zoom is intentionally disabled and shown as "in progress" until Marketplace production approval is solved.
- Microsoft Teams is also shown as "in progress".
- Do not re-enable Zoom OAuth casually. Draft Zoom apps fail for external users; production requires Zoom Marketplace approval or an approved private beta flow.

## Docker And Local Operations

Docker is available and should be preferred when the user wants the full app stack.

- Dev stack: `docker compose up -d --build`
- Stop dev stack: `docker compose down`
- Production-style stack: `docker compose -f docker-compose.prod.yml up -d --build`
- Stop production stack: `docker compose -f docker-compose.prod.yml down`
- App runs on `http://localhost:${HOST_PORT:-3000}`.
- Postgres is exposed on host port `5433`, container port `5432`.
- Dev Docker uses `Dockerfile.dev`, bind mounts the repo, runs `scripts/next-dev-watch-env.mjs`, forces webpack dev with polling because Turbopack misses bind-mounted file changes on Windows.
- Prisma schema changes trigger `prisma generate` and a Next restart in the dev container. Migrations still require `docker compose exec web npx prisma migrate dev` or `npm run db:migrate`.

## Common Commands

- `npm run dev`: local Next dev server.
- `npm run build`: production build.
- `npm run lint`: ESLint.
- `npm run test`: Vitest tests.
- `npm run db:generate`: Prisma generate.
- `npm run db:migrate`: Prisma migrate dev.
- `npm run db:push`: Prisma db push.
- `npm run docker:up`: dev Docker stack.
- `npm run docker:down`: stop dev Docker stack.

## Verification Notes

- Targeted lint can pass even if full `npm run lint` fails from unrelated existing issues. Report both honestly.
- As of the latest known state, full lint has unrelated `react-hooks/set-state-in-effect` errors in account/sidebar components.
- As of the latest known state, `npx tsc --noEmit` can fail from stale `.next` route types and module/type resolution around `nodemailer` or `bcryptjs`.
- After modifying code, run the graphify rebuild if available:
  `python -c "from graphify.watch import _rebuild_code; from pathlib import Path; _rebuild_code(Path('.'))"`

## Git Safety

The worktree may be dirty with user changes. Never reset, checkout, or revert unrelated work unless the user explicitly asks. Read the touched files and preserve existing edits.
