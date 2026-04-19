import type { SVGProps } from "react"
import Image from "next/image"

type IconProps = SVGProps<SVGSVGElement>
type ImgIconProps = { className?: string }

/**
 * Official brand logos. Each icon is self-contained: it includes any
 * standard colored tile that's part of the brand identity. Consumers
 * size them via `className` (e.g. `className="h-8 w-8"`).
 *
 * Source: vendor brand kits, simpleicons.org for monochrome marks,
 * and Icons8 (public/icons8-*) for Google Calendar, Zoom, Teams, Outlook.
 */

// ─── Google "G" sign-in mark ────────────────────────────────────────────────

export function GoogleGIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" {...props}>
      <path
        fill="#FFC107"
        d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
      />
      <path
        fill="#FF3D00"
        d="M6.306 14.691l6.571 4.819C14.655 15.108 19.001 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.012 35.245 44 30 44 24c0-1.341-.138-2.65-.389-3.917z"
      />
    </svg>
  )
}

// ─── Google Meet ────────────────────────────────────────────────────────────

export function GoogleMeetIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 87 72" aria-hidden="true" {...props}>
      <path fill="#00832d" d="M49.5 36l8.53 9.75 11.47 7.33 2-17.02-2-16.64-11.69 6.44z" />
      <path
        fill="#0066da"
        d="M0 51.5V66c0 3.315 2.685 6 6 6h14.5l3-10.96-3-9.54-9.95-3z"
      />
      <path fill="#e94235" d="M20.5 0L0 20.5l10.55 3 9.95-3 2.95-9.41z" />
      <path fill="#2684fc" d="M0 20.5h20.5v31H0z" />
      <path
        fill="#00ac47"
        d="M82.6 8.68L69.5 19.42v33.66l13.16 10.79c1.97 1.54 4.85.135 4.85-2.37V11c0-2.535-2.945-3.925-4.91-2.32zM49.5 36v15.5h-29V72h43c3.315 0 6-2.685 6-6V53.08z"
      />
      <path
        fill="#ffba00"
        d="M63.5 0h-43v20.5h29V36l20-16.57V6c0-3.315-2.685-6-6-6z"
      />
    </svg>
  )
}

// ─── Icons8 brand assets ────────────────────────────────────────────────────

export function GoogleCalendarIcon({ className }: ImgIconProps) {
  return (
    <Image
      src="/icons8-google-calendar.svg"
      alt=""
      aria-hidden
      width={48}
      height={48}
      className={className}
      unoptimized
    />
  )
}

export function ZoomIcon({ className }: ImgIconProps) {
  return (
    <Image
      src="/icons8-zoom.svg"
      alt=""
      aria-hidden
      width={48}
      height={48}
      className={className}
      unoptimized
    />
  )
}

export function TeamsIcon({ className }: ImgIconProps) {
  return (
    <Image
      src="/icons8-microsoft-teams-2019-48.png"
      alt=""
      aria-hidden
      width={48}
      height={48}
      className={className}
    />
  )
}

export function OutlookIcon({ className }: ImgIconProps) {
  return (
    <Image
      src="/icons8-microsoft-outlook-2019-48.png"
      alt=""
      aria-hidden
      width={48}
      height={48}
      className={className}
    />
  )
}

export function AppStoreIcon({ className }: ImgIconProps) {
  return (
    <Image
      src="/icons8-app-store-48.png"
      alt=""
      aria-hidden
      width={48}
      height={48}
      className={className}
    />
  )
}

export function GooglePlayIcon({ className }: ImgIconProps) {
  return (
    <Image
      src="/icons8-google-play-48.png"
      alt=""
      aria-hidden
      width={48}
      height={48}
      className={className}
    />
  )
}

export function EdgeIcon({ className }: ImgIconProps) {
  return (
    <Image
      src="/icons8-microsoft-edge-48.png"
      alt=""
      aria-hidden
      width={48}
      height={48}
      className={className}
    />
  )
}

export function SafariIcon({ className }: ImgIconProps) {
  return (
    <Image
      src="/icons8-safari-48.png"
      alt=""
      aria-hidden
      width={48}
      height={48}
      className={className}
    />
  )
}

export function FirefoxIcon({ className }: ImgIconProps) {
  return (
    <Image
      src="/firefox.png"
      alt=""
      aria-hidden
      width={48}
      height={48}
      className={className}
    />
  )
}

// ─── Gmail ──────────────────────────────────────────────────────────────────

export function GmailIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 256 193" aria-hidden="true" {...props}>
      <path
        fill="#4285F4"
        d="M58.182 192.05V93.14L27.507 65.077 0 49.504v125.091c0 9.658 7.825 17.455 17.455 17.455h40.727Z"
      />
      <path
        fill="#34A853"
        d="M197.818 192.05h40.727c9.659 0 17.455-7.826 17.455-17.455V49.505l-31.156 17.837-26.026 25.798v98.91Z"
      />
      <path
        fill="#EA4335"
        d="M58.182 93.14 54.13 55.62l4.052-35.82L128 72.323l69.818-52.522 4.533 33.91-4.533 39.43L128 145.66z"
      />
      <path
        fill="#FBBC04"
        d="M197.818 19.8V93.14L256 49.504V28.595c0-19.39-22.14-30.444-37.644-18.808z"
      />
      <path
        fill="#C5221F"
        d="m0 49.504 26.759 20.07L58.182 93.14V19.8L37.644 4.387C22.115-7.249 0 3.805 0 23.196z"
      />
    </svg>
  )
}

// ─── Slack ──────────────────────────────────────────────────────────────────

export function SlackIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fill="#E01E5A"
        d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313z"
      />
      <path
        fill="#36C5F0"
        d="M8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312z"
      />
      <path
        fill="#2EB67D"
        d="M18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312z"
      />
      <path
        fill="#ECB22E"
        d="M15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"
      />
    </svg>
  )
}

// ─── Salesforce ─────────────────────────────────────────────────────────────

export function SalesforceIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fill="#00A1E0"
        d="M9.998 5.085c.778-.81 1.86-1.31 3.057-1.31 1.59 0 2.977.886 3.715 2.197a4.555 4.555 0 0 1 1.86-.392c2.535 0 4.59 2.072 4.59 4.629 0 2.555-2.055 4.628-4.59 4.628-.31 0-.612-.03-.905-.09-.65 1.158-1.89 1.94-3.31 1.94a3.78 3.78 0 0 1-1.66-.382c-.685 1.61-2.282 2.74-4.143 2.74-1.94 0-3.59-1.222-4.232-2.937a3.495 3.495 0 0 1-.722.075C1.612 16.183 0 14.553 0 12.541c0-1.348.722-2.527 1.798-3.158a4.022 4.022 0 0 1-.333-1.605c0-2.234 1.815-4.045 4.054-4.045 1.314 0 2.483.626 3.221 1.595.42-.135.866-.207 1.328-.207h-.07Z"
      />
    </svg>
  )
}

// ─── HubSpot ────────────────────────────────────────────────────────────────

export function HubSpotIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fill="#FF7A59"
        d="M18.164 7.93V5.084a2.198 2.198 0 0 0 1.267-1.978v-.067A2.2 2.2 0 0 0 17.238.847h-.067a2.2 2.2 0 0 0-2.193 2.192v.067a2.198 2.198 0 0 0 1.267 1.978v2.844a6.215 6.215 0 0 0-2.957 1.301L4.84 2.74a2.481 2.481 0 1 0-1.165 1.524l8.286 6.45a6.247 6.247 0 0 0 .096 7.045l-2.52 2.52a2.022 2.022 0 0 0-.582-.096 2.038 2.038 0 1 0 2.038 2.038c0-.2-.034-.392-.095-.581l2.493-2.493a6.262 6.262 0 1 0 4.773-11.218zm-1.054 9.398a3.214 3.214 0 1 1 0-6.428 3.214 3.214 0 0 1 0 6.428z"
      />
    </svg>
  )
}

// ─── LinkedIn ───────────────────────────────────────────────────────────────

export function LinkedInIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <rect width="24" height="24" rx="4" fill="#0A66C2" />
      <path
        fill="#fff"
        d="M7 9.5h2.7v8.5H7zM8.34 5.5a1.56 1.56 0 1 1 0 3.12 1.56 1.56 0 0 1 0-3.12zM11.5 9.5h2.6v1.16h.04c.36-.68 1.24-1.4 2.56-1.4 2.74 0 3.24 1.8 3.24 4.14V18h-2.7v-3.95c0-.94-.02-2.16-1.32-2.16-1.32 0-1.52 1.03-1.52 2.09V18h-2.7z"
      />
    </svg>
  )
}

// ─── Chrome ─────────────────────────────────────────────────────────────────

export function ChromeIcon({ className }: ImgIconProps) {
  return (
    <Image
      src="/icons8-chrome-48.png"
      alt=""
      aria-hidden
      width={48}
      height={48}
      className={className}
    />
  )
}

// ─── Stripe ─────────────────────────────────────────────────────────────────

export function StripeIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" {...props}>
      <rect width="32" height="32" rx="6" fill="#635BFF" />
      <path
        fill="#fff"
        d="M14.7 12.6c0-.78.64-1.08 1.7-1.08 1.52 0 3.44.46 4.96 1.28v-4.7c-1.66-.66-3.3-.92-4.96-.92-4.06 0-6.76 2.12-6.76 5.66 0 5.52 7.6 4.64 7.6 7.02 0 .92-.8 1.22-1.92 1.22-1.66 0-3.78-.68-5.46-1.6v4.76c1.86.8 3.74 1.14 5.46 1.14 4.16 0 7.02-2.06 7.02-5.64-.02-5.96-7.64-4.9-7.64-7.14z"
      />
    </svg>
  )
}

// ─── Zapier ─────────────────────────────────────────────────────────────────

export function ZapierIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" {...props}>
      <rect width="32" height="32" rx="6" fill="#FF4A00" />
      <path
        fill="#fff"
        d="M19.2 16a8.83 8.83 0 0 1-.57 3.13 8.83 8.83 0 0 1-3.14.57h-.01a8.84 8.84 0 0 1-3.13-.57A8.83 8.83 0 0 1 11.78 16a8.83 8.83 0 0 1 .57-3.13 8.84 8.84 0 0 1 3.13-.57h.01c1.1 0 2.16.2 3.14.57.37.97.57 2.03.57 3.13zm5.79-1.66h-5.55l3.93-3.93a9.62 9.62 0 0 0-1.49-1.88h-.01a9.65 9.65 0 0 0-1.88-1.5l-3.93 3.93V5.4a9.66 9.66 0 0 0-2.4 0l.01 5.56-3.93-3.93a9.7 9.7 0 0 0-1.88 1.49l-.01.01a9.69 9.69 0 0 0-1.49 1.88l3.93 3.93H5.4a9.66 9.66 0 0 0 0 2.4l5.55-.01-3.93 3.93a9.66 9.66 0 0 0 3.38 3.38l3.93-3.93v5.55a9.7 9.7 0 0 0 2.4 0v-5.55l3.94 3.93a9.7 9.7 0 0 0 1.88-1.49h.01a9.7 9.7 0 0 0 1.5-1.88l-3.94-3.94h5.56a9.66 9.66 0 0 0 0-2.4z"
      />
    </svg>
  )
}

// ─── PayPal ─────────────────────────────────────────────────────────────────

export function PayPalIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" {...props}>
      <rect width="32" height="32" rx="6" fill="#003087" />
      <path
        fill="#009CDE"
        d="M19.5 9.6c-.7-.8-1.96-1.16-3.58-1.16h-4.7a.67.67 0 0 0-.66.56l-1.95 12.4a.4.4 0 0 0 .4.46h2.91l.73-4.65v.15a.67.67 0 0 1 .66-.56h1.39c2.72 0 4.85-1.1 5.47-4.3.02-.1.04-.18.05-.27.42-2.16-.04-3.17-.72-3.96z"
      />
      <path
        fill="#fff"
        d="M21.05 11.86c-.1.66-.27 1.21-.5 1.69-.92 1.97-2.86 2.83-5.36 2.83h-1.39a.67.67 0 0 0-.66.56l-.7 4.45-.2 1.27a.36.36 0 0 0 .35.41h2.27a.59.59 0 0 0 .58-.5l.02-.12.43-2.72.03-.15a.59.59 0 0 1 .58-.5h.36c2.36 0 4.21-.96 4.75-3.74.23-1.16.11-2.13-.49-2.81-.18-.21-.4-.39-.68-.55z"
      />
    </svg>
  )
}
