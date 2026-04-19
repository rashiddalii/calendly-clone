"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  AppStoreIcon,
  ChromeIcon,
  EdgeIcon,
  FirefoxIcon,
  GooglePlayIcon,
  OutlookIcon,
  SafariIcon,
} from "@/components/icons/brand";

/* ─── Nav columns ────────────────────────────────────────────── */
const NAV = [
  {
    heading: "Product",
    links: [
      { label: "Scheduling automation", href: "#" },
      { label: "Smart availability", href: "#" },
      { label: "Payments", href: "#" },
      { label: "Customizable availability", href: "#" },
      { label: "Mobile apps", href: "#" },
      { label: "Browser extensions", href: "#" },
      { label: "Meeting routing", href: "#" },
      { label: "Event Types", href: "#" },
      { label: "Email & website embeds", href: "#" },
      { label: "Reminders & follow-ups", href: "#" },
      { label: "Meeting polls", href: "#" },
      { label: "Analytics", href: "#" },
      { label: "Admin management", href: "#" },
    ],
  },
  {
    heading: "Integrations",
    links: [
      { label: "Google ecosystem", href: "#" },
      { label: "Microsoft ecosystem", href: "#" },
      { label: "Calendars", href: "#" },
      { label: "Video conferencing", href: "#" },
      { label: "Payment processors", href: "#" },
      { label: "Sales & CRM", href: "#" },
      { label: "Recruiting & ATS", href: "#" },
      { label: "Email messaging", href: "#" },
      { label: "Embed Fluid", href: "#" },
      { label: "Analytics", href: "#" },
      { label: "API & connectors", href: "#" },
      { label: "Security & compliance", href: "#" },
    ],
  },
  {
    heading: "Fluid",
    links: [
      { label: "Pricing", href: "/pricing" },
      { label: "Product overview", href: "#" },
      { label: "Solutions", href: "#" },
      { label: "For individuals", href: "#" },
      { label: "For small businesses", href: "#" },
      { label: "For large companies", href: "#" },
      { label: "Compare", href: "#" },
      { label: "Security", href: "#" },
      { label: "Sign up for free", href: "/signup" },
      { label: "Talk to sales", href: "#" },
      { label: "Get a demo", href: "#" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Help center", href: "#" },
      { label: "Resource center", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Customer stories", href: "#" },
      { label: "Learning hub", href: "#" },
      { label: "Fluid community", href: "#" },
      { label: "Developer tools", href: "#" },
      { label: "Release notes", href: "#" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About us", href: "#" },
      { label: "Leadership", href: "#" },
      { label: "Careers", href: "#", badge: "We're hiring!" },
      { label: "Newsroom", href: "#" },
      { label: "Become a partner", href: "#" },
      { label: "Contact us", href: "#" },
    ],
  },
];

/* ─── Download badges — official brand assets ────────────────── */
const DL_ICON = "h-4 w-4 shrink-0";
const DOWNLOADS = [
  { label: "App Store",         icon: <AppStoreIcon className={DL_ICON} /> },
  { label: "Google Play",       icon: <GooglePlayIcon className={DL_ICON} /> },
  { label: "Chrome extension",  icon: <ChromeIcon className={DL_ICON} /> },
  { label: "Edge extension",    icon: <EdgeIcon className={DL_ICON} /> },
  { label: "Firefox extension", icon: <FirefoxIcon className={DL_ICON} /> },
  { label: "Safari extension",  icon: <SafariIcon className={DL_ICON} /> },
  { label: "Outlook add-in",    icon: <OutlookIcon className={DL_ICON} /> },
];

/* ─── Social icons ───────────────────────────────────────────── */
const SOCIALS = [
  {
    label: "X (Twitter)", href: "#",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    label: "Facebook", href: "#",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
  },
  {
    label: "Instagram", href: "#",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    ),
  },
  {
    label: "LinkedIn", href: "#",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
  {
    label: "YouTube", href: "#",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
  },
];

export function CtaBanner() {
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
      { threshold: 0.06 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      id="cta"
      style={{
        backgroundColor: "#ffffff",
        borderTop: "1px solid #f1f5f9",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(64px)",
        transition: "opacity 0.9s cubic-bezier(0.4,0,0.2,1), transform 0.9s cubic-bezier(0.4,0,0.2,1)",
      }}
    >
      <style>{`
        .cta-two-col {
          display: grid; grid-template-columns: 1fr;
          gap: 2rem; align-items: center;
        }
        @media (min-width: 768px) { .cta-two-col { grid-template-columns: 1fr 1fr; } }

        .cta-nav-grid {
          display: grid; grid-template-columns: repeat(2, 1fr); gap: 2.5rem 1.5rem;
        }
        @media (min-width: 640px)  { .cta-nav-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (min-width: 1024px) { .cta-nav-grid { grid-template-columns: repeat(5, 1fr); } }

        .cta-nav-link { color: #374151; text-decoration: none; font-family: var(--font-inter), sans-serif; font-size: 0.875rem; line-height: 1.4; min-width: 44px; min-height: 44px; display: inline-flex; align-items: center; transition: color 0.15s; }
        .cta-nav-link:hover { color: #00213F; }

        .cta-dl-btn { display: inline-flex; min-height: 44px; align-items: center; gap: 8px; padding: 8px 14px; border: 1.5px solid #e5e7eb; border-radius: 9px; background: #fff; font-family: var(--font-inter), sans-serif; font-size: 0.8125rem; font-weight: 600; color: #00213F; text-decoration: none; transition: border-color 0.15s, color 0.15s, background 0.15s; white-space: nowrap; }
        .cta-dl-btn:hover { border-color: #006BFF; color: #006BFF; background: #f0f7ff; }

        .cta-social { width: 44px; height: 44px; border-radius: 50%; border: 1.5px solid #e5e7eb; display: flex; align-items: center; justify-content: center; color: #374151; transition: border-color 0.15s, color 0.15s; }
        .cta-social:hover { border-color: #00213F; color: #00213F; }

        .cta-start { transition: background-color 0.14s ease; }
        .cta-start:hover { background-color: #0055CC !important; }
        .cta-demo  { transition: background-color 0.14s ease; }
        .cta-demo:hover  { background-color: #EBF3FF !important; }
      `}</style>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "5rem 1.5rem 0" }}>

        {/* ── Power up your scheduling ── */}
        <div className="cta-two-col">
          <h2 style={{
            fontFamily: "var(--font-manrope), sans-serif",
            fontWeight: 800, fontSize: "clamp(2rem, 4vw, 3rem)",
            color: "#00213F", letterSpacing: "-0.03em",
            lineHeight: 1.08, margin: 0,
          }}>
            Power up your scheduling
          </h2>
          <div>
            <p style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "1rem", color: "#666666",
              lineHeight: 1.65, margin: "0 0 1.5rem",
            }}>
              Get started in seconds — for free. No credit card required.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
              <Link href="/signup" className="cta-start" style={{
                display: "inline-flex", alignItems: "center",
                fontFamily: "var(--font-inter), sans-serif", fontWeight: 600,
                fontSize: "0.9375rem", color: "#ffffff", textDecoration: "none",
                padding: "0.7rem 1.75rem", borderRadius: "0.375rem",
                backgroundColor: "#006BFF",
              }}>
                Start for free
              </Link>
              <Link href="#" className="cta-demo" style={{
                display: "inline-flex", alignItems: "center",
                fontFamily: "var(--font-inter), sans-serif", fontWeight: 600,
                fontSize: "0.9375rem", color: "#006BFF", textDecoration: "none",
                padding: "0.7rem 1.75rem", borderRadius: "0.375rem",
                border: "1.5px solid #006BFF", backgroundColor: "transparent",
              }}>
                Get a demo
              </Link>
            </div>
          </div>
        </div>

        {/* ── Nav columns ── */}
        <div style={{ borderTop: "1px solid #f1f5f9", marginTop: "4rem", paddingTop: "3rem" }}>
          <div className="cta-nav-grid">
            {NAV.map(({ heading, links }) => (
              <div key={heading}>
                <p style={{
                  fontFamily: "var(--font-manrope), sans-serif", fontWeight: 800,
                  fontSize: "0.875rem", color: "#00213F", margin: "0 0 1rem",
                }}>{heading}</p>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                  {links.map(({ label, href, badge }) => (
                    <li key={label}>
                      <Link href={href} className="cta-nav-link">
                        {label}
                        {badge && (
                          <span style={{
                            marginLeft: 7, fontSize: "0.6875rem", fontWeight: 700,
                            color: "#006BFF", background: "#eff6ff",
                            padding: "2px 7px", borderRadius: 99, verticalAlign: "middle",
                            border: "1px solid #bfdbfe",
                          }}>{badge}</span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* ── Downloads + Social icons (same row) ── */}
        <div style={{
          borderTop: "1px solid #f1f5f9", marginTop: "3rem",
          padding: "2.5rem 0 3rem",
          display: "flex", alignItems: "flex-start",
          justifyContent: "space-between", gap: "2rem", flexWrap: "wrap",
        }}>
          <div>
            <p style={{
              fontFamily: "var(--font-manrope), sans-serif", fontWeight: 800,
              fontSize: "0.875rem", color: "#00213F", margin: "0 0 1rem",
            }}>Downloads</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.625rem" }}>
              {DOWNLOADS.map(({ label, icon }) => (
                <a key={label} href="#" className="cta-dl-btn">{icon}{label}</a>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "flex-end", gap: 8, paddingTop: "2.25rem", flexShrink: 0 }}>
            {SOCIALS.map(({ label, href, icon }) => (
              <a key={label} href={href} aria-label={label} className="cta-social">{icon}</a>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
