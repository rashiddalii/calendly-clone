"use client";

import Link from "next/link";

const LINK_COLUMNS = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "Integrations", href: "#integrations" },
    { label: "Pricing", href: "#cta" },
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Careers", href: "#" },
  ],
  Legal: [
    { label: "Privacy", href: "#" },
    { label: "Terms", href: "#" },
    { label: "Security", href: "#" },
  ],
};

function XIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer style={{ backgroundColor: "#f0ecf6" }}>

      {/* Main content */}
      <div
        style={{
          maxWidth: "1152px",
          margin: "0 auto",
          padding: "4rem 1.5rem 3rem",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: "3rem",
          alignItems: "start",
        }}
      >
        {/* Brand column */}
        <div style={{ gridColumn: "span 1" }}>
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.375rem",
              textDecoration: "none",
              marginBottom: "0.75rem",
            }}
          >
            <span
              aria-hidden="true"
              style={{
                width: "26px",
                height: "26px",
                borderRadius: "0.4375rem",
                background: "linear-gradient(135deg, #4a4bd7, #7073ff)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <circle cx="7" cy="7" r="5.5" stroke="#fbf7ff" strokeWidth="1.6" fill="none" />
                <circle cx="7" cy="7" r="2" fill="#fbf7ff" />
              </svg>
            </span>
            <span
              style={{
                fontFamily: "var(--font-manrope), sans-serif",
                fontWeight: 600,
                fontSize: "1.0625rem",
                color: "#4a4bd7",
                letterSpacing: "-0.025em",
              }}
            >
              Fluid
            </span>
          </Link>

          <p
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "0.875rem",
              color: "#5f5e68",
              lineHeight: "1.65",
              margin: "0 0 1.5rem",
              maxWidth: "200px",
            }}
          >
            Scheduling that respects your time and the time of everyone you meet with.
          </p>

          {/* Social icons */}
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {[
              { href: "https://twitter.com", label: "Follow Fluid on X", Icon: XIcon },
              { href: "https://linkedin.com", label: "Follow Fluid on LinkedIn", Icon: LinkedInIcon },
              { href: "https://github.com", label: "View Fluid on GitHub", Icon: GitHubIcon },
            ].map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "0.5rem",
                  backgroundColor: "#e4e1ed",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#5f5e68",
                  textDecoration: "none",
                  transition: "background-color 0.14s ease, color 0.14s ease",
                  flexShrink: 0,
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.backgroundColor = "#4a4bd7";
                  el.style.color = "#fbf7ff";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.backgroundColor = "#e4e1ed";
                  el.style.color = "#5f5e68";
                }}
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>

        {/* Link columns */}
        {Object.entries(LINK_COLUMNS).map(([heading, links]) => (
          <div key={heading}>
            <h4
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontWeight: 700,
                fontSize: "0.75rem",
                color: "#32323b",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                margin: "0 0 1.125rem",
              }}
            >
              {heading}
            </h4>
            <ul
              style={{
                listStyle: "none",
                margin: 0,
                padding: 0,
                display: "flex",
                flexDirection: "column",
                gap: "0.625rem",
              }}
            >
              {links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    style={{
                      fontFamily: "var(--font-inter), sans-serif",
                      fontSize: "0.9375rem",
                      color: "#5f5e68",
                      textDecoration: "none",
                      transition: "color 0.14s ease",
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#32323b"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#5f5e68"; }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom strip */}
      <div style={{ backgroundColor: "#eae7f1" }}>
        <div
          style={{
            maxWidth: "1152px",
            margin: "0 auto",
            padding: "1.125rem 1.5rem",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "0.75rem",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "0.8125rem",
              color: "#7b7984",
              margin: 0,
            }}
          >
            &copy; 2026 Fluid. Made for people who value their time.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1.25rem" }}>
            {["Privacy", "Terms", "Security"].map((item) => (
              <a
                key={item}
                href="#"
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: "0.8125rem",
                  color: "#7b7984",
                  textDecoration: "none",
                  transition: "color 0.14s ease",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#4a4bd7"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#7b7984"; }}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
