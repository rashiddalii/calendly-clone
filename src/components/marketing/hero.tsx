"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { GoogleGIcon } from "@/components/icons/brand";
import { handleOAuthSignUp } from "@/lib/actions/auth";

const CALENDAR_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
// July 2024 — Mon 1st
const JULY_DAYS: (number | null)[][] = [
  [null, 1, 2, 3, 4, 5, 6],
  [7, 8, 9, 10, 11, 12, 13],
  [14, 15, 16, 17, 18, 19, 20],
  [21, 22, 23, 24, 25, 26, 27],
  [28, 29, 30, 31, null, null, null],
];
const AVAIL_JULY = new Set([16, 17, 19, 22, 23, 24, 25, 30, 31]);
const SELECTED_JULY = 22;
const BOOKING_TIMES = ["10:00am", "11:00am", "1:00pm", "2:30pm", "4:00pm"];
const SELECTED_TIME = "11:00am";
const CARD_TITLES = [
  "Reduce no-shows and stay on track",
  "Share your booking page",
];

/* ─────────────────────────────────────────────────────────────
   Illustrated icons — phone+clock and envelope+clock
───────────────────────────────────────────────────────────── */
function PhoneClockIcon() {
  return (
    <svg
      width="52"
      height="52"
      viewBox="0 0 52 52"
      fill="none"
      aria-hidden="true"
    >
      {/* Phone body */}
      <rect x="8" y="4" width="24" height="38" rx="5" fill="#5b8def" />
      {/* Screen bezel */}
      <rect
        x="10"
        y="9"
        width="20"
        height="26"
        rx="2"
        fill="white"
        opacity="0.95"
      />
      {/* Screen content lines */}
      <rect x="13" y="13" width="14" height="2" rx="1" fill="#e2e8f0" />
      <rect x="13" y="17" width="10" height="2" rx="1" fill="#e2e8f0" />
      <rect x="13" y="21" width="12" height="2" rx="1" fill="#e2e8f0" />
      {/* Chat bubble on screen */}
      <rect x="13" y="26" width="14" height="6" rx="2" fill="#dbeafe" />
      <rect x="13" y="26" width="8" height="3" rx="1" fill="#93c5fd" />
      {/* Home notch */}
      <rect
        x="16"
        y="38"
        width="8"
        height="1.5"
        rx="0.75"
        fill="rgba(255,255,255,0.5)"
      />

      {/* Green clock badge — overlapping top-right */}
      <circle cx="34" cy="12" r="11" fill="white" />
      <circle cx="34" cy="12" r="10" fill="#22c55e" />
      {/* Clock face */}
      <circle cx="34" cy="12" r="7.5" fill="white" />
      {/* Hour hand */}
      <line
        x1="34"
        y1="12"
        x2="34"
        y2="7"
        stroke="#22c55e"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      {/* Minute hand */}
      <line
        x1="34"
        y1="12"
        x2="37.5"
        y2="12"
        stroke="#22c55e"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      {/* Center dot */}
      <circle cx="34" cy="12" r="1.2" fill="#22c55e" />
    </svg>
  );
}

function MailClockIcon() {
  return (
    <svg
      width="52"
      height="52"
      viewBox="0 0 52 52"
      fill="none"
      aria-hidden="true"
    >
      {/* Envelope shadow/body */}
      <rect x="3" y="14" width="34" height="24" rx="4" fill="#5b8def" />
      {/* Envelope interior white */}
      <rect
        x="5"
        y="16"
        width="30"
        height="20"
        rx="3"
        fill="white"
        opacity="0.15"
      />
      {/* Envelope front face */}
      <rect x="5" y="16" width="30" height="20" rx="3" fill="#4f7de8" />
      {/* Flap crease */}
      <path
        d="M5 16 L20 27 L35 16"
        stroke="white"
        strokeWidth="1.5"
        fill="none"
        strokeLinejoin="round"
      />
      {/* Bottom fold line */}
      <line
        x1="5"
        y1="36"
        x2="16"
        y2="26"
        stroke="white"
        strokeWidth="1"
        opacity="0.6"
      />
      <line
        x1="35"
        y1="36"
        x2="24"
        y2="26"
        stroke="white"
        strokeWidth="1"
        opacity="0.6"
      />

      {/* Purple clock badge — overlapping top-right */}
      <circle cx="36" cy="16" r="11" fill="white" />
      <circle cx="36" cy="16" r="10" fill="#006bff" />
      {/* Clock face */}
      <circle cx="36" cy="16" r="7.5" fill="white" />
      {/* Hour hand */}
      <line
        x1="36"
        y1="16"
        x2="36"
        y2="11"
        stroke="#006bff"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      {/* Minute hand */}
      <line
        x1="36"
        y1="16"
        x2="39.5"
        y2="16"
        stroke="#006bff"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      {/* Center dot */}
      <circle cx="36" cy="16" r="1.2" fill="#006bff" />
    </svg>
  );
}

/* Action row — app-style icon for SMS */
function SmsAppIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
      <rect width="20" height="20" rx="5" fill="#1a6fdb" />
      {/* Two chat bubbles */}
      <rect
        x="3"
        y="5"
        width="10"
        height="6"
        rx="2"
        fill="white"
        opacity="0.9"
      />
      <path d="M3 11 L5 13 V11Z" fill="white" opacity="0.9" />
      <rect
        x="7"
        y="9"
        width="10"
        height="5"
        rx="2"
        fill="white"
        opacity="0.6"
      />
      <path d="M17 14 L15 16 V14Z" fill="white" opacity="0.6" />
    </svg>
  );
}

/* Action row — app-style icon for email */
function MailAppIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
      <rect width="20" height="20" rx="5" fill="#4f7de8" />
      {/* Envelope */}
      <rect
        x="3"
        y="6"
        width="14"
        height="9"
        rx="2"
        fill="white"
        opacity="0.9"
      />
      <path
        d="M3 6 L10 12 L17 6"
        stroke="#4f7de8"
        strokeWidth="1.5"
        fill="none"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────
   Card 1 — Workflow reminders  (Calendly-accurate)
───────────────────────────────────────────────────────────── */

function MicrosoftIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 21 21" aria-hidden="true">
      <rect x="1" y="1" width="9" height="9" fill="#f25022" />
      <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
      <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
      <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
    </svg>
  );
}

/*
───────────────────────────────────────────────────────────── */
function WorkflowCard() {
  const subCards = [
    {
      icon: <PhoneClockIcon />,
      title: "Send text reminder",
      timing: "24 hours before event starts",
      actionIcon: <SmsAppIcon />,
      action: "Send text to invitees",
    },
    {
      icon: <MailClockIcon />,
      title: "Send follow-up email",
      timing: "2 hours after event ends",
      actionIcon: <MailAppIcon />,
      action: "Send email to invitees",
    },
  ];

  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: "16px",
        padding: "20px 20px 18px",
        boxShadow:
          "0 2px 8px rgba(0,0,0,0.06), 0 16px 48px rgba(0,0,0,0.10), 0 0 0 1px rgba(0,0,0,0.04)",
        height: "100%",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      {/* Card title */}
      <p
        style={{
          fontFamily: "var(--font-manrope), sans-serif",
          fontWeight: 700,
          fontSize: "16px",
          color: "#0f172a",
          textAlign: "center",
          margin: 0,
          lineHeight: 1.3,
        }}
      >
        Reduce no-shows and stay on track
      </p>

      {/* Two sub-cards */}
      <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
        {subCards.map((c) => (
          <div
            key={c.title}
            style={{
              background: "#f8f9fc",
              border: "1px solid #e8eaf0",
              borderRadius: "12px",
              padding: "14px 12px 12px",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "10px",
            }}
          >
            {/* Top row: "Workflow" badge left, illustrated icon right */}
            <div
              style={{
                width: "100%",
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  padding: "3px 9px",
                  borderRadius: "99px",
                  background: "#e8f4fd",
                  fontSize: "10px",
                  fontFamily: "var(--font-inter), sans-serif",
                  fontWeight: 600,
                  color: "#006BFF",
                  letterSpacing: "0.03em",
                }}
              >
                Workflow
              </span>
              {/* Icon sits slightly overflowing to the right — matches Calendly */}
              <div
                style={{
                  marginTop: "-6px",
                  marginRight: "-4px",
                  flexShrink: 0,
                }}
              >
                {c.icon}
              </div>
            </div>

            {/* Title */}
            <p
              style={{
                fontFamily: "var(--font-manrope), sans-serif",
                fontWeight: 700,
                fontSize: "14px",
                color: "#0f172a",
                margin: 0,
                lineHeight: 1.3,
              }}
            >
              {c.title}
            </p>

            {/* Timing pill — solid dark border, exactly like Calendly */}
            <div
              style={{
                width: "100%",
                border: "1.5px solid #0f172a",
                borderRadius: "8px",
                padding: "7px 8px",
                textAlign: "center",
                background: "#ffffff",
                boxSizing: "border-box",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: "11px",
                  fontWeight: 500,
                  color: "#0f172a",
                }}
              >
                {c.timing}
              </span>
            </div>

            {/* Dashed vertical connector */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
              }}
            >
              <svg width="2" height="16" viewBox="0 0 2 16" aria-hidden="true">
                <line
                  x1="1"
                  y1="0"
                  x2="1"
                  y2="16"
                  stroke="#cbd5e1"
                  strokeWidth="1.5"
                  strokeDasharray="3 2"
                />
              </svg>
            </div>

            {/* Action row */}
            <div
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "#f0f4ff",
                borderRadius: "8px",
                padding: "7px 10px",
                boxSizing: "border-box",
              }}
            >
              {c.actionIcon}
              <span
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "#0f172a",
                }}
              >
                {c.action}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Card 2 — Booking calendar mockup  (Calendly-accurate)
   Three columns: [company+person] | [calendar] | [time slots]
───────────────────────────────────────────────────────────── */
function BookingCard() {
  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow:
          "0 2px 8px rgba(0,0,0,0.06), 0 16px 48px rgba(0,0,0,0.10), 0 0 0 1px rgba(0,0,0,0.04)",
        height: "100%",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ── Card title — inside card, like Calendly ── */}
      <div
        style={{
          padding: "14px 20px 12px",
          borderBottom: "1px solid #e5e7eb",
          textAlign: "center",
          flexShrink: 0,
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-manrope), sans-serif",
            fontWeight: 700,
            fontSize: "15px",
            color: "#0f172a",
            margin: 0,
          }}
        >
          Share your booking page
        </p>
      </div>

      {/* ── Three-column content ── */}
      <div className="flex min-h-0 flex-1 flex-col lg:grid lg:grid-cols-[160px_minmax(0,1fr)_140px]">
        {/* ── Col 1: Company + person info ── */}
        <div
          style={{
            padding: "14px 14px",
            borderRight: "1px solid #e5e7eb",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          {/* Company row */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <img
              src="/acme-logo.svg"
              alt="ACME Inc. logo"
              width={26}
              height={26}
              style={{ borderRadius: "7px", flexShrink: 0, display: "block" }}
            />
            <span
              style={{
                fontFamily: "var(--font-manrope), sans-serif",
                fontWeight: 700,
                fontSize: "13px",
                color: "#0f172a",
              }}
            >
              ACME Inc.
            </span>
          </div>

          {/* Avatar — person photo */}
          <img
            src="/avatar-fatima.svg"
            alt="Fatima Sy"
            width={40}
            height={40}
            style={{
              borderRadius: "50%",
              flexShrink: 0,
              display: "block",
              border: "2px solid #e5e7eb",
            }}
          />

          {/* Person name + event */}
          <div>
            <p
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "12px",
                color: "#64748b",
                fontWeight: 400,
                margin: "0 0 3px",
              }}
            >
              Fatima Sy
            </p>
            <h3
              style={{
                fontFamily: "var(--font-manrope), sans-serif",
                fontWeight: 700,
                fontSize: "13px",
                color: "#0f172a",
                margin: "0 0 7px",
                lineHeight: 1.3,
              }}
            >
              Client Check-in
            </h3>

            {/* Duration */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                marginBottom: "7px",
                fontSize: "12px",
                fontFamily: "var(--font-inter), sans-serif",
                color: "#64748b",
              }}
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#64748b"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              30 min
            </div>

            {/* Zoom */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "12px",
                fontFamily: "var(--font-inter), sans-serif",
                color: "#64748b",
              }}
            >
              {/* Zoom logo mark */}
              <div
                style={{
                  width: "16px",
                  height: "16px",
                  borderRadius: "4px",
                  background: "#2D8CFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <svg
                  width="9"
                  height="9"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <rect
                    x="1"
                    y="6"
                    width="14"
                    height="12"
                    rx="2"
                    fill="white"
                  />
                  <polygon points="15 9 22 5 22 19 15 15" fill="white" />
                </svg>
              </div>
              Zoom
            </div>
          </div>

          {/* Skeleton placeholder bars (Calendly style) */}
          <div
            style={{
              marginTop: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "7px",
            }}
          >
            <div
              style={{
                height: "7px",
                borderRadius: "4px",
                background: "#e2e8f0",
                width: "82%",
              }}
            />
            <div
              style={{
                height: "7px",
                borderRadius: "4px",
                background: "#e2e8f0",
                width: "62%",
              }}
            />
            <div
              style={{
                height: "7px",
                borderRadius: "4px",
                background: "#e2e8f0",
                width: "74%",
              }}
            />
          </div>
        </div>

        {/* ── Col 2: Calendar ── */}
        <div
          style={{
            padding: "12px 12px",
            borderRight: "1px solid #e5e7eb",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Calendar header */}
          <p
            style={{
              fontFamily: "var(--font-manrope), sans-serif",
              fontWeight: 700,
              fontSize: "12px",
              color: "#0f172a",
              margin: "0 0 8px",
            }}
          >
            Select a Date &amp; Time
          </p>

          {/* Month navigation */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "6px",
            }}
          >
            <button
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "2px",
                color: "#94a3b8",
                display: "flex",
              }}
              aria-label="Previous month"
            >
              <ChevronLeft size={14} />
            </button>
            <span
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontWeight: 600,
                fontSize: "12px",
                color: "#0f172a",
              }}
            >
              July 2024
            </span>
            <button
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "2px",
                color: "#94a3b8",
                display: "flex",
              }}
              aria-label="Next month"
            >
              <ChevronRight size={14} />
            </button>
          </div>

          {/* Day-of-week headers */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              marginBottom: "4px",
            }}
            aria-hidden="true"
          >
            {CALENDAR_DAYS.map((d) => (
              <div
                key={d}
                style={{
                  textAlign: "center",
                  fontSize: "9px",
                  fontFamily: "var(--font-inter), sans-serif",
                  fontWeight: 600,
                  color: "#94a3b8",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  padding: "1px 0",
                }}
              >
                {d}
              </div>
            ))}
          </div>

          {/* Date grid */}
          <div role="grid" aria-label="July 2024 calendar">
            {JULY_DAYS.map((week, wi) => (
              <div
                key={wi}
                role="row"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(7, 1fr)",
                  marginBottom: "1px",
                }}
              >
                {week.map((day, di) => {
                  const isAvail = day !== null && AVAIL_JULY.has(day);
                  const isSel = day === SELECTED_JULY;
                  return (
                    <div
                      key={di}
                      role="gridcell"
                      aria-label={
                        day
                          ? `July ${day}${isAvail ? ", available" : ""}${isSel ? ", selected" : ""}`
                          : undefined
                      }
                      style={{
                        textAlign: "center",
                        padding: "4px 1px",
                        borderRadius: "50%",
                        fontSize: "11px",
                        fontFamily: "var(--font-inter), sans-serif",
                        fontWeight: isSel ? 700 : isAvail ? 500 : 400,
                        color: isSel
                          ? "#ffffff"
                          : isAvail
                            ? "#006BFF"
                            : day === null
                              ? "transparent"
                              : "#cbd5e1",
                        background: isSel ? "#006BFF" : "transparent",
                        /* Available dates get an outlined circle border */
                        border:
                          isAvail && !isSel
                            ? "1.5px solid #006BFF"
                            : "1.5px solid transparent",
                        cursor: isAvail ? "pointer" : "default",
                        boxSizing: "border-box",
                        aspectRatio: "1",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto",
                        width: "24px",
                        height: "24px",
                      }}
                    >
                      {day ?? ""}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Time zone row */}
          <div
            style={{
              marginTop: "auto",
              paddingTop: "10px",
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <svg
              width="11"
              height="11"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#64748b"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            <span
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "11px",
                color: "#64748b",
              }}
            >
              Time zone
            </span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              marginTop: "3px",
            }}
          >
            <svg
              width="11"
              height="11"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#006BFF"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            <span
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "11px",
                color: "#006BFF",
                fontWeight: 500,
              }}
            >
              Eastern time - US &amp; Canada
            </span>
            <span style={{ color: "#006BFF", fontSize: "10px" }}>▾</span>
          </div>
        </div>

        {/* ── Col 3: Time slots ── */}
        <div
          style={{
            padding: "12px 10px",
            display: "flex",
            flexDirection: "column",
            gap: "0",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-manrope), sans-serif",
              fontWeight: 700,
              fontSize: "11px",
              color: "#0f172a",
              margin: "0 0 8px",
              lineHeight: 1.3,
            }}
          >
            Monday, July 22
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {BOOKING_TIMES.map((time) => {
              const isSel = time === SELECTED_TIME;
              if (isSel) {
                /* Selected slot: blue fill + dark "Confirm" pill side-by-side */
                return (
                  <div
                    key={time}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr auto",
                      gap: "4px",
                    }}
                  >
                    <div
                      style={{
                        padding: "8px 6px",
                        borderRadius: "6px",
                        background: "#006BFF",
                        color: "#ffffff",
                        fontFamily: "var(--font-inter), sans-serif",
                        fontSize: "11px",
                        fontWeight: 600,
                        textAlign: "center",
                      }}
                    >
                      {time}
                    </div>
                    <div
                      style={{
                        padding: "8px 8px",
                        borderRadius: "6px",
                        background: "#0f172a",
                        color: "#ffffff",
                        fontFamily: "var(--font-inter), sans-serif",
                        fontSize: "11px",
                        fontWeight: 600,
                        whiteSpace: "nowrap",
                        cursor: "pointer",
                      }}
                    >
                      Confirm
                    </div>
                  </div>
                );
              }
              /* Unselected: blue outline pill */
              return (
                <div
                  key={time}
                  style={{
                    padding: "8px 6px",
                    borderRadius: "6px",
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: "11px",
                    fontWeight: 500,
                    border: "1px solid #006BFF",
                    color: "#006BFF",
                    background: "#ffffff",
                    textAlign: "center",
                    cursor: "pointer",
                  }}
                >
                  {time}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Background shapes — JS physics, random bounce off all edges
───────────────────────────────────────────────────────────── */
function HeroShapes() {
  const blobRef = useRef<SVGPathElement>(null);
  const polyRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    /* Lissajous-curve motion:
       x = sin(t * fx) * Ax
       y = cos(t * fy) * Ay
       Because fx/fy is irrational the path never exactly repeats.
       Amplitude is large so shapes drift partially off every edge —
       overflow:hidden on the section does the clipping, creating the
       "slides in from the corner / hides back out" feel with no bounce. */

    let t = 0;
    let raf: number;

    /* Slow drift — one full sine cycle ≈ 26 s at 60 fps.
       Near each amplitude peak, velocity ≈ 0 for ~1-2 s,
       producing the natural "rests at the edge then drifts back" feel. */
    const STEP = 0.009;

    /* blob — freq ratio ≈ golden ratio → aperiodic path */
    const BFX = 0.41,
      BFY = 0.67;
    const BAX = 0,
      BAY = 130;
    const BPX = 0,
      BPY = 0;

    /* poly — different ratios + phase offsets so they're fully independent */
    const PFX = 0.57,
      PFY = 0.38;
    const PAX = 0,
      PAY = 145;
    const PPX = Math.PI * 0.9,
      PPY = Math.PI * 0.4;

    const tick = () => {
      t += STEP;

      const bx = Math.sin(t * BFX + BPX) * BAX;
      const by = Math.cos(t * BFY + BPY) * BAY;
      const px = Math.sin(t * PFX + PPX) * PAX;
      const py = Math.cos(t * PFY + PPY) * PAY;

      if (blobRef.current)
        blobRef.current.style.transform = `translate(${bx}px,${by}px)`;
      if (polyRef.current)
        polyRef.current.style.transform = `translate(${px}px,${py}px)`;

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1578 1286"
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "88%",
          height: "115%",
        }}
        preserveAspectRatio="xMaxYMid meet"
      >
        <path
          ref={blobRef}
          d="M1095.14 290.82C987.352 269.254 874.719 327.964 834.942 438.111C797.458 541.915 841.045 659.741 937.044 714.078C1038.16 771.355 1160.58 743.493 1228.68 658.816C1336.47 680.383 1449.1 621.672 1488.88 511.525C1526.36 407.722 1482.78 289.896 1386.78 235.558C1285.71 178.302 1163.29 206.164 1095.14 290.82Z"
          fill="#FF36C8"
          style={{ willChange: "transform" }}
        />
        <path
          ref={polyRef}
          d="M740.199 -141.7L1209.73 -33.2747C1240.97 -26.0606 1260.44 5.10148 1253.22 36.3415L1144.8 505.868C1133.17 556.223 1066.43 567.428 1039.02 523.561L677.918 -54.3902C650.51 -98.2564 689.798 -153.338 740.199 -141.7Z"
          fill="#006BFF"
          style={{ willChange: "transform" }}
        />
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Hero section
───────────────────────────────────────────────────────────── */
export function Hero() {
  const [active, setActive] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setActive((c) => (c + 1) % 2);
    }, 6000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleDot = (i: number) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setActive(i);
    timerRef.current = setInterval(() => {
      setActive((c) => (c + 1) % 2);
    }, 6000);
  };

  return (
    <section
      style={{
        background: "#ffffff",
        padding: "5rem 1.5rem",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <style>{`
        /* ── Layout ── */
        .hero-google-btn { transition: background-color 0.16s ease, box-shadow 0.16s ease; }
        .hero-google-btn:hover { background-color: #f1f5ff !important; box-shadow: 0 0 0 1px #c7d2fe !important; }
        .hero-ms-btn { transition: background-color 0.16s ease; cursor: not-allowed; }
        .hero-email-link { transition: color 0.14s ease; }
        .hero-email-link:hover { color: #0055CC !important; }
        .fhero-grid { display: grid; grid-template-columns: 1fr; gap: 4rem; align-items: center; }
        @media (min-width: 1024px) { .fhero-grid { grid-template-columns: 1fr 1fr; } }
        .fhero-right { display: none; }
        @media (min-width: 1024px) { .fhero-right { display: block; } }

        /* ── Card depth-swap ──
           Active  → full size, full opacity (front)
           Inactive→ scaled back, transparent (behind)
           Both transition together = the Calendly "card comes forward" feel
        */
        .hcard-wrap {
          position: absolute;
          inset: 0;
          transition:
            opacity  0.65s cubic-bezier(0.4, 0, 0.2, 1),
            transform 0.65s cubic-bezier(0.4, 0, 0.2, 1);
          will-change: opacity, transform;
        }
        .hcard-wrap[data-active="true"] {
          opacity: 1;
          transform: scale(1) translateY(0px);
          z-index: 2;
          pointer-events: auto;
        }
        .hcard-wrap[data-active="false"] {
          opacity: 0;
          transform: scale(0.91) translateY(28px);
          z-index: 1;
          pointer-events: none;
        }

        /* ── Dot indicators ── */
        .hdot {
          border: none;
          width: 44px;
          height: 44px;
          border-radius: 999px;
          cursor: pointer;
          padding: 0;
          outline: none;
          background: transparent;
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .hdot::after {
          content: "";
          height: 8px;
          border-radius: 4px;
          transition: width 0.35s ease, background-color 0.35s ease;
        }
        .hdot[data-active="true"]::after  { width: 24px; background: #006BFF; }
        .hdot[data-active="false"]::after { width: 8px;  background: #cbd5e1; }
        .hdot:focus-visible { box-shadow: 0 0 0 3px rgba(0,107,255,0.3); }
      `}</style>

      <HeroShapes />

      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div className="fhero-grid">
          {/* ── Left: marketing copy ── */}
          <div>
            {/* Badge */}
            <div style={{ marginBottom: "1.5rem" }}>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "6px 16px",
                  borderRadius: "99px",
                  background: "#00213F",
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#fff",
                  letterSpacing: "0.005em",
                }}
              >
                <span
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: "#006BFF",
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
                lineHeight: 1.06,
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
                color: "#64748b",
                lineHeight: 1.65,
                maxWidth: "440px",
                margin: "0 0 2.25rem",
              }}
            >
              Join millions who book meetings without the back-and-forth. Share
              your link and let Fluid handle the rest.
            </p>

            {/* CTAs */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                maxWidth: "360px",
              }}
            >
              {/* Google — white button, coloured G, dark text (Calendly style) */}
              <form action={handleOAuthSignUp}>
                <input type="hidden" name="provider" value="google" />
                <button
                  type="submit"
                  className="hero-google-btn cursor-pointer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                    width: "100%",
                    fontFamily: "var(--font-inter), sans-serif",
                    fontWeight: 600,
                    fontSize: "15px",
                    color: "#0f172a",
                    textDecoration: "none",
                    padding: "12px 24px",
                    borderRadius: "6px",
                    background: "#ffffff",
                    border: "1.5px solid #d1d5db",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                  }}
                >
                  <GoogleGIcon width={18} height={18} />
                  Sign up with Google
                </button>
              </form>

              {/* Microsoft — dark button, disabled/coming-soon */}
              <button
                disabled
                className="hero-ms-btn"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  fontFamily: "var(--font-inter), sans-serif",
                  fontWeight: 600,
                  fontSize: "15px",
                  color: "rgba(255,255,255,0.65)",
                  padding: "12px 24px",
                  borderRadius: "6px",
                  background: "#1e293b",
                  border: "none",
                  width: "100%",
                  opacity: 0.6,
                }}
              >
                <MicrosoftIcon />
                Sign up with Microsoft
              </button>

              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <div
                  style={{ flex: 1, height: "1px", background: "#e5e7eb" }}
                />
                <span
                  style={{
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: "13px",
                    color: "#94a3b8",
                    fontWeight: 500,
                  }}
                >
                  OR
                </span>
                <div
                  style={{ flex: 1, height: "1px", background: "#e5e7eb" }}
                />
              </div>

              <Link
                href="/login"
                className="hero-email-link"
                style={{
                  display: "block",
                  textAlign: "center",
                  fontFamily: "var(--font-inter), sans-serif",
                  fontWeight: 600,
                  fontSize: "15px",
                  color: "#006BFF",
                  textDecoration: "none",
                }}
              >
                Sign up free with email. No credit card required.
              </Link>
            </div>

            <p
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "13px",
                color: "#94a3b8",
                margin: "1.5rem 0 0",
              }}
            >
              No credit card&nbsp;&nbsp;·&nbsp;&nbsp;2 min
              setup&nbsp;&nbsp;·&nbsp;&nbsp;Free plan
            </p>
          </div>

          {/* ── Right: card carousel ── */}
          <div className="fhero-right" style={{ marginTop: "-48px" }}>
            {/* Stacked card area — title lives inside each card */}
            <div style={{ position: "relative", height: "400px" }}>
              <div
                className="hcard-wrap"
                data-active={active === 0 ? "true" : "false"}
              >
                <WorkflowCard />
              </div>
              <div
                className="hcard-wrap"
                data-active={active === 1 ? "true" : "false"}
              >
                <BookingCard />
              </div>
            </div>

            {/* Dot indicators */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "6px",
                marginTop: "14px",
              }}
            >
              {CARD_TITLES.map((title, i) => (
                <button
                  key={i}
                  className="hdot"
                  data-active={active === i ? "true" : "false"}
                  onClick={() => handleDot(i)}
                  aria-label={`Show: ${title}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
