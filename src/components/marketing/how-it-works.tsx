const STEPS = [
  {
    number: "01",
    title: "Set your hours",
    body: "Tell Fluid when you're free. Configure a weekly schedule, block off dates, add buffer time between meetings. Set it once.",
  },
  {
    number: "02",
    title: "Share your link",
    body: 'Drop fluid.app/you/30min into any email, LinkedIn bio, or footer. No login required for whoever you send it to.',
  },
  {
    number: "03",
    title: "Get booked",
    body: "Meetings appear on your calendar automatically. Confirmations go out. Reminders fire. You just show up.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      style={{
        backgroundColor: "#fcf8fe",
        padding: "6rem 1.5rem",
      }}
    >
      <div style={{ maxWidth: "1152px", margin: "0 auto" }}>

        {/* Section header */}
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <span
            style={{
              display: "inline-block",
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "0.8125rem",
              fontWeight: 600,
              color: "#4a4bd7",
              textTransform: "uppercase",
              letterSpacing: "0.09em",
              marginBottom: "0.875rem",
            }}
          >
            How it works
          </span>
          <h2
            style={{
              fontFamily: "var(--font-manrope), sans-serif",
              fontWeight: 700,
              fontSize: "clamp(1.75rem, 3vw, 2.375rem)",
              color: "#32323b",
              letterSpacing: "-0.03em",
              margin: "0 0 0.875rem",
              lineHeight: "1.18",
            }}
          >
            Three steps from hello to booked.
          </h2>
          <p
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "1.0625rem",
              color: "#5f5e68",
              maxWidth: "380px",
              margin: "0 auto",
              lineHeight: "1.65",
            }}
          >
            No technical setup. No back-and-forth. Just time, handled.
          </p>
        </div>

        {/* Steps row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {STEPS.map(({ number, title, body }) => (
            <div
              key={number}
              style={{
                position: "relative",
                backgroundColor: "#ffffff",
                borderRadius: "1.5rem",
                padding: "2.25rem 2rem 2rem",
                overflow: "hidden",
              }}
            >
              {/* Large numeral watermark */}
              <span
                aria-hidden="true"
                style={{
                  position: "absolute",
                  top: "1rem",
                  right: "1.25rem",
                  fontFamily: "var(--font-manrope), sans-serif",
                  fontWeight: 800,
                  fontSize: "4rem",
                  lineHeight: 1,
                  color: "rgba(74, 75, 215, 0.1)",
                  userSelect: "none",
                  letterSpacing: "-0.04em",
                  pointerEvents: "none",
                }}
              >
                {number}
              </span>

              <h3
                style={{
                  fontFamily: "var(--font-manrope), sans-serif",
                  fontWeight: 700,
                  fontSize: "1.25rem",
                  color: "#32323b",
                  margin: "0 0 0.75rem",
                  letterSpacing: "-0.02em",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                {title}
              </h3>
              <p
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: "0.9375rem",
                  color: "#5f5e68",
                  lineHeight: "1.65",
                  margin: 0,
                  position: "relative",
                  zIndex: 1,
                }}
              >
                {body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
