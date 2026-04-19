import Link from "next/link";

const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Status", href: "#" },
  { label: "Cookie Settings", href: "#" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer style={{ borderTop: "1px solid #E5E7EB", backgroundColor: "#ffffff" }}>
      <style>{`
        .ff-link { color: #0F172A; text-decoration: none; font-family: var(--font-inter), sans-serif; font-size: 0.8125rem; font-weight: 500; white-space: nowrap; min-width: 44px; min-height: 44px; display: inline-flex; align-items: center; }
        .ff-link:hover { text-decoration: underline; }
        .ff-lang { font-family: var(--font-inter), sans-serif; font-size: 0.8125rem; font-weight: 500; color: #0F172A; background: none; border: none; cursor: pointer; min-width: 44px; min-height: 44px; padding: 0; display: inline-flex; align-items: center; }
        .ff-lang:hover { text-decoration: underline; }
        @media (max-width: 639px) { .ff-bar { flex-direction: column !important; gap: 0.75rem !important; } .ff-links { flex-wrap: wrap !important; } }
      `}</style>

      <div className="ff-bar" style={{
        maxWidth: "1200px", margin: "0 auto", padding: "1.25rem 1.5rem",
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem",
      }}>
        <button className="ff-lang">English</button>

        <nav className="ff-links" aria-label="Legal" style={{ display: "flex", alignItems: "center", gap: "1.25rem", flexWrap: "nowrap" }}>
          {LEGAL_LINKS.map(({ label, href }) => (
            <Link key={label} href={href} className="ff-link">{label}</Link>
          ))}
        </nav>

        <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "0.8125rem", fontWeight: 500, color: "#0F172A", margin: 0, flexShrink: 0, whiteSpace: "nowrap" }}>
          Copyright Fluid {year}
        </p>
      </div>
    </footer>
  );
}
