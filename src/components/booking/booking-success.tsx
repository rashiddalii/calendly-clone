"use client";

import Link from "next/link";
import { format } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import {
  CalendarDays,
  CheckCircle2,
  ExternalLink,
  Globe2,
  User,
  Video,
} from "lucide-react";
import { FluidCornerBadge } from "@/components/booking/fluid-corner-badge";
import { dateFnsFormatFor, timeFnsFormatFor } from "@/lib/utils/format";
import type { PublicEventTypeView, TimeSlot } from "@/types";

interface BookingSuccessProps {
  eventType: PublicEventTypeView;
  slot: TimeSlot;
  bookerTimezone: string;
  bookerName: string;
  isAuthenticated: boolean;
  invitationSearchFrom: string;
}

function escapeGmailSearchValue(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function gmailFromTerm(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (/[\s()[\]{}"]/.test(trimmed)) {
    return `from:"${escapeGmailSearchValue(trimmed)}"`;
  }
  return `from:${trimmed}`;
}

function buildGmailSearchUrl(fromAddress: string, hostName: string): string {
  const fromTerms = [
    gmailFromTerm(fromAddress),
    gmailFromTerm(`${hostName} (via Fluid)`),
    gmailFromTerm("Fluid"),
  ].filter(Boolean);
  const query = `{${fromTerms.join(" ")}} in:anywhere newer_than:1d`;
  return `https://mail.google.com/mail/u/0/#search/${encodeURIComponent(query)}`;
}

export function BookingSuccess({
  eventType,
  slot,
  bookerTimezone,
  isAuthenticated,
  invitationSearchFrom,
}: BookingSuccessProps) {
  const slotDate = new Date(slot.startUtc);
  const dateFmt = `EEEE, ${dateFnsFormatFor(eventType.host.dateFormat)}`;
  const timeFmt = timeFnsFormatFor(eventType.host.timeFormat);
  const dateLabel = format(
    new Date(
      formatInTimeZone(slotDate, bookerTimezone, "yyyy-MM-dd") + "T12:00:00"
    ),
    dateFmt
  );
  const startLabel = formatInTimeZone(slotDate, bookerTimezone, timeFmt);
  const endLabel = formatInTimeZone(
    new Date(slot.endUtc),
    bookerTimezone,
    timeFmt
  );

  const hostName = eventType.host.name ?? eventType.host.username ?? "the host";
  const timeRange = `${startLabel} - ${endLabel}, ${dateLabel}`;
  const invitationUrl = buildGmailSearchUrl(invitationSearchFrom, hostName);

  return (
    <section className="relative w-full max-w-[66rem] overflow-hidden rounded-[1rem] bg-white px-5 py-8 shadow-[0_18px_50px_rgba(28,43,75,0.08)] ring-1 ring-[#9dafc5]/20 sm:px-8 lg:px-10">
      <FluidCornerBadge />
      <div className="mx-auto flex max-w-xl flex-col items-center text-center">
        <div className="mb-3 flex items-center gap-3">
          <CheckCircle2
            className="h-7 w-7 fill-[#0b8f6a] text-white"
            aria-hidden="true"
          />
          <h1 className="font-heading text-2xl font-bold tracking-tight text-[#1c2b4b]">
            You are scheduled
          </h1>
        </div>
        <p className="text-sm text-[#1c2b4b]">
          A calendar invitation has been sent to your email address.
        </p>

        <a
          href={invitationUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex h-touch cursor-pointer items-center justify-center gap-2 rounded-full border border-[#9dafc5]/45 bg-white px-4 text-sm font-semibold text-[#1c2b4b] no-underline transition-colors hover:bg-[#f0f5ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006bff]/30"
        >
          Open invitation
          <ExternalLink className="h-4 w-4" aria-hidden="true" />
        </a>

        <div className="mt-7 w-full rounded-[0.75rem] bg-white p-5 text-left shadow-[inset_0_0_0_1px_rgba(157,175,197,0.36)]">
          <h2 className="font-heading text-xl font-bold text-[#667085]">
            {eventType.title}
          </h2>
          <div className="mt-4 space-y-3">
            <div className="flex gap-3">
              <User className="mt-0.5 h-5 w-5 shrink-0 text-[#737373]" />
              <p className="text-sm font-semibold text-[#667085]">{hostName}</p>
            </div>
            <div className="flex gap-3">
              <CalendarDays className="mt-0.5 h-5 w-5 shrink-0 text-[#737373]" />
              <p className="text-sm font-semibold text-[#667085]">
                {timeRange}
              </p>
            </div>
            <div className="flex gap-3">
              <Globe2 className="mt-0.5 h-5 w-5 shrink-0 text-[#737373]" />
              <p className="text-sm font-semibold text-[#667085]">
                {bookerTimezone}
              </p>
            </div>
            <div className="flex gap-3">
              <Video className="mt-0.5 h-5 w-5 shrink-0 text-[#737373]" />
              <p className="text-sm font-semibold text-[#667085]">
                Web conferencing details to follow.
              </p>
            </div>
          </div>
        </div>

        {!isAuthenticated && (
          <div className="mt-7 w-full border-t border-[#9dafc5]/25 pt-6 text-center">
            <h2 className="font-heading text-lg font-bold text-[#1c2b4b]">
              Schedule your own meetings with Fluid for free
            </h2>
            <p className="mt-3 text-sm text-[#4b5a6d]">
              Eliminate the back and forth when finding time.
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/signup"
                className="inline-flex h-touch flex-1 cursor-pointer items-center justify-center rounded-full px-5 text-sm font-semibold text-white no-underline transition-all hover:brightness-95"
                style={{
                  background: "linear-gradient(135deg, #006bff, #4d94ff)",
                }}
              >
                Sign up for free
              </Link>
              <Link
                href="/signup"
                className="inline-flex h-touch flex-1 cursor-pointer items-center justify-center rounded-full border border-[#9dafc5]/45 bg-white px-5 text-sm font-semibold text-[#1c2b4b] no-underline transition-colors hover:bg-[#f0f5ff]"
              >
                Create account
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
