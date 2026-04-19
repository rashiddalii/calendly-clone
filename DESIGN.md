# DESIGN.md — Blue Scheduling Hub
> Updated: 2026-04-18 — migrated from Indigo to Calendly-style Blue + White

---

## 1. Creative North Star: "The Fluid Architect"

This design system moves away from rigid, boxed-in productivity tool aesthetics. We are designing a **serene environment for time management** — sophisticated, breathable, and authoritative. Think high-end digital concierge, not SaaS grid.

**Key Principles:**
- **Weightless Depth** — use tonal surface shifts instead of borders
- **Editorial Authority** — treat scheduling data with the same hierarchy as a magazine spread
- **Intentional Breathing Room** — whitespace is a functional tool, not empty space

---

## 2. Color System

### Primary Brand — Calendly Blue
| Token | Hex | Usage |
|-------|-----|-------|
| `primary` / `brand` | `#006bff` | Interactive elements, links, CTAs |
| `primary-container` / `brand-container` | `#4d94ff` | CTA gradient endpoint, hover states |
| `on-primary` / `on-brand` | `#ffffff` | Text on primary backgrounds |

**CTA Gradient Rule:** Never use a flat primary hex on buttons. Apply `linear-gradient(135deg, #006bff, #4d94ff)` for a sense of forward motion.

### Surface Hierarchy — White + Subtle Blue Tints
| Level | Token | Hex | Use For |
|-------|-------|-----|---------|
| 0 — Base | `surface` | `#ffffff` | Page background (pure white) |
| 1 — Sections | `surface-container-low` | `#f0f5ff` | Sidebars, panels |
| 1 — Sections | `surface-container` | `#e5edff` | Section backgrounds |
| 2 — Cards | `surface-container-lowest` | `#ffffff` | Cards, inputs (active) |
| Elevated | `surface-container-high` | `#dae6ff` | Input resting state |
| Floating | `surface-container-highest` | `#d0deff` | Active overlays, tertiary buttons |
| Dimmed | `surface-dim` | `#bdd0f8` | Disabled / muted areas |
| Bright | `surface-bright` | `#ffffff` | Highlighted panels |

### Text & On-Surface — Calendly Navy
| Token | Hex | Usage |
|-------|-----|-------|
| `on-surface` | `#1c2b4b` | Primary text — Calendly navy (NEVER use pure #000000) |
| `on-surface-variant` | `#4b5a6d` | Secondary metadata, labels |
| `on-background` | `#1c2b4b` | Body text on page background |
| `background` | `#ffffff` | Document background |

### Secondary & Tertiary
| Token | Hex | Usage |
|-------|-----|-------|
| `secondary` | `#4b5a6d` | Secondary actions |
| `secondary-container` | `#d9e8ff` | Tentative holds, badges |
| `on-secondary` | `#ffffff` | Text on secondary |
| `on-secondary-container` | `#1c3a6e` | Text on secondary container |
| `tertiary` | `#2d8a5e` | Green accents (Calendly-style success) |
| `tertiary-container` | `#d0f2e3` | Tertiary backgrounds |

### Feedback
| Token | Hex | Usage |
|-------|-----|-------|
| `error` | `#a8364b` | Errors, conflicts |
| `error-container` | `#f97386` | Error backgrounds |
| `on-error` | `#fff7f7` | Text on error |

### Outlines
| Token | Hex | Usage |
|-------|-----|-------|
| `outline` | `#6b7d94` | Visible boundaries (use sparingly) |
| `outline-variant` | `#9dafc5` | Ghost borders at 15% opacity only |
| `surface-tint` | `#006bff` | Brand tint for empty states |

---

## 3. Typography

### Typefaces
| Role | Font | Rationale |
|------|------|-----------|
| Display & Headlines | **Manrope** | Modern geometric sans-serif — Editorial character |
| Titles & Body | **Inter** | Precision-optimized legibility for functional data |
| Labels | **Inter** | Consistent with body, smaller weight |

### Type Scale
| Token | Size | Font | Weight | Use |
|-------|------|------|--------|-----|
| `display-lg` | 3.5rem | Manrope | Bold | Hero moments: total hours booked, milestones, empty states |
| `display-md` | 2.8rem | Manrope | Bold | Large stat callouts |
| `display-sm` | 2.25rem | Manrope | SemiBold | Section hero numbers |
| `headline-lg` | 2rem | Manrope | SemiBold | Page titles |
| `headline-md` | 1.75rem | Manrope | SemiBold | Dashboard greetings |
| `headline-sm` | 1.5rem | Manrope | Medium | Section headers |
| `title-lg` | 1.25rem | Inter | SemiBold | Card titles |
| `title-md` | 1.125rem | Inter | Medium | Sub-section labels |
| `title-sm` | 1rem | Inter | Medium | Event names, list titles |
| `body-lg` | 1rem | Inter | Regular | Standard body copy |
| `body-md` | 0.875rem | Inter | Regular | Calendar descriptions, metadata |
| `body-sm` | 0.75rem | Inter | Regular | Helper text, captions |
| `label-lg` | 0.875rem | Inter | Medium | Form labels |
| `label-md` | 0.75rem | Inter | Medium | Input labels, chips |
| `label-sm` | 0.625rem | Inter | Medium | Tags, badges |

**Hierarchy Rule:** Always maintain a minimum 2× size ratio between Headline and Body text to avoid a flat typographic appearance.

---

## 4. Spacing & Layout

Based on a **3× spacing scale** (8px grid):

| Token | Value | Usage |
|-------|-------|-------|
| `spacing-xs` | 0.25rem (4px) | Tight gaps, icon spacing |
| `spacing-sm` | 0.5rem (8px) | Inner component gaps |
| `spacing-md` | 1rem (16px) | Standard padding |
| `spacing-lg` | 1.5rem (24px) | Card internal padding |
| `spacing-xl` | 2rem (32px) | Section gaps |
| `spacing-2xl` | 3rem (48px) | Page-level vertical rhythm |

**Asymmetric Margin Rule:** Use intentional asymmetry. If left margin is 40px, try 64px right margin for an editorial, modern feel. If you think there's enough whitespace, add 16px more.

---

## 5. Border Radius

**Roundness Scale:** `ROUND_EIGHT` (8px base)

| Token | Value | Usage |
|-------|-------|-------|
| `sm` | 0.25rem | Minimum — tooltips, tags, selection states |
| `md` | 0.75rem | Buttons, small cards, chips |
| `lg` | 1rem | Large dashboard containers, modals |
| `xl` | 1.5rem | Feature cards, full-bleed panels |
| `full` | 9999px | Pills, avatar badges |

**Rule:** Hard corners are prohibited. Every element must use a minimum of `sm` (0.25rem).

---

## 6. Elevation & Depth

We use **Tonal Layering** — never floating card drop shadows.

### The Layering Principle
Place a `surface-container-lowest` (#ffffff) card on a `surface-container-low` (#f0f5ff) section. The contrast creates a natural "lift" without shadows.

### Shadow Tokens (for floating elements only)
| Use Case | Value |
|----------|-------|
| Modals, Popovers | `box-shadow: 0 12px 40px rgba(28, 43, 75, 0.06)` |
| Hover cards | `box-shadow: 0 4px 16px rgba(28, 43, 75, 0.04)` |

**Ghost Border Fallback:** If a container requires a boundary for accessibility, use `outline-variant` (#9dafc5) at **15% opacity** only. Never 100% opaque borders.

### Glassmorphism (for floating UI elements)
- Background: `surface-container-lowest` at **80% opacity**
- Blur: `backdrop-filter: blur(24px)`
- Use for: hover menus, date pickers, floating overlays

---

## 7. The "No-Line" Rule

**1px borders for sectioning are strictly prohibited.**

Layout boundaries must be defined through **background color shifts**:
- ✅ Sidebar using `surface-container-low` against a `surface` main content area
- ✅ Dividers using a 1px-height `surface-container-high` bar that doesn't touch container edges
- ❌ `border: 1px solid #ccc` for section separation
- ❌ `border-bottom` on list items — use 16px vertical whitespace instead

---

## 8. Components

### Buttons
| Variant | Background | Text | Border | Hover |
|---------|-----------|------|--------|-------|
| **Primary** | `linear-gradient(135deg, #006bff, #4d94ff)` | `#ffffff` | none | Darken 5% |
| **Secondary** | transparent | `on-surface` | none | `surface-container-low` bg |
| **Tertiary** | `surface-container-highest` | `on-surface` | none | `surface-container-high` bg |

- Roundness: `md` (0.75rem) for all buttons
- Padding: `spacing-sm` vertical, `spacing-lg` horizontal

### Cards
- Background: `surface-container-lowest` (#ffffff)
- Radius: `lg` (1rem)
- Internal padding: `spacing-lg` (1.5rem)
- No divider lines — separate content with `body-sm` labels or vertical whitespace
- Natural lift via parent background: `surface-container-low` (#f0f5ff)

### Input Fields
| State | Background | Border |
|-------|-----------|--------|
| Resting | `surface-container-high` (#dae6ff) | none |
| Focus | `surface-container-lowest` (#ffffff) | 2px Ghost Border: `primary` at 30% opacity |
| Error | `surface-container-lowest` | 2px `error` (#a8364b) at 50% opacity |

- Radius: `md` (0.75rem)
- Label: `label-md` in `on-surface-variant` (#4b5a6d)

### Time Slot Pills
- Resting: `surface-container-low` background, `body-md` text
- Hover: scale(1.02), shift to `primary` color, soft ambient shadow
- Selected: `primary` background, `on-primary` text
- No button grid — treat as "pills" in a flex-wrap layout

### Badges & Status Indicators
- **Confirmed:** `secondary-container` background, `on-secondary-container` text
- **Urgent/Conflict:** `tertiary` (#2d8a5e) or `error` (#a8364b)
- **Tentative:** `secondary` (#4b5a6d)

### Navigation / Sidebar
- Background: `surface-container-low` (#f0f5ff)
- Active item: `surface-container-lowest` with left `primary` accent bar (3px)
- No borders separating sidebar from content

### Modals / Dialogs
- Background: Glassmorphism — `surface-container-lowest` at 80% opacity, blur 24px
- Shadow: `0 12px 40px rgba(28, 43, 75, 0.06)`
- Radius: `lg` (1rem)
- Overlay: `on-surface` at 30% opacity backdrop

---

## 9. Screens Inventory

All screens are **Desktop** (1280px wide base), exported from Stitch project `3922679111200956344`.

| Screen | Stitch Screen ID | Description |
|--------|-----------------|-------------|
| Landing Page | `ee18737d0b5a44e8999d24579ba73531` | Public marketing / hero page |
| Login Page | `4e7630d72e85455388c01cfa48c03485` | Authentication entry |
| Sign-Up Page | `08ca2c7638b649e7b3c2cb5f1d830d7f` | New user registration |
| Onboarding - Welcome | `fdbca695289f498fb8e0bbc296032a65` | First-run welcome step |
| Onboarding - Availability | `495bc8bf5f914105aa4be5a0eb1fb53c` | Availability setup step |
| Dashboard | `87b9625904e04612bf7bd25845a7924e` | Main app home |
| Event Types | `22efa5454d594bed88ffbb748d915d2f` | Event type management |
| Public Booking Page | `cb182de2f51b45188ad362abc76200e1` | Guest-facing booking flow |
| Booking Confirmation | `fd8349af4e2946488d591a848b28eb62` | Post-booking success state |
| Product Requirements Document | `43329d64f6d1486c908928dcc77c4c9b` | Internal reference |

---

## 10. Do's and Don'ts

### Do
- Use `on-surface` (`#1c2b4b`) for all body text — never pure `#000000`
- Use `display` sizes for numerical data (dates, counts) to make them feel like "Art Objects"
- Embrace asymmetric margins for editorial feel
- Add 16px more whitespace when in doubt
- Use `surface-tint` (#006bff) for subtle brand presence in empty states
- Use `backdrop-filter: blur(24px)` for floating elements

### Don't
- Don't use 1px gray borders for sectioning — use background shifts
- Don't use standard drop shadows on every card — reserve for floating/moving elements
- Don't use flat primary hex on CTAs — always use the 135° gradient
- Don't use hard corners — minimum `sm` (0.25rem) radius everywhere
- Don't use `#000000` for text
- Don't place dividers between list items — use vertical whitespace instead

### Accessibility
- All `primary` text on `surface` backgrounds must meet WCAG AA (4.5:1 contrast minimum)
- When using glassmorphism, ensure backdrop-blur is sufficient for legibility
- `on-surface` (#1c2b4b) on `surface` (#ffffff) passes AA at all sizes
