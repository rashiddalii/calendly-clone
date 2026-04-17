"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Integrations", href: "#integrations" },
  { label: "Pricing", href: "#cta" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        transition: "background-color 0.22s ease, box-shadow 0.22s ease",
        backgroundColor: scrolled ? "rgba(252, 248, 254, 0.88)" : "#fcf8fe",
        backdropFilter: scrolled ? "blur(24px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(24px)" : "none",
        boxShadow: scrolled ? "0 4px 24px rgba(50, 50, 59, 0.06)" : "none",
      }}
    >
      <style>{`
        .nav-desktop { display: none; }
        @media (min-width: 768px) { .nav-desktop { display: flex; } }
        .nav-mobile-btn { display: flex; }
        @media (min-width: 768px) { .nav-mobile-btn { display: none; } }
        .nav-link:hover { color: #32323b !important; background-color: #f0ecf6 !important; }
        .nav-cta-ghost:hover { color: #32323b !important; }
        .nav-hamburger:hover { background-color: #f0ecf6 !important; }
        .mobile-nav-link:hover { background-color: #f0ecf6 !important; }
      `}</style>

      <nav
        aria-label="Main navigation"
        style={{
          maxWidth: "1152px",
          margin: "0 auto",
          padding: "0 1.5rem",
          height: "68px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Wordmark */}
        <Link
          href="/"
          aria-label="Fluid home"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.375rem",
            textDecoration: "none",
            flexShrink: 0,
          }}
        >
          <span
            aria-hidden="true"
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "0.5rem",
              background: "linear-gradient(135deg, #4a4bd7, #7073ff)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <circle cx="7" cy="7" r="5.5" stroke="#fbf7ff" strokeWidth="1.6" fill="none" />
              <circle cx="7" cy="7" r="2" fill="#fbf7ff" />
            </svg>
          </span>
          <span
            style={{
              fontFamily: "var(--font-manrope), sans-serif",
              fontWeight: 600,
              fontSize: "1.1875rem",
              color: "#4a4bd7",
              letterSpacing: "-0.025em",
            }}
          >
            Fluid
          </span>
        </Link>

        {/* Desktop nav links */}
        <ul
          aria-label="Site sections"
          className="nav-desktop"
          style={{
            listStyle: "none",
            margin: 0,
            padding: 0,
            alignItems: "center",
            gap: "0.125rem",
          }}
        >
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="nav-link"
                style={{
                  display: "inline-block",
                  fontFamily: "var(--font-inter), sans-serif",
                  fontWeight: 500,
                  fontSize: "0.9375rem",
                  color: "#5f5e68",
                  textDecoration: "none",
                  padding: "0.4375rem 0.875rem",
                  borderRadius: "0.5rem",
                  transition: "color 0.14s ease, background-color 0.14s ease",
                }}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop CTAs */}
        <div
          className="nav-desktop"
          style={{ alignItems: "center", gap: "0.625rem", flexShrink: 0 }}
        >
          <Link
            href="/login"
            className="nav-cta-ghost"
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontWeight: 500,
              fontSize: "0.9375rem",
              color: "#5f5e68",
              textDecoration: "none",
              padding: "0.4375rem 1rem",
              borderRadius: "0.75rem",
              transition: "color 0.14s ease",
            }}
          >
            Sign in
          </Link>
          <Link
            href="/login"
            className="cta-gradient"
            style={{
              display: "inline-flex",
              alignItems: "center",
              fontFamily: "var(--font-inter), sans-serif",
              fontWeight: 600,
              fontSize: "0.9375rem",
              color: "#fbf7ff",
              textDecoration: "none",
              padding: "0.5rem 1.25rem",
              borderRadius: "0.75rem",
            }}
          >
            Get started
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="nav-mobile-btn nav-hamburger"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
          style={{
            alignItems: "center",
            justifyContent: "center",
            padding: "0.5rem",
            borderRadius: "0.5rem",
            border: "none",
            background: "none",
            cursor: "pointer",
            color: "#32323b",
            transition: "background-color 0.14s ease",
          }}
        >
          {mobileOpen ? <X size={21} strokeWidth={2} /> : <Menu size={21} strokeWidth={2} />}
        </button>
      </nav>

      {/* Mobile slide-down panel */}
      {mobileOpen && (
        <div
          id="mobile-nav"
          style={{
            backgroundColor: "#fcf8fe",
            padding: "0.75rem 1.5rem 1.5rem",
            borderTop: "1px solid rgba(179, 176, 188, 0.18)",
          }}
        >
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "0.125rem" }}>
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="mobile-nav-link"
                  onClick={() => setMobileOpen(false)}
                  style={{
                    display: "block",
                    fontFamily: "var(--font-inter), sans-serif",
                    fontWeight: 500,
                    fontSize: "1rem",
                    color: "#32323b",
                    textDecoration: "none",
                    padding: "0.6875rem 1rem",
                    borderRadius: "0.75rem",
                    transition: "background-color 0.14s ease",
                  }}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "0.625rem" }}>
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              style={{
                display: "block",
                textAlign: "center",
                fontFamily: "var(--font-inter), sans-serif",
                fontWeight: 500,
                fontSize: "1rem",
                color: "#5f5e68",
                textDecoration: "none",
                padding: "0.75rem",
                borderRadius: "0.75rem",
                backgroundColor: "#f0ecf6",
              }}
            >
              Sign in
            </Link>
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="cta-gradient"
              style={{
                display: "block",
                textAlign: "center",
                fontFamily: "var(--font-inter), sans-serif",
                fontWeight: 600,
                fontSize: "1rem",
                textDecoration: "none",
                padding: "0.75rem",
                borderRadius: "0.75rem",
              }}
            >
              Get started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
