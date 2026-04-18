import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

const CALENDAR_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const APRIL_DAYS: (number | null)[][] = [
  [null, null, 1, 2, 3, 4, 5],
  [6, 7, 8, 9, 10, 11, 12],
  [13, 14, 15, 16, 17, 18, 19],
  [20, 21, 22, 23, 24, 25, 26],
  [27, 28, 29, 30, null, null, null],
];
const AVAILABLE_DATES = new Set([7, 8, 9, 10, 14, 15, 16, 17, 21, 22, 23, 24, 28, 29, 30]);
const SELECTED_DATE = 17;
const TIME_SLOTS = ["1:00 pm", "2:30 pm", "4:00 pm"];

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

export function Hero() {
  return (
    <section
      style={{
        backgroundColor: "#ffffff",
        padding: "5rem 1.5rem 5rem",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <style>{`
        .hero-google-btn:hover { background-color: #0055CC !important; }
        .hero-google-btn { transition: background-color 0.16s ease; }
        .hero-email-link:hover { color: #006BFF !important; }
        .hero-email-link { transition: color 0.14s ease; }
        .fluid-hero-grid { display: grid; grid-template-columns: 1fr; gap: 4rem; align-items: center; }
        @media (min-width: 1024px) { .fluid-hero-grid { grid-template-columns: 1fr 1fr; } }
        .fluid-booking-card { display: none; }
        @media (min-width: 1024px) { .fluid-booking-card { display: block; } }
      `}</style>

      <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div className="fluid-hero-grid">

          {/* Left: Copy */}
          <div>
            {/* Badge pill */}
            <div style={{ marginBottom: "1.5rem" }}>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.375rem 1rem",
                  borderRadius: "9999px",
                  backgroundColor: "#00213F",
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                  color: "#ffffff",
                  letterSpacing: "0.005em",
                }}
              >
                <span
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "9999px",
                    backgroundColor: "#006BFF",
                    display: "inline-block",
                    flexShrink: 0,
                  }}
                />
                The #1 scheduling tool
              </span>
            </div>

            {/* Headline */}
            <h1
              style={{
                fontFamily: "var(--font-manrope), sans-serif",
                fontWeight: 800,
                fontSize: "clamp(2.5rem, 5vw, 4rem)",
                lineHeight: "1.06",
                color: "#00213F",
                letterSpacing: "-0.03em",
                margin: "0 0 1.25rem",
              }}
            >
              Easy scheduling ahead
            </h1>

            {/* Subhead */}
            <p
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "clamp(1rem, 1.6vw, 1.125rem)",
                fontWeight: 400,
                color: "#666666",
                lineHeight: "1.65",
                maxWidth: "440px",
                margin: "0 0 2.25rem",
              }}
            >
              Join millions who book meetings without the back-and-forth. Share your link and let Fluid handle the rest.
            </p>

            {/* Sign up buttons */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", maxWidth: "360px" }}>
              {/* Google sign up */}
              <Link
                href="/login"
                className="hero-google-btn"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.625rem",
                  fontFamily: "var(--font-inter), sans-serif",
                  fontWeight: 600,
                  fontSize: "0.9375rem",
                  color: "#ffffff",
                  textDecoration: "none",
                  padding: "0.75rem 1.5rem",
                  borderRadius: "0.375rem",
                  backgroundColor: "#006BFF",
                }}
              >
                <GoogleIcon />
                Sign up with Google
              </Link>

              {/* OR divider */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                }}
              >
                <div style={{ flex: 1, height: "1px", backgroundColor: "#e5e7eb" }} />
                <span
                  style={{
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: "0.8125rem",
                    color: "#888888",
                    fontWeight: 500,
                  }}
                >
                  OR
                </span>
                <div style={{ flex: 1, height: "1px", backgroundColor: "#e5e7eb" }} />
              </div>

              {/* Email sign up */}
              <Link
                href="/login"
                className="hero-email-link"
                style={{
                  display: "block",
                  textAlign: "center",
                  fontFamily: "var(--font-inter), sans-serif",
                  fontWeight: 600,
                  fontSize: "0.9375rem",
                  color: "#006BFF",
                  textDecoration: "none",
                }}
              >
                Sign up free with email. No credit card required.
              </Link>
            </div>

            {/* Trust line */}
            <p
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "0.8125rem",
                color: "#888888",
                margin: "1.5rem 0 0",
              }}
            >
              No credit card&nbsp;&nbsp;·&nbsp;&nbsp;2 min setup&nbsp;&nbsp;·&nbsp;&nbsp;Free plan
            </p>
          </div>

          {/* Right: Booking card mockup */}
          <div className="fluid-booking-card" style={{ position: "relative" }}>
            {/* Booking card */}
            <div
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "1rem",
                overflow: "hidden",
                boxShadow: "0 4px 6px -1px rgba(0,0,0,0.07), 0 20px 50px -12px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.05)",
              }}
            >
              {/* Browser chrome bar */}
              <div
                style={{
                  backgroundColor: "#f5f5f7",
                  padding: "0.6875rem 1rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  borderBottom: "1px solid #e5e7eb",
                }}
              >
                <div style={{ display: "flex", gap: "0.3125rem" }} aria-hidden="true">
                  {["#FF5F57", "#FFBD2E", "#28C840"].map((c, i) => (
                    <div
                      key={i}
                      style={{
                        width: "10px",
                        height: "10px",
                        borderRadius: "9999px",
                        backgroundColor: c,
                      }}
                    />
                  ))}
                </div>
                <div
                  style={{
                    flex: 1,
                    backgroundColor: "#e5e7eb",
                    borderRadius: "0.25rem",
                    padding: "0.1875rem 0.5rem",
                    fontSize: "0.6875rem",
                    fontFamily: "var(--font-inter), sans-serif",
                    color: "#888888",
                  }}
                >
                  fluid.app/alex/30min
                </div>
              </div>

              {/* Card body: two-panel layout */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "190px 1fr",
                  minHeight: "380px",
                }}
              >
                {/* Left info panel */}
                <div
                  style={{
                    backgroundColor: "#ffffff",
                    padding: "1.5rem 1.125rem",
                    borderRight: "1px solid #e5e7eb",
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                  }}
                >
                  {/* Avatar */}
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "9999px",
                      backgroundColor: "#006BFF",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "var(--font-manrope), sans-serif",
                      fontWeight: 700,
                      fontSize: "1rem",
                      color: "#ffffff",
                    }}
                    aria-label="Host avatar"
                  >
                    A
                  </div>

                  <div>
                    <p
                      style={{
                        fontSize: "0.6875rem",
                        fontFamily: "var(--font-inter), sans-serif",
                        color: "#888888",
                        fontWeight: 500,
                        margin: "0 0 0.25rem",
                      }}
                    >
                      Alex Morgan
                    </p>
                    <h3
                      style={{
                        fontFamily: "var(--font-manrope), sans-serif",
                        fontWeight: 700,
                        fontSize: "1rem",
                        color: "#00213F",
                        margin: "0 0 1rem",
                        lineHeight: 1.25,
                      }}
                    >
                      30 Minute Check-in
                    </h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.4375rem",
                          fontSize: "0.75rem",
                          fontFamily: "var(--font-inter), sans-serif",
                          color: "#666666",
                        }}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                        30 min
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.4375rem",
                          fontSize: "0.75rem",
                          fontFamily: "var(--font-inter), sans-serif",
                          color: "#666666",
                        }}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                          <polygon points="23 7 16 12 23 17 23 7" />
                          <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                        </svg>
                        Video call
                      </div>
                    </div>
                  </div>

                  {/* Timezone selector */}
                  <div
                    style={{
                      marginTop: "auto",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.375rem",
                      fontSize: "0.6875rem",
                      fontFamily: "var(--font-inter), sans-serif",
                      color: "#666666",
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="2" y1="12" x2="22" y2="12" />
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                    </svg>
                    Eastern time - US &amp; Canada
                  </div>
                </div>

                {/* Right: Calendar + time slots */}
                <div
                  style={{
                    backgroundColor: "#ffffff",
                    padding: "1.25rem 1rem",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {/* Month header */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "1rem",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-manrope), sans-serif",
                        fontWeight: 700,
                        fontSize: "0.875rem",
                        color: "#00213F",
                      }}
                    >
                      April 2026
                    </span>
                    <div style={{ display: "flex", gap: "0.25rem" }} aria-hidden="true">
                      {[ChevronLeft, ChevronRight].map((Icon, i) => (
                        <div
                          key={i}
                          style={{
                            width: "22px",
                            height: "22px",
                            borderRadius: "0.25rem",
                            border: "1px solid #e5e7eb",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#888888",
                            cursor: "pointer",
                          }}
                        >
                          <Icon size={11} />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Day headers */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(7, 1fr)",
                      gap: "0.125rem",
                      marginBottom: "0.25rem",
                    }}
                    aria-hidden="true"
                  >
                    {CALENDAR_DAYS.map((d) => (
                      <div
                        key={d}
                        style={{
                          textAlign: "center",
                          fontSize: "0.5625rem",
                          fontFamily: "var(--font-inter), sans-serif",
                          fontWeight: 600,
                          color: "#888888",
                          padding: "0.125rem 0",
                          textTransform: "uppercase",
                          letterSpacing: "0.03em",
                        }}
                      >
                        {d}
                      </div>
                    ))}
                  </div>

                  {/* Calendar grid */}
                  <div aria-label="April 2026 calendar" role="grid">
                    {APRIL_DAYS.map((week, wi) => (
                      <div
                        key={wi}
                        role="row"
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(7, 1fr)",
                          gap: "0.125rem",
                          marginBottom: "0.125rem",
                        }}
                      >
                        {week.map((day, di) => {
                          const isAvail = day !== null && AVAILABLE_DATES.has(day);
                          const isSel = day === SELECTED_DATE;
                          return (
                            <div
                              key={di}
                              role="gridcell"
                              aria-label={
                                day
                                  ? `April ${day}${isAvail ? ", available" : ""}${isSel ? ", selected" : ""}`
                                  : undefined
                              }
                              style={{
                                textAlign: "center",
                                padding: "0.25rem 0.125rem",
                                borderRadius: "9999px",
                                fontSize: "0.6875rem",
                                fontFamily: "var(--font-inter), sans-serif",
                                fontWeight: isSel ? 700 : isAvail ? 500 : 400,
                                color: isSel
                                  ? "#ffffff"
                                  : isAvail
                                  ? "#00213F"
                                  : day === null
                                  ? "transparent"
                                  : "#cccccc",
                                backgroundColor: isSel
                                  ? "#006BFF"
                                  : isAvail
                                  ? "#EBF3FF"
                                  : "transparent",
                                cursor: isAvail ? "pointer" : "default",
                              }}
                            >
                              {day ?? ""}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>

                  {/* Time slots */}
                  <div
                    style={{
                      marginTop: "auto",
                      paddingTop: "0.875rem",
                      borderTop: "1px solid #e5e7eb",
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "var(--font-inter), sans-serif",
                        fontWeight: 600,
                        fontSize: "0.6875rem",
                        color: "#888888",
                        margin: "0 0 0.5rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      Thu, Apr 17
                    </p>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.375rem",
                      }}
                    >
                      {TIME_SLOTS.map((slot, i) => (
                        <div
                          key={slot}
                          style={{
                            padding: "0.4375rem 0.75rem",
                            borderRadius: "0.25rem",
                            fontFamily: "var(--font-inter), sans-serif",
                            fontSize: "0.75rem",
                            fontWeight: 500,
                            border: `1px solid ${i === 1 ? "#006BFF" : "#e5e7eb"}`,
                            color: i === 1 ? "#ffffff" : "#00213F",
                            backgroundColor: i === 1 ? "#006BFF" : "#ffffff",
                            textAlign: "center",
                          }}
                        >
                          {slot}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
