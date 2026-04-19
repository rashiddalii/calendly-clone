"use client";

import { useEffect, useRef, useState } from "react";

// Brand logo SVG components — simplified but clearly identifiable by color + shape

function DropboxLogo() {
  return (
    <svg width="20" height="17" viewBox="0 0 40 34" fill="#0061FE" aria-label="Dropbox">
      <path d="M10 0L0 6.5l10 6.5 10-6.5L10 0zM30 0L20 6.5l10 6.5 10-6.5L30 0zM0 19.5L10 26l10-6.5L10 13 0 19.5zM20 13l10 6.5L40 13l-10-6.5L20 13zM10 27.5L20 34l10-6.5L20 21 10 27.5z" />
    </svg>
  );
}

function SalesforceLogo() {
  return (
    <svg width="24" height="17" viewBox="0 0 62 44" fill="#00A1E0" aria-label="Salesforce">
      <path d="M25.8 5.8a13.2 13.2 0 0 1 9.4-3.9c5 0 9.4 2.8 11.8 6.9a14.3 14.3 0 0 1 6 1.3 13.8 13.8 0 0 1 0 27.6H10A10 10 0 0 1 10 17.5a10 10 0 0 1 2.3.3A13.2 13.2 0 0 1 25.8 5.8z" />
    </svg>
  );
}

function LinkedInLogo() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-label="LinkedIn">
      <rect width="24" height="24" rx="4" fill="#0A66C2" />
      <path fill="white" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452z" />
    </svg>
  );
}

function SlackLogo() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-label="Slack">
      <path fill="#E01E5A" d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313z" />
      <path fill="#36C5F0" d="M8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312z" />
      <path fill="#2EB67D" d="M18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312z" />
      <path fill="#ECB22E" d="M15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" />
    </svg>
  );
}

function GoogleLogo() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-label="Google">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

function ZenDeskLogo() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-label="Zendesk">
      <circle cx="12" cy="12" r="12" fill="#03363D" />
      <path fill="white" d="M11.2 7h1.6L7 17H5.4L11.2 7zM17 7v10h-1.6V8.6L11.2 17H9.6L15.4 7H17z" />
    </svg>
  );
}

function HubSpotLogo() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-label="HubSpot">
      <path fill="#FF7A59" d="M18.164 7.93V5.084a2.198 2.198 0 1 0-2.394 0V7.93a6.542 6.542 0 0 0-2.69 1.386L7.567 5.46a2.313 2.313 0 1 0-.518 1.317l5.379 3.77a6.446 6.446 0 0 0 0 2.907L7.08 17.24a2.284 2.284 0 1 0 .543 1.302l5.394-3.782a6.533 6.533 0 0 0 2.69 1.386v2.89a2.198 2.198 0 1 0 2.394 0v-2.89a6.536 6.536 0 0 0 0-8.217zM17 15.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7z" />
    </svg>
  );
}

function DoorDashLogo() {
  return (
    <svg width="22" height="16" viewBox="0 0 60 44" aria-label="DoorDash">
      <rect width="60" height="44" rx="6" fill="#FF3008" />
      <path fill="white" d="M10 12h22c6.6 0 12 5.4 12 12s-5.4 12-12 12H10V12zm8 8v8h14c2.2 0 4-1.8 4-4s-1.8-4-4-4H18z" />
    </svg>
  );
}

function GongLogo() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-label="Gong">
      <circle cx="12" cy="12" r="12" fill="#7B2FBE" />
      <path fill="white" d="M12 4l1.5 3.5 3.8.6-2.7 2.6.6 3.8L12 12.8l-3.2 1.7.6-3.8L6.7 8.1l3.8-.6z" />
    </svg>
  );
}

function CompassLogo() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-label="Compass">
      <circle cx="12" cy="12" r="11" fill="none" stroke="#2D3748" strokeWidth="1.5" />
      <path fill="#E53E3E" d="M12 2l2.5 7.5-7.5-2.5 7.5 2.5z" />
      <path fill="#2D3748" d="M12 22l-2.5-7.5 7.5 2.5-7.5-2.5z" />
    </svg>
  );
}

function LorealLogo() {
  return (
    <svg width="24" height="20" viewBox="0 0 70 44" aria-label="L'Oréal">
      <rect width="70" height="44" rx="4" fill="#000000" />
      <text x="35" y="30" textAnchor="middle" fontFamily="Georgia,serif" fontWeight="700" fontSize="18" fill="#C9A84C" letterSpacing="1">
        {`L'ORÉAL`}
      </text>
    </svg>
  );
}

function HackerOneLogo() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-label="HackerOne">
      <circle cx="12" cy="12" r="12" fill="#494949" />
      <path fill="white" d="M7 7h2v4.5h6V7h2v10h-2v-3.5H9V17H7V7z" />
      <rect x="13" y="5" width="2" height="2" rx="1" fill="#00C244" />
    </svg>
  );
}

const COMPANIES = [
  { name: "Dropbox",      Logo: DropboxLogo },
  { name: "Salesforce",   Logo: SalesforceLogo },
  { name: "LinkedIn",     Logo: LinkedInLogo },
  { name: "Slack",        Logo: SlackLogo },
  { name: "Google",       Logo: GoogleLogo },
  { name: "HubSpot",      Logo: HubSpotLogo },
  { name: "Zendesk",      Logo: ZenDeskLogo },
  { name: "DoorDash",     Logo: DoorDashLogo },
  { name: "Gong",         Logo: GongLogo },
  { name: "Compass",      Logo: CompassLogo },
  { name: "L'Oréal",      Logo: LorealLogo },
  { name: "HackerOne",    Logo: HackerOneLogo },
];

export function SocialProof() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
          obs.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      style={{
        backgroundColor: "#ffffff",
        overflow: "hidden",
        opacity: visible ? 1 : 0,
        transform: visible ? "scale(1) translateY(0)" : "scale(0.97) translateY(18px)",
        transition: "opacity 0.65s cubic-bezier(0.4,0,0.2,1), transform 0.65s cubic-bezier(0.4,0,0.2,1)",
      }}
    >
      <style>{`
        @keyframes fluid-marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .fluid-marquee-track {
          animation: fluid-marquee 36s linear infinite;
          display: flex;
          align-items: center;
          gap: 0;
          width: max-content;
        }
        .fluid-marquee-track:hover {
          animation-play-state: paused;
        }
        .fluid-marquee-viewport {
          contain: layout paint;
          max-width: 100vw;
          overflow: hidden;
        }
      `}</style>

      {/* Label */}
      <div style={{ textAlign: "center", marginBottom: "2rem", padding: "0 1.5rem" }}>
        <p
          style={{
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: "0.9375rem",
            color: "#666666",
            margin: 0,
          }}
        >
          Trusted by more than{" "}
          <strong style={{ color: "#00213F", fontWeight: 700 }}>100,000</strong>{" "}
          of the world&apos;s leading organizations
        </p>
      </div>

      {/* Scrolling marquee — two copies for seamless loop */}
      <div className="fluid-marquee-viewport">
        <div className="fluid-marquee-track" aria-hidden="true">
          {[...COMPANIES, ...COMPANIES].map(({ name, Logo }, i) => (
            <div
              key={i}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0 2.5rem",
                flexShrink: 0,
              }}
            >
              <span style={{ display: "inline-flex", transform: "scale(1.35)", transformOrigin: "center" }}>
                <Logo />
              </span>
              <span
                style={{
                  fontFamily: "var(--font-manrope), sans-serif",
                  fontWeight: 700,
                  fontSize: "1.075rem",
                  color: "#00213F",
                  whiteSpace: "nowrap",
                  letterSpacing: "-0.01em",
                }}
              >
                {name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
