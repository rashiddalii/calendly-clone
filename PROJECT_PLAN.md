# PROJECT PLAN: Calendly Clone — Full Product Build

## Product Vision
A pixel-perfect Calendly clone with all core features. Professional scheduling platform where users create event types, set availability, share booking links, and sync with Google Calendar. Clean, modern, trustworthy design that matches Calendly's polished aesthetic.

---

## Design Direction

### Visual Identity
- **Primary color**: #0069FF (Calendly blue) — used for CTAs, active states, links
- **Secondary color**: #1A1A1A (near-black) — used for headings, nav
- **Accent colors**: #00A2FF (light blue), #006BFA (hover blue)
- **Success**: #00B57E (green for confirmations)
- **Warning**: #F5A623 (amber for alerts)
- **Danger**: #E04F5F (red for destructive actions)
- **Backgrounds**: #FFFFFF (primary), #F8F9FA (secondary/sidebar), #F2F3F5 (cards)
- **Text**: #1A1A1A (primary), #4D5055 (secondary), #8C8F94 (muted)
- **Borders**: #E5E7EB (light), #D1D5DB (medium)

### Typography
- **Headings**: "Cal Sans" or fallback to system sans-serif, weight 600-700
- **Body**: System sans-serif stack (-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif), weight 400-500
- **Sizes**: H1 36px, H2 28px, H3 22px, Body 16px, Small 14px, Caption 12px
- **Line height**: 1.5 for body, 1.2 for headings

### Component Style
- **Border radius**: 8px for cards/containers, 6px for buttons/inputs, 50% for avatars
- **Shadows**: Minimal — `0 1px 3px rgba(0,0,0,0.08)` for cards, `0 4px 12px rgba(0,0,0,0.1)` for modals
- **Buttons**: Solid fill primary (blue bg, white text), ghost secondary (transparent bg, blue text, blue border)
- **Inputs**: 40px height, 1px border, 8px radius, subtle focus ring in primary blue
- **Spacing grid**: 4px base (4, 8, 12, 16, 24, 32, 48, 64)

### Design References
Use Google Stitch to generate screens. Prompt Stitch with:
"Professional scheduling platform like Calendly. Clean, minimal, lots of whitespace. Primary blue #0069FF. White backgrounds. Subtle shadows. System sans-serif fonts. Rounded corners 8px. Modern SaaS aesthetic."

Export DESIGN.md from Stitch and place in project root. Claude Code must reference DESIGN.md for all UI implementation.

---

## Pages & Features — Complete List

### PHASE 1: Landing Page (Public Marketing Site)
**Priority: HIGH — Build first, this is the face of the product**

#### Page: Landing Page `/`
- **Navbar**: Logo left, nav links center (Product, Solutions, Enterprise, Pricing, Resources), "Log In" text button + "Get started" blue button right. Sticky on scroll with subtle shadow.
- **Hero section**: 
  - Headline: "Easy scheduling ahead" (large, bold)
  - Subheadline: "Calendly is your scheduling automation platform for eliminating the back-and-forth emails for finding the perfect time — and so much more."
  - CTA: "Sign up for free" blue button + "Talk to sales" ghost button
  - Hero image: Product screenshot showing the booking page UI (use a mock screenshot component)
- **Social proof bar**: "Trusted by 100,000+ companies" with grayscale company logos (use placeholder logos)
- **Features section "Scheduling for any meeting type"**:
  - One-on-one meetings card with illustration
  - Group events card
  - Round robin assignment card
  - Collective meetings card
- **How it works section**:
  - Step 1: "Create your event types" with product screenshot
  - Step 2: "Share your link" with product screenshot  
  - Step 3: "Get booked" with product screenshot
- **Integration section**: Grid of integration logos (Google Calendar, Zoom, Slack, Salesforce, etc.) with heading "Integrations that work for you"
- **Testimonials section**: 2-3 customer quote cards with avatar, name, title, company
- **CTA section**: Full-width blue background, "Start scheduling with Calendly" heading, "Sign up for free" button
- **Footer**: 4-column grid (Product, Solutions, About, Resources), social links, copyright, privacy/terms links

#### Page: Pricing `/pricing`
- Toggle: Monthly / Annual billing
- 4 plan cards: Free, Standard ($10/mo), Teams ($16/mo), Enterprise (custom)
- Each card: plan name, price, description, feature list with checkmarks, CTA button
- Feature comparison table below cards (expandable sections)
- FAQ accordion at bottom

#### Page: Login `/login`  
- Centered card layout
- "Log in to Calendly" heading
- "Sign in with Google" button (primary method)
- Email + magic link input as alternative
- "Don't have an account? Sign up" link
- Forgot password link

#### Page: Sign Up `/signup`
- Centered card layout
- "Sign up with Calendly" heading
- "Sign up with Google" button
- Email signup form (name, email)
- Terms acceptance checkbox
- "Already have an account? Log in" link

---

### PHASE 2: Authentication + Onboarding
**Priority: HIGH — Users need to log in before anything else**

#### Auth System
- Google OAuth via NextAuth v5 (primary — also grants calendar access)
- Email magic link via Resend (secondary)
- Session management with JWT
- Protected route middleware (all /dashboard/* routes)
- Auto-redirect: logged in users → /dashboard, logged out → /login

#### Onboarding Flow `/onboarding`
- Step 1: "Welcome! Let's set you up" — Upload avatar, confirm name
- Step 2: "Set your username" — username picker (checks uniqueness), shows preview URL: `yourdomain.com/username`
- Step 3: "Set your timezone" — Timezone dropdown (auto-detect from browser)
- Step 4: "Set your availability" — Quick weekly schedule picker (Mon-Fri 9-5 default)
- Step 5: "Create your first event type" — Quick setup (title + duration)
- Step 6: "You're all set!" — Share your booking link CTA
- Progress bar at top showing steps
- Skip option on non-essential steps

---

### PHASE 3: Dashboard + Core Layout
**Priority: HIGH — The app shell everything lives in**

#### Layout: Dashboard Shell
- **Sidebar** (left, 240px wide):
  - Logo at top
  - User avatar + name + dropdown (settings, logout)
  - Nav items with icons:
    - Home (house icon)
    - Event Types (calendar icon)
    - Meetings (video icon — shows upcoming/past meetings)
    - Availability (clock icon)
    - Workflows (zap icon — email reminders)
    - Routing (arrow-split icon — skip for MVP)
    - Analytics (chart icon)
  - "Create" button at bottom of nav
  - Collapse to icon-only on smaller screens
- **Mobile**: Sidebar becomes bottom tab bar (Home, Events, Meetings, More)
- **Top bar**: Page title left, notification bell + "Upgrade" button right

#### Page: Dashboard Home `/dashboard`
- Greeting: "Good morning, {name}" with date
- Quick stats row: 3 metric cards
  - Upcoming meetings (count + next meeting time)
  - Meetings this week (count)
  - Active event types (count)
- "Upcoming meetings" list (next 5 meetings with time, attendee name, event type)
- "Quick actions" section: Create event type, Share your link, Set availability
- Empty states with illustrations when no data

---

### PHASE 4: Event Types Management
**Priority: HIGH — Core feature**

#### Page: Event Types List `/dashboard/event-types`
- Header: "Event Types" + "New Event Type" button
- Grid of event type cards, each showing:
  - Color dot (left edge or top border in event color)
  - Event title
  - Duration badge (e.g., "30 min")
  - Booking link with copy button
  - Toggle switch (active/inactive)
  - Three-dot menu: Edit, Duplicate, Delete
- Empty state: Illustration + "Create your first event type" CTA
- Filter/sort: by active status, by date created

#### Modal/Page: Create/Edit Event Type `/dashboard/event-types/new` or `/dashboard/event-types/[id]/edit`
- **Tab 1: Event Details**
  - Event name input
  - Duration dropdown (15, 30, 45, 60, 90, 120 min or custom)
  - Location dropdown (Zoom, Google Meet, Phone, In-person, Custom)
  - Description textarea (shown on booking page)
  - Event link/slug input with preview
  - Event color picker (8 preset colors)
- **Tab 2: Availability**
  - Choose which availability schedule to use
  - Or override with custom hours for this event type
  - Date range: rolling days (e.g., 60 days into the future) or specific date range
- **Tab 3: Booking Rules**
  - Buffer before meeting (0, 5, 10, 15, 30 min)
  - Buffer after meeting (0, 5, 10, 15, 30 min)
  - Minimum scheduling notice (1hr, 2hr, 4hr, 12hr, 24hr, 48hr)
  - Maximum bookings per day (unlimited or set limit)
  - Start time increments (15, 20, 30, 60 min)
- **Tab 4: Booking Form**  
  - Default fields: Name (required), Email (required)
  - Add custom questions: text, textarea, dropdown, radio, checkbox, phone
  - Mark as required or optional
- **Tab 5: Notifications**
  - Confirmation email to booker (on/off, customizable message)
  - Reminder email to booker (on/off, timing: 24hr, 1hr, 15min before)
  - Notification to host (on/off)
  - Calendar invitation settings

---

### PHASE 5: Availability Management
**Priority: HIGH — Core feature**

#### Page: Availability `/dashboard/availability`
- **Named schedules**: Users can create multiple named availability schedules (e.g., "Working Hours", "Consulting Hours")
- **Weekly schedule view**: 
  - 7-day grid (Sun-Sat)
  - Each day: toggle on/off + add time ranges
  - Time range inputs: start time + end time dropdowns (15 min increments)
  - "Add another time range" for split schedules (e.g., 9-12 and 1-5)
  - Copy to all days button
- **Date overrides section**:
  - Calendar view showing current month
  - Click a date to: block entirely, or set custom hours
  - List of existing overrides with edit/delete
- **Timezone**: Display current timezone with change option
- **Preview**: "See what your bookers see" button — opens booking page preview

---

### PHASE 6: Public Booking Page
**Priority: HIGH — This is what end-users interact with**

#### Page: User Profile `/[username]`
- Host avatar + name + bio
- List of active event types as cards:
  - Event color dot
  - Event title
  - Duration
  - Brief description
  - "Book" button or click entire card
- Clean, minimal design — white background, centered content, max-width 680px

#### Page: Booking Flow `/[username]/[event-slug]`
- **Step 1: Select Date**
  - Left panel: Event info (title, duration, location, description, host name/avatar)
  - Right panel: Calendar month view
  - Navigable month-by-month (prev/next arrows)
  - Dates with availability are clickable (bold/blue)
  - Dates without availability are grayed out
  - Past dates disabled
- **Step 2: Select Time** (appears after date selection)
  - Date selected shown at top
  - List of available time slots as buttons
  - Times shown in booker's detected timezone
  - Timezone selector at bottom (dropdown to change)
  - Clicking a time → shows "Confirm" state on that button
- **Step 3: Enter Details** (appears after time confirmation)
  - Name input (required)
  - Email input (required)
  - Custom questions from event type config
  - "Add guests" expandable section (CC additional emails)
  - Notes/message textarea
  - "Schedule Event" primary button
- **Step 4: Confirmation** `/[username]/[event-slug]/confirmation`
  - Success checkmark animation
  - "You are scheduled!" heading
  - Meeting details card: event name, date, time, timezone, location/link
  - "Add to calendar" button (generates .ics file)
  - Google Calendar / Outlook quick-add links
  - "Reschedule" and "Cancel" links

#### Page: Reschedule `/reschedule/[bookingId]`
- Same calendar/time picker as booking flow
- Pre-filled with current meeting details
- "Reschedule" confirmation button
- Sends update emails to all parties

#### Page: Cancel `/cancel/[bookingId]`
- Meeting details summary
- "Why are you cancelling?" optional textarea
- "Cancel Meeting" destructive button (red)
- Confirmation message after cancellation
- Sends cancellation emails to all parties

---

### PHASE 7: Meetings (Upcoming & Past)
**Priority: MEDIUM**

#### Page: Upcoming Meetings `/dashboard/meetings/upcoming`
- List/table of confirmed future bookings
- Each row: Date/time, event type name, booker name/email, status badge
- Actions: Reschedule, Cancel, Copy meeting link
- Filter by: event type, date range
- Empty state: "No upcoming meetings"

#### Page: Past Meetings `/dashboard/meetings/past`
- Same layout as upcoming but for completed meetings
- Status: Completed, Cancelled, No-show
- Filter by: event type, date range, status

---

### PHASE 8: Google Calendar Integration
**Priority: MEDIUM — Key differentiator**

#### Feature: Calendar Sync
- Connect Google Calendar during onboarding or settings
- Two-way sync:
  - READ: Check Google Calendar busy times → exclude from available slots
  - WRITE: Create Google Calendar event when booking is confirmed
- Multiple calendar support (check conflicts across all calendars)
- Auto-update calendar events on reschedule/cancel

#### Settings: Connected Calendars `/dashboard/settings/calendars`
- "Connect Google Calendar" button
- List of connected calendars with toggle (check for conflicts yes/no)
- Default calendar for new events dropdown
- Disconnect option

---

### PHASE 9: Workflows (Email Automations)
**Priority: MEDIUM**

#### Page: Workflows `/dashboard/workflows`
- List of automation rules, each with:
  - Trigger: "Before event" / "After event" / "On booking" / "On cancellation"
  - Timing: "15 min before" / "1 hour before" / "24 hours before" / etc.
  - Action: Send email / Send SMS (email only for MVP)
  - Applied to: specific event types or all
- Default workflows: confirmation email, 24hr reminder, 1hr reminder
- Create custom workflow button
- Toggle workflows on/off

---

### PHASE 10: Analytics
**Priority: LOW — Nice to have**

#### Page: Analytics `/dashboard/analytics`
- Date range picker (last 7 days, 30 days, 90 days, custom)
- Metric cards: Total meetings, Cancellation rate, Most popular day, Most popular time
- Charts:
  - Meetings over time (line chart)
  - Meetings by event type (bar chart)
  - Meetings by day of week (bar chart)
  - Top hours heatmap (optional)
- Export data as CSV

---

### PHASE 11: Settings
**Priority: MEDIUM**

#### Page: Profile Settings `/dashboard/settings/profile`
- Avatar upload (with crop/resize)
- Full name input
- Username input (with availability check)
- Welcome message / bio textarea
- Timezone dropdown
- Language dropdown
- Date format preference (MM/DD/YYYY vs DD/MM/YYYY)
- Time format preference (12hr vs 24hr)

#### Page: Branding `/dashboard/settings/branding`
- Custom logo upload (shown on booking page)
- Brand color picker (accent color for booking page)
- Custom booking page URL preview
- "Remove Calendly branding" toggle (premium feature flag)

#### Page: Account `/dashboard/settings/account`
- Email address (with change flow)
- Connected accounts (Google)
- Delete account (with confirmation modal)
- Export data

---

### PHASE 12: Embed & Share
**Priority: LOW**

#### Feature: Sharing Options
- Copy booking link button (everywhere)
- "Add to website" modal with 3 embed options:
  - Inline embed (iframe code snippet)
  - Popup widget (JS snippet)
  - Popup text link (anchor tag snippet)
- Preview each embed style
- QR code generation for booking link

---

## Additional Agents Needed

### Add to `.claude/agents/`:

#### `landing-page-builder.md`
```
---
name: landing-page-builder
description: Builds marketing/landing pages with polished design. Use for the public-facing pages like landing page, pricing, login, signup. Focuses on conversion-optimized design, responsive layouts, smooth animations, and pixel-perfect execution.
tools: Read, Edit, Write, Bash, Glob, Grep
model: sonnet
---

You are a senior frontend engineer specializing in marketing sites and landing pages. Build conversion-optimized pages with polished animations, responsive design, and attention to detail.

## Rules
- Reference DESIGN.md for all design tokens if it exists
- Use Tailwind CSS exclusively for styling
- Add subtle scroll animations using CSS or framer-motion
- Mobile-first responsive design
- Optimize for Core Web Vitals (no layout shift, fast LCP)
- Use next/image for all images
- Use semantic HTML (header, nav, main, section, footer)
- Ensure all interactive elements are keyboard accessible
- Add proper meta tags and Open Graph data for SEO
```

#### `booking-flow-builder.md`
```
---
name: booking-flow-builder
description: Builds the public-facing booking experience. Use for the booking page calendar, time picker, form, and confirmation flow. Focuses on timezone handling, accessibility, mobile UX, and smooth step transitions.
tools: Read, Edit, Write, Bash, Glob, Grep
model: sonnet
---

You are a senior frontend engineer specializing in booking/scheduling UIs. Build smooth, accessible booking flows with precise timezone handling.

## Rules
- ALL dates stored in UTC, displayed in booker's local timezone
- Use date-fns and date-fns-tz for all date operations
- Calendar component must be keyboard navigable
- Time slots must update instantly when timezone changes
- Show loading skeletons while fetching availability
- Handle edge cases: timezone daylight saving transitions, fully booked days, past dates
- Mobile: stack layout vertically (event info on top, calendar below)
- Smooth transitions between booking steps (slide or fade)
- Confirmation page must include .ics file download
```

---

## Build Order (Paste These Into Claude Code)

### Session 1: Landing Page
```
Use the landing-page-builder agent to build the landing page at src/app/(marketing)/page.tsx

Build these sections in order:
1. Navbar (sticky, responsive, mobile hamburger menu)
2. Hero section with headline, subheadline, two CTAs, and product screenshot mock
3. Social proof bar with company logos
4. Features section (4 cards in grid)
5. How it works section (3 steps with screenshots)
6. Integration logos grid
7. Testimonials section (3 cards)
8. CTA section (full-width blue background)
9. Footer (4-column grid)

Follow the design direction in PROJECT_PLAN.md. Primary blue #0069FF.
Use the (marketing) route group with its own layout (no sidebar).
```

### Session 2: Auth
```
Use the builder agent to implement authentication:
1. NextAuth v5 config in src/lib/auth.ts with Google OAuth provider
2. Login page at src/app/(auth)/login/page.tsx
3. Signup page at src/app/(auth)/signup/page.tsx
4. Auth middleware to protect /dashboard/* routes
5. Session provider wrapper

We're using Prisma 7 — import from "@/generated/prisma".
Don't modify .env — tell me what vars I need.
```

### Session 3: Dashboard Layout
```
Use the builder agent to build the dashboard shell:
1. Sidebar navigation component (collapsible, with all nav items from PROJECT_PLAN.md)
2. Dashboard layout at src/app/(dashboard)/layout.tsx
3. Dashboard home page at src/app/(dashboard)/dashboard/page.tsx with greeting, stats cards, upcoming meetings list
4. Mobile bottom tab bar
5. All placeholder pages for other sections

Follow design tokens from PROJECT_PLAN.md.
```

### Session 4: Onboarding
```
Use the builder agent to build the onboarding flow at src/app/(onboarding)/onboarding/page.tsx:
1. Multi-step form with progress bar
2. Step 1: Welcome + avatar upload + name
3. Step 2: Username picker with uniqueness check
4. Step 3: Timezone auto-detect + selector
5. Step 4: Weekly availability quick setup
6. Step 5: Create first event type
7. Step 6: Success + share link

New users (no username set) should redirect here from /dashboard.
```

### Session 5: Event Types CRUD
```
Use the builder agent to implement event type management:
1. Event types list page with card grid
2. Create event type modal/page with all 5 tabs (details, availability, booking rules, form builder, notifications)
3. Edit event type (reuse create form)
4. Delete with confirmation
5. Duplicate event type
6. Toggle active/inactive
7. Copy booking link
8. Service functions for all CRUD operations
9. Zod validators for all inputs
```

### Session 6: Availability System
```
Use the builder agent to implement availability management:
1. Weekly schedule editor (day toggles, time range inputs, add/remove ranges)
2. Date override calendar (click dates to block or set custom hours)
3. Named schedules (create multiple)
4. Timezone display/change
5. Availability calculation engine in src/lib/services/availability.ts
6. The engine must: start with weekly schedule, apply overrides, subtract existing bookings, apply buffer times, apply min notice, return available slots
```

### Session 7: Public Booking Page
```
Use the booking-flow-builder agent to build the public booking experience:
1. User profile page at src/app/(booking)/[username]/page.tsx — lists their active event types
2. Booking flow at src/app/(booking)/[username]/[eventSlug]/page.tsx:
   - Step 1: Calendar date picker (month view, navigate months)
   - Step 2: Time slot list for selected date
   - Step 3: Booking form (name, email, custom questions, notes)
   - Step 4: Confirmation page with add-to-calendar
3. Reschedule page
4. Cancel page
5. API endpoint to fetch available slots (with timezone param)
6. Booking creation with conflict detection
7. Confirmation + cancellation emails via Resend
```

### Session 8: Meetings List
```
Use the builder agent to implement the meetings pages:
1. Upcoming meetings page — list of future bookings with actions
2. Past meetings page — list with status badges
3. Filters: by event type, date range, status
4. Actions: reschedule, cancel, copy link
5. Empty states with illustrations
```

### Session 9: Google Calendar Integration
```
Use the builder agent to implement Google Calendar sync:
1. OAuth flow to request calendar access (separate from auth login)
2. Settings page to connect/disconnect calendars
3. Read busy times from Google Calendar when calculating availability
4. Create calendar event on booking confirmation
5. Update/delete calendar event on reschedule/cancel
6. Service in src/lib/services/calendar.ts
```

### Session 10: Workflows
```
Use the builder agent to implement the workflows system:
1. Workflows list page
2. Create/edit workflow form
3. Default workflows: booking confirmation, 24hr reminder, 1hr reminder
4. Workflow engine that triggers emails at the right time
5. Email templates (use React Email or simple HTML)
6. Service in src/lib/services/workflow.ts
```

### Session 11: Settings + Profile
```
Use the builder agent to implement all settings pages:
1. Profile settings (avatar, name, username, bio, timezone)
2. Branding settings (logo, color, remove branding toggle)
3. Calendar connections (Google Calendar manage page)
4. Account settings (email change, delete account)
4. Embed & share options (inline, popup, text link code snippets)
```

### Session 12: Analytics
```
Use the builder agent to implement the analytics dashboard:
1. Date range picker
2. Metric cards (total meetings, cancellation rate, popular day/time)
3. Line chart: meetings over time (use recharts)
4. Bar chart: meetings by event type
5. Bar chart: meetings by day of week
6. CSV export
```

### Session 13: Pricing Page
```
Use the landing-page-builder agent to build the pricing page:
1. Monthly/Annual toggle
2. 4 plan cards (Free, Standard, Teams, Enterprise)
3. Feature comparison table (expandable sections)
4. FAQ accordion
5. CTA section at bottom
```

### Session 14: Polish + Review
```
Use the code-reviewer agent to do a full codebase review.
Then use the builder agent to:
1. Fix all critical and warning issues from review
2. Add loading.tsx skeletons for all pages
3. Add error.tsx error boundaries for all pages
4. Add proper meta tags and SEO for all public pages
5. Add 404 not-found page
6. Test all booking flow edge cases
7. Run npm run build and fix all errors
```

### Session 15: Deploy
```
Use the deployer agent to:
1. Run final build check
2. Commit all changes with proper conventional commit messages
3. Push to GitHub
4. Verify Vercel deployment
```

---

## Database Changes by Phase
- Phase 1-3: No changes (use existing schema)
- Phase 4: Possibly add custom questions JSON field to EventType
- Phase 5: No changes (Availability + DateOverride already exist)
- Phase 6: No changes (Booking already exists)
- Phase 9: Add google_calendar_token fields to Account model
- Phase 10: Add Workflow + WorkflowAction models
- Phase 11: Add branding fields to User model

---

## Environment Variables Needed
```
# Auth
AUTH_SECRET="generate-random-32-char-string"
AUTH_GOOGLE_ID="from-google-cloud-console"
AUTH_GOOGLE_SECRET="from-google-cloud-console"

# Database
DATABASE_URL="your-postgres-connection-string"

# Email
RESEND_API_KEY="from-resend.com"

# Google Calendar API
GOOGLE_CALENDAR_CLIENT_ID="same-as-auth-or-separate"
GOOGLE_CALENDAR_CLIENT_SECRET="same-as-auth-or-separate"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXTAUTH_URL="http://localhost:3000"
```

---

## Stitch Design Prompts

Use these prompts in Google Stitch to generate the screens:

### Prompt 1: Landing Page
"A SaaS landing page for a scheduling platform called 'CalSync'. Hero section with bold headline 'Easy scheduling ahead', blue CTA button (#0069FF), product screenshot. Social proof bar. 4-feature grid. How-it-works 3-step section. Testimonials. Footer. White background, clean, professional, lots of whitespace."

### Prompt 2: Dashboard
"A SaaS dashboard for a scheduling app. Left sidebar with navigation (Home, Event Types, Meetings, Availability, Workflows, Analytics). Main content area with greeting, 3 stat cards, upcoming meetings list. Clean white background, subtle card shadows, blue accent color #0069FF."

### Prompt 3: Event Types Page
"An event types management page. Grid of event type cards, each with colored left border, title, duration badge, booking link, toggle switch, three-dot menu. 'New Event Type' button in header. White cards, subtle shadows."

### Prompt 4: Booking Page
"A scheduling booking page. Left panel shows event details (title, 30 min, host avatar+name). Right panel shows a month calendar with blue highlighted available dates. Below calendar shows time slots as vertical button list. Clean, minimal, white background, centered layout max-width 700px."

### Prompt 5: Settings Page
"A settings page for a SaaS app. Left vertical tabs (Profile, Branding, Calendars, Account). Right content area shows profile form with avatar upload circle, name input, username input, bio textarea, timezone dropdown. Clean form layout, blue save button."
