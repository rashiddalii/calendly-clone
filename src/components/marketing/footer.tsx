"use client";

export function Footer() {
  const year = new Date().getFullYear();

  const LEGAL_LINKS = [
    "Privacy Policy",
    "Legal",
    "Status",
    "Cookie Settings",
    "Your Privacy Choices",
  ];

  return (
    <footer
      style={{
        borderTop: "1px solid #E5E7EB",
        backgroundColor: "#ffffff",
      }}
    >
      <style>{`
        .ff-link:hover { text-decoration: underline !important; }
        .ff-lang:hover { background-color: #F8F9FB !important; }
        .ff-lang { transition: background-color 0.14s ease; }
        @media (max-width: 639px) {
          .ff-inner { flex-direction: column !important; gap: 0.75rem !important; }
          .ff-links { flex-wrap: wrap !important; }
        }
      `}</style>

      <div
        className="ff-inner"
        style={{
          maxWidth: "72rem",
          margin: "0 auto",
          padding: "1.25rem 2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
        }}
      >
        {/* Language selector */}
        <button
          type="button"
          className="ff-lang"
          style={{
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: "0.8125rem",
            fontWeight: 500,
            color: "#0F172A",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "0.25rem 0.5rem",
            borderRadius: "0.375rem",
            flexShrink: 0,
          }}
        >
          English
        </button>

        {/* Legal links */}
        <nav
          aria-label="Legal"
          className="ff-links"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            flexWrap: "nowrap",
          }}
        >
          {LEGAL_LINKS.map((item) => (
            <a
              key={item}
              href="#"
              className="ff-link"
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "0.8125rem",
                fontWeight: 500,
                color: "#0F172A",
                textDecoration: "none",
                whiteSpace: "nowrap",
              }}
            >
              {item}
            </a>
          ))}
        </nav>

        {/* Copyright */}
        <p
          style={{
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: "0.8125rem",
            fontWeight: 500,
            color: "#0F172A",
            margin: 0,
            flexShrink: 0,
            whiteSpace: "nowrap",
          }}
        >
          Copyright Fluid {year}
        </p>
      </div>
    </footer>
  );
}
