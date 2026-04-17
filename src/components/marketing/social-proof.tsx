const LOGOS = [
  "Northwind",
  "Kite",
  "Atlas",
  "Orbit",
  "Cadence",
  "Meridian",
];

export function SocialProof() {
  return (
    <section
      style={{
        backgroundColor: "#f6f2fb",
        padding: "2.75rem 1.5rem",
      }}
    >
      <div
        style={{
          maxWidth: "1152px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1.5rem",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: "0.875rem",
            fontWeight: 500,
            color: "#7b7984",
            margin: 0,
            letterSpacing: "0.01em",
            textAlign: "center",
          }}
        >
          Trusted by teams that ship
        </p>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.375rem",
            rowGap: "0.5rem",
          }}
        >
          {LOGOS.map((name) => (
            <span
              key={name}
              style={{
                fontFamily: "var(--font-manrope), sans-serif",
                fontWeight: 700,
                fontSize: "1.0625rem",
                color: "rgba(95, 94, 104, 0.55)",
                letterSpacing: "-0.02em",
                padding: "0 1.25rem",
                userSelect: "none",
                whiteSpace: "nowrap",
              }}
              aria-label={name}
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
