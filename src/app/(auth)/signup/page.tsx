import { redirect } from "next/navigation"
import Link from "next/link"
import { auth } from "@/lib/auth"
import { handleOAuthSignUp } from "@/lib/actions/auth"
import { EmailSignInForm } from "@/components/auth/email-sign-in-form"
import { TrustLogosStrip } from "@/components/marketing/trust-logos-strip"
import { Check } from "lucide-react"

const BLUE = "#006BFF"
const NAVY = "#00213F"
const PANEL = "#F8F9FB"

const FEATURES = [
  "Multi-person and co-hosted meetings",
  "Round-robin meeting distribution",
  "Meeting reminders, follow-ups, and notifications",
  "Connect payment tools like PayPal or Stripe",
  "Remove Fluid branding on paid plans",
]

function GoogleGlyph({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  )
}

function MicrosoftGlyph({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 23 23" aria-hidden>
      <path fill="#f25022" d="M1 1h10v10H1z" />
      <path fill="#00a4ef" d="M12 1h10v10H12z" />
      <path fill="#7fba00" d="M1 12h10v10H1z" />
      <path fill="#ffb900" d="M12 12h10v10H12z" />
    </svg>
  )
}

function oauthButtonClass(disabled?: boolean) {
  return [
    "flex h-11 w-full items-center justify-center gap-2 rounded-[10px] border bg-white text-[15px] font-medium text-[#0F172A] transition-colors",
    disabled
      ? "cursor-not-allowed border-[#E5E7EB] opacity-50"
      : "cursor-pointer border-[#E5E7EB] hover:bg-[#F8F9FB]",
  ].join(" ")
}

export default async function SignupPage() {
  const session = await auth()
  if (session) redirect("/events")

  const year = new Date().getFullYear()
  const microsoftOAuthEnabled = Boolean(
    process.env.AUTH_MICROSOFT_ENTRA_ID_ID &&
      process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET
  )

  return (
    <div className="flex min-h-screen flex-col bg-white text-[#0F172A]">
      <header className="border-b border-[#E5E7EB] px-4 py-4 sm:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 no-underline"
            aria-label="Fluid home"
          >
            <span
              className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg"
              style={{ backgroundColor: "#1e3461" }}
            >
              <img
                src="/logo-fluid-icon.svg"
                alt=""
                width={22}
                height={22}
                className="object-contain"
              />
            </span>
            <span
              className="font-[family-name:var(--font-manrope)] text-xl font-bold tracking-tight"
              style={{ color: BLUE }}
            >
              Fluid
            </span>
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center rounded-lg border border-[#E5E7EB] bg-white px-4 py-2 text-[15px] font-medium text-[#444444] no-underline transition-colors hover:bg-[#F8F9FB]"
          >
            Log In
          </Link>
        </div>
      </header>

      <div className="grid flex-1 lg:grid-cols-2">
        {/* Form column */}
        <div className="flex flex-col justify-center px-4 py-12 sm:px-10 lg:px-16 xl:px-24">
          <div className="mx-auto w-full max-w-[440px]">
            <h1 className="font-[family-name:var(--font-manrope)] text-3xl font-bold tracking-tight text-[#0F172A] sm:text-[2rem] sm:leading-tight">
              Create your free account
            </h1>
            <p className="mt-2 text-[17px] text-[#64748B]">
              No credit card required. Upgrade anytime.
            </p>

            <div className="mt-10 flex flex-col gap-6">
              <EmailSignInForm variant="marketing" />

              <div className="flex items-center gap-4">
                <div className="h-px flex-1 bg-[#E5E7EB]" />
                <span className="text-[13px] font-medium uppercase tracking-wide text-[#94A3B8]">
                  or
                </span>
                <div className="h-px flex-1 bg-[#E5E7EB]" />
              </div>

              <div className="flex flex-col gap-3">
                <form action={handleOAuthSignUp}>
                  <input type="hidden" name="provider" value="google" />
                  <button type="submit" className={oauthButtonClass()}>
                    <GoogleGlyph className="h-5 w-5 shrink-0" />
                    Continue with Google
                  </button>
                </form>

                {microsoftOAuthEnabled ? (
                  <form action={handleOAuthSignUp}>
                    <input
                      type="hidden"
                      name="provider"
                      value="microsoft-entra-id"
                    />
                    <button type="submit" className={oauthButtonClass()}>
                      <MicrosoftGlyph className="h-5 w-5 shrink-0" />
                      Continue with Microsoft
                    </button>
                  </form>
                ) : (
                  <button
                    type="button"
                    disabled
                    title="Add AUTH_MICROSOFT_ENTRA_ID_ID and AUTH_MICROSOFT_ENTRA_ID_SECRET to enable Microsoft sign-in"
                    className={oauthButtonClass(true)}
                  >
                    <MicrosoftGlyph className="h-5 w-5 shrink-0" />
                    Continue with Microsoft
                  </button>
                )}
              </div>

              <p className="text-center text-[13px] leading-relaxed text-[#64748B]">
                Continue with Google or Microsoft to connect your calendar.
              </p>

              <p className="text-center text-[15px] text-[#0F172A]">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1 font-semibold no-underline"
                  style={{ color: BLUE }}
                >
                  Log In
                  <span aria-hidden className="text-lg leading-none">
                    →
                  </span>
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Value column */}
        <div
          className="flex flex-col justify-center border-t border-[#E5E7EB] px-4 py-14 sm:px-10 lg:border-l lg:border-t-0 lg:px-14 xl:px-20"
          style={{ backgroundColor: PANEL }}
        >
          <div className="mx-auto w-full max-w-[480px]">
            <span
              className="inline-flex rounded-full px-4 py-1.5 text-[13px] font-semibold text-white"
              style={{ backgroundColor: NAVY }}
            >
              Try Teams plan free
            </span>
            <h2 className="font-[family-name:var(--font-manrope)] mt-5 text-2xl font-bold leading-snug tracking-tight text-[#0F172A] sm:text-[1.65rem]">
              Explore premium features with your free 14-day Teams plan trial
            </h2>
            <ul className="mt-8 flex flex-col gap-4">
              {FEATURES.map((line) => (
                <li key={line} className="flex gap-3 text-[17px] leading-snug text-[#334155]">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[#006BFF]">
                    <Check className="h-4 w-4" strokeWidth={2.5} />
                  </span>
                  {line}
                </li>
              ))}
            </ul>

            <div className="mt-14">
              <p className="text-center text-[14px] text-[#64748B]">
                Join leading companies using the #1 scheduling tool
              </p>
              <TrustLogosStrip />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-auto border-t border-[#E5E7EB] px-4 py-5 sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 text-[13px] font-medium text-[#0F172A] sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            className="cursor-default border-0 bg-transparent p-0 text-left text-[#0F172A] sm:text-center"
          >
            English
          </button>
          <nav
            aria-label="Legal"
            className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:gap-x-5"
          >
            {[
              ["Privacy Policy", "#"],
              ["Legal", "#"],
              ["Status", "#"],
              ["Cookie Settings", "#"],
              ["Your Privacy Choices", "#"],
            ].map(([label, href]) => (
              <a
                key={label}
                href={href}
                className="whitespace-nowrap text-[#0F172A] no-underline hover:opacity-75"
              >
                {label}
              </a>
            ))}
          </nav>
          <p className="text-center text-[#0F172A] sm:text-right">
            Copyright Fluid {year}
          </p>
        </div>
      </footer>
    </div>
  )
}
