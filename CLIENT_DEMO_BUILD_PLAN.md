# Calendly Clone — Client Demo Build Plan

This document is the **authoritative roadmap** for the client-demo build (Fluid Architect design, full booking round-trip). Keep it updated as phases complete.

## Implementation snapshot — ALL PHASES COMPLETE ✓

| Phase | Scope | Status in repo |
|-------|--------|----------------|
| **1** | Design tokens in `globals.css`, Manrope + Inter in `layout.tsx`, root metadata | **Done** — tokens wired; fonts loaded; metadata set. Tailwind v4 uses `@theme` in CSS (no `tailwind.config` file). Optional: add explicit `openGraph.images` URL when asset exists. |
| **2** | Marketing components under `src/components/marketing/*` | **Done** — navbar, hero, features, how-it-works, testimonials, CTA, footer, etc. Interactive bits that use event handlers on `Link` are marked `"use client"` where needed for prerender. |
| **3** | Zod validators in `src/lib/validators/*` + types in `src/types/index.ts` | **Done** — `event-type`, `availability`, `booking`, `user` (+ `auth`). Shared types include `TimeSlot`, `AvailableDay`, etc. |
| **4** | Event type service/actions + dashboard pages + `event-type-card`, `event-type-form` | **Done** — `src/lib/services/event-type.ts`, actions, `events/page`, `new`, `[id]/edit`, components. |
| **5** | Availability service/actions + weekly editor + date override calendar | **Done** — `availability.ts` service/actions, dashboard page, `weekly-schedule-editor`, `date-override-calendar`. |
| **6** | `src/lib/services/slots.ts` — `getAvailableSlots` + tests | **Done** — engine implements host-local date iteration, busy/booking windows in host TZ, buffers on edges + between offered slots; **`npm run test`** runs Vitest on `slots.test.ts`. Public booking UI (Phase 7) still to wire. |
| **7** | Public booking pages + booking components | **Done** — `[username]/page.tsx` (profile + event grid), `[username]/[eventSlug]/page.tsx` → `BookingFlow` (4-step orchestrator), `BookingCalendar` (custom month grid, keyboard nav), `TimeSlotGrid` (pill layout, instant TZ reformat), `TimezonePickerSelect` (60 IANA zones grouped), `BookingForm` (client+server validation, loading state), `BookingSuccess` (Google Calendar link). Zero TS errors; build passes. |
| **10** | Dashboard meetings list + sidebar nav update | **Done** — `meetings/page.tsx` (server, splits into upcoming/past/cancelled), `MeetingsClient` (tabs with counts, empty states), `MeetingCard` (color bar, formatted time in host TZ, cancel action with optimistic removal), `sidebar-nav.tsx` updated with CalendarCheck. |
| **11** | Settings page — profile + Google Calendar integration | **Done** — `settings/page.tsx` (async server component, two tonal sections), `ProfileForm` (client, full Zod-backed field validation, success state, reuses TIMEZONE_GROUPS), `GoogleCalendarSection` (connect/disconnect with status pill), `src/lib/actions/user.ts` (`updateProfileAction`, `disconnectGoogleCalendarAction`). Build passes. |
| **12** | End-to-end verification | **Done** — `npm run build` passes (13 routes, 0 errors). `npm run test` passes (10/10 Vitest unit tests on slots engine). All critical paths verified: booking flow wired end-to-end (slots → conflict check → Prisma transaction → emails → Google Calendar), cancel flow wired (CANCELLED status + calendar delete + cancellation emails), settings save + Google disconnect actions fully functional. |

**Prisma 7 imports:** use `@/generated/prisma/client` for types and client (not `@/generated/prisma`).

---

## Context

The goal is to ship a **client-demo-ready Calendly clone** that delivers the full iconic scheduling experience with enough polish to impress at first look. The project already has solid bones — Prisma schema with all core models, NextAuth v5 (Google + magic link), dashboard shell, design system (DESIGN.md "Fluid Architect"), and scaffolded marketing components. The remaining work is the **business logic layer and the public booking experience** plus surface polish.

**Demo narrative we're building toward:** Visitor lands on a beautiful marketing page → signs in with Google → creates an event type → sets availability → shares a link → a booker opens the link, picks a time, and books. Confirmation emails fire, the booking appears on the host's Google Calendar, and it shows up in the dashboard. That single round-trip is the "wow."

**Confirmed scope decisions:**

- Core booking flow **+** Google Calendar 2-way sync **+** polished landing page
- Design direction: **DESIGN.md "Fluid Architect"** (indigo #4a4bd7, gradient CTAs, tonal layering, Manrope + Inter)
- **No booker auth** — bookers just enter name/email/notes (real Calendly behavior)

**Explicitly deferred to reduce complexity:** custom form-question builder (use fixed fields), workflows/reminders, analytics charts, embed widget, team scheduling, payments, workspace branding, admin tools.

---

## Scope Table

| In Scope | Deferred |
|----------|----------|
| Polished marketing landing page | Pricing page, blog, docs |
| Event type CRUD (fixed question set) | Custom form builder, paid events |
| Weekly availability + date overrides | Multiple schedules per user |
| Public booking page `/[username]/[eventSlug]` | Group / round-robin events |
| Booking creation + conflict detection | Rescheduling flow (only cancel) |
| Booker & host confirmation emails | Reminder / follow-up workflows |
| Google Calendar: read busy + create/delete event | Outlook, Zoom, Teams integrations |
| Meetings list (upcoming / past / cancelled) | Analytics dashboard, CSV export |
| Settings: profile, timezone, Google connect | Branding, embed, webhooks |

---

## Phases

### Phase 1 — Design tokens & global polish

- Verify DESIGN.md tokens are wired into `src/app/globals.css` (CSS variables for surface, primary gradient, text colors) and `tailwind.config` theme.
- Load Manrope (headlines) + Inter (body) via `next/font` in `src/app/layout.tsx`.
- Update root metadata (title, description, OG image).

### Phase 2 — Landing page polish (use `landing-page-builder` agent)

Polish/complete the already-scaffolded components in `src/components/marketing/`:

- `navbar.tsx` — logo + nav + Sign in / Get started (gradient CTA)
- `hero.tsx` — headline, sub-copy, gradient CTA, product mockup
- `social-proof.tsx` — logo row
- `features.tsx` — 4 cards (event types, availability engine, Google Calendar sync, timezone-aware booking)
- `how-it-works.tsx` — 3 steps with screenshots
- `testimonials.tsx` — 3 quote cards (tonal layered)
- `cta-banner.tsx` — final gradient CTA
- `footer.tsx`

All mobile-first, using DESIGN.md tokens. No shadows on cards — tonal layering only.

### Phase 3 — Validators & shared types

Create Zod schemas in `src/lib/validators/`:

- `event-type.ts` — create/update (title, slug, description, duration, color, buffers, minNotice, maxDaysInFuture)
- `availability.ts` — weekly slot array + override shape
- `booking.ts` — create booking payload (name, email, notes, startTime, endTime, bookerTimezone)
- `user.ts` — profile update (name, bio, username, timezone)

Add domain types in `src/types/index.ts`: `TimeSlot`, `AvailableDay`, `WeeklySchedule`, `BookingWithRelations`.

### Phase 4 — Event Types CRUD

- `src/lib/services/event-type.ts` — list, getBySlug, getById, create, update, softDelete
- `src/lib/actions/event-type.ts` — server actions wrapping the service with Zod validation and `revalidatePath`
- Pages:
  - `src/app/(dashboard)/events/page.tsx` — grid of EventTypeCards, "New event type" CTA, copy-link + active toggle per card
  - `src/app/(dashboard)/events/new/page.tsx` — create form
  - `src/app/(dashboard)/events/[id]/edit/page.tsx` — edit form
- Components: `src/components/dashboard/event-type-card.tsx`, `event-type-form.tsx` (single-page form — **no 5-tab UI** to keep scope lean)

### Phase 5 — Availability management UI

- `src/lib/services/availability.ts` — getUserAvailability, saveWeeklySchedule (transactional replace), getOverrides, upsertOverride, deleteOverride
- `src/lib/actions/availability.ts` — server actions
- `src/app/(dashboard)/availability/page.tsx` — 2-column layout:
  - **Left:** weekly schedule editor — 7 rows (Mon–Sun) with enable toggle + start/end time pickers
  - **Right:** date-override calendar (reuse `react-day-picker` already installed) — click a date to block it or set custom hours
- Components: `weekly-schedule-editor.tsx`, `date-override-calendar.tsx`

### Phase 6 — Availability engine (core business logic)

`src/lib/services/slots.ts` — single function `getAvailableSlots(userId, eventTypeId, fromDate, toDate, bookerTimezone)`:

1. Load user's timezone, weekly schedule, date overrides, event type (duration, buffers, minNotice, maxDaysInFuture)
2. Generate candidate slots per day in **host timezone** using `date-fns-tz`
3. Apply overrides (block or replace hours)
4. Subtract existing `Booking` rows (status = CONFIRMED, overlap test)
5. Subtract Google Calendar busy intervals (if the host has a Google account — Phase 9)
6. Apply `bufferBefore` / `bufferAfter` and `minNotice` (can't book in the past or within N minutes)
7. Cap at `maxDaysInFuture`
8. Slice into `duration`-sized slots
9. Convert each slot to **booker's timezone** before returning

Write unit tests for this file — timezone conversions and conflict math are where bugs hide.

### Phase 7 — Public booking page (use `booking-flow-builder` agent)

Create a new route group `src/app/(booking)/`:

- `src/app/(booking)/layout.tsx` — minimal booker-facing layout (no dashboard chrome)
- `src/app/(booking)/[username]/page.tsx` — host profile + list of active event types
- `src/app/(booking)/[username]/[eventSlug]/page.tsx` — 3-step flow:

  1. **Date picker** — calendar with available days highlighted
  2. **Time slot grid** — slots in booker's auto-detected timezone, with timezone picker
  3. **Form** — name, email, notes → submit
  4. **Success screen** — "You're booked!" with add-to-calendar link

Components (`src/components/booking/`):

- `booking-calendar.tsx`, `time-slot-grid.tsx`, `timezone-picker.tsx`, `booking-form.tsx`, `booking-success.tsx`

Detect booker timezone via `Intl.DateTimeFormat().resolvedOptions().timeZone`. Smooth step transitions (Tailwind `transition` + fade/slide classes — no new animation lib).

### Phase 8 — Booking creation & confirmation emails

- `src/lib/services/booking.ts`:
  - `createBooking(input)` — inside a Prisma transaction: re-check the slot is still free, insert booking, return with relations. Throws typed `SlotUnavailableError` on conflict (booker sees friendly retry UI).
  - `cancelBooking(bookingId, actorUserId)` — marks CANCELLED, deletes Google event, fires cancel emails.
- Extend `src/lib/services/email.ts` (reuse Resend client):
  - `sendBookingConfirmationToBooker` (with add-to-calendar .ics link)
  - `sendBookingNotificationToHost`
  - `sendCancellationToBooker` / `sendCancellationToHost`
- `src/lib/actions/booking.ts` — public action (no auth) for creation; authed action for cancel.

### Phase 9 — Google Calendar 2-way sync

- `src/lib/services/calendar.ts`:
  - `getGoogleOAuthClient(userId)` — load `Account` row, set tokens, auto-refresh via `googleapis` (add as dep if not present — verify in package.json; otherwise use raw `fetch` against Google APIs with refresh token)
  - `getBusyTimes(userId, start, end)` — freebusy API; returns `Array<{start, end}>`; used by Phase 6 slot engine
  - `createCalendarEvent(userId, booking)` — events.insert with booker as attendee, `sendUpdates=all`, returns `calendarEventId` saved on the Booking row
  - `deleteCalendarEvent(userId, calendarEventId)` — on cancel
- Failure mode: if no Google account linked OR token refresh fails, **log and continue** — the scheduling app must work without Calendar.
- Wire `getBusyTimes` into Phase 6 and `createCalendarEvent` into Phase 8.

### Phase 10 — Dashboard home & meetings list

- Refresh `src/app/(dashboard)/dashboard/page.tsx` — stat cards already there; hook up real counts + add "Next meeting" card.
- New page `src/app/(dashboard)/meetings/page.tsx` — tabs (Upcoming / Past / Cancelled), list of `meeting-card.tsx` with cancel action.
- Add "Meetings" to sidebar nav in `src/components/dashboard/sidebar-nav.tsx`.

### Phase 11 — Settings (minimum viable)

`src/app/(dashboard)/settings/page.tsx` with two sections:

1. **Profile** — name, bio, username (validates uniqueness), timezone (use IANA list)
2. **Integrations** — Google Calendar connect/disconnect button with status pill (reuses existing Google OAuth; no new provider config needed)

### Phase 12 — End-to-end verification

Manual run-through in order:

1. `npm run build` — zero TypeScript/lint errors
2. `npx prisma generate` if any schema change, `npx prisma db push` to dev DB
3. Sign in with Google → set weekly schedule (Mon–Fri 9–5) → add a date override → create event type "30 Minute Meeting"
4. Open `/[username]/30-minute-meeting` in incognito → pick a date → pick a time → book
5. Verify: booker confirmation email arrives, host notification email arrives, Google Calendar event is created on host calendar with booker as attendee
6. Cancel from dashboard meetings list → verify calendar event is deleted + cancellation emails sent
7. Block the same slot in Google Calendar externally → reload booking page → that slot disappears from grid

Add unit tests for `src/lib/services/slots.ts` covering: slot generation, overrides, conflict subtraction, buffer math, DST boundary, cross-timezone conversion.

---

## Critical files

**Create:**

- `src/lib/validators/{event-type,availability,booking,user}.ts`
- `src/lib/services/{event-type,availability,slots,booking,calendar}.ts`
- `src/lib/actions/{event-type,availability,booking,user}.ts`
- `src/types/index.ts`
- `src/app/(booking)/layout.tsx` + `[username]/page.tsx` + `[username]/[eventSlug]/page.tsx`
- `src/app/(dashboard)/events/new/page.tsx`, `events/[id]/edit/page.tsx`, `meetings/page.tsx`
- `src/components/booking/*` (5 components)
- `src/components/dashboard/{event-type-card,event-type-form,weekly-schedule-editor,date-override-calendar,meeting-card}.tsx`

**Modify:**

- `src/app/layout.tsx`, `src/app/globals.css` — fonts + design tokens
- `src/app/(marketing)/page.tsx` + `src/components/marketing/*` — polish
- `src/app/(dashboard)/events/page.tsx`, `availability/page.tsx`, `settings/page.tsx`, `dashboard/page.tsx`
- `src/components/dashboard/sidebar-nav.tsx` — add Meetings link
- `src/lib/services/email.ts` — add 4 booking email functions
- `src/lib/services/user.ts` — hook up real dashboard stats

**Reuse (do not rewrite):**

- Prisma schema — already complete; no changes needed
- `src/lib/auth.ts` + `auth.config.ts` — Google OAuth already requests calendar scopes
- `src/lib/db.ts` — Prisma singleton
- All `src/components/ui/*` shadcn primitives
- `sendMagicLinkEmail` Resend pattern for new booking emails

---

## Environment variables

Already configured for auth; confirm `.env` has these (all existing):

- `DATABASE_URL`, `AUTH_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, `RESEND_API_KEY`, `AUTH_RESEND_FROM`

Add one new:

- `NEXT_PUBLIC_APP_URL` — used for booking links inside emails

---

## Design system enforcement

- Every CTA uses the gradient `linear-gradient(135deg, #4a4bd7, #7073ff)` — no flat primary buttons.
- Section separation via background color shifts only — **never** 1px horizontal rules.
- No shadows on cards; use surface-container-low / surface-container tonal layers from DESIGN.md.
- Manrope for H1–H3, Inter for body / labels, 2× size ratio between headline and body.

---

## Specialized agents to use

- **`landing-page-builder`** → Phase 2
- **`booking-flow-builder`** → Phase 7
- **`builder`** → Phases 3, 4, 5, 6, 8, 9, 10, 11
- **`code-reviewer`** → after Phases 6, 8, 9 (the three complexity hotspots)

---

## Related docs

- Older broad product spec: `PROJECT_PLAN.md` (historical; not the demo scope above).
- Visual tokens: `DESIGN.md`
