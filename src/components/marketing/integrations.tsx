const INTEGRATIONS = [
  {
    name: "Google Calendar",
    description: "Two-way sync",
    color: "#4285f4",
    badge: null,
  },
  {
    name: "Google Meet",
    description: "Auto video links",
    color: "#34a853",
    badge: null,
  },
  {
    name: "Zoom",
    description: "Meeting links",
    color: "#2d8cff",
    badge: "Coming soon",
  },
  {
    name: "Outlook",
    description: "Calendar sync",
    color: "#0078d4",
    badge: "Coming soon",
  },
  {
    name: "Resend",
    description: "Email delivery",
    color: "#4a4bd7",
    badge: null,
  },
  {
    name: "Slack",
    description: "Notifications",
    color: "#4a154b",
    badge: "Coming soon",
  },
];

export function Integrations() {
  return (
    <section
      id="integrations"
      style={{
        backgroundColor: "#f0ecf6",
        padding: "5rem 1.5rem",
      }}
    >
      <div style={{ maxWidth: "1152px", margin: "0 auto" }}>

        {/* Section header */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
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
            Integrations
          </span>
          <h2
            style={{
              fontFamily: "var(--font-manrope), sans-serif",
              fontWeight: 700,
              fontSize: "clamp(1.75rem, 3vw, 2.375rem)",
              color: "#32323b",
              letterSpacing: "-0.03em",
              margin: "0 0 0.75rem",
              lineHeight: "1.18",
            }}
          >
            Works with your stack.
          </h2>
          <p
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "1rem",
              color: "#5f5e68",
              maxWidth: "360px",
              margin: "0 auto",
              lineHeight: "1.65",
            }}
          >
            Connect the tools you already use. Setup in seconds, no code needed.
          </p>
        </div>

        {/* Pill row */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.75rem",
            justifyContent: "center",
          }}
        >
          {INTEGRATIONS.map(({ name, description, color, badge }) => (
            <div
              key={name}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.625rem",
                padding: "0.5rem 1rem",
                borderRadius: "9999px",
                backgroundColor: "#ffffff",
                boxShadow: "0 1px 4px rgba(50, 50, 59, 0.05)",
              }}
            >
              {/* Color square icon placeholder */}
              <span
                aria-hidden="true"
                style={{
                  display: "inline-block",
                  width: "10px",
                  height: "10px",
                  borderRadius: "0.1875rem",
                  backgroundColor: color,
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  color: "#32323b",
                  whiteSpace: "nowrap",
                }}
              >
                {name}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: "0.75rem",
                  color: "#7b7984",
                  whiteSpace: "nowrap",
                }}
              >
                {description}
              </span>
              {badge && (
                <span
                  style={{
                    display: "inline-block",
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: "0.625rem",
                    fontWeight: 600,
                    color: "#505064",
                    backgroundColor: "#e2e0f9",
                    padding: "0.1875rem 0.5rem",
                    borderRadius: "9999px",
                    letterSpacing: "0.01em",
                    whiteSpace: "nowrap",
                  }}
                >
                  {badge}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
