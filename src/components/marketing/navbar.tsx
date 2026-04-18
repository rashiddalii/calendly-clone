"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ChevronDown, Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Product",   href: "#features",    dropdown: true },
  { label: "Solutions", href: "#how-it-works", dropdown: true },
  { label: "Resources", href: "#",             dropdown: true },
  { label: "Pricing",   href: "#pricing",      dropdown: false },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled,   setScrolled]   = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #E5E7EB",
        boxShadow: scrolled ? "0 2px 12px rgba(0,0,0,0.05)" : "none",
        transition: "box-shadow 0.2s ease",
      }}
    >
      {/*
        Critical: hamburger button has NO inline `display` — only the CSS class
        controls it so the @media query can override it.
      */}
      <style>{`
        .mn-nav  { display: none; }
        .mn-ctas { display: none; }
        .mn-ham  { display: flex; align-items: center; justify-content: center; }
        @media (min-width: 1024px) {
          .mn-nav  { display: flex; }
          .mn-ctas { display: flex; }
          .mn-ham  { display: none; }
        }
        .mn-link:hover    { background-color: #F8F9FB !important; }
        .mn-login:hover   { background-color: #F8F9FB !important; }
        .mn-start:hover   { background-color: #0055CC !important; }
        .mn-mlink:hover   { background-color: #F8F9FB !important; }
        .mn-ham:hover     { background-color: #F8F9FB !important; }
      `}</style>

      {/* ── Inner nav row — matches login page: max-w-6xl, px-4 sm:px-8, py-4 ── */}
      <nav
        aria-label="Main navigation"
        style={{
          maxWidth: "72rem",       /* max-w-6xl */
          margin: "0 auto",
          padding: "1rem 2rem",    /* py-4 px-8 */
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >

        {/* ── Logo — identical to login page ── */}
        <Link
          href="/"
          aria-label="Fluid home"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            textDecoration: "none",
            flexShrink: 0,
          }}
        >
          <span
            aria-hidden="true"
            style={{
              width: "36px",          /* h-9 w-9 */
              height: "36px",
              borderRadius: "0.5rem", /* rounded-lg */
              backgroundColor: "#1e3461",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              overflow: "hidden",
            }}
          >
            <img
              src="/logo-fluid-icon.svg"
              alt=""
              width={22}
              height={22}
              style={{ objectFit: "contain" }}
            />
          </span>
          <span
            style={{
              fontFamily: "var(--font-manrope), sans-serif",
              fontWeight: 700,
              fontSize: "1.25rem",    /* text-xl */
              color: "#006BFF",
              letterSpacing: "-0.025em", /* tracking-tight */
            }}
          >
            Fluid
          </span>
        </Link>

        {/* ── Desktop nav links (flex:1 → centred) ── */}
        <ul
          aria-label="Site sections"
          className="mn-nav"
          style={{
            flex: 1,
            listStyle: "none",
            margin: 0,
            padding: 0,
            justifyContent: "center",
            alignItems: "center",
            gap: "0.125rem",
          }}
        >
          {NAV_LINKS.map(({ label, href, dropdown }) => (
            <li key={label}>
              <a
                href={href}
                className="mn-link"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.25rem",
                  fontFamily: "var(--font-inter), sans-serif",
                  fontWeight: 500,
                  fontSize: "0.9375rem", /* text-[15px] — matches auth pages */
                  color: "#444444",
                  textDecoration: "none",
                  padding: "0.5rem 0.875rem",
                  borderRadius: "0.5rem",
                  transition: "background-color 0.14s ease",
                }}
              >
                {label}
                {dropdown && (
                  <ChevronDown size={13} strokeWidth={2} color="#888888" />
                )}
              </a>
            </li>
          ))}
        </ul>

        {/* ── Desktop CTAs — match login page button style ── */}
        <div
          className="mn-ctas"
          style={{ alignItems: "center", gap: "0.5rem", flexShrink: 0 }}
        >
          {/* "Log In" — same as login page's "Sign up" outline button */}
          <Link
            href="/login"
            className="mn-login"
            style={{
              display: "inline-flex",
              alignItems: "center",
              fontFamily: "var(--font-inter), sans-serif",
              fontWeight: 500,
              fontSize: "0.9375rem",   /* text-[15px] */
              color: "#444444",
              textDecoration: "none",
              padding: "0.5rem 1rem",  /* px-4 py-2 */
              borderRadius: "0.5rem",  /* rounded-lg */
              border: "1px solid #E5E7EB",
              backgroundColor: "#ffffff",
              transition: "background-color 0.14s ease",
            }}
          >
            Log In
          </Link>

          {/* "Get started" — same shape, blue fill */}
          <Link
            href="/login"
            className="mn-start"
            style={{
              display: "inline-flex",
              alignItems: "center",
              fontFamily: "var(--font-inter), sans-serif",
              fontWeight: 600,
              fontSize: "0.9375rem",   /* text-[15px] */
              color: "#ffffff",
              textDecoration: "none",
              padding: "0.5rem 1.125rem",
              borderRadius: "0.5rem",  /* rounded-lg */
              backgroundColor: "#006BFF",
              border: "1px solid transparent",
              transition: "background-color 0.16s ease",
            }}
          >
            Get started
          </Link>
        </div>

        {/* ── Mobile hamburger — NO inline `display` ── */}
        <button
          className="mn-ham"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          style={{
            padding: "0.5rem",
            borderRadius: "0.5rem",
            border: "1px solid #E5E7EB",
            background: "#ffffff",
            cursor: "pointer",
            color: "#444444",
            transition: "background-color 0.14s ease",
          }}
        >
          {mobileOpen ? (
            <X size={18} strokeWidth={2} />
          ) : (
            <Menu size={18} strokeWidth={2} />
          )}
        </button>
      </nav>

      {/* ── Mobile slide-down panel ── */}
      {mobileOpen && (
        <div
          style={{
            backgroundColor: "#ffffff",
            borderTop: "1px solid #E5E7EB",
            padding: "0.75rem 2rem 1.5rem",
          }}
        >
          <ul
            style={{
              listStyle: "none",
              margin: 0,
              padding: 0,
              display: "flex",
              flexDirection: "column",
              gap: "0.125rem",
            }}
          >
            {NAV_LINKS.map(({ label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  className="mn-mlink"
                  onClick={() => setMobileOpen(false)}
                  style={{
                    display: "block",
                    fontFamily: "var(--font-inter), sans-serif",
                    fontWeight: 500,
                    fontSize: "0.9375rem",
                    color: "#444444",
                    textDecoration: "none",
                    padding: "0.625rem 0.75rem",
                    borderRadius: "0.5rem",
                    transition: "background-color 0.14s ease",
                  }}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>

          <div
            style={{
              marginTop: "1rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.625rem",
            }}
          >
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              style={{
                display: "block",
                textAlign: "center",
                fontFamily: "var(--font-inter), sans-serif",
                fontWeight: 500,
                fontSize: "0.9375rem",
                color: "#444444",
                textDecoration: "none",
                padding: "0.625rem",
                borderRadius: "0.5rem",
                border: "1px solid #E5E7EB",
                backgroundColor: "#ffffff",
              }}
            >
              Log In
            </Link>
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              style={{
                display: "block",
                textAlign: "center",
                fontFamily: "var(--font-inter), sans-serif",
                fontWeight: 600,
                fontSize: "0.9375rem",
                color: "#ffffff",
                textDecoration: "none",
                padding: "0.625rem",
                borderRadius: "0.5rem",
                backgroundColor: "#006BFF",
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
