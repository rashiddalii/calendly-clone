"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export function ValueProp() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // double-rAF ensures the hidden state is painted before the transition fires
          requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
          obs.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      style={{
        backgroundColor: "#ffffff",
        padding: "6rem 1.5rem 0",
        textAlign: "center",
      }}
    >
      <style>{`
        .vp-cta { transition: background-color 0.16s ease; }
        .vp-cta:hover { background: #0055CC !important; }
      `}</style>

      <div
        ref={ref}
        style={{
          maxWidth: "820px",
          margin: "0 auto",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(40px)",
          transition: "opacity 0.75s cubic-bezier(0.4,0,0.2,1), transform 0.75s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <h2
          style={{
            fontFamily: "var(--font-manrope), sans-serif",
            fontWeight: 800,
            fontSize: "clamp(2.5rem, 5.5vw, 4.25rem)",
            lineHeight: 1.08,
            color: "#00213F",
            letterSpacing: "-0.03em",
            margin: "0 0 1.5rem",
          }}
        >
          Fluid makes scheduling simple
        </h2>

        <p
          style={{
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: "clamp(1rem, 1.6vw, 1.175rem)",
            fontWeight: 400,
            color: "#4a5568",
            lineHeight: 1.7,
            maxWidth: "640px",
            margin: "0 auto 2.5rem",
          }}
        >
          Fluid is easy enough for individual users, and powerful enough to meet
          the needs of enterprise organizations, trusted by teams at companies
          of every size.
        </p>

        <Link
          href="/signup"
          className="vp-cta"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "14px 36px",
            borderRadius: "6px",
            background: "#006BFF",
            color: "#ffffff",
            fontFamily: "var(--font-inter), sans-serif",
            fontWeight: 600,
            fontSize: "1rem",
            textDecoration: "none",
            letterSpacing: "0.005em",
          }}
        >
          Sign up for free
        </Link>
      </div>
    </section>
  );
}
