"use client";

import Link from "next/link";

export function CtaBanner() {
  return (
    <section
      id="cta"
      style={{
        background: "linear-gradient(140deg, #4a4bd7 0%, #6366f1 55%, #7073ff 100%)",
        padding: "6rem 1.5rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient orbs */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "-100px",
          right: "-80px",
          width: "440px",
          height: "440px",
          borderRadius: "9999px",
          background: "radial-gradient(circle, rgba(255,255,255,0.07) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: "-120px",
          left: "-60px",
          width: "500px",
          height: "500px",
          borderRadius: "9999px",
          background: "radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: "680px",
          margin: "0 auto",
          textAlign: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        <h2
          style={{
            fontFamily: "var(--font-manrope), sans-serif",
            fontWeight: 800,
            fontSize: "clamp(2rem, 4.5vw, 3rem)",
            color: "#fbf7ff",
            letterSpacing: "-0.035em",
            lineHeight: "1.08",
            margin: "0 0 1.25rem",
          }}
        >
          Give your calendar the
          <br />
          respect it deserves.
        </h2>

        <p
          style={{
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: "clamp(1rem, 1.8vw, 1.125rem)",
            color: "rgba(251, 247, 255, 0.78)",
            lineHeight: "1.65",
            margin: "0 auto 2.5rem",
            maxWidth: "460px",
          }}
        >
          Join professionals who stopped apologizing for their schedule
          and started owning it — with Fluid.
        </p>

        <Link
          href="/login"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.375rem",
            fontFamily: "var(--font-inter), sans-serif",
            fontWeight: 700,
            fontSize: "1.0625rem",
            color: "#4a4bd7",
            textDecoration: "none",
            padding: "0.9375rem 2.25rem",
            borderRadius: "0.75rem",
            backgroundColor: "#ffffff",
            transition: "transform 0.16s ease, box-shadow 0.16s ease",
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLAnchorElement;
            el.style.transform = "translateY(-2px)";
            el.style.boxShadow = "0 8px 28px rgba(0,0,0,0.18)";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLAnchorElement;
            el.style.transform = "translateY(0)";
            el.style.boxShadow = "none";
          }}
        >
          Start scheduling for free →
        </Link>

        <p
          style={{
            marginTop: "1.25rem",
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: "0.8125rem",
            color: "rgba(251, 247, 255, 0.55)",
          }}
        >
          No credit card.&nbsp;&nbsp;2 minutes to set up.
        </p>
      </div>
    </section>
  );
}
