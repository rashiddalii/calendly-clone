"use client";

import { useState, useEffect, useRef, type ComponentType } from "react";

/* ─── Logo components (use currentColor for hover-to-white) ─── */
function LogoHackerOne() {
  return (
    <div style={{
      fontFamily: "var(--font-inter), sans-serif",
      fontWeight: 300, fontSize: "1.65rem",
      letterSpacing: "-0.03em", color: "inherit", lineHeight: 1,
    }}>hackerone</div>
  );
}
function LogoVonage() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 9, color: "inherit" }}>
      <svg width="24" height="20" viewBox="0 0 24 20" fill="none" aria-hidden="true">
        <path d="M2 1.5L12 18.5L22 1.5" stroke="currentColor" strokeWidth="3.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <span style={{ fontFamily: "var(--font-manrope), sans-serif", fontWeight: 800, fontSize: "1.15rem", letterSpacing: "0.07em", color: "inherit" }}>
        VONAGE
      </span>
    </div>
  );
}
function LogoTexas() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, color: "inherit" }}>
      <svg width="28" height="32" viewBox="0 0 28 32" fill="none" aria-hidden="true">
        <path d="M14 0.5L1 6v13C1 26 7 31.5 14 31.5S27 26 27 19V6L14 0.5z" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="1.5"/>
        <text x="14" y="21" textAnchor="middle" fontSize="11" fontWeight="900" fill="currentColor" fontFamily="Georgia, serif">T</text>
      </svg>
      <div>
        <div style={{ fontFamily: "var(--font-manrope), sans-serif", fontWeight: 800, fontSize: "0.875rem", letterSpacing: "0.07em", color: "inherit", lineHeight: 1.2 }}>TEXAS</div>
        <div style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "0.6rem", color: "inherit", opacity: 0.65, lineHeight: 1.3 }}>The University of Texas<br />at Austin</div>
      </div>
    </div>
  );
}
function LogoDropbox() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 9, color: "inherit" }}>
      <svg width="22" height="19" viewBox="0 0 40 34" fill="currentColor" aria-hidden="true">
        <path d="M10 0L0 6.5l10 6.5 10-6.5L10 0zM30 0L20 6.5l10 6.5 10-6.5L30 0zM0 19.5L10 26l10-6.5L10 13 0 19.5zM20 13l10 6.5L40 13l-10-6.5L20 13zM10 27.5L20 34l10-6.5L20 21 10 27.5z"/>
      </svg>
      <span style={{ fontFamily: "var(--font-manrope), sans-serif", fontWeight: 800, fontSize: "1.1rem", letterSpacing: "0.01em", color: "inherit" }}>
        Dropbox
      </span>
    </div>
  );
}
function LogoGong() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 9, color: "inherit" }}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8"/>
        <circle cx="12" cy="12" r="4" fill="currentColor" opacity="0.2"/>
        <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
      <span style={{ fontFamily: "var(--font-manrope), sans-serif", fontWeight: 800, fontSize: "1.15rem", letterSpacing: "0.01em", color: "inherit" }}>
        Gong
      </span>
    </div>
  );
}
function LogoZendesk() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 9, color: "inherit" }}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8"/>
        <path d="M8 8.5h8L8 15.5h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <span style={{ fontFamily: "var(--font-manrope), sans-serif", fontWeight: 800, fontSize: "1.15rem", letterSpacing: "0.01em", color: "inherit" }}>
        Zendesk
      </span>
    </div>
  );
}

/* ─── Story data ─────────────────────────────────────────────── */
interface Story {
  id: string;
  Logo: ComponentType;
  stat: string;
  desc: string;
  cls: string;       // CSS class for accent colours
  numColor: string;
  blobColor: string;
  hoverColor: string;
}

const STORIES: Story[] = [
  {
    id: "hackerone", Logo: LogoHackerOne,
    stat: "169%", desc: "return on investment",
    cls: "sc-1", numColor: "#00213F", blobColor: "#00213F", hoverColor: "#001d35",
  },
  {
    id: "vonage", Logo: LogoVonage,
    stat: "160%", desc: "increase in customers reached",
    cls: "sc-2", numColor: "#006BFF", blobColor: "#006BFF", hoverColor: "#005ae0",
  },
  {
    id: "texas", Logo: LogoTexas,
    stat: "20%", desc: "decrease in scheduling errors",
    cls: "sc-3", numColor: "#d97706", blobColor: "#f59e0b", hoverColor: "#d97706",
  },
  {
    id: "dropbox", Logo: LogoDropbox,
    stat: "37%", desc: "less time spent on scheduling",
    cls: "sc-4", numColor: "#0061FE", blobColor: "#0061FE", hoverColor: "#0052d9",
  },
  {
    id: "gong", Logo: LogoGong,
    stat: "3×", desc: "increase in demos booked per week",
    cls: "sc-5", numColor: "#7B2FBE", blobColor: "#7B2FBE", hoverColor: "#6b27a8",
  },
  {
    id: "zendesk", Logo: LogoZendesk,
    stat: "55%", desc: "more customer meetings scheduled",
    cls: "sc-6", numColor: "#03363D", blobColor: "#03363D", hoverColor: "#022a30",
  },
];

const PAGE_SIZE = 3;
const TOTAL_PAGES = Math.ceil(STORIES.length / PAGE_SIZE);

/* ─── Arrow CTA ──────────────────────────────────────────────── */
const ArrowRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M5 12h14M12 5l7 7-7 7" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export function Stats() {
  const [page, setPage] = useState(0);
  const [dir, setDir] = useState<"fwd" | "back">("fwd");
  const sectionRef = useRef<HTMLElement>(null);
  const [sectionVisible, setSectionVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          requestAnimationFrame(() => requestAnimationFrame(() => setSectionVisible(true)));
          obs.disconnect();
        }
      },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  function next() { setDir("fwd"); setPage((p) => (p + 1) % TOTAL_PAGES); }
  function prev() { setDir("back"); setPage((p) => (p - 1 + TOTAL_PAGES) % TOTAL_PAGES); }

  const visible = STORIES.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  return (
    <section
      ref={sectionRef}
      id="stories"
      style={{
        backgroundColor: "#ffffff", padding: "5rem 1.5rem",
        opacity: sectionVisible ? 1 : 0,
        transform: sectionVisible
          ? "perspective(1000px) rotateX(0deg) translateY(0)"
          : "perspective(1000px) rotateX(5deg) translateY(36px)",
        transition: "opacity 0.85s cubic-bezier(0.4,0,0.2,1), transform 0.85s cubic-bezier(0.4,0,0.2,1)",
      }}
    >
      <style>{`
        /* Grid */
        .sc-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.25rem;
        }
        @media (min-width: 768px) { .sc-grid { grid-template-columns: repeat(3, 1fr); } }

        /* Carousel animation */
        @keyframes sc-slide-fwd  { from { opacity: 0; transform: translateX(28px);  } to { opacity: 1; transform: translateX(0); } }
        @keyframes sc-slide-back { from { opacity: 0; transform: translateX(-28px); } to { opacity: 1; transform: translateX(0); } }
        .sc-anim-fwd  { animation: sc-slide-fwd  0.42s cubic-bezier(0.4,0,0.2,1) both; }
        .sc-anim-back { animation: sc-slide-back 0.42s cubic-bezier(0.4,0,0.2,1) both; }

        /* Base card */
        .sc {
          position: relative; overflow: hidden;
          border: 1.5px solid #e5e7eb; border-radius: 20px;
          padding: 2rem 2rem 11rem;
          color: #00213F; background: #ffffff;
          transition: background 0.38s ease, border-color 0.38s ease, color 0.38s ease;
          cursor: pointer;
        }
        .sc-logo { transition: color 0.38s ease; }
        .sc-num {
          font-family: var(--font-manrope), sans-serif;
          font-weight: 800; font-size: clamp(2.75rem, 4vw, 3.75rem);
          letter-spacing: -0.03em; line-height: 1;
          margin: 1.1rem 0 0.6rem;
          transition: color 0.38s ease;
        }
        .sc-desc {
          font-family: var(--font-inter), sans-serif;
          font-size: 0.9375rem; line-height: 1.55; color: #64748b;
          transition: color 0.38s ease;
        }
        .sc-blob {
          position: absolute; bottom: 0;
          left: -22%; right: -22%; height: 178px;
          border-radius: 50% 50% 0 0 / 100% 100% 0 0;
          display: flex; align-items: flex-start;
          justify-content: center; padding-top: 38px;
          transition: background 0.38s ease;
        }
        .sc-read {
          font-family: var(--font-inter), sans-serif;
          font-weight: 700; font-size: 0.9375rem; color: #fff;
          text-decoration: none; display: inline-flex; align-items: center; gap: 7px;
        }
        .sc-read:hover { text-decoration: underline; }

        /* Per-card accents */
        .sc-1 .sc-num { color: #00213F; } .sc-1 .sc-blob { background: #00213F; }
        .sc-1:hover { background: #001d35; border-color: #001d35; color: #fff; }
        .sc-1:hover .sc-num,.sc-1:hover .sc-logo { color: #fff; }
        .sc-1:hover .sc-desc { color: rgba(255,255,255,0.78); }
        .sc-1:hover .sc-blob { background: rgba(255,255,255,0.13); }

        .sc-2 .sc-num { color: #006BFF; } .sc-2 .sc-blob { background: #006BFF; }
        .sc-2:hover { background: #005ae0; border-color: #005ae0; color: #fff; }
        .sc-2:hover .sc-num,.sc-2:hover .sc-logo { color: #fff; }
        .sc-2:hover .sc-desc { color: rgba(255,255,255,0.78); }
        .sc-2:hover .sc-blob { background: rgba(255,255,255,0.13); }

        .sc-3 .sc-num { color: #d97706; } .sc-3 .sc-blob { background: #f59e0b; }
        .sc-3:hover { background: #d97706; border-color: #d97706; color: #fff; }
        .sc-3:hover .sc-num,.sc-3:hover .sc-logo { color: #fff; }
        .sc-3:hover .sc-desc { color: rgba(255,255,255,0.85); }
        .sc-3:hover .sc-blob { background: rgba(255,255,255,0.13); }

        .sc-4 .sc-num { color: #0061FE; } .sc-4 .sc-blob { background: #0061FE; }
        .sc-4:hover { background: #0052d9; border-color: #0052d9; color: #fff; }
        .sc-4:hover .sc-num,.sc-4:hover .sc-logo { color: #fff; }
        .sc-4:hover .sc-desc { color: rgba(255,255,255,0.78); }
        .sc-4:hover .sc-blob { background: rgba(255,255,255,0.13); }

        .sc-5 .sc-num { color: #7B2FBE; } .sc-5 .sc-blob { background: #7B2FBE; }
        .sc-5:hover { background: #6b27a8; border-color: #6b27a8; color: #fff; }
        .sc-5:hover .sc-num,.sc-5:hover .sc-logo { color: #fff; }
        .sc-5:hover .sc-desc { color: rgba(255,255,255,0.78); }
        .sc-5:hover .sc-blob { background: rgba(255,255,255,0.13); }

        .sc-6 .sc-num { color: #03363D; } .sc-6 .sc-blob { background: #03363D; }
        .sc-6:hover { background: #022a30; border-color: #022a30; color: #fff; }
        .sc-6:hover .sc-num,.sc-6:hover .sc-logo { color: #fff; }
        .sc-6:hover .sc-desc { color: rgba(255,255,255,0.78); }
        .sc-6:hover .sc-blob { background: rgba(255,255,255,0.13); }

        /* Nav buttons */
        .sc-nav {
          width: 44px; height: 44px; border-radius: 50%;
          border: 1.5px solid #d1d5db; background: #fff;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; flex-shrink: 0;
          transition: border-color 0.2s, background 0.2s;
        }
        .sc-nav:hover { border-color: #00213F; background: #00213F; }
        .sc-nav:hover path { stroke: #fff; }
        .sc-view-link { text-decoration: none; }
        .sc-view-link:hover { text-decoration: underline; }
        .sc-dot {
          width: 44px;
          height: 44px;
          border: none;
          padding: 0;
          border-radius: 999px;
          background: transparent;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .sc-dot::after {
          content: "";
          height: 8px;
          border-radius: 99px;
          transition: width 0.3s ease, background 0.3s ease;
        }
        .sc-dot[data-active="true"]::after {
          width: 22px;
          background: #00213F;
        }
        .sc-dot[data-active="false"]::after {
          width: 8px;
          background: #d1d5db;
        }
      `}</style>

      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

        {/* Header row */}
        <div style={{
          display: "flex", alignItems: "flex-start",
          justifyContent: "space-between", gap: "1rem", marginBottom: "2.5rem",
        }}>
          <div>
            <h2 style={{
              fontFamily: "var(--font-manrope), sans-serif",
              fontWeight: 800, fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
              color: "#00213F", letterSpacing: "-0.03em",
              margin: "0 0 0.75rem", lineHeight: 1.15,
            }}>
              Discover how businesses grow with Fluid
            </h2>
            <a href="#" className="sc-view-link" style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontWeight: 600, fontSize: "0.9375rem", color: "#006BFF",
            }}>
              View customer stories &rarr;
            </a>
          </div>
          <div style={{ display: "flex", gap: 8, paddingTop: 4 }}>
            <button
              className="sc-nav"
              onClick={prev}
              aria-label="Previous"
              style={{ width: 44, height: 44 }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M15 18l-6-6 6-6" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button
              className="sc-nav"
              onClick={next}
              aria-label="Next"
              style={{ width: 44, height: 44 }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M9 18l6-6-6-6" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Cards — key triggers re-animation on page change */}
        <div
          key={`${page}-${dir}`}
          className={`sc-grid ${dir === "fwd" ? "sc-anim-fwd" : "sc-anim-back"}`}
        >
          {visible.map(({ id, Logo, stat, desc, cls }) => (
            <div key={id} className={`sc ${cls}`}>
              <div className="sc-logo"><Logo /></div>
              <div className="sc-num">{stat}</div>
              <div className="sc-desc">{desc}</div>
              <div className="sc-blob">
                <a href="#" className="sc-read">Read now <ArrowRight /></a>
              </div>
            </div>
          ))}
        </div>

        {/* Page dots */}
        <div style={{ display: "flex", justifyContent: "center", gap: 7, marginTop: "1.75rem" }}>
          {Array.from({ length: TOTAL_PAGES }).map((_, i) => (
            <button
              key={i}
              className="sc-dot"
              onClick={() => { setDir(i > page ? "fwd" : "back"); setPage(i); }}
              aria-label={`Page ${i + 1}`}
              data-active={i === page ? "true" : "false"}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
