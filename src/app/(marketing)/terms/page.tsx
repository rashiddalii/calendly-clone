import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Terms of Service | Fluid",
  description: "The terms and conditions governing your use of the Fluid scheduling platform.",
}

export default function TermsPage() {
  return (
    <div style={{ backgroundColor: "#fcf8fe" }}>
      <div className="mx-auto max-w-3xl px-6 py-16">
        {/* Header */}
        <div className="mb-12">
          <Link
            href="/"
            className="mb-8 inline-block text-sm font-medium transition-opacity hover:opacity-70"
            style={{ color: "#4a4bd7" }}
          >
            ← Back to Fluid
          </Link>
          <h1
            className="mb-3 text-4xl font-bold leading-tight"
            style={{ color: "#32323b", fontFamily: "var(--font-heading)" }}
          >
            Terms of Service
          </h1>
          <p className="text-sm" style={{ color: "#7b7984" }}>
            Effective date: April 18, 2026
          </p>
        </div>

        {/* Intro */}
        <p className="mb-10 text-base leading-relaxed" style={{ color: "#5f5e68" }}>
          These Terms of Service (&quot;Terms&quot;) govern your access to and use of Fluid
          (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;), the scheduling platform available at{" "}
          <span style={{ color: "#4a4bd7" }}>fluidcal.vercel.app</span>. Please read these Terms
          carefully before using the service. By creating an account or using Fluid in any way, you
          agree to be bound by these Terms.
        </p>

        <div className="flex flex-col gap-10">
          {/* Section 1 */}
          <section>
            <h2
              className="mb-4 text-xl font-semibold"
              style={{ color: "#32323b", fontFamily: "var(--font-heading)" }}
            >
              1. Acceptance of Terms
            </h2>
            <p className="text-base leading-relaxed" style={{ color: "#5f5e68" }}>
              By accessing or using Fluid, you confirm that you are at least 16 years old, have read
              and understood these Terms, and agree to be legally bound by them. If you are using
              Fluid on behalf of an organisation, you represent that you have the authority to bind
              that organisation to these Terms.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2
              className="mb-4 text-xl font-semibold"
              style={{ color: "#32323b", fontFamily: "var(--font-heading)" }}
            >
              2. Description of Service
            </h2>
            <p className="mb-4 text-base leading-relaxed" style={{ color: "#5f5e68" }}>
              Fluid is a scheduling platform that allows you to:
            </p>
            <ul className="mb-4 flex flex-col gap-2 pl-4">
              {[
                "Create event types with custom durations, availability windows, and booking rules.",
                "Share a personal booking link so others can schedule meetings with you.",
                "Set weekly recurring availability and date-specific overrides.",
                "Connect your Google Calendar to automatically block busy times and add confirmed bookings.",
                "Receive email notifications for new, cancelled, or rescheduled bookings.",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <span
                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ backgroundColor: "#4a4bd7" }}
                  />
                  <span className="text-sm leading-relaxed" style={{ color: "#5f5e68" }}>
                    {item}
                  </span>
                </li>
              ))}
            </ul>
            <p className="text-sm leading-relaxed" style={{ color: "#5f5e68" }}>
              We reserve the right to modify, suspend, or discontinue any aspect of the service at any
              time with reasonable notice where practicable.
            </p>
          </section>

          {/* Section 3 */}
          <section>
            <h2
              className="mb-4 text-xl font-semibold"
              style={{ color: "#32323b", fontFamily: "var(--font-heading)" }}
            >
              3. Accounts
            </h2>
            <p className="mb-4 text-base leading-relaxed" style={{ color: "#5f5e68" }}>
              To use Fluid you must authenticate via a supported OAuth provider (Google or GitHub).
              You are responsible for:
            </p>
            <ul className="flex flex-col gap-2 pl-4">
              {[
                "Maintaining the security of your OAuth session and signing out on shared devices.",
                "All activity that occurs under your account.",
                "Ensuring that the information in your profile is accurate and kept up to date.",
                "Notifying us immediately at support@fluidcal.app if you suspect unauthorised access.",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <span
                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ backgroundColor: "#4a4bd7" }}
                  />
                  <span className="text-sm leading-relaxed" style={{ color: "#5f5e68" }}>
                    {item}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm leading-relaxed" style={{ color: "#5f5e68" }}>
              We reserve the right to suspend or terminate accounts that violate these Terms.
            </p>
          </section>

          {/* Section 4 */}
          <section>
            <h2
              className="mb-4 text-xl font-semibold"
              style={{ color: "#32323b", fontFamily: "var(--font-heading)" }}
            >
              4. Acceptable Use
            </h2>
            <p className="mb-4 text-base leading-relaxed" style={{ color: "#5f5e68" }}>
              You agree not to use Fluid to:
            </p>
            <ul className="flex flex-col gap-2 pl-4">
              {[
                "Send unsolicited commercial messages (spam) to bookers or third parties.",
                "Impersonate another person or organisation, or misrepresent your affiliation.",
                "Scrape, crawl, or systematically extract data from the platform without our written permission.",
                "Attempt to gain unauthorised access to other users' accounts or data.",
                "Upload or transmit malicious code, viruses, or any content designed to disrupt the service.",
                "Use the service for any unlawful purpose or in violation of applicable regulations.",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <span
                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ backgroundColor: "#4a4bd7" }}
                  />
                  <span className="text-sm leading-relaxed" style={{ color: "#5f5e68" }}>
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* Section 5 */}
          <section>
            <h2
              className="mb-4 text-xl font-semibold"
              style={{ color: "#32323b", fontFamily: "var(--font-heading)" }}
            >
              5. Google Calendar Integration
            </h2>
            <p className="mb-4 text-base leading-relaxed" style={{ color: "#5f5e68" }}>
              Fluid offers optional integration with Google Calendar. When you connect your Google
              account, we request the following OAuth scopes:
            </p>
            <ul className="mb-4 flex flex-col gap-2 pl-4">
              {[
                "Read your calendar events to determine your free/busy status.",
                "Create, update, and delete calendar events to reflect confirmed or cancelled bookings.",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <span
                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ backgroundColor: "#4a4bd7" }}
                  />
                  <span className="text-sm leading-relaxed" style={{ color: "#5f5e68" }}>
                    {item}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mb-3 text-sm leading-relaxed" style={{ color: "#5f5e68" }}>
              We access your calendar data only to the minimum extent necessary to provide this
              feature. We do not read the content of existing calendar events beyond what is
              required to determine availability.
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "#5f5e68" }}>
              You can revoke Fluid&apos;s access to Google Calendar at any time from your Google
              Account security settings at{" "}
              <a
                href="https://myaccount.google.com/permissions"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2"
                style={{ color: "#4a4bd7" }}
              >
                myaccount.google.com/permissions
              </a>
              , or from your Fluid settings page. Revoking access will disconnect the integration
              and delete your stored Google OAuth token.
            </p>
          </section>

          {/* Section 6 */}
          <section>
            <h2
              className="mb-4 text-xl font-semibold"
              style={{ color: "#32323b", fontFamily: "var(--font-heading)" }}
            >
              6. Intellectual Property
            </h2>
            <p className="mb-3 text-base leading-relaxed" style={{ color: "#5f5e68" }}>
              Fluid and its original content, features, and functionality are owned by us and are
              protected by applicable intellectual property laws. You may not copy, modify,
              distribute, or create derivative works based on Fluid without our prior written consent.
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "#5f5e68" }}>
              You retain ownership of any content you create within the service (event types,
              availability configurations, booking notes). By using Fluid, you grant us a limited
              licence to store and display that content solely for the purpose of providing the
              service to you.
            </p>
          </section>

          {/* Section 7 */}
          <section>
            <h2
              className="mb-4 text-xl font-semibold"
              style={{ color: "#32323b", fontFamily: "var(--font-heading)" }}
            >
              7. Termination
            </h2>
            <p className="text-base leading-relaxed" style={{ color: "#5f5e68" }}>
              You may delete your account at any time from the settings page. We may suspend or
              terminate your access to Fluid immediately, without prior notice, if we reasonably
              believe you have violated these Terms or if required by law. Upon termination, your
              right to use the service ceases immediately and we will process data deletion in
              accordance with our{" "}
              <Link
                href="/privacy"
                className="underline underline-offset-2"
                style={{ color: "#4a4bd7" }}
              >
                Privacy Policy
              </Link>
              .
            </p>
          </section>

          {/* Section 8 */}
          <section>
            <h2
              className="mb-4 text-xl font-semibold"
              style={{ color: "#32323b", fontFamily: "var(--font-heading)" }}
            >
              8. Disclaimer of Warranties
            </h2>
            <p className="text-base leading-relaxed" style={{ color: "#5f5e68" }}>
              Fluid is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind,
              either express or implied, including but not limited to implied warranties of
              merchantability, fitness for a particular purpose, or non-infringement. We do not
              warrant that the service will be uninterrupted, error-free, or free of harmful
              components. Your use of the service is at your sole risk.
            </p>
          </section>

          {/* Section 9 */}
          <section>
            <h2
              className="mb-4 text-xl font-semibold"
              style={{ color: "#32323b", fontFamily: "var(--font-heading)" }}
            >
              9. Limitation of Liability
            </h2>
            <p className="text-base leading-relaxed" style={{ color: "#5f5e68" }}>
              To the fullest extent permitted by applicable law, Fluid and its operators shall not be
              liable for any indirect, incidental, special, consequential, or punitive damages,
              including but not limited to lost profits, missed meetings, loss of data, or business
              interruption, arising out of your use of or inability to use the service, even if we
              have been advised of the possibility of such damages. Our aggregate liability to you
              for any claim arising out of these Terms shall not exceed the greater of (a) the amount
              you paid us in the 12 months preceding the claim or (b) USD $10.
            </p>
          </section>

          {/* Section 10 */}
          <section>
            <h2
              className="mb-4 text-xl font-semibold"
              style={{ color: "#32323b", fontFamily: "var(--font-heading)" }}
            >
              10. Changes to Terms
            </h2>
            <p className="text-base leading-relaxed" style={{ color: "#5f5e68" }}>
              We may update these Terms from time to time. When we do, we will revise the effective
              date at the top of this page. For material changes, we will notify you by email or by
              a prominent in-app notice at least 14 days before the changes take effect. Continued
              use of Fluid after the effective date of updated Terms constitutes your acceptance of
              the changes. If you do not agree to the updated Terms, you must stop using the service
              and may delete your account.
            </p>
          </section>

          {/* Section 11 */}
          <section>
            <h2
              className="mb-4 text-xl font-semibold"
              style={{ color: "#32323b", fontFamily: "var(--font-heading)" }}
            >
              11. Governing Law
            </h2>
            <p className="text-base leading-relaxed" style={{ color: "#5f5e68" }}>
              These Terms are governed by and construed in accordance with applicable law. Any
              disputes arising under these Terms will be subject to the exclusive jurisdiction of
              the competent courts of the jurisdiction in which you reside, unless otherwise required
              by mandatory local law.
            </p>
          </section>

          {/* Section 12 */}
          <section>
            <h2
              className="mb-4 text-xl font-semibold"
              style={{ color: "#32323b", fontFamily: "var(--font-heading)" }}
            >
              12. Contact
            </h2>
            <p className="text-base leading-relaxed" style={{ color: "#5f5e68" }}>
              If you have any questions about these Terms or wish to report a violation, please
              contact us at{" "}
              <a
                href="mailto:support@fluidcal.app"
                className="font-medium underline underline-offset-2"
                style={{ color: "#4a4bd7" }}
              >
                support@fluidcal.app
              </a>
              . We aim to respond to all enquiries within 5 business days.
            </p>
          </section>
        </div>

        {/* Footer divider */}
        <div
          className="mt-16 border-t pt-8 text-center text-xs"
          style={{ borderColor: "#e8e6f0", color: "#7b7984" }}
        >
          <p>
            © {new Date().getFullYear()} Fluid. All rights reserved.{" "}
            <Link
              href="/privacy"
              className="underline underline-offset-2 transition-opacity hover:opacity-70"
              style={{ color: "#4a4bd7" }}
            >
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
