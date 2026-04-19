const TESTIMONIALS = [
  {
    quote:
      "Cut my scheduling email thread by 90%. I used to spend 20 minutes finding a time for every intro call. Now I paste a link and it's done before I close the email.",
    name: "Priya Nair",
    role: "Head of Partnerships",
    company: "Northwind",
    initials: "PN",
    accentColor: "#006bff",
    accentBg: "#d9e8ff",
  },
  {
    quote:
      "It feels like it was designed by someone who genuinely dislikes scheduling overhead. Every sharp edge has been sanded off. Our clients notice the polish immediately.",
    name: "Marcus Webb",
    role: "CEO",
    company: "Atlas",
    initials: "MW",
    accentColor: "#2d8a5e",
    accentBg: "#d0f2e3",
  },
  {
    quote:
      "We rolled it out to twelve account managers in a single afternoon. No training docs. They just shared their links and started getting booked. That kind of adoption is rare.",
    name: "Dana Osei",
    role: "VP of Sales",
    company: "Cadence",
    initials: "DO",
    accentColor: "#006bff",
    accentBg: "#d9e8ff",
  },
];

function Stars() {
  return (
    <div style={{ display: "flex", gap: "0.25rem" }} aria-label="5 stars">
      {[0, 1, 2, 3, 4].map((i) => (
        <svg
          key={i}
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="#f59e0b"
          aria-hidden="true"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

export function Testimonials() {
  return (
    <section
      style={{
        backgroundColor: "#f0f5ff",
        padding: "6rem 1.5rem",
      }}
    >
      <div style={{ maxWidth: "1152px", margin: "0 auto" }}>
        {/* Section header */}
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <span
            style={{
              display: "inline-block",
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "0.8125rem",
              fontWeight: 600,
              color: "#006bff",
              textTransform: "uppercase",
              letterSpacing: "0.09em",
              marginBottom: "0.875rem",
            }}
          >
            What people say
          </span>
          <h2
            style={{
              fontFamily: "var(--font-manrope), sans-serif",
              fontWeight: 700,
              fontSize: "clamp(1.75rem, 3vw, 2.375rem)",
              color: "#1c2b4b",
              letterSpacing: "-0.03em",
              margin: "0 0 0.875rem",
              lineHeight: "1.18",
            }}
          >
            Real results, real teams.
          </h2>
          <p
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "1.0625rem",
              color: "#4b5a6d",
              maxWidth: "360px",
              margin: "0 auto",
              lineHeight: "1.65",
            }}
          >
            From solo founders to enterprise sales teams.
          </p>
        </div>

        {/* Quote cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
            gap: "1.25rem",
          }}
        >
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="hover-lift"
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "1.25rem",
                padding: "2rem",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Stars />

              {/* Pull quote */}
              <blockquote
                style={{
                  fontFamily: "var(--font-manrope), sans-serif",
                  fontStyle: "italic",
                  fontSize: "1.0625rem",
                  fontWeight: 500,
                  color: "#1c2b4b",
                  lineHeight: "1.65",
                  margin: "1.25rem 0 0",
                  flex: 1,
                }}
              >
                &ldquo;{t.quote}&rdquo;
              </blockquote>

              {/* 16px whitespace gap — no hr */}
              <div style={{ height: "1.5rem" }} />

              {/* Attribution */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.875rem",
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "9999px",
                    backgroundColor: t.accentBg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    fontFamily: "var(--font-manrope), sans-serif",
                    fontWeight: 700,
                    fontSize: "0.8125rem",
                    color: t.accentColor,
                  }}
                  aria-label={`Avatar for ${t.name}`}
                >
                  {t.initials}
                </div>
                <div>
                  <p
                    style={{
                      fontFamily: "var(--font-inter), sans-serif",
                      fontWeight: 600,
                      fontSize: "0.875rem",
                      color: "#1c2b4b",
                      margin: "0 0 0.125rem",
                    }}
                  >
                    {t.name}
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-inter), sans-serif",
                      fontSize: "0.8125rem",
                      color: "#6b7d94",
                      margin: 0,
                    }}
                  >
                    {t.role}, {t.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
