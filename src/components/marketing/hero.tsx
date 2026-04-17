import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

const CALENDAR_DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const APRIL_DAYS: (number | null)[][] = [
  [null, null, 1, 2, 3, 4, 5],
  [6, 7, 8, 9, 10, 11, 12],
  [13, 14, 15, 16, 17, 18, 19],
  [20, 21, 22, 23, 24, 25, 26],
  [27, 28, 29, 30, null, null, null],
];
const AVAILABLE_DATES = new Set([3, 7, 8, 9, 10, 14, 15, 16, 17, 22, 23, 28, 29]);
const SELECTED_DATE = 15;
const TIME_SLOTS = ["9:00 AM", "9:30 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:30 PM"];
const SELECTED_SLOT = "10:00 AM";

export function Hero() {
  return (
    <section
      style={{
        backgroundColor: "#fcf8fe",
        padding: "5.5rem 1.5rem 5rem",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Ambient glow blobs */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "-160px",
          right: "-120px",
          width: "680px",
          height: "680px",
          borderRadius: "9999px",
          background: "radial-gradient(circle, rgba(112, 115, 255, 0.11) 0%, transparent 68%)",
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: "-80px",
          left: "-140px",
          width: "540px",
          height: "540px",
          borderRadius: "9999px",
          background: "radial-gradient(circle, rgba(74, 75, 215, 0.07) 0%, transparent 68%)",
          pointerEvents: "none",
        }}
      />

      <style>{`
        .hero-primary:hover { filter: brightness(0.94); transform: translateY(-2px); box-shadow: 0 10px 32px rgba(74, 75, 215, 0.42) !important; }
        .hero-primary { transition: filter 0.16s ease, transform 0.16s ease, box-shadow 0.16s ease; }
        .hero-secondary:hover { background-color: #ccc9f2 !important; transform: translateY(-1px); }
        .hero-secondary { transition: background-color 0.16s ease, transform 0.16s ease; }
        .hero-grid { display: grid; grid-template-columns: 1fr; gap: 4rem; align-items: center; }
        @media (min-width: 1024px) { .hero-grid { grid-template-columns: 1fr 1fr; } }
      `}</style>

      <div style={{ maxWidth: "1152px", margin: "0 auto", position: "relative", zIndex: 1 }}>

        {/* Two-column layout on large screens */}
        <div className="hero-grid">
          {/* Left: Copy */}
          <div>
            {/* Badge */}
            <div style={{ marginBottom: "1.75rem" }}>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.375rem 0.875rem",
                  borderRadius: "9999px",
                  backgroundColor: "#e2e0f9",
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                  color: "#4a4bd7",
                  letterSpacing: "0.005em",
                }}
              >
                <span
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "9999px",
                    backgroundColor: "#4a4bd7",
                    display: "inline-block",
                    flexShrink: 0,
                  }}
                />
                Scheduling, reimagined for serious work
              </span>
            </div>

            {/* Headline — two lines */}
            <h1
              style={{
                fontFamily: "var(--font-manrope), sans-serif",
                fontWeight: 800,
                fontSize: "clamp(2.25rem, 4.5vw, 3.625rem)",
                lineHeight: "1.08",
                color: "#32323b",
                letterSpacing: "-0.035em",
                margin: "0 0 1.25rem",
              }}
            >
              Scheduling,{" "}
              <br />
              <span
                style={{
                  backgroundImage: "linear-gradient(135deg, #4a4bd7 20%, #7073ff 80%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                reimagined.
              </span>
            </h1>

            {/* Subhead */}
            <p
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "clamp(1rem, 1.8vw, 1.125rem)",
                fontWeight: 400,
                color: "#5f5e68",
                lineHeight: "1.68",
                maxWidth: "480px",
                margin: "0 0 2.5rem",
              }}
            >
              Fluid makes booking meetings feel effortless — for you and everyone you meet.
              Share one link. Let availability speak for itself.
            </p>

            {/* CTAs */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.875rem", marginBottom: "2rem" }}>
              <Link
                href="/login"
                className="hero-primary cta-gradient"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontFamily: "var(--font-inter), sans-serif",
                  fontWeight: 600,
                  fontSize: "1rem",
                  textDecoration: "none",
                  padding: "0.8125rem 1.75rem",
                  borderRadius: "0.75rem",
                  boxShadow: "0 4px 20px rgba(74, 75, 215, 0.32)",
                }}
              >
                Get started — it&apos;s free
                <ArrowRight size={16} strokeWidth={2.5} />
              </Link>
              <a
                href="#how-it-works"
                className="hero-secondary"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontFamily: "var(--font-inter), sans-serif",
                  fontWeight: 600,
                  fontSize: "1rem",
                  color: "#4a4bd7",
                  textDecoration: "none",
                  padding: "0.8125rem 1.75rem",
                  borderRadius: "0.75rem",
                  backgroundColor: "#e2e0f9",
                }}
              >
                See a demo
              </a>
            </div>

            {/* Trust signals */}
            <p
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "0.8125rem",
                color: "#7b7984",
                margin: 0,
              }}
            >
              No credit card required&nbsp;&nbsp;·&nbsp;&nbsp;2-minute setup&nbsp;&nbsp;·&nbsp;&nbsp;Free forever plan
            </p>
          </div>

          {/* Right: Product mockup */}
          <div style={{ position: "relative" }}>
            {/* Glow behind card */}
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: "-40px",
                borderRadius: "9999px",
                background: "radial-gradient(circle at 60% 40%, rgba(74, 75, 215, 0.12) 0%, transparent 65%)",
                filter: "blur(32px)",
                pointerEvents: "none",
                zIndex: 0,
              }}
            />

            {/* Booking card */}
            <div
              style={{
                position: "relative",
                zIndex: 1,
                backgroundColor: "#ffffff",
                borderRadius: "1.25rem",
                overflow: "hidden",
                boxShadow: "0 24px 64px rgba(50, 50, 59, 0.12), 0 4px 16px rgba(50, 50, 59, 0.06)",
              }}
            >
              {/* Browser chrome */}
              <div
                style={{
                  backgroundColor: "#f0ecf6",
                  padding: "0.8125rem 1.125rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.875rem",
                }}
              >
                <div style={{ display: "flex", gap: "0.375rem" }} aria-hidden="true">
                  {["#f97386", "#fbbf24", "#34d399"].map((c, i) => (
                    <div key={i} style={{ width: "10px", height: "10px", borderRadius: "9999px", backgroundColor: c }} />
                  ))}
                </div>
                <div
                  style={{
                    flex: 1,
                    backgroundColor: "#e4e1ed",
                    borderRadius: "0.3125rem",
                    padding: "0.25rem 0.625rem",
                    fontSize: "0.6875rem",
                    fontFamily: "var(--font-inter), sans-serif",
                    color: "#7b7984",
                  }}
                >
                  fluid.app/alex-morgan/30min
                </div>
              </div>

              {/* Card body */}
              <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", minHeight: "340px" }}>

                {/* Left info panel */}
                <div
                  style={{
                    backgroundColor: "#f6f2fb",
                    padding: "1.5rem 1.125rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "1.125rem",
                  }}
                >
                  <div
                    style={{
                      width: "38px",
                      height: "38px",
                      borderRadius: "9999px",
                      background: "linear-gradient(135deg, #4a4bd7, #7073ff)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "var(--font-manrope), sans-serif",
                      fontWeight: 700,
                      fontSize: "1rem",
                      color: "#fbf7ff",
                    }}
                    aria-label="Host avatar: Alex Morgan"
                  >
                    A
                  </div>
                  <div>
                    <p
                      style={{
                        fontSize: "0.625rem",
                        fontFamily: "var(--font-inter), sans-serif",
                        color: "#7b7984",
                        fontWeight: 600,
                        margin: "0 0 0.25rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.07em",
                      }}
                    >
                      Alex Morgan
                    </p>
                    <h3
                      style={{
                        fontFamily: "var(--font-manrope), sans-serif",
                        fontWeight: 700,
                        fontSize: "0.9375rem",
                        color: "#32323b",
                        margin: "0 0 0.875rem",
                        lineHeight: 1.3,
                      }}
                    >
                      30 Minute Intro Call
                    </h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.4375rem" }}>
                      {[
                        { dot: "#4a4bd7", label: "30 min" },
                        { dot: "#7073ff", label: "Video call" },
                        { dot: "#745479", label: "Apr 2026" },
                      ].map(({ dot, label }) => (
                        <div
                          key={label}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.4375rem",
                            fontSize: "0.75rem",
                            fontFamily: "var(--font-inter), sans-serif",
                            color: "#5f5e68",
                          }}
                        >
                          <span style={{ width: "6px", height: "6px", borderRadius: "9999px", backgroundColor: dot, flexShrink: 0 }} />
                          {label}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div
                    style={{
                      marginTop: "auto",
                      padding: "0.625rem 0.75rem",
                      backgroundColor: "#e2e0f9",
                      borderRadius: "0.75rem",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "0.6875rem",
                        fontFamily: "var(--font-inter), sans-serif",
                        color: "#4a4bd7",
                        fontWeight: 500,
                        margin: 0,
                        lineHeight: 1.5,
                      }}
                    >
                      Select a date &amp; time
                    </p>
                  </div>
                </div>

                {/* Right: Calendar + slots */}
                <div style={{ backgroundColor: "#ffffff", display: "flex", flexDirection: "column" }}>
                  {/* Calendar */}
                  <div style={{ padding: "1.25rem 1.125rem 1rem", flex: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "0.875rem",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "var(--font-manrope), sans-serif",
                          fontWeight: 700,
                          fontSize: "0.875rem",
                          color: "#32323b",
                        }}
                      >
                        April 2026
                      </span>
                      <div style={{ display: "flex", gap: "0.25rem" }} aria-hidden="true">
                        {[ChevronLeft, ChevronRight].map((Icon, i) => (
                          <div
                            key={i}
                            style={{
                              width: "24px",
                              height: "24px",
                              borderRadius: "0.375rem",
                              backgroundColor: "#f0ecf6",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "#5f5e68",
                            }}
                          >
                            <Icon size={12} />
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
                            color: "#7b7984",
                            padding: "0.1875rem 0",
                            textTransform: "uppercase",
                            letterSpacing: "0.04em",
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
                                aria-label={day ? `April ${day}${isAvail ? ", available" : ""}${isSel ? ", selected" : ""}` : undefined}
                                style={{
                                  textAlign: "center",
                                  padding: "0.25rem 0",
                                  borderRadius: "0.3125rem",
                                  fontSize: "0.6875rem",
                                  fontFamily: "var(--font-inter), sans-serif",
                                  fontWeight: isSel ? 700 : isAvail ? 600 : 400,
                                  color: isSel ? "#fbf7ff" : isAvail ? "#32323b" : day === null ? "transparent" : "#b3b0bc",
                                  background: isSel
                                    ? "linear-gradient(135deg, #4a4bd7, #7073ff)"
                                    : isAvail
                                    ? "#f0ecf6"
                                    : "transparent",
                                }}
                              >
                                {day ?? ""}
                              </div>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Time slots */}
                  <div
                    style={{
                      backgroundColor: "#f6f2fb",
                      padding: "1rem 1.125rem",
                      borderTop: "1px solid rgba(179, 176, 188, 0.12)",
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "var(--font-manrope), sans-serif",
                        fontWeight: 700,
                        fontSize: "0.75rem",
                        color: "#32323b",
                        margin: "0 0 0.625rem",
                      }}
                    >
                      Tue, Apr 15
                    </p>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "0.375rem",
                      }}
                    >
                      {TIME_SLOTS.map((slot) => {
                        const isSel = slot === SELECTED_SLOT;
                        return (
                          <div
                            key={slot}
                            style={{
                              padding: "0.3125rem 0.625rem",
                              borderRadius: "0.5rem",
                              fontFamily: "var(--font-inter), sans-serif",
                              fontSize: "0.6875rem",
                              fontWeight: 500,
                              background: isSel ? "linear-gradient(135deg, #4a4bd7, #7073ff)" : "#ffffff",
                              color: isSel ? "#fbf7ff" : "#32323b",
                              boxShadow: isSel ? "0 2px 8px rgba(74, 75, 215, 0.28)" : "0 1px 3px rgba(50, 50, 59, 0.05)",
                            }}
                          >
                            {slot}
                          </div>
                        );
                      })}
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
