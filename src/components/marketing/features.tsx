import { Calendar, Clock, RefreshCw, Globe } from "lucide-react";

const FEATURES = [
  {
    Icon: Calendar,
    title: "Event types",
    body: "Create 1:1s, group sessions, or quick syncs. Every format your schedule demands, handled with zero friction.",
  },
  {
    Icon: Clock,
    title: "Smart availability",
    body: "Set weekly schedules, override specific dates, configure buffer time and minimum notice — it adapts to how you work.",
  },
  {
    Icon: RefreshCw,
    title: "Google Calendar sync",
    body: "See your busy times reflected instantly. Auto-create events on confirmation. True two-way sync.",
  },
  {
    Icon: Globe,
    title: "Timezone-aware",
    body: "Bookers see your slots in their local timezone automatically. No conversions, no confusion, no dropped meetings.",
  },
];

export function Features() {
  return (
    <section
      id="features"
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
            Features
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
            Everything you need,
            <br />
            nothing you don&apos;t.
          </h2>
          <p
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "1.0625rem",
              color: "#4b5a6d",
              maxWidth: "440px",
              margin: "0 auto",
              lineHeight: "1.65",
            }}
          >
            Fluid is deliberately focused. Every feature earns its place.
          </p>
        </div>

        {/* Feature grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "1.25rem",
          }}
        >
          {FEATURES.map(({ Icon, title, body }) => (
            <div
              key={title}
              className="hover-lift"
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "1.5rem",
                padding: "2rem",
                display: "flex",
                flexDirection: "column",
                gap: "1.25rem",
              }}
            >
              {/* Icon badge */}
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "0.75rem",
                  backgroundColor: "#d9e8ff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Icon size={22} color="#006bff" strokeWidth={2} aria-hidden="true" />
              </div>

              <div>
                <h3
                  style={{
                    fontFamily: "var(--font-manrope), sans-serif",
                    fontWeight: 600,
                    fontSize: "1.125rem",
                    color: "#1c2b4b",
                    margin: "0 0 0.5rem",
                    letterSpacing: "-0.015em",
                  }}
                >
                  {title}
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: "0.9375rem",
                    color: "#4b5a6d",
                    lineHeight: "1.65",
                    margin: 0,
                  }}
                >
                  {body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
