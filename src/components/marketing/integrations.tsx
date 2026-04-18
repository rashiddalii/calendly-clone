// ── Brand icon SVG components ────────────────────────────────────────────────

function ZoomIcon() {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none" aria-label="Zoom">
      <rect width="44" height="44" rx="10" fill="#2D8CFF" />
      <rect x="6" y="13" width="20" height="18" rx="3" fill="white" />
      <path d="M28 17 L38 13 V31 L28 27 Z" fill="white" />
    </svg>
  );
}

function GoogleCalendarIcon() {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none" aria-label="Google Calendar">
      <rect x="2" y="6" width="40" height="36" rx="4" fill="white" />
      <rect x="2" y="6" width="40" height="14" rx="4" fill="#1A73E8" />
      <rect x="2" y="14" width="40" height="6" fill="#1A73E8" />
      <rect x="12" y="2" width="6" height="9" rx="3" fill="#1A73E8" />
      <rect x="26" y="2" width="6" height="9" rx="3" fill="#1A73E8" />
      <rect x="2" y="6" width="40" height="36" rx="4" stroke="#e0e0e0" strokeWidth="1.5" fill="none" />
      <text x="22" y="35" textAnchor="middle" fontFamily="Arial,sans-serif" fontWeight="700" fontSize="13" fill="#1A73E8">31</text>
    </svg>
  );
}

function SalesforceIcon() {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none" aria-label="Salesforce">
      <rect width="44" height="44" rx="10" fill="#F4F6F8" />
      <path
        d="M17.5 11.5a8.5 8.5 0 0 1 14.2 2.8 6.8 6.8 0 0 1 1 13.4H11A7 7 0 0 1 11 14a7 7 0 0 1 1.5.2 8.5 8.5 0 0 1 5-2.7z"
        fill="#00A1E0"
      />
    </svg>
  );
}

function SlackIcon() {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none" aria-label="Slack">
      <rect width="44" height="44" rx="10" fill="#FAF9F7" />
      <g transform="translate(10, 10)">
        <path fill="#E01E5A" d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313z" />
        <path fill="#36C5F0" d="M8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312z" />
        <path fill="#2EB67D" d="M18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312z" />
        <path fill="#ECB22E" d="M15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" />
      </g>
    </svg>
  );
}

function HubSpotIcon() {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none" aria-label="HubSpot">
      <rect width="44" height="44" rx="10" fill="#FFF5F2" />
      <path
        fill="#FF7A59"
        d="M30 13.5V11a2.5 2.5 0 1 0-3 0v2.5a7 7 0 0 0-3 1.6l-6-4.2a2.5 2.5 0 1 0-.6 1.5l5.6 3.9a7 7 0 0 0 0 3.4l-5.6 3.9a2.5 2.5 0 1 0 .6 1.5l6-4.2a7 7 0 0 0 3 1.6V24a2.5 2.5 0 1 0 3 0v-2.5a7 7 0 0 0 0-8zm-1.5 6.5a4 4 0 1 1 0-8 4 4 0 0 1 0 8z"
      />
    </svg>
  );
}

function GmailIcon() {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none" aria-label="Gmail">
      <rect width="44" height="44" rx="10" fill="white" />
      <rect x="4" y="11" width="36" height="26" rx="3" fill="white" stroke="#e0e0e0" strokeWidth="1.5" />
      <path d="M4 14l18 12 18-12" stroke="#EA4335" strokeWidth="2.5" fill="none" strokeLinejoin="round" />
      <path d="M4 14v22l9-11" fill="#EA4335" opacity="0.15" />
      <path d="M40 14v22l-9-11" fill="#EA4335" opacity="0.15" />
    </svg>
  );
}

function OutlookIcon() {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none" aria-label="Outlook">
      <rect width="44" height="44" rx="10" fill="#0078D4" />
      <rect x="5" y="12" width="22" height="20" rx="2" fill="#28A8E8" />
      <rect x="16" y="8" width="22" height="20" rx="2" fill="white" />
      <path d="M16 8l22 0v3L16 20z" fill="#0078D4" opacity="0.8" />
      <circle cx="10" cy="22" r="6" fill="white" />
      <text x="10" y="26" textAnchor="middle" fontFamily="Arial,sans-serif" fontWeight="700" fontSize="8" fill="#0078D4">O</text>
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" aria-label="LinkedIn">
      <rect width="44" height="44" rx="10" fill="#0A66C2" />
      <path
        fill="white"
        d="M13.5 16.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zM11.5 18.5h4v13h-4zM18.5 18.5h4v1.8c.7-1.2 2.2-2.1 4-2.1 4 0 4.7 2.6 4.7 6v7.3h-4V25c0-1.7-.6-3-2-3s-2.2 1.3-2.2 2.9v6.6h-4.5V18.5z"
      />
    </svg>
  );
}

function TeamsIcon() {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none" aria-label="Microsoft Teams">
      <rect width="44" height="44" rx="10" fill="#5558AF" />
      <rect x="14" y="11" width="18" height="24" rx="4" fill="#7B83EB" />
      <path d="M22 19a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" fill="white" />
      <path d="M31 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" fill="white" opacity="0.8" />
      <rect x="28" y="17" width="10" height="15" rx="3" fill="white" opacity="0.8" />
      <rect x="12" y="20" width="22" height="14" rx="3" fill="white" />
      <text x="23" y="31" textAnchor="middle" fontFamily="Arial,sans-serif" fontWeight="700" fontSize="9" fill="#5558AF">Teams</text>
    </svg>
  );
}

// ── Data ─────────────────────────────────────────────────────────────────────

const INTEGRATIONS = [
  { name: "Zoom",             Icon: ZoomIcon },
  { name: "Google Calendar",  Icon: GoogleCalendarIcon },
  { name: "Salesforce",       Icon: SalesforceIcon },
  { name: "Slack",            Icon: SlackIcon },
  { name: "HubSpot",          Icon: HubSpotIcon },
  { name: "Gmail",            Icon: GmailIcon },
  { name: "Outlook",          Icon: OutlookIcon },
  { name: "LinkedIn",         Icon: LinkedInIcon },
  { name: "Teams",            Icon: TeamsIcon },
];

// ── Component ─────────────────────────────────────────────────────────────────

export function Integrations() {
  return (
    <section
      id="integrations"
      style={{
        backgroundColor: "#ffffff",
        padding: "5rem 1.5rem",
      }}
    >
      <style>{`
        .fi-tile:hover {
          box-shadow: 0 8px 28px rgba(0,0,0,0.09) !important;
          transform: translateY(-3px);
        }
        .fi-tile { transition: box-shadow 0.18s ease, transform 0.18s ease; }
        .fi-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
        }
        @media (min-width: 640px) { .fi-grid { grid-template-columns: repeat(4, 1fr); } }
        @media (min-width: 1024px) { .fi-grid { grid-template-columns: repeat(9, 1fr); } }
        .fi-viewall:hover { text-decoration: underline !important; }
      `}</style>

      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h2
            style={{
              fontFamily: "var(--font-manrope), sans-serif",
              fontWeight: 800,
              fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
              color: "#00213F",
              letterSpacing: "-0.03em",
              margin: "0 0 0.75rem",
              lineHeight: "1.15",
            }}
          >
            Connect Fluid to the tools you already use
          </h2>
          <p
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "1rem",
              color: "#666666",
              maxWidth: "400px",
              margin: "0 auto 1.25rem",
              lineHeight: "1.65",
            }}
          >
            Boost productivity with your favorite apps
          </p>
          <a
            href="#"
            className="fi-viewall"
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontWeight: 600,
              fontSize: "0.9375rem",
              color: "#006BFF",
              textDecoration: "none",
            }}
          >
            View all integrations &rarr;
          </a>
        </div>

        {/* Logo grid */}
        <div className="fi-grid">
          {INTEGRATIONS.map(({ name, Icon }) => (
            <div
              key={name}
              className="fi-tile"
              title={name}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.625rem",
                padding: "1.375rem 0.75rem",
                borderRadius: "0.875rem",
                border: "1px solid #e5e7eb",
                backgroundColor: "#ffffff",
                cursor: "pointer",
              }}
            >
              <Icon />
              <span
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: "0.6875rem",
                  fontWeight: 500,
                  color: "#444444",
                  textAlign: "center",
                  lineHeight: "1.3",
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
