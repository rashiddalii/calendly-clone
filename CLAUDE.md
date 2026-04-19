# Calendly Clone — Project Intelligence

## Project Overview
A full-featured scheduling platform (Calendly clone) built with Next.js 15, deployed on Vercel. Users can create event types, set availability, share booking links, and receive calendar integrations.

## Tech Stack
- **Framework**: Next.js 15 (App Router, Server Components, Server Actions)
- **Language**: TypeScript (strict mode)
- **Database**: PostgreSQL via Prisma ORM
- **Auth**: NextAuth.js v5 (Google + GitHub providers)
- **Styling**: Tailwind CSS v4 + shadcn/ui components
- **Email**: Resend for transactional emails
- **Calendar**: Google Calendar API integration
- **Deployment**: Vercel (auto-deploy from GitHub)
- **Timezone**: date-fns-tz for all timezone operations

## Project Structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/             # Auth pages (login, register)
│   ├── (dashboard)/        # Protected dashboard routes
│   │   ├── dashboard/      # Main dashboard
│   │   ├── events/         # Event type management
│   │   ├── availability/   # Availability settings
│   │   └── settings/       # User settings
│   ├── (booking)/          # Public booking pages
│   │   └── [username]/[eventSlug]/  # Public booking flow
│   └── api/                # API routes
├── components/
│   ├── ui/                 # shadcn/ui base components
│   ├── booking/            # Booking-specific components
│   ├── dashboard/          # Dashboard components
│   └── shared/             # Shared/layout components
├── lib/
│   ├── db.ts               # Prisma client singleton
│   ├── auth.ts             # NextAuth configuration
│   ├── validators/         # Zod schemas for validation
│   ├── utils/              # Utility functions
│   └── services/           # Business logic services
│       ├── availability.ts # Availability calculation engine
│       ├── booking.ts      # Booking creation + conflict detection
│       ├── calendar.ts     # Google Calendar sync
│       └── email.ts        # Email notifications
├── hooks/                  # Custom React hooks
├── types/                  # TypeScript type definitions
└── prisma/
    ├── schema.prisma       # Database schema
    └── seed.ts             # Seed data
```

## Coding Rules

### General
- Use Server Components by default. Only add "use client" when you need interactivity.
- Use Server Actions for mutations (form submissions, data updates).
- All database queries go through service files in `src/lib/services/`, never directly in components.
- Validate ALL inputs with Zod schemas from `src/lib/validators/`.
- Handle errors with try/catch and return typed responses, never throw unhandled.
- **STRICT: NEVER write em dashes (—) anywhere in user-facing text.** This covers UI labels, body copy, page titles, metadata titles, placeholder text, tooltips, and error messages. Use a colon, comma, period, or reword. Examples: "Active: booking link" not "Active — booking link"; "Settings | Fluid" not "Settings — Fluid".

### Naming
- Files: kebab-case (`event-type-card.tsx`)
- Components: PascalCase (`EventTypeCard`)
- Functions/variables: camelCase (`getAvailableSlots`)
- Database models: PascalCase singular (`EventType`, `Booking`)
- API routes: RESTful naming (`/api/events/[id]`)

### Styling
- Use Tailwind utility classes. No custom CSS files.
- Use shadcn/ui components for all form elements, dialogs, dropdowns, etc.
- Mobile-first responsive design (sm → md → lg breakpoints).
- Consistent spacing: use 4px grid (p-1, p-2, p-4, p-6, p-8).
- ALL clickable elements (button, [role="button"], interactive divs/cards) MUST have `cursor-pointer` class. No exceptions.
- NEVER use em dashes (—) anywhere in user-facing text (see General rules above).

### Database
- Always use Prisma transactions for multi-step operations.
- Include proper indexes on frequently queried fields.
- Use soft deletes (deletedAt column) for user-facing data.
- All timestamps stored in UTC. Convert to user timezone only in the UI.

### Testing
- Write integration tests for booking conflict detection.
- Write unit tests for timezone conversion utilities.
- Test files live next to source: `availability.test.ts` beside `availability.ts`.

## Key Business Logic

### Availability Engine
1. User sets weekly recurring availability (e.g., Mon-Fri 9am-5pm in their timezone).
2. Override specific dates (block Dec 25, add Saturday Nov 15).
3. When calculating available slots for a booking page:
   - Start with weekly schedule for the date range
   - Apply date overrides
   - Subtract existing bookings (from our DB)
   - Subtract Google Calendar busy times (if connected)
   - Apply buffer time between meetings
   - Apply minimum scheduling notice (e.g., can't book < 4 hours from now)
   - Return available slots in the BOOKER'S timezone

### Booking Flow
1. Booker visits `/{username}/{event-slug}`
2. Sees calendar with available dates (next 60 days)
3. Picks a date → sees available time slots
4. Fills in name, email, optional notes
5. System creates booking, sends confirmation emails to both parties
6. If Google Calendar connected → creates calendar event for host

## Git Workflow
- Main branch: `main` (auto-deploys to production on Vercel)
- Feature branches: `feat/feature-name`
- Always commit with conventional commits: `feat:`, `fix:`, `chore:`, `refactor:`
- Push triggers Vercel preview deployment automatically

## Commands for Claude
- Before implementing a feature, always check existing code for patterns to follow.
- Run `npx prisma generate` after any schema changes.
- Run `npx prisma db push` to sync schema to dev database.
- Run `npm run build` before committing to catch type errors.
- Use `npx shadcn@latest add [component]` to add new shadcn components.

## graphify

This project has a graphify knowledge graph at graphify-out/.

Rules:
- Before answering architecture or codebase questions, read graphify-out/GRAPH_REPORT.md for god nodes and community structure
- If graphify-out/wiki/index.md exists, navigate it instead of reading raw files
- After modifying code files in this session, run `python3 -c "from graphify.watch import _rebuild_code; from pathlib import Path; _rebuild_code(Path('.'))"` to keep the graph current

## Build Plan & Progress

- **ALWAYS read `CLIENT_DEMO_BUILD_PLAN.md` at the start of each session** — it is the authoritative roadmap and tracks which phases are complete.
- The implementation snapshot table at the top of that file shows the current status of each phase.
- Update the snapshot table in `CLIENT_DEMO_BUILD_PLAN.md` whenever a phase is completed.

## Design System
- All UI designs are generated in Google Stitch and exported as DESIGN.md
- ALWAYS reference DESIGN.md for colors, typography, spacing, and component patterns
- Convert Stitch HTML output to React + shadcn/ui + Tailwind CSS
- Never invent new colors or spacing — use only what's defined in DESIGN.md
- If DESIGN.md is not present, use: primary #6366f1 (indigo), 
  neutral grays, Inter font, 8px spacing grid
