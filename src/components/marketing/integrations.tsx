"use client";

import { useEffect, useRef, useState } from "react";
import {
  GmailIcon,
  GoogleCalendarIcon,
  HubSpotIcon,
  LinkedInIcon,
  OutlookIcon,
  SalesforceIcon,
  SlackIcon,
  TeamsIcon,
  ZoomIcon,
} from "@/components/icons/brand";

// ── Data ─────────────────────────────────────────────────────────────────────

const INTEGRATIONS: { name: string; Icon: (props: { className?: string }) => React.ReactElement }[] = [
  { name: "Zoom",             Icon: ZoomIcon },
  { name: "Google Calendar",  Icon: GoogleCalendarIcon },
  { name: "Salesforce",       Icon: SalesforceIcon },
  { name: "Slack",            Icon: SlackIcon },
  { name: "HubSpot",          Icon: HubSpotIcon },
  { name: "Gmail",            Icon: GmailIcon },
  { name: "Outlook",          Icon: OutlookIcon },
  { name: "LinkedIn",         Icon: LinkedInIcon },
  { name: "Teams",            Icon: TeamsIcon },
];

// ── Component ─────────────────────────────────────────────────────────────────

export function Integrations() {
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
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      id="integrations"
      style={{
        backgroundColor: "#ffffff",
        padding: "5rem 1.5rem",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateX(0)" : "translateX(-56px)",
        transition: "opacity 0.8s cubic-bezier(0.4,0,0.2,1), transform 0.8s cubic-bezier(0.4,0,0.2,1)",
      }}
    >
      <style>{`
        .fi-tile:hover {
          box-shadow: 0 8px 28px rgba(0,0,0,0.09) !important;
          transform: translateY(-3px);
        }
        .fi-tile { transition: box-shadow 0.18s ease, transform 0.18s ease; }
        .fi-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
        }
        @media (min-width: 640px) { .fi-grid { grid-template-columns: repeat(4, 1fr); } }
        @media (min-width: 1024px) { .fi-grid { grid-template-columns: repeat(9, 1fr); } }
        .fi-viewall:hover { text-decoration: underline !important; }
      `}</style>

      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h2
            style={{
              fontFamily: "var(--font-manrope), sans-serif",
              fontWeight: 800,
              fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
              color: "#00213F",
              letterSpacing: "-0.03em",
              margin: "0 0 0.75rem",
              lineHeight: "1.15",
            }}
          >
            Connect Fluid to the tools you already use
          </h2>
          <p
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "1rem",
              color: "#666666",
              maxWidth: "400px",
              margin: "0 auto 1.25rem",
              lineHeight: "1.65",
            }}
          >
            Boost productivity with your favorite apps
          </p>
          <a
            href="#"
            className="fi-viewall"
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontWeight: 600,
              fontSize: "0.9375rem",
              color: "#006BFF",
              textDecoration: "none",
            }}
          >
            View all integrations &rarr;
          </a>
        </div>

        {/* Logo grid */}
        <div className="fi-grid">
          {INTEGRATIONS.map(({ name, Icon }) => (
            <div
              key={name}
              className="fi-tile"
              title={name}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.625rem",
                padding: "1.375rem 0.75rem",
                borderRadius: "0.875rem",
                border: "1px solid #e5e7eb",
                backgroundColor: "#ffffff",
                cursor: "pointer",
              }}
            >
              <Icon className="h-11 w-11" />
              <span
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: "0.6875rem",
                  fontWeight: 500,
                  color: "#444444",
                  textAlign: "center",
                  lineHeight: "1.3",
                }}
              >
                {name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
