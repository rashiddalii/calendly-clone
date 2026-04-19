import Link from "next/link"
import { Check } from "lucide-react"

const plans = [
  {
    name: "Free",
    price: { monthly: 0, annual: 0 },
    description: "Perfect for individuals getting started.",
    cta: "Get started free",
    ctaHref: "/signup",
    highlighted: false,
    features: [
      "1 active event type",
      "Unlimited bookings",
      "Google Calendar sync",
      "Booking confirmation emails",
      "Basic availability rules",
    ],
  },
  {
    name: "Standard",
    price: { monthly: 10, annual: 8 },
    description: "For professionals who need more flexibility.",
    cta: "Start free trial",
    ctaHref: "/signup",
    highlighted: true,
    features: [
      "Unlimited event types",
      "Custom booking questions",
      "Buffer times & limits",
      "Email reminders",
      "Multiple calendar connections",
      "Timezone-aware booking",
      "Priority support",
    ],
  },
  {
    name: "Teams",
    price: { monthly: 16, annual: 13 },
    description: "Built for teams who schedule together.",
    cta: "Start free trial",
    ctaHref: "/signup",
    highlighted: false,
    features: [
      "Everything in Standard",
      "Round-robin scheduling",
      "Team availability management",
      "Shared event types",
      "Admin dashboard",
      "Analytics & reporting",
      "CRM integrations",
    ],
  },
  {
    name: "Enterprise",
    price: { monthly: null, annual: null },
    description: "Custom pricing for large organisations.",
    cta: "Contact sales",
    ctaHref: "/login",
    highlighted: false,
    features: [
      "Everything in Teams",
      "SSO & SCIM provisioning",
      "Advanced security controls",
      "Dedicated account manager",
      "SLA & uptime guarantee",
      "Custom integrations",
      "On-premise option",
    ],
  },
]

const faqs = [
  {
    q: "Is the free plan really free?",
    a: "Yes, forever. No credit card required. The free plan includes 1 event type and unlimited bookings.",
  },
  {
    q: "Can I change plans at any time?",
    a: "Absolutely. Upgrade, downgrade, or cancel at any time. Changes take effect immediately.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit and debit cards. Annual plans are billed upfront at a 20% discount.",
  },
  {
    q: "Do you offer refunds?",
    a: "Yes, if you're not satisfied within 14 days of upgrading, contact us for a full refund.",
  },
]

export const metadata = {
  title: "Pricing | Fluid",
  description: "Simple, transparent pricing. Start free and upgrade when you need to.",
}

export default function PricingPage() {
  return (
    <div style={{ backgroundColor: "#ffffff" }}>
      {/* Hero */}
      <section className="px-6 pb-8 pt-20 text-center">
        <p
          className="mb-4 inline-block rounded-full px-3 py-1 text-xs font-semibold tracking-wide uppercase"
          style={{ backgroundColor: "#d9e8ff", color: "#006bff" }}
        >
          Pricing
        </p>
        <h1
          className="mb-4 text-4xl font-bold leading-tight md:text-5xl"
          style={{ color: "#1c2b4b", fontFamily: "var(--font-heading)" }}
        >
          Scheduling that scales with you
        </h1>
        <p className="mx-auto max-w-xl text-lg" style={{ color: "#4b5a6d" }}>
          Start free, no credit card needed. Upgrade when you need more power.
          Cancel any time.
        </p>
      </section>

      {/* Plan cards */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className="relative flex flex-col rounded-2xl p-6"
              style={{
                backgroundColor: plan.highlighted ? "#006bff" : "#ffffff",
                ...(plan.highlighted
                  ? {}
                  : { boxShadow: "0 4px 16px rgba(50,50,59,0.04)" }),
              }}
            >
              {plan.highlighted && (
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-xs font-semibold"
                  style={{ backgroundColor: "#4d94ff", color: "#ffffff" }}
                >
                  Most popular
                </div>
              )}

              <div className="mb-6">
                <h2
                  className="mb-1 text-lg font-semibold"
                  style={{
                    color: plan.highlighted ? "#ffffff" : "#1c2b4b",
                    fontFamily: "var(--font-heading)",
                  }}
                >
                  {plan.name}
                </h2>
                <p
                  className="text-sm"
                  style={{
                    color: plan.highlighted
                      ? "rgba(251,247,255,0.75)"
                      : "#4b5a6d",
                  }}
                >
                  {plan.description}
                </p>
              </div>

              <div className="mb-6">
                {plan.price.monthly !== null ? (
                  <div className="flex items-end gap-1">
                    <span
                      className="text-4xl font-bold"
                      style={{
                        color: plan.highlighted ? "#ffffff" : "#1c2b4b",
                        fontFamily: "var(--font-heading)",
                      }}
                    >
                      ${plan.price.monthly}
                    </span>
                    <span
                      className="mb-1 text-sm"
                      style={{
                        color: plan.highlighted
                          ? "rgba(251,247,255,0.65)"
                          : "#6b7d94",
                      }}
                    >
                      /seat/mo
                    </span>
                  </div>
                ) : (
                  <span
                    className="text-3xl font-bold"
                    style={{
                      color: plan.highlighted ? "#ffffff" : "#1c2b4b",
                      fontFamily: "var(--font-heading)",
                    }}
                  >
                    Custom
                  </span>
                )}
              </div>

              <Link
                href={plan.ctaHref}
                className="mb-6 flex min-h-11 items-center justify-center rounded-xl py-2.5 text-sm font-semibold transition-opacity hover:opacity-90"
                style={
                  plan.highlighted
                    ? { backgroundColor: "#ffffff", color: "#006bff" }
                    : {
                        background: "linear-gradient(135deg, #006bff, #4d94ff)",
                        color: "#ffffff",
                      }
                }
              >
                {plan.cta}
              </Link>

              <ul className="flex flex-col gap-2.5">
                {plan.features.map((feat) => (
                  <li key={feat} className="flex items-start gap-2.5">
                    <Check
                      className="mt-0.5 h-4 w-4 shrink-0"
                      style={{
                        color: plan.highlighted ? "#a8f0c6" : "#006bff",
                      }}
                    />
                    <span
                      className="text-sm"
                      style={{
                        color: plan.highlighted
                          ? "rgba(251,247,255,0.85)"
                          : "#4b5a6d",
                      }}
                    >
                      {feat}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section
        className="mx-auto max-w-2xl px-6 py-16"
      >
        <h2
          className="mb-8 text-center text-2xl font-semibold"
          style={{ color: "#1c2b4b", fontFamily: "var(--font-heading)" }}
        >
          Frequently asked questions
        </h2>
        <div className="flex flex-col gap-6">
          {faqs.map((faq) => (
            <div
              key={faq.q}
              className="rounded-2xl p-6"
              style={{ backgroundColor: "#ffffff" }}
            >
              <h3
                className="mb-2 font-semibold"
                style={{ color: "#1c2b4b" }}
              >
                {faq.q}
              </h3>
              <p className="text-sm" style={{ color: "#4b5a6d" }}>
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section
        className="mx-4 mb-16 rounded-3xl px-8 py-14 text-center md:mx-auto md:max-w-4xl"
        style={{ background: "linear-gradient(135deg, #006bff, #4d94ff)" }}
      >
        <h2
          className="mb-3 text-3xl font-bold"
          style={{ color: "#ffffff", fontFamily: "var(--font-heading)" }}
        >
          Ready to start scheduling smarter?
        </h2>
        <p className="mb-8 text-base" style={{ color: "rgba(251,247,255,0.8)" }}>
          Join thousands of professionals who save hours every week.
        </p>
        <Link
          href="/signup"
          className="inline-flex items-center gap-2 rounded-xl px-8 py-3 text-sm font-semibold transition-opacity hover:opacity-90"
          style={{ backgroundColor: "#ffffff", color: "#006bff" }}
        >
          Get started free
        </Link>
      </section>
    </div>
  )
}
