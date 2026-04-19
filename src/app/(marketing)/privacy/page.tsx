import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Privacy Policy | Fluid",
  description: "How Fluid collects, uses, and protects your personal information.",
}

export default function PrivacyPage() {
  return (
    <div style={{ backgroundColor: "#ffffff" }}>
      <div className="mx-auto max-w-3xl px-6 py-16">
        {/* Header */}
        <div className="mb-12">
          <Link
            href="/"
            className="mb-8 inline-block text-sm font-medium transition-opacity hover:opacity-70"
            style={{ color: "#006bff" }}
          >
            ← Back to Fluid
          </Link>
          <h1
            className="mb-3 text-4xl font-bold leading-tight"
            style={{ color: "#1c2b4b", fontFamily: "var(--font-heading)" }}
          >
            Privacy Policy
          </h1>
          <p className="text-sm" style={{ color: "#6b7d94" }}>
            Effective date: April 18, 2026
          </p>
        </div>

        {/* Intro */}
        <p className="mb-10 text-base leading-relaxed" style={{ color: "#4b5a6d" }}>
          Fluid (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) operates the scheduling platform available at{" "}
          <span style={{ color: "#006bff" }}>fluidcal.vercel.app</span>. This Privacy Policy explains
          what information we collect, how we use it, and the choices you have regarding your data.
          By using Fluid, you agree to the practices described here.
        </p>

        <div className="flex flex-col gap-10">
          {/* Section 1 */}
          <section>
            <h2
              className="mb-4 text-xl font-semibold"
              style={{ color: "#1c2b4b", fontFamily: "var(--font-heading)" }}
            >
              1. Information We Collect
            </h2>
            <p className="mb-4 text-base leading-relaxed" style={{ color: "#4b5a6d" }}>
              We collect information you provide directly and information generated through your use of
              the service.
            </p>
            <ul className="flex flex-col gap-3 pl-4">
              <li className="flex flex-col gap-1">
                <span className="text-sm font-semibold" style={{ color: "#1c2b4b" }}>
                  Account information
                </span>
                <span className="text-sm leading-relaxed" style={{ color: "#4b5a6d" }}>
                  When you sign up, we collect your name, email address, and profile picture via your
                  Google or GitHub OAuth account. We do not store passwords.
                </span>
              </li>
              <li className="flex flex-col gap-1">
                <span className="text-sm font-semibold" style={{ color: "#1c2b4b" }}>
                  Calendar data
                </span>
                <span className="text-sm leading-relaxed" style={{ color: "#4b5a6d" }}>
                  If you connect Google Calendar, we access your calendar events solely to read
                  busy/free times and to create booking events on your behalf. We store an OAuth
                  refresh token to maintain this connection. We never read the content of your
                  existing calendar events beyond what is necessary to determine availability.
                </span>
              </li>
              <li className="flex flex-col gap-1">
                <span className="text-sm font-semibold" style={{ color: "#1c2b4b" }}>
                  Booking data
                </span>
                <span className="text-sm leading-relaxed" style={{ color: "#4b5a6d" }}>
                  When someone books a meeting with you, we collect the booker&apos;s name, email
                  address, and any optional notes they provide. This information is visible to you as
                  the host.
                </span>
              </li>
              <li className="flex flex-col gap-1">
                <span className="text-sm font-semibold" style={{ color: "#1c2b4b" }}>
                  Usage data
                </span>
                <span className="text-sm leading-relaxed" style={{ color: "#4b5a6d" }}>
                  We collect standard server logs including IP addresses, browser type, pages visited,
                  and timestamps. This data helps us diagnose issues and improve the service.
                </span>
              </li>
              <li className="flex flex-col gap-1">
                <span className="text-sm font-semibold" style={{ color: "#1c2b4b" }}>
                  Cookies
                </span>
                <span className="text-sm leading-relaxed" style={{ color: "#4b5a6d" }}>
                  We use a single session cookie to keep you signed in. We do not use third-party
                  advertising cookies or tracking pixels.
                </span>
              </li>
            </ul>
          </section>

          {/* Section 2 */}
          <section>
            <h2
              className="mb-4 text-xl font-semibold"
              style={{ color: "#1c2b4b", fontFamily: "var(--font-heading)" }}
            >
              2. How We Use Your Information
            </h2>
            <ul className="flex flex-col gap-2 pl-4">
              {[
                "Provide, operate, and improve the Fluid scheduling service.",
                "Display your availability and accept bookings on your behalf.",
                "Send booking confirmation and notification emails to you and your bookers.",
                "Sync confirmed meetings to your Google Calendar when you have connected it.",
                "Respond to support requests or account inquiries.",
                "Detect and prevent abuse, fraud, or unauthorised access.",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <span
                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ backgroundColor: "#006bff" }}
                  />
                  <span className="text-sm leading-relaxed" style={{ color: "#4b5a6d" }}>
                    {item}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm leading-relaxed" style={{ color: "#4b5a6d" }}>
              We do not use your data for advertising and we do not build ad profiles.
            </p>
          </section>

          {/* Section 3 */}
          <section>
            <h2
              className="mb-4 text-xl font-semibold"
              style={{ color: "#1c2b4b", fontFamily: "var(--font-heading)" }}
            >
              3. How We Share Your Information
            </h2>
            <p className="mb-4 text-base leading-relaxed" style={{ color: "#4b5a6d" }}>
              We do not sell your personal data. We share it only with the following service
              providers who process it solely on our behalf:
            </p>
            <ul className="flex flex-col gap-3 pl-4">
              <li className="flex flex-col gap-1">
                <span className="text-sm font-semibold" style={{ color: "#1c2b4b" }}>
                  Google Calendar API
                </span>
                <span className="text-sm leading-relaxed" style={{ color: "#4b5a6d" }}>
                  Used to read your free/busy information and create calendar events when a booking
                  is confirmed. Governed by{" "}
                  <a
                    href="https://policies.google.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-2"
                    style={{ color: "#006bff" }}
                  >
                    Google&apos;s Privacy Policy
                  </a>
                  .
                </span>
              </li>
              <li className="flex flex-col gap-1">
                <span className="text-sm font-semibold" style={{ color: "#1c2b4b" }}>
                  Email delivery
                </span>
                <span className="text-sm leading-relaxed" style={{ color: "#4b5a6d" }}>
                  Transactional emails (booking confirmations, sign-in links) are sent via SMTP.
                  Your name and email address are used only to deliver these messages.
                </span>
              </li>
              <li className="flex flex-col gap-1">
                <span className="text-sm font-semibold" style={{ color: "#1c2b4b" }}>
                  Neon (PostgreSQL)
                </span>
                <span className="text-sm leading-relaxed" style={{ color: "#4b5a6d" }}>
                  Our managed database provider stores your account data, event configurations, and
                  bookings in an encrypted PostgreSQL database hosted on AWS infrastructure.
                </span>
              </li>
            </ul>
            <p className="mt-4 text-sm leading-relaxed" style={{ color: "#4b5a6d" }}>
              We may also disclose information when required by law, court order, or to protect the
              rights and safety of Fluid and its users.
            </p>
          </section>

          {/* Section 4 */}
          <section>
            <h2
              className="mb-4 text-xl font-semibold"
              style={{ color: "#1c2b4b", fontFamily: "var(--font-heading)" }}
            >
              4. Data Retention
            </h2>
            <p className="text-base leading-relaxed" style={{ color: "#4b5a6d" }}>
              We retain your account data for as long as your account is active. Booking records are
              retained for 24 months after the meeting date to allow for audit and dispute resolution.
              If you delete your account, we permanently delete your personal data within 30 days,
              except where retention is required by applicable law. Google Calendar tokens are
              deleted immediately upon disconnecting the integration or deleting your account.
            </p>
          </section>

          {/* Section 5 */}
          <section>
            <h2
              className="mb-4 text-xl font-semibold"
              style={{ color: "#1c2b4b", fontFamily: "var(--font-heading)" }}
            >
              5. Your Rights
            </h2>
            <p className="mb-4 text-base leading-relaxed" style={{ color: "#4b5a6d" }}>
              Depending on your location, you may have the following rights regarding your personal
              data:
            </p>
            <ul className="flex flex-col gap-2 pl-4">
              {[
                "Access: request a copy of the personal data we hold about you.",
                "Correction: ask us to correct inaccurate or incomplete data.",
                "Deletion: request that we delete your account and associated data.",
                "Export: receive a machine-readable export of your booking data.",
                "Objection: object to certain processing activities.",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <span
                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ backgroundColor: "#006bff" }}
                  />
                  <span className="text-sm leading-relaxed" style={{ color: "#4b5a6d" }}>
                    {item}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm leading-relaxed" style={{ color: "#4b5a6d" }}>
              To exercise any of these rights, email us at{" "}
              <a
                href="mailto:support@fluidcal.app"
                className="underline underline-offset-2"
                style={{ color: "#006bff" }}
              >
                support@fluidcal.app
              </a>
              . We will respond within 30 days.
            </p>
          </section>

          {/* Section 6 */}
          <section>
            <h2
              className="mb-4 text-xl font-semibold"
              style={{ color: "#1c2b4b", fontFamily: "var(--font-heading)" }}
            >
              6. Security
            </h2>
            <p className="text-base leading-relaxed" style={{ color: "#4b5a6d" }}>
              All data transmitted between your browser and Fluid is encrypted using TLS (HTTPS). Data
              at rest is encrypted by our database provider. We never store passwords; authentication
              is handled entirely through OAuth providers (Google and GitHub). OAuth refresh tokens are
              stored encrypted and access is strictly limited. We conduct periodic security reviews and
              follow industry best practices, but no system is perfectly secure; please notify us
              immediately at{" "}
              <a
                href="mailto:support@fluidcal.app"
                className="underline underline-offset-2"
                style={{ color: "#006bff" }}
              >
                support@fluidcal.app
              </a>{" "}
              if you suspect unauthorised access to your account.
            </p>
          </section>

          {/* Section 7 */}
          <section>
            <h2
              className="mb-4 text-xl font-semibold"
              style={{ color: "#1c2b4b", fontFamily: "var(--font-heading)" }}
            >
              7. Changes to This Policy
            </h2>
            <p className="text-base leading-relaxed" style={{ color: "#4b5a6d" }}>
              We may update this Privacy Policy from time to time. When we do, we will revise the
              effective date at the top and, for material changes, notify you by email or by a
              prominent notice in the application. Continued use of Fluid after changes take effect
              constitutes your acceptance of the updated policy.
            </p>
          </section>

          {/* Section 8 */}
          <section>
            <h2
              className="mb-4 text-xl font-semibold"
              style={{ color: "#1c2b4b", fontFamily: "var(--font-heading)" }}
            >
              8. Contact
            </h2>
            <p className="text-base leading-relaxed" style={{ color: "#4b5a6d" }}>
              If you have questions about this Privacy Policy or how we handle your data, please
              contact us at{" "}
              <a
                href="mailto:support@fluidcal.app"
                className="font-medium underline underline-offset-2"
                style={{ color: "#006bff" }}
              >
                support@fluidcal.app
              </a>
              .
            </p>
          </section>
        </div>

        {/* Footer divider */}
        <div
          className="mt-16 border-t pt-8 text-center text-xs"
          style={{ borderColor: "#e8e6f0", color: "#6b7d94" }}
        >
          <p>
            © {new Date().getFullYear()} Fluid. All rights reserved.{" "}
            <Link
              href="/terms"
              className="underline underline-offset-2 transition-opacity hover:opacity-70"
              style={{ color: "#006bff" }}
            >
              Terms of Service
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
