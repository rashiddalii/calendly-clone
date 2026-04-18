export function Stats() {
  return (
    <section
      style={{
        backgroundColor: "#ffffff",
        padding: "5rem 1.5rem",
      }}
    >
      <style>{`
        .fluid-stats-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
        }
        @media (min-width: 768px) {
          .fluid-stats-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        .fluid-read-link:hover { text-decoration: underline !important; }
      `}</style>

      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: "2.5rem" }}>
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
            Discover how businesses grow with Fluid
          </h2>
          <a
            href="#"
            className="fluid-read-link"
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontWeight: 600,
              fontSize: "0.9375rem",
              color: "#006BFF",
              textDecoration: "none",
            }}
          >
            View customer stories &rarr;
          </a>
        </div>

        {/* Stat cards */}
        <div className="fluid-stats-grid">
          {/* Card 1: HackerOne */}
          <div
            style={{
              backgroundColor: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "1rem",
              padding: "2rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-manrope), sans-serif",
                fontWeight: 800,
                fontSize: "0.875rem",
                color: "#00213F",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              HackerOne
            </div>
            <div
              style={{
                fontFamily: "var(--font-manrope), sans-serif",
                fontWeight: 800,
                fontSize: "3.5rem",
                color: "#00213F",
                letterSpacing: "-0.03em",
                lineHeight: "1",
              }}
            >
              169%
            </div>
            <div
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "0.9375rem",
                color: "#666666",
                lineHeight: "1.5",
              }}
            >
              return on investment
            </div>
            <a
              href="#"
              className="fluid-read-link"
              style={{
                marginTop: "auto",
                fontFamily: "var(--font-inter), sans-serif",
                fontWeight: 600,
                fontSize: "0.875rem",
                color: "#006BFF",
                textDecoration: "none",
              }}
            >
              Read now &rarr;
            </a>
          </div>

          {/* Card 2: Vonage */}
          <div
            style={{
              backgroundColor: "#006BFF",
              borderRadius: "1rem",
              padding: "2rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-manrope), sans-serif",
                fontWeight: 800,
                fontSize: "0.875rem",
                color: "rgba(255,255,255,0.7)",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              Vonage
            </div>
            <div
              style={{
                fontFamily: "var(--font-manrope), sans-serif",
                fontWeight: 800,
                fontSize: "3.5rem",
                color: "#ffffff",
                letterSpacing: "-0.03em",
                lineHeight: "1",
              }}
            >
              160%
            </div>
            <div
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "0.9375rem",
                color: "rgba(255,255,255,0.8)",
                lineHeight: "1.5",
              }}
            >
              increase in customers reached
            </div>
            <a
              href="#"
              style={{
                marginTop: "auto",
                fontFamily: "var(--font-inter), sans-serif",
                fontWeight: 600,
                fontSize: "0.875rem",
                color: "rgba(255,255,255,0.9)",
                textDecoration: "none",
              }}
            >
              Read now &rarr;
            </a>
          </div>

          {/* Card 3: Texas */}
          <div
            style={{
              backgroundColor: "#ffffff",
              border: "1px solid #fcd34d",
              borderRadius: "1rem",
              padding: "2rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-manrope), sans-serif",
                fontWeight: 800,
                fontSize: "0.875rem",
                color: "#92400e",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              Texas A&amp;M
            </div>
            <div
              style={{
                fontFamily: "var(--font-manrope), sans-serif",
                fontWeight: 800,
                fontSize: "3.5rem",
                color: "#f59e0b",
                letterSpacing: "-0.03em",
                lineHeight: "1",
              }}
            >
              20%
            </div>
            <div
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "0.9375rem",
                color: "#666666",
                lineHeight: "1.5",
              }}
            >
              decrease in scheduling errors
            </div>
            <a
              href="#"
              className="fluid-read-link"
              style={{
                marginTop: "auto",
                fontFamily: "var(--font-inter), sans-serif",
                fontWeight: 600,
                fontSize: "0.875rem",
                color: "#006BFF",
                textDecoration: "none",
              }}
            >
              Read now &rarr;
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
