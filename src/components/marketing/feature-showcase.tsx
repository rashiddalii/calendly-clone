"use client";

import { useState, useEffect, useRef } from "react";

/* ─── Feature data ───────────────────────────────────────────── */
interface FeatureDef {
  title: string;
  desc: string;
  color: string;
  bgColor: string;
  shapeA: string;
  shapeB: string;
  tab1: string;
  tab2: string;
}

const FEATURES: FeatureDef[] = [
  {
    title: "Connect your calendars",
    desc: "Fluid connects to your calendar so invitees only see your real availability. No double-bookings, ever.",
    color: "#006BFF",
    bgColor: "#7c3aed",
    shapeA: "rgba(167,139,250,0.55)",
    shapeB: "rgba(236,72,153,0.35)",
    tab1: "Calendars",
    tab2: "Connect existing calendar",
  },
  {
    title: "Add your availability",
    desc: "Set weekly schedules, block off dates, add buffer time. Configure minimum notice requirements.",
    color: "#a855f7",
    bgColor: "#15803d",
    shapeA: "rgba(74,222,128,0.45)",
    shapeB: "rgba(134,239,172,0.30)",
    tab1: "Availability",
    tab2: "Meeting hours",
  },
  {
    title: "Connect conferencing tools",
    desc: "Sync your video conferencing tools and set preferences for in-person meetings or calls.",
    color: "#ec4899",
    bgColor: "#6d28d9",
    shapeA: "rgba(196,181,253,0.50)",
    shapeB: "rgba(236,72,153,0.35)",
    tab1: "Meeting location",
    tab2: "Video conferencing",
  },
  {
    title: "Customize your event types",
    desc: "Choose from pre-built templates or quickly create custom event types for any meeting you need to schedule.",
    color: "#f97316",
    bgColor: "#c2410c",
    shapeA: "rgba(251,146,60,0.50)",
    shapeB: "rgba(253,186,116,0.35)",
    tab1: "Event types",
    tab2: "Ways to meet",
  },
  {
    title: "Share your scheduling link",
    desc: "Easily book meetings by embedding scheduling links on your website, landing pages, or emails.",
    color: "#10b981",
    bgColor: "#0f766e",
    shapeA: "rgba(52,211,153,0.45)",
    shapeB: "rgba(94,234,212,0.35)",
    tab1: "Share",
    tab2: "Offer time slots via email",
  },
];

const INTERVAL_MS = 5000;

/* ─── Distinct rich icon per feature ────────────────────────── */
function Icon0({ color, size }: { color: string; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <rect x="4" y="8" width="26" height="28" rx="4" fill={`${color}18`} stroke={color} strokeWidth="2"/>
      <rect x="12" y="4" width="2" height="8" rx="1" fill={color}/>
      <rect x="20" y="4" width="2" height="8" rx="1" fill={color}/>
      <line x1="4" y1="16" x2="30" y2="16" stroke={color} strokeWidth="2"/>
      <rect x="9" y="21" width="6" height="5" rx="1" fill={color} opacity="0.7"/>
      <rect x="17" y="21" width="6" height="5" rx="1" fill={color} opacity="0.4"/>
      <circle cx="36" cy="34" r="10" fill={color}/>
      <path d="M31 34a5 5 0 0 1 8.5-3.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
      <path d="M41 34a5 5 0 0 1-8.5 3.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
      <path d="M39.5 30.5l1 3h-3" stroke="white" strokeWidth="1.5" strokeLinejoin="round" fill="none"/>
      <path d="M32.5 37.5l-1-3h3" stroke="white" strokeWidth="1.5" strokeLinejoin="round" fill="none"/>
    </svg>
  );
}
function Icon1({ color, size }: { color: string; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <rect x="4" y="10" width="30" height="32" rx="4" fill={`${color}18`} stroke={color} strokeWidth="2"/>
      <line x1="4" y1="18" x2="34" y2="18" stroke={color} strokeWidth="2"/>
      <rect x="9" y="6" width="2" height="8" rx="1" fill={color}/>
      <rect x="23" y="6" width="2" height="8" rx="1" fill={color}/>
      <rect x="9" y="23" width="18" height="3" rx="1.5" fill={color} opacity="0.5"/>
      <rect x="9" y="29" width="14" height="3" rx="1.5" fill={color} opacity="0.7"/>
      <rect x="9" y="35" width="16" height="3" rx="1.5" fill={color} opacity="0.3"/>
      <circle cx="36" cy="14" r="10" fill={color}/>
      <circle cx="36" cy="14" r="7" fill="white" opacity="0.95"/>
      <line x1="36" y1="14" x2="36" y2="10" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="36" y1="14" x2="39" y2="14" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
      <circle cx="36" cy="14" r="1.2" fill={color}/>
    </svg>
  );
}
function Icon2({ color, size }: { color: string; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <rect x="3" y="13" width="28" height="22" rx="5" fill={`${color}18`} stroke={color} strokeWidth="2"/>
      <polygon points="31,18 45,11 45,37 31,30" fill={color} opacity="0.8"/>
      <circle cx="13" cy="24" r="5" fill={color} opacity="0.35"/>
      <circle cx="13" cy="24" r="2.5" fill={color} opacity="0.7"/>
    </svg>
  );
}
function Icon3({ color, size }: { color: string; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <rect x="6" y="16" width="36" height="24" rx="5" fill={`${color}18`} stroke={color} strokeWidth="2"/>
      <rect x="10" y="9" width="28" height="6" rx="3" fill={color} opacity="0.35"/>
      <rect x="14" y="4" width="20" height="5" rx="2.5" fill={color} opacity="0.18"/>
      <line x1="6" y1="25" x2="42" y2="25" stroke={color} strokeWidth="1.5" opacity="0.4"/>
      <rect x="12" y="29" width="10" height="3" rx="1.5" fill={color} opacity="0.6"/>
      <rect x="12" y="34" width="16" height="3" rx="1.5" fill={color} opacity="0.4"/>
    </svg>
  );
}
function Icon4({ color, size }: { color: string; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <circle cx="10" cy="24" r="7" fill={`${color}22`} stroke={color} strokeWidth="2"/>
      <circle cx="38" cy="10" r="7" fill={color} opacity="0.75"/>
      <circle cx="38" cy="38" r="7" fill={color} opacity="0.45"/>
      <line x1="17" y1="21" x2="31" y2="13" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <line x1="17" y1="27" x2="31" y2="35" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <circle cx="10" cy="24" r="3" fill={color}/>
    </svg>
  );
}

const ICONS = [Icon0, Icon1, Icon2, Icon3, Icon4];

/* ─── Animated background shapes ────────────────────────────── */
function PanelShapes({ shapeA, shapeB }: { shapeA: string; shapeB: string }) {
  return (
    <svg
      width="100%" height="100%"
      viewBox="0 0 650 520"
      preserveAspectRatio="xMidYMid slice"
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      aria-hidden="true"
    >
      <path
        d="M416 255C329 180 197 176 104 255C17 330 -4 460 55 558C118 662 243 700 349 658C435 733 568 737 660 658C748 583 769 453 709 355C647 251 521 213 416 255Z"
        fill={shapeA}
      >
        <animateMotion dur="20s" repeatCount="indefinite" path="M0,0 0,-210 0,0 Z" />
      </path>
      <path
        d="M83 -156L537 10C568 37 570 84 542 114L127 368C82 417 1 388 -2 322L-41 -98C-44 -164 35 -201 83 -156Z"
        fill={shapeB}
      >
        <animateMotion dur="20s" repeatCount="indefinite" path="M0,0 0,95 0,0 Z" />
      </path>
    </svg>
  );
}

/* ─── Shared tab bar ─────────────────────────────────────────── */
function TabBar({ tab1, tab2 }: { tab1: string; tab2: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
      <span style={{
        padding: "5px 14px", borderRadius: 99,
        fontSize: 12, fontWeight: 700,
        fontFamily: "var(--font-inter), sans-serif",
        background: "#ede9fe", color: "#7c3aed",
        border: "1px solid #ddd6fe",
        whiteSpace: "nowrap",
      }}>{tab1}</span>
      <span style={{
        fontSize: 12, color: "#9ca3af",
        fontFamily: "var(--font-inter), sans-serif", fontWeight: 500,
        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
      }}>{tab2}</span>
    </div>
  );
}

/* ─── Card 1: Connect calendars ─────────────────────────────── */
function Card1({ tab1, tab2 }: { tab1: string; tab2: string }) {
  const calendars = [
    {
      bg: "#4285F4", letter: "G",
      name: "Google Calendar", sub: "john@gmail.com",
      events: "3 calendars syncing", connected: true,
    },
    {
      bg: "#0078D4", letter: "M",
      name: "Outlook / Exchange", sub: "Not connected",
      events: null, connected: false,
    },
    {
      bg: "#1d1d1f", letter: "A",
      name: "Apple Calendar", sub: "Not connected",
      events: null, connected: false,
    },
  ];
  return (
    <div>
      <TabBar tab1={tab1} tab2={tab2} />
      <p style={{
        fontSize: 12.5, color: "#64748b", margin: "0 0 14px",
        fontFamily: "var(--font-inter), sans-serif", lineHeight: 1.55,
      }}>
        Fluid checks these calendars so you&apos;re never double-booked.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
        {calendars.map(({ bg, letter, name, sub, events, connected }) => (
          <div key={name} style={{
            display: "flex", alignItems: "center", gap: 13,
            padding: "13px 15px",
            border: `1.5px solid ${connected ? "#bbf7d0" : "#e5e7eb"}`,
            borderRadius: 12,
            background: connected ? "#f0fdf4" : "#fafafa",
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10, background: bg,
              flexShrink: 0, display: "flex", alignItems: "center",
              justifyContent: "center", fontWeight: 800, fontSize: 17,
              color: "#fff", fontFamily: "var(--font-manrope), sans-serif",
              boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
            }}>{letter}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontWeight: 700, fontSize: 14, color: "#00213F",
                fontFamily: "var(--font-manrope), sans-serif",
              }}>{name}</div>
              <div style={{
                fontSize: 12, color: connected ? "#16a34a" : "#9ca3af",
                fontFamily: "var(--font-inter), sans-serif", marginTop: 2,
              }}>
                {connected ? `● ${sub}` : sub}
              </div>
              {events && (
                <div style={{
                  fontSize: 11, color: "#64748b",
                  fontFamily: "var(--font-inter), sans-serif", marginTop: 1,
                }}>{events}</div>
              )}
            </div>
            {connected ? (
              <div style={{
                display: "flex", alignItems: "center", gap: 5,
                background: "#dcfce7", padding: "4px 12px", borderRadius: 99,
                border: "1px solid #bbf7d0",
              }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
                <span style={{ fontSize: 11.5, fontWeight: 700, color: "#15803d", fontFamily: "var(--font-inter), sans-serif" }}>Connected</span>
              </div>
            ) : (
              <div style={{
                fontSize: 11.5, fontWeight: 600, color: "#006BFF",
                background: "#eff6ff", padding: "4px 12px", borderRadius: 99,
                fontFamily: "var(--font-inter), sans-serif",
                border: "1px solid #bfdbfe", whiteSpace: "nowrap",
              }}>+ Connect</div>
            )}
          </div>
        ))}
      </div>
      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        marginTop: 13, padding: "11px 15px",
        background: "#eff6ff", borderRadius: 10, border: "1px solid #bfdbfe",
      }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="10" fill="#bfdbfe"/>
          <polyline points="20 6 9 17 4 12" stroke="#1d4ed8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span style={{ fontSize: 12, color: "#1d4ed8", fontFamily: "var(--font-inter), sans-serif", fontWeight: 500 }}>
          Real-time sync · No double-bookings guaranteed
        </span>
      </div>
    </div>
  );
}

/* ─── Card 2: Add availability ──────────────────────────────── */
function Card2({ tab1, tab2 }: { tab1: string; tab2: string }) {
  const days = [
    { abbr: "S", label: "Sun", avail: false },
    { abbr: "M", label: "Mon", avail: true, start: "9:00 am", end: "4:30 pm" },
    { abbr: "T", label: "Tue", avail: false },
    { abbr: "W", label: "Wed", avail: true, start: "9:30 am", end: "5:00 pm" },
    { abbr: "Th", label: "Thu", avail: true, start: "10:00 am", end: "6:00 pm" },
    { abbr: "F", label: "Fri", avail: true, start: "10:00 am", end: "3:00 pm" },
  ];
  return (
    <div>
      <TabBar tab1={tab1} tab2={tab2} />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 5 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00213F" strokeWidth="2.2" aria-hidden="true">
            <path d="M1 4v6h6"/><path d="M23 20v-6h-6"/>
            <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/>
          </svg>
          <span style={{ fontWeight: 800, fontSize: 14, color: "#00213F", fontFamily: "var(--font-manrope), sans-serif" }}>
            Weekly hours
          </span>
        </div>
        <div style={{
          fontSize: 11, fontWeight: 700, color: "#7c3aed",
          background: "#f5f3ff", padding: "3px 10px", borderRadius: 99,
          fontFamily: "var(--font-inter), sans-serif", border: "1px solid #ddd6fe",
        }}>4 active days</div>
      </div>
      <p style={{ fontSize: 11.5, color: "#94a3b8", fontFamily: "var(--font-inter), sans-serif", margin: "0 0 13px" }}>
        Set when you are typically available for meetings
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        {days.map(({ abbr, avail, start, end }) => (
          <div key={abbr} style={{
            display: "flex", alignItems: "center", gap: 9,
            padding: "7px 10px", borderRadius: 9,
            background: avail ? "rgba(124,58,237,0.04)" : "transparent",
            border: avail ? "1px solid rgba(124,58,237,0.12)" : "1px solid transparent",
          }}>
            <div style={{
              width: 28, height: 28, borderRadius: "50%",
              background: avail ? "#1e293b" : "#e5e7eb",
              flexShrink: 0, display: "flex", alignItems: "center",
              justifyContent: "center", fontWeight: 700, fontSize: 10,
              color: avail ? "#fff" : "#9ca3af",
              fontFamily: "var(--font-inter), sans-serif",
            }}>{abbr}</div>
            {avail ? (
              <div style={{ display: "flex", alignItems: "center", gap: 6, flex: 1 }}>
                <div style={{
                  padding: "4px 10px", borderRadius: 7,
                  border: "1.5px solid #e2e8f0", background: "#fff",
                  fontSize: 12, fontFamily: "var(--font-inter), sans-serif",
                  color: "#00213F", fontWeight: 500,
                  boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                }}>{start}</div>
                <span style={{ color: "#94a3b8", fontSize: 12, fontWeight: 500 }}>—</span>
                <div style={{
                  padding: "4px 10px", borderRadius: 7,
                  border: "1.5px solid #e2e8f0", background: "#fff",
                  fontSize: 12, fontFamily: "var(--font-inter), sans-serif",
                  color: "#00213F", fontWeight: 500,
                  boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                }}>{end}</div>
                <div style={{ marginLeft: "auto", display: "flex", gap: 12, alignItems: "center" }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" aria-hidden="true"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
                </div>
              </div>
            ) : (
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 12, color: "#9ca3af", fontFamily: "var(--font-inter), sans-serif" }}>Unavailable</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="2" aria-hidden="true">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Card 3: Conferencing ──────────────────────────────────── */
function Card3({ tab1, tab2 }: { tab1: string; tab2: string }) {
  const tools = [
    {
      bg: "#2D8CFF", letter: "Z", name: "Zoom",
      desc: "HD video conferencing", connected: true, isDefault: true,
    },
    {
      bg: "#5558AF", letter: "T", name: "Microsoft Teams",
      desc: "Team collaboration + video", connected: false, isDefault: false,
    },
    {
      bg: "#34A853", letter: "M", name: "Google Meet",
      desc: "Free video meetings", connected: false, isDefault: false,
    },
  ];
  return (
    <div>
      <TabBar tab1={tab1} tab2={tab2} />
      <p style={{
        fontSize: 12.5, color: "#64748b", margin: "0 0 14px",
        fontFamily: "var(--font-inter), sans-serif", lineHeight: 1.55,
      }}>
        Add your preferred video conferencing tools and set a default location.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
        {tools.map(({ bg, letter, name, desc, connected, isDefault }) => (
          <div key={name} style={{
            display: "flex", alignItems: "center", gap: 13,
            padding: "13px 15px",
            border: `1.5px solid ${connected ? "#bfdbfe" : "#e5e7eb"}`,
            borderRadius: 12,
            background: connected ? "#eff6ff" : "#fafafa",
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10, background: bg,
              flexShrink: 0, display: "flex", alignItems: "center",
              justifyContent: "center", fontWeight: 800, fontSize: 17,
              color: "#fff", fontFamily: "var(--font-manrope), sans-serif",
              boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
            }}>{letter}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap" }}>
                <span style={{ fontWeight: 700, fontSize: 14, color: "#00213F", fontFamily: "var(--font-manrope), sans-serif" }}>{name}</span>
                {isDefault && (
                  <span style={{
                    fontSize: 10.5, fontWeight: 700, color: "#1d4ed8",
                    background: "#dbeafe", padding: "2px 8px", borderRadius: 99,
                    fontFamily: "var(--font-inter), sans-serif",
                    border: "1px solid #bfdbfe",
                  }}>Default</span>
                )}
              </div>
              <div style={{ fontSize: 12, color: "#94a3b8", fontFamily: "var(--font-inter), sans-serif", marginTop: 2 }}>{desc}</div>
            </div>
            {connected ? (
              <div style={{
                display: "flex", alignItems: "center", gap: 5,
                background: "#dcfce7", padding: "4px 12px", borderRadius: 99,
                border: "1px solid #bbf7d0",
              }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#16a34a" }}/>
                <span style={{ fontSize: 11.5, fontWeight: 700, color: "#15803d", fontFamily: "var(--font-inter), sans-serif" }}>Active</span>
              </div>
            ) : (
              <div style={{
                fontSize: 11.5, fontWeight: 600, color: "#ec4899",
                background: "#fdf2f8", padding: "4px 12px", borderRadius: 99,
                fontFamily: "var(--font-inter), sans-serif",
                border: "1px solid #fbcfe8", whiteSpace: "nowrap",
              }}>+ Connect</div>
            )}
          </div>
        ))}
      </div>
      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        marginTop: 13, padding: "11px 15px",
        background: "#f8fafc", borderRadius: 10, border: "1px solid #e2e8f0",
      }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" aria-hidden="true">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
        <span style={{ fontSize: 12, color: "#475569", fontFamily: "var(--font-inter), sans-serif" }}>
          Also supports <strong style={{ color: "#00213F" }}>In-person</strong> &amp; <strong style={{ color: "#00213F" }}>phone call</strong> locations
        </span>
      </div>
    </div>
  );
}

/* ─── Card 4: Event types ───────────────────────────────────── */
function Card4({ tab1, tab2 }: { tab1: string; tab2: string }) {
  const events = [
    {
      color: "#006BFF", bg: "#eff6ff", dot: "#006BFF",
      name: "30 Minute Meeting", duration: "30 min · One-on-one",
      link: "fluid.app/john/30min", active: true,
    },
    {
      color: "#7c3aed", bg: "#f5f3ff", dot: "#7c3aed",
      name: "Strategy Session", duration: "60 min · Group",
      link: "fluid.app/john/strategy", active: true,
    },
    {
      color: "#f97316", bg: "#fff7ed", dot: "#f97316",
      name: "Quick Intro Call", duration: "15 min · One-on-one",
      link: "fluid.app/john/intro", active: false,
    },
  ];
  return (
    <div>
      <TabBar tab1={tab1} tab2={tab2} />
      <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
        {events.map(({ color, bg, name, duration, link, active }) => (
          <div key={name} style={{
            padding: "13px 15px",
            borderRadius: 12,
            border: `1.5px solid ${color}30`,
            background: bg,
          }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: "#00213F", fontFamily: "var(--font-manrope), sans-serif", marginBottom: 2 }}>{name}</div>
                <div style={{ fontSize: 12, color: "#64748b", fontFamily: "var(--font-inter), sans-serif", marginBottom: 8 }}>{duration}</div>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 5,
                  fontSize: 11.5, color: color, fontFamily: "var(--font-inter), sans-serif",
                  background: "#fff", padding: "3px 10px", borderRadius: 7,
                  border: `1px solid ${color}30`,
                }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" aria-hidden="true">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                  </svg>
                  {link}
                </div>
              </div>
              <div style={{
                display: "flex", alignItems: "center", gap: 5,
                background: active ? "#dcfce7" : "#f1f5f9",
                borderRadius: 99, padding: "4px 11px", flexShrink: 0,
                border: `1px solid ${active ? "#bbf7d0" : "#e2e8f0"}`,
              }}>
                <div style={{
                  width: 6, height: 6, borderRadius: "50%",
                  background: active ? "#16a34a" : "#94a3b8",
                }}/>
                <span style={{
                  fontSize: 11, fontWeight: 700,
                  color: active ? "#15803d" : "#64748b",
                  fontFamily: "var(--font-inter), sans-serif",
                }}>{active ? "Open" : "Off"}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div style={{
        marginTop: 10, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
        padding: "10px 15px",
        borderRadius: 10, border: "2px dashed #e2e8f0",
        fontSize: 12.5, fontWeight: 600, color: "#94a3b8",
        fontFamily: "var(--font-inter), sans-serif",
      }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        New event type
      </div>
    </div>
  );
}

/* ─── Card 5: Share scheduling link ─────────────────────────── */
function Card5({ tab1, tab2 }: { tab1: string; tab2: string }) {
  const shareOptions = [
    {
      color: "#006BFF", bg: "#eff6ff", border: "#bfdbfe",
      label: "Share via email",
      sub: "Send booking links to clients",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#006BFF" strokeWidth="2" aria-hidden="true">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
          <polyline points="22,6 12,13 2,6"/>
        </svg>
      ),
    },
    {
      color: "#7c3aed", bg: "#f5f3ff", border: "#ddd6fe",
      label: "Embed on website",
      sub: "Add booking to any page",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" aria-hidden="true">
          <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
        </svg>
      ),
    },
    {
      color: "#0A66C2", bg: "#e7f0fb", border: "#bfdbfe",
      label: "Add to LinkedIn",
      sub: "Let your network book you",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect width="20" height="20" x="2" y="2" rx="3" fill="#0A66C2" opacity="0.85"/>
          <path fill="white" d="M7.5 10h2v6.5h-2zm1-1.5a1.2 1.2 0 1 1 0-2.4 1.2 1.2 0 0 1 0 2.4zm3 1.5h1.9v.9c.3-.5 1-1 2-1 2.1 0 2.6 1.4 2.6 3.2v3.4h-2v-3c0-.7 0-1.7-1-1.7s-1.2.8-1.2 1.6v3.1h-2V10z"/>
        </svg>
      ),
    },
  ];
  return (
    <div>
      <TabBar tab1={tab1} tab2={tab2} />
      {/* Link bar */}
      <div style={{
        display: "flex", alignItems: "center", gap: 9,
        padding: "11px 14px",
        border: "1.5px solid #e2e8f0",
        borderRadius: 11, background: "#fff", marginBottom: 16,
        boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
      }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" aria-hidden="true">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
        </svg>
        <span style={{
          flex: 1, fontSize: 13, color: "#374151",
          fontFamily: "var(--font-inter), sans-serif",
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>
          fluid.app/<strong style={{ color: "#10b981" }}>yourname</strong>
        </span>
        <div style={{
          fontSize: 12, fontWeight: 700, color: "#fff",
          background: "#10b981", padding: "5px 13px", borderRadius: 7,
          fontFamily: "var(--font-inter), sans-serif", cursor: "pointer",
          flexShrink: 0,
        }}>Copy</div>
      </div>
      <p style={{ fontSize: 12.5, color: "#64748b", margin: "0 0 12px", fontFamily: "var(--font-inter), sans-serif" }}>
        Share your page anywhere people need to book you
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {shareOptions.map(({ color, bg, border, label, sub, icon }) => (
          <div key={label} style={{
            display: "flex", alignItems: "center", gap: 13,
            padding: "12px 14px", borderRadius: 11,
            border: `1.5px solid ${border}`, background: bg,
          }}>
            <div style={{
              width: 38, height: 38, borderRadius: 9,
              background: "#fff",
              border: `1.5px solid ${border}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>{icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 13.5, color: "#00213F", fontFamily: "var(--font-manrope), sans-serif" }}>{label}</div>
              <div style={{ fontSize: 12, color: "#94a3b8", fontFamily: "var(--font-inter), sans-serif", marginTop: 1 }}>{sub}</div>
            </div>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" aria-hidden="true">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
}

const CARDS = [Card1, Card2, Card3, Card4, Card5];

/* ─── Main section ──────────────────────────────────────────── */
export function FeatureShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [progressKey, setProgressKey] = useState(0);
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
          obs.disconnect();
        }
      },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  function startTimer() {
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
    startTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function goTo(index: number) {
    setActiveIndex(index);
    setProgressKey((k) => k + 1);
    startTimer();
  }

  const feature = FEATURES[activeIndex];
  const CardComponent = CARDS[activeIndex];

  return (
    <section
      ref={sectionRef}
      id="features"
      style={{
        backgroundColor: "#ffffff",
        padding: "6rem 1.5rem",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(48px)",
        transition: "opacity 0.85s cubic-bezier(0.4,0,0.2,1), transform 0.85s cubic-bezier(0.4,0,0.2,1)",
      }}
    >
      <style>{`
        @keyframes fluid-progress {
          from { width: 0%; }
          to   { width: 100%; }
        }
        @keyframes fluid-card-in {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .feat-item { cursor: pointer; }
        .feat-item:hover .feat-title-dim { color: #374151 !important; }
        .feat-showcase-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 3rem;
          align-items: center;
        }
        @media (min-width: 1024px) {
          .feat-showcase-grid { grid-template-columns: 5fr 7fr; }
        }
        .feat-right { display: none; }
        @media (min-width: 1024px) { .feat-right { display: block; } }
      `}</style>

      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div className="feat-showcase-grid">

          {/* ── Left accordion ── */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            {FEATURES.map((feat, i) => {
              const isActive = i === activeIndex;
              const IconComp = ICONS[i];
              return (
                <div key={i}>
                  {i > 0 && <div style={{ height: 1, background: "#f0f2f5" }} />}
                  <div className="feat-item" onClick={() => goTo(i)} style={{ padding: "18px 0" }}>
                    {isActive ? (
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
                          <IconComp color={feat.color} size={52} />
                          <h3 style={{
                            fontFamily: "var(--font-manrope), sans-serif",
                            fontWeight: 800, fontSize: "1.35rem",
                            color: "#00213F", margin: 0, lineHeight: 1.2,
                          }}>{feat.title}</h3>
                        </div>
                        <p style={{
                          fontFamily: "var(--font-inter), sans-serif",
                          fontSize: "0.9375rem", color: "#64748b",
                          lineHeight: 1.65, margin: "0 0 1rem",
                        }}>{feat.desc}</p>
                        <div style={{ height: 3, background: "#e5e7eb", borderRadius: 99, overflow: "hidden", maxWidth: "55%" }}>
                          <div
                            key={progressKey}
                            style={{
                              height: "100%", background: feat.color,
                              borderRadius: 99,
                              animation: `fluid-progress ${INTERVAL_MS}ms linear forwards`,
                            }}
                          />
                        </div>
                      </div>
                    ) : (
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <IconComp color="#d1d5db" size={28} />
                        <span className="feat-title-dim" style={{
                          fontFamily: "var(--font-manrope), sans-serif",
                          fontWeight: 600, fontSize: "1rem", color: "#9ca3af",
                          transition: "color 0.2s",
                        }}>{feat.title}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Right visual panel ── */}
          <div className="feat-right">
            <div style={{
              position: "relative", height: 540, borderRadius: 24,
              overflow: "hidden",
              background: feature.bgColor,
              transition: "background 0.5s ease",
            }}>
              <PanelShapes shapeA={feature.shapeA} shapeB={feature.shapeB} />

              {/* White card — equal vertical margins, left offset shows shapes */}
              <div
                key={activeIndex}
                style={{
                  position: "absolute",
                  top: 44, bottom: 44, left: 60, right: 36,
                  background: "#ffffff",
                  borderRadius: 18,
                  padding: "22px 22px 20px",
                  boxShadow: "0 8px 40px rgba(0,0,0,0.14), -4px 0 20px rgba(0,0,0,0.07)",
                  overflowY: "auto",
                  animation: "fluid-card-in 0.4s ease both",
                }}
              >
                <CardComponent tab1={feature.tab1} tab2={feature.tab2} />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
