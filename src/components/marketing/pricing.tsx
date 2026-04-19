"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

interface Plan {
  name: string;
  tagline: string;
  price: string;
  yearlyPrice: string;
  cta: string;
  ctaStyle: "dark" | "blue" | "outline";
  recommended: boolean;
  features: string[];
}

const PLANS: Plan[] = [
  {
    name: "Free",
    tagline: "For personal use",
    price: "Always free",
    yearlyPrice: "Always free",
    cta: "Get started",
    ctaStyle: "dark",
    recommended: false,
    features: [
      "1 active event type",
      "Unlimited meetings",
      "Fluid branding",
      "Google Calendar sync",
      "Email notifications",
    ],
  },
  {
    name: "Standard",
    tagline: "For professionals",
    price: "$10/seat/mo",
    yearlyPrice: "$8/seat/mo",
    cta: "Get started",
    ctaStyle: "blue",
    recommended: false,
    features: [
      "Unlimited event types",
      "Custom branding",
      "SMS notifications",
      "Workflows & reminders",
      "Analytics dashboard",
    ],
  },
  {
    name: "Teams",
    tagline: "For growing businesses",
    price: "$16/seat/mo",
    yearlyPrice: "$13/seat/mo",
    cta: "Try for Free",
    ctaStyle: "blue",
    recommended: true,
    features: [
      "Everything in Standard",
      "Round robin routing",
      "Collective events",
      "Team reporting",
      "Salesforce integration",
    ],
  },
  {
    name: "Enterprise",
    tagline: "For large companies",
    price: "Starts at $15k/yr",
    yearlyPrice: "Starts at $15k/yr",
    cta: "Talk to sales",
    ctaStyle: "outline",
    recommended: false,
    features: [
      "Everything in Teams",
      "SSO & SCIM",
      "Audit logs",
      "Custom agreements",
      "Dedicated support",
    ],
  },
];

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export function Pricing() {
  const [yearly, setYearly] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
          obs.disconnect();
        }
      },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      id="pricing"
      style={{
        backgroundColor: "#ffffff",
        padding: "6rem 1.5rem",
        opacity: visible ? 1 : 0,
        transform: visible ? "scale(1)" : "scale(0.94)",
        transition: "opacity 0.75s cubic-bezier(0.4,0,0.2,1), transform 0.75s cubic-bezier(0.4,0,0.2,1)",
      }}
    >
      <style>{`
        .fluid-pricing-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
        }
        @media (min-width: 768px) {
          .fluid-pricing-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (min-width: 1200px) {
          .fluid-pricing-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }
        .fluid-plan-cta-dark:hover { background-color: #374151 !important; }
        .fluid-plan-cta-dark { transition: background-color 0.14s ease; }
        .fluid-plan-cta-blue:hover { background-color: #0055CC !important; }
        .fluid-plan-cta-blue { transition: background-color 0.14s ease; }
        .fluid-plan-cta-outline:hover { background-color: #EBF3FF !important; }
        .fluid-plan-cta-outline { transition: background-color 0.14s ease; }
        .fluid-toggle-btn { min-height: 44px; transition: background-color 0.14s ease, color 0.14s ease; }
      `}</style>

      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h2
            style={{
              fontFamily: "var(--font-manrope), sans-serif",
              fontWeight: 800,
              fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)",
              color: "#00213F",
              letterSpacing: "-0.03em",
              margin: "0 0 1.5rem",
              lineHeight: "1.12",
            }}
          >
            Pick the perfect plan for your team
          </h2>

          {/* Monthly/Yearly toggle */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              backgroundColor: "#f5f5f7",
              borderRadius: "0.5rem",
              padding: "0.25rem",
              gap: "0.125rem",
            }}
          >
            <button
              className="fluid-toggle-btn"
              onClick={() => setYearly(false)}
              style={{
                padding: "0.4375rem 0.875rem",
                minHeight: "44px",
                borderRadius: "0.375rem",
                fontFamily: "var(--font-inter), sans-serif",
                fontWeight: 500,
                fontSize: "0.875rem",
                border: "none",
                cursor: "pointer",
                backgroundColor: !yearly ? "#ffffff" : "transparent",
                color: !yearly ? "#00213F" : "#888888",
                boxShadow: !yearly ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
              }}
            >
              Monthly
            </button>
            <button
              className="fluid-toggle-btn"
              onClick={() => setYearly(true)}
              style={{
                padding: "0.4375rem 0.875rem",
                minHeight: "44px",
                borderRadius: "0.375rem",
                fontFamily: "var(--font-inter), sans-serif",
                fontWeight: 500,
                fontSize: "0.875rem",
                border: "none",
                cursor: "pointer",
                backgroundColor: yearly ? "#ffffff" : "transparent",
                color: yearly ? "#00213F" : "#888888",
                boxShadow: yearly ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                display: "flex",
                alignItems: "center",
                gap: "0.375rem",
              }}
            >
              Yearly
              {yearly && (
                <span
                  style={{
                    backgroundColor: "#006BFF",
                    color: "#ffffff",
                    fontSize: "0.625rem",
                    fontWeight: 700,
                    padding: "0.125rem 0.375rem",
                    borderRadius: "9999px",
                    letterSpacing: "0.02em",
                  }}
                >
                  Save 20%
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Plan cards */}
        <div className="fluid-pricing-grid">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              style={{
                backgroundColor: "#ffffff",
                border: plan.recommended ? "2px solid #006BFF" : "1px solid #e5e7eb",
                borderRadius: "1rem",
                padding: "1.75rem",
                display: "flex",
                flexDirection: "column",
                gap: "1.25rem",
                position: "relative",
              }}
            >
              {/* Recommended badge */}
              {plan.recommended && (
                <div
                  style={{
                    position: "absolute",
                    top: "-1px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    backgroundColor: "#006BFF",
                    color: "#ffffff",
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: "0.6875rem",
                    fontWeight: 700,
                    padding: "0.25rem 0.875rem",
                    borderRadius: "0 0 0.5rem 0.5rem",
                    whiteSpace: "nowrap",
                    letterSpacing: "0.02em",
                  }}
                >
                  Recommended plan
                </div>
              )}

              {/* Plan header */}
              <div style={{ paddingTop: plan.recommended ? "0.5rem" : "0" }}>
                <div
                  style={{
                    fontFamily: "var(--font-manrope), sans-serif",
                    fontWeight: 700,
                    fontSize: "1.125rem",
                    color: "#00213F",
                    marginBottom: "0.25rem",
                  }}
                >
                  {plan.name}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: "0.875rem",
                    color: "#888888",
                  }}
                >
                  {plan.tagline}
                </div>
              </div>

              {/* Price */}
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-manrope), sans-serif",
                    fontWeight: 800,
                    fontSize: "1.5rem",
                    color: "#00213F",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {yearly ? plan.yearlyPrice : plan.price}
                </div>
              </div>

              {/* CTA button */}
              <Link
                href="/login"
                className={`fluid-plan-cta-${plan.ctaStyle}`}
                style={{
                  display: "flex",
                  textAlign: "center",
                  minHeight: "44px",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "var(--font-inter), sans-serif",
                  fontWeight: 600,
                  fontSize: "0.9375rem",
                  textDecoration: "none",
                  padding: "0.6875rem 1rem",
                  borderRadius: "0.375rem",
                  ...(plan.ctaStyle === "dark"
                    ? { backgroundColor: "#111827", color: "#ffffff" }
                    : plan.ctaStyle === "blue"
                    ? { backgroundColor: "#006BFF", color: "#ffffff" }
                    : {
                        backgroundColor: "transparent",
                        color: "#006BFF",
                        border: "1.5px solid #006BFF",
                      }),
                }}
              >
                {plan.cta}
              </Link>

              {/* Feature list */}
              <ul
                style={{
                  listStyle: "none",
                  margin: 0,
                  padding: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                {plan.features.map((feat) => (
                  <li
                    key={feat}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "0.5rem",
                      fontFamily: "var(--font-inter), sans-serif",
                      fontSize: "0.875rem",
                      color: "#444444",
                    }}
                  >
                    <span style={{ flexShrink: 0, marginTop: "1px" }}>
                      <CheckIcon />
                    </span>
                    {feat}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
