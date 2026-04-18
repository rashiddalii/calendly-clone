import Link from "next/link";

export function CtaBanner() {
  return (
    <section
      id="cta"
      style={{
        backgroundColor: "#f5f5f7",
        padding: "5rem 1.5rem",
      }}
    >
      <style>{`
        .fluid-cta-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
          align-items: center;
        }
        @media (min-width: 768px) {
          .fluid-cta-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
        .fluid-cta-start:hover { background-color: #0055CC !important; }
        .fluid-cta-start { transition: background-color 0.14s ease; }
        .fluid-cta-demo:hover { background-color: #EBF3FF !important; }
        .fluid-cta-demo { transition: background-color 0.14s ease; }
      `}</style>

      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div className="fluid-cta-grid">
          {/* Left: Heading */}
          <div>
            <h2
              style={{
                fontFamily: "var(--font-manrope), sans-serif",
                fontWeight: 800,
                fontSize: "clamp(2rem, 4vw, 3rem)",
                color: "#00213F",
                letterSpacing: "-0.03em",
                lineHeight: "1.08",
                margin: 0,
              }}
            >
              Power up your scheduling
            </h2>
          </div>

          {/* Right: Text + buttons */}
          <div>
            <p
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "1rem",
                color: "#666666",
                lineHeight: "1.65",
                margin: "0 0 1.5rem",
              }}
            >
              Get started in seconds — for free. No credit card required.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
              <Link
                href="/login"
                className="fluid-cta-start"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  fontFamily: "var(--font-inter), sans-serif",
                  fontWeight: 600,
                  fontSize: "0.9375rem",
                  color: "#ffffff",
                  textDecoration: "none",
                  padding: "0.6875rem 1.5rem",
                  borderRadius: "0.375rem",
                  backgroundColor: "#006BFF",
                }}
              >
                Start for free
              </Link>
              <Link
                href="/login"
                className="fluid-cta-demo"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  fontFamily: "var(--font-inter), sans-serif",
                  fontWeight: 600,
                  fontSize: "0.9375rem",
                  color: "#006BFF",
                  textDecoration: "none",
                  padding: "0.6875rem 1.5rem",
                  borderRadius: "0.375rem",
                  border: "1.5px solid #006BFF",
                  backgroundColor: "transparent",
                }}
              >
                Get a demo
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
