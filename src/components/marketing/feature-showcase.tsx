"use client";

import { useState, useEffect, useRef } from "react";

interface Feature {
  color: string;
  title: string;
  desc: string;
  gradient: string;
}

const FEATURES: Feature[] = [
  {
    color: "#006BFF",
    title: "Connect your calendars",
    desc: "Fluid connects to your calendar so invitees only see your real availability. No double-bookings, ever.",
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
  },
  {
    color: "#a855f7",
    title: "Add your availability",
    desc: "Set weekly schedules, block off dates, add buffer time. Configure minimum notice requirements.",
    gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  },
  {
    color: "#f97316",
    title: "Connect conferencing tools",
    desc: "Auto-generate Zoom or Google Meet links for every booking. Zero copy-paste.",
    gradient: "linear-gradient(135deg, #f7971e 0%, #ffd200 100%)",
  },
  {
    color: "#f97316",
    title: "Customize your event types",
    desc: "Create 1:1s, group sessions, or quick syncs. Every meeting format your work demands.",
    gradient: "linear-gradient(135deg, #f7971e 0%, #f97316 50%, #ef4444 100%)",
  },
  {
    color: "#10b981",
    title: "Share your scheduling link",
    desc: "Drop your link anywhere. Bookers pick a time. Both sides get confirmation.",
    gradient: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
  },
];

function IconCalendar({ color }: { color: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" aria-hidden="true">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function IconClock({ color }: { color: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function IconVideo({ color }: { color: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" aria-hidden="true">
      <polygon points="23 7 16 12 23 17 23 7" />
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </svg>
  );
}

function IconLayers({ color }: { color: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" aria-hidden="true">
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  );
}

function IconShare({ color }: { color: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" aria-hidden="true">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  );
}

const ICONS = [IconCalendar, IconClock, IconVideo, IconLayers, IconShare];

// Visual card content for each feature
function CardFeature1() {
  return (
    <div>
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
        {["Availability", "Connect existing calendar"].map((tab, i) => (
          <button
            key={tab}
            style={{
              padding: "0.375rem 0.75rem",
              borderRadius: "0.375rem",
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "0.75rem",
              fontWeight: 500,
              border: "none",
              cursor: "pointer",
              backgroundColor: i === 0 ? "#006BFF" : "transparent",
              color: i === 0 ? "#ffffff" : "#888888",
            }}
          >
            {tab}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
        {[
          { icon: "G", bg: "#4285F4", title: "Google", sub: "Google calendars" },
          { icon: "M", bg: "#0078D4", title: "Microsoft", sub: "Outlook calendars" },
        ].map(({ icon, bg, title, sub }) => (
          <div
            key={title}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              padding: "0.75rem",
              border: "1px solid #e5e7eb",
              borderRadius: "0.5rem",
              backgroundColor: "#f9fafb",
            }}
          >
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "0.375rem",
                backgroundColor: bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--font-manrope), sans-serif",
                fontWeight: 700,
                fontSize: "0.875rem",
                color: "#ffffff",
                flexShrink: 0,
              }}
            >
              {icon}
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  color: "#00213F",
                }}
              >
                {title}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: "0.75rem",
                  color: "#888888",
                }}
              >
                {sub}
              </div>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#888888" strokeWidth="2" aria-hidden="true">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
}

function CardFeature2() {
  const days = [
    { abbr: "MON", avail: true },
    { abbr: "TUE", avail: true },
    { abbr: "WED", avail: true },
    { abbr: "THU", avail: true },
    { abbr: "FRI", avail: true },
    { abbr: "SAT", avail: false },
    { abbr: "SUN", avail: false },
  ];
  return (
    <div>
      <div
        style={{
          fontFamily: "var(--font-manrope), sans-serif",
          fontWeight: 700,
          fontSize: "0.875rem",
          color: "#00213F",
          marginBottom: "0.875rem",
        }}
      >
        Weekly schedule
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
        {days.map(({ abbr, avail }) => (
          <div
            key={abbr}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.625rem",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontWeight: 600,
                fontSize: "0.6875rem",
                color: "#888888",
                width: "32px",
                letterSpacing: "0.05em",
              }}
            >
              {abbr}
            </span>
            {avail ? (
              <>
                <span
                  style={{
                    padding: "0.1875rem 0.5rem",
                    borderRadius: "9999px",
                    backgroundColor: "#EBF3FF",
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: "0.6875rem",
                    fontWeight: 500,
                    color: "#006BFF",
                  }}
                >
                  9:00 AM – 5:00 PM
                </span>
                <div
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "9999px",
                    backgroundColor: "#10b981",
                  }}
                />
              </>
            ) : (
              <span
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: "0.6875rem",
                  color: "#cccccc",
                }}
              >
                Unavailable
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function CardFeature3() {
  const tools = [
    { name: "Zoom", color: "#2D8CFF", active: true, status: "Connected" },
    { name: "Google Meet", color: "#34A853", active: false, status: "" },
    { name: "Teams", color: "#5558AF", active: false, status: "Coming soon" },
  ];
  return (
    <div>
      <div
        style={{
          fontFamily: "var(--font-manrope), sans-serif",
          fontWeight: 700,
          fontSize: "0.875rem",
          color: "#00213F",
          marginBottom: "0.875rem",
        }}
      >
        Conferencing tools
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {tools.map(({ name, color, active, status }) => (
          <div
            key={name}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              padding: "0.625rem 0.75rem",
              borderRadius: "0.5rem",
              border: active ? `1.5px solid ${color}` : "1px solid #e5e7eb",
              backgroundColor: active ? "#f0f7ff" : "#f9fafb",
            }}
          >
            <div
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "0.375rem",
                backgroundColor: color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--font-manrope), sans-serif",
                fontWeight: 700,
                fontSize: "0.75rem",
                color: "#ffffff",
                flexShrink: 0,
              }}
            >
              {name[0]}
            </div>
            <span
              style={{
                flex: 1,
                fontFamily: "var(--font-inter), sans-serif",
                fontWeight: 500,
                fontSize: "0.8125rem",
                color: "#00213F",
              }}
            >
              {name}
            </span>
            {active && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.25rem",
                  fontSize: "0.6875rem",
                  fontFamily: "var(--font-inter), sans-serif",
                  color: "#10b981",
                  fontWeight: 500,
                }}
              >
                <div
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "9999px",
                    backgroundColor: "#10b981",
                  }}
                />
                {status}
              </div>
            )}
            {!active && status && (
              <span
                style={{
                  fontSize: "0.625rem",
                  fontFamily: "var(--font-inter), sans-serif",
                  color: "#888888",
                  backgroundColor: "#f0f0f0",
                  padding: "0.125rem 0.375rem",
                  borderRadius: "9999px",
                }}
              >
                {status}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function CardFeature4() {
  const types = [
    {
      label: "One-on-one",
      color: "#006BFF",
      hosts: "1 host \u2192 1 invitee",
      desc: "Good for 1:1 check-ins",
    },
    {
      label: "Collective",
      color: "#10b981",
      hosts: "Multiple hosts \u2192 1 invitee",
      desc: "Co-host meetings",
    },
    {
      label: "Round robin",
      color: "#f97316",
      hosts: "Rotating hosts \u2192 1 invitee",
      desc: "Distribute among team",
    },
  ];
  return (
    <div>
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.875rem" }}>
        {["Event types", "Ways to meet"].map((tab, i) => (
          <button
            key={tab}
            style={{
              padding: "0.3125rem 0.625rem",
              borderRadius: "0.375rem",
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "0.75rem",
              fontWeight: 500,
              border: "none",
              cursor: "pointer",
              backgroundColor: i === 0 ? "#006BFF" : "transparent",
              color: i === 0 ? "#ffffff" : "#888888",
            }}
          >
            {tab}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {types.map(({ label, color, hosts, desc }) => (
          <div
            key={label}
            style={{
              padding: "0.625rem 0.75rem",
              borderRadius: "0.5rem",
              border: `1.5px solid ${color}20`,
              backgroundColor: `${color}08`,
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontWeight: 600,
                fontSize: "0.8125rem",
                color: color,
                marginBottom: "0.125rem",
              }}
            >
              {label}
            </div>
            <div
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "0.6875rem",
                color: "#666666",
              }}
            >
              {hosts}
            </div>
            <div
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "0.6875rem",
                color: "#888888",
              }}
            >
              {desc}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CardFeature5() {
  const slots = ["9:00 AM", "10:00 AM", "2:00 PM", "3:30 PM"];
  return (
    <div>
      <div
        style={{
          fontFamily: "var(--font-manrope), sans-serif",
          fontWeight: 700,
          fontSize: "0.875rem",
          color: "#00213F",
          marginBottom: "0.875rem",
        }}
      >
        Your scheduling link
      </div>
      {/* URL bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          padding: "0.5rem 0.75rem",
          borderRadius: "0.375rem",
          backgroundColor: "#EBF3FF",
          marginBottom: "1rem",
        }}
      >
        <span
          style={{
            flex: 1,
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: "0.75rem",
            fontWeight: 500,
            color: "#006BFF",
          }}
        >
          fluid.app/yourname/30min
        </span>
        <button
          style={{
            padding: "0.1875rem 0.5rem",
            borderRadius: "0.25rem",
            backgroundColor: "#006BFF",
            color: "#ffffff",
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: "0.6875rem",
            fontWeight: 600,
            border: "none",
            cursor: "pointer",
          }}
        >
          Copy
        </button>
      </div>
      {/* Mini booking preview */}
      <div
        style={{
          padding: "0.75rem",
          borderRadius: "0.5rem",
          border: "1px solid #e5e7eb",
          backgroundColor: "#f9fafb",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-inter), sans-serif",
            fontWeight: 600,
            fontSize: "0.75rem",
            color: "#00213F",
            marginBottom: "0.5rem",
          }}
        >
          30 Minute Meeting
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.25rem" }}>
          {slots.map((slot) => (
            <span
              key={slot}
              style={{
                padding: "0.1875rem 0.5rem",
                borderRadius: "0.25rem",
                backgroundColor: "#006BFF",
                color: "#ffffff",
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "0.6875rem",
                fontWeight: 500,
              }}
            >
              {slot}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

const CARD_COMPONENTS = [CardFeature1, CardFeature2, CardFeature3, CardFeature4, CardFeature5];

const INTERVAL_MS = 5000;

export function FeatureShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [progressKey, setProgressKey] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function goTo(index: number) {
    setActiveIndex(index);
    setProgressKey((k) => k + 1);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % FEATURES.length;
        setProgressKey((k) => k + 1);
        return next;
      });
    }, INTERVAL_MS);
  }

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % FEATURES.length;
        setProgressKey((k) => k + 1);
        return next;
      });
    }, INTERVAL_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const CardComponent = CARD_COMPONENTS[activeIndex];

  return (
    <section
      id="features"
      style={{
        backgroundColor: "#ffffff",
        padding: "6rem 1.5rem",
      }}
    >
      <style>{`
        @keyframes fluid-progress {
          from { width: 0%; }
          to { width: 100%; }
        }
        @keyframes fluid-card-fade {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fluid-feature-item {
          cursor: pointer;
          transition: opacity 0.2s ease;
        }
        .fluid-feature-item:hover .fluid-feature-title {
          color: #00213F !important;
        }
        .fluid-showcase-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 3rem;
          align-items: start;
        }
        @media (min-width: 1024px) {
          .fluid-showcase-grid {
            grid-template-columns: 2fr 3fr;
            align-items: start;
          }
        }
        .fluid-right-panel {
          display: none;
        }
        @media (min-width: 1024px) {
          .fluid-right-panel {
            display: block;
          }
        }
      `}</style>

      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Section label */}
        <div style={{ marginBottom: "3rem" }}>
          <span
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontWeight: 600,
              fontSize: "0.8125rem",
              color: "#006BFF",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            How it works
          </span>
        </div>

        <div className="fluid-showcase-grid">
          {/* Left: Feature accordion */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0", position: "relative" }}>
            {FEATURES.map((feature, index) => {
              const isActive = index === activeIndex;
              const Icon = ICONS[index];
              return (
                <div
                  key={index}
                  className="fluid-feature-item"
                  onClick={() => goTo(index)}
                  style={{
                    padding: "1.125rem 0 1.125rem 1.25rem",
                    borderLeft: `2px solid ${isActive ? feature.color : "#e5e7eb"}`,
                    opacity: isActive ? 1 : 0.6,
                    transition: "border-color 0.2s ease, opacity 0.2s ease",
                    position: "relative",
                  }}
                >
                  {/* Icon + Title row */}
                  <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: isActive ? "0.5rem" : "0" }}>
                    <div
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "0.5rem",
                        backgroundColor: isActive ? `${feature.color}15` : "#f5f5f7",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        transition: "background-color 0.2s ease",
                      }}
                    >
                      <Icon color={isActive ? feature.color : "#888888"} />
                    </div>
                    <span
                      className="fluid-feature-title"
                      style={{
                        fontFamily: "var(--font-manrope), sans-serif",
                        fontWeight: 600,
                        fontSize: "1rem",
                        color: isActive ? "#00213F" : "#888888",
                        transition: "color 0.2s ease",
                      }}
                    >
                      {feature.title}
                    </span>
                  </div>

                  {/* Description — only when active */}
                  {isActive && (
                    <div>
                      <p
                        style={{
                          fontFamily: "var(--font-inter), sans-serif",
                          fontSize: "0.875rem",
                          color: "#666666",
                          lineHeight: "1.65",
                          margin: "0 0 0.75rem",
                        }}
                      >
                        {feature.desc}
                      </p>
                      {/* Progress bar */}
                      <div
                        style={{
                          height: "2px",
                          backgroundColor: "#e5e7eb",
                          borderRadius: "9999px",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          key={progressKey}
                          style={{
                            height: "100%",
                            backgroundColor: feature.color,
                            borderRadius: "9999px",
                            animation: `fluid-progress ${INTERVAL_MS}ms linear forwards`,
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right: Animated visual panel */}
          <div className="fluid-right-panel">
            <div
              style={{
                borderRadius: "1rem",
                height: "500px",
                overflow: "hidden",
                position: "relative",
                background: FEATURES[activeIndex].gradient,
                transition: "background 0.4s ease",
              }}
            >
              {/* White card at bottom 70% */}
              <div
                key={activeIndex}
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: "72%",
                  backgroundColor: "#ffffff",
                  borderRadius: "1rem 1rem 0 0",
                  padding: "1.5rem",
                  animation: "fluid-card-fade 0.35s ease both",
                  overflowY: "auto",
                }}
              >
                <CardComponent />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
