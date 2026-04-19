"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { addDays, format } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  Globe2,
  MapPin,
  Phone,
  Video,
} from "lucide-react";
import { getAvailabilityAction } from "@/lib/actions/booking";
import { dateFnsFormatFor, timeFnsFormatFor } from "@/lib/utils/format";
import { BookingCalendar } from "@/components/booking/booking-calendar";
import { BookingForm } from "@/components/booking/booking-form";
import { BookingSuccess } from "@/components/booking/booking-success";
import { FluidCornerBadge } from "@/components/booking/fluid-corner-badge";
import { TimeSlotGrid } from "@/components/booking/time-slot-grid";
import { TimezonePickerSelect } from "@/components/booking/timezone-picker";
import type { AvailableDay, PublicEventTypeView, TimeSlot } from "@/types";

type Step = "calendar" | "time" | "form" | "success";

interface BookingFlowProps {
  eventType: PublicEventTypeView;
  hostId: string;
  isAuthenticated: boolean;
  invitationSearchFrom: string;
}

interface SuccessData {
  bookingId: string;
  bookerName: string;
}

export function BookingFlow({
  eventType,
  hostId,
  isAuthenticated,
  invitationSearchFrom,
}: BookingFlowProps) {
  const [step, setStep] = useState<Step>("calendar");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [availableDays, setAvailableDays] = useState<AvailableDay[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(true);
  const [bookerTimezone, setBookerTimezone] = useState("UTC");
  const [successData, setSuccessData] = useState<SuccessData | null>(null);
  const [slotNotice, setSlotNotice] = useState<string | null>(null);

  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      setBookerTimezone(tz);
    } catch {
      // Keep UTC when the browser cannot resolve a timezone.
    }
  }, []);

  const fetchSlots = useCallback(
    async (tz: string) => {
      if (!hostId) return;
      setIsLoadingSlots(true);
      try {
        const today = format(new Date(), "yyyy-MM-dd");
        const end = format(addDays(new Date(), 60), "yyyy-MM-dd");
        const days = await getAvailabilityAction({
          userId: hostId,
          eventTypeId: eventType.id,
          bookerTimezone: tz,
          from: today,
          to: end,
        });
        setAvailableDays(days);
      } catch {
        setAvailableDays([]);
      } finally {
        setIsLoadingSlots(false);
      }
    },
    [hostId, eventType.id]
  );

  useEffect(() => {
    fetchSlots(bookerTimezone);
  }, [bookerTimezone, fetchSlots]);

  function handleSelectDate(date: string) {
    setSelectedDate(date);
    setSelectedSlot(null);
    setSlotNotice(null);
    setStep("time");
  }

  function handleSelectSlot(slot: TimeSlot) {
    setSelectedSlot(slot);
    setSlotNotice(null);
  }

  function handleConfirmSlot() {
    if (!selectedSlot) return;
    setStep("form");
  }

  function handleTimezoneChange(tz: string) {
    setBookerTimezone(tz);
    setSelectedSlot(null);
    setSlotNotice(null);
  }

  function handleSuccess(bookingId: string, bookerName: string) {
    setSuccessData({ bookingId, bookerName });
    setStep("success");
  }

  function handleSlotUnavailable(message: string) {
    setSelectedSlot(null);
    setSlotNotice(message);
    setStep("time");
    void fetchSlots(bookerTimezone);
  }

  function goBack() {
    if (step === "form") {
      setSlotNotice(null);
      setStep("time");
      return;
    }
    if (step === "time") {
      setSelectedDate(null);
      setSelectedSlot(null);
      setSlotNotice(null);
      setStep("calendar");
    }
  }

  const slotsForDate =
    availableDays.find((d) => d.date === selectedDate)?.slots ?? [];

  const hostDisplayName =
    eventType.host.name ?? eventType.host.username ?? "Host";
  const initials = hostDisplayName
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const dateFmt = `EEEE, ${dateFnsFormatFor(eventType.host.dateFormat)}`;
  const timeFmt = timeFnsFormatFor(eventType.host.timeFormat);

  const selectedDateLabel = selectedDate
    ? format(new Date(selectedDate + "T12:00:00"), dateFmt)
    : null;
  const selectedSlotLabel = selectedSlot
    ? formatInTimeZone(new Date(selectedSlot.startUtc), bookerTimezone, timeFmt)
    : null;
  const selectedSlotEndLabel = selectedSlot
    ? formatInTimeZone(new Date(selectedSlot.endUtc), bookerTimezone, timeFmt)
    : null;

  if (step === "success" && selectedSlot && successData) {
    return (
      <BookingSuccess
        eventType={eventType}
        slot={selectedSlot}
        bookerTimezone={bookerTimezone}
        bookerName={successData.bookerName}
        isAuthenticated={isAuthenticated}
        invitationSearchFrom={invitationSearchFrom}
      />
    );
  }

  const gridClass =
    step === "time"
      ? "lg:grid-cols-[280px_minmax(330px,1fr)_280px]"
      : "lg:grid-cols-[280px_minmax(0,1fr)]";

  return (
    <section className="relative w-full max-w-[1020px] overflow-hidden rounded-none bg-white shadow-[0_18px_50px_rgba(28,43,75,0.08)] ring-1 ring-[#9dafc5]/20 sm:rounded-[1rem]">
      <FluidCornerBadge hide={!eventType.host.useAppBranding} />
      <div
        className={`grid min-h-[auto] grid-cols-1 lg:min-h-[520px] ${gridClass}`}
      >
        <aside className="bg-white shadow-[inset_0_-1px_0_rgba(157,175,197,0.18)] lg:shadow-[inset_-1px_0_0_rgba(157,175,197,0.24)]">
          {eventType.host.logoUrl && (
            <div className="h-20 overflow-hidden bg-[#f0f4f9] sm:h-[120px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={eventType.host.logoUrl}
                alt="Company logo"
                className="h-full w-full object-contain"
              />
            </div>
          )}

          <div className="px-5 py-7 sm:px-6">
            {(step === "time" || step === "form") && (
              <button
                type="button"
                onClick={goBack}
                className="mb-6 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-white text-[#006bff] shadow-[inset_0_0_0_1px_rgba(157,175,197,0.35)] transition-colors hover:bg-[#f0f5ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006bff]/30"
                aria-label="Go back"
              >
                <ArrowLeft className="h-6 w-6" aria-hidden="true" />
              </button>
            )}

            <div className="mb-4 flex items-center gap-3">
              <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full bg-[#d9e8ff]">
                {eventType.host.image ? (
                  <Image
                    src={eventType.host.image}
                    alt={hostDisplayName}
                    width={36}
                    height={36}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-[#006bff]">
                    {initials}
                  </div>
                )}
              </div>
              <p className="text-base font-semibold text-[#737373]">
                {hostDisplayName}
              </p>
            </div>

            <h1 className="font-heading text-xl font-bold leading-tight tracking-tight text-[#1c2b4b] sm:text-2xl">
              {eventType.title}
            </h1>

            {eventType.description && (
              <p className="mt-4 text-sm leading-relaxed text-[#4b5a6d]">
                {eventType.description}
              </p>
            )}

            <div className="mt-6 space-y-4 text-[#737373]">
              <div className="flex gap-3">
                <Clock3
                  className="mt-0.5 h-5 w-5 shrink-0"
                  aria-hidden="true"
                />
                <p className="text-sm font-semibold">
                  {eventType.duration} min
                </p>
              </div>
              <div className="flex gap-3">
                {eventType.location === "phone" ? (
                  <Phone
                    className="mt-0.5 h-5 w-5 shrink-0"
                    aria-hidden="true"
                  />
                ) : eventType.location === "in_person" ? (
                  <MapPin
                    className="mt-0.5 h-5 w-5 shrink-0"
                    aria-hidden="true"
                  />
                ) : (
                  <Video
                    className="mt-0.5 h-5 w-5 shrink-0"
                    aria-hidden="true"
                  />
                )}
                <p className="text-sm font-semibold leading-relaxed">
                  {eventType.location === "phone"
                    ? "Phone call"
                    : eventType.location === "in_person"
                      ? (eventType.locationAddress ?? "In-person meeting")
                      : "Web conferencing details provided upon confirmation."}
                </p>
              </div>
              {selectedDateLabel && (
                <div className="flex gap-3">
                  <CalendarDays
                    className="mt-0.5 h-5 w-5 shrink-0"
                    aria-hidden="true"
                  />
                  <p className="text-sm font-semibold leading-relaxed">
                    {selectedSlotLabel && selectedSlotEndLabel
                      ? `${selectedSlotLabel} - ${selectedSlotEndLabel}, ${selectedDateLabel}`
                      : selectedDateLabel}
                  </p>
                </div>
              )}
              <div className="flex gap-3">
                <Globe2
                  className="mt-0.5 h-5 w-5 shrink-0"
                  aria-hidden="true"
                />
                <p className="text-sm font-semibold leading-relaxed">
                  {bookerTimezone}
                </p>
              </div>
            </div>
          </div>
        </aside>

        {step === "form" && selectedSlot ? (
          <div className="px-5 py-7 sm:px-7 lg:px-9">
            <BookingForm
              eventType={eventType}
              selectedSlot={selectedSlot}
              bookerTimezone={bookerTimezone}
              onSuccess={handleSuccess}
              onSlotUnavailable={handleSlotUnavailable}
              onBack={() => setStep("time")}
            />
          </div>
        ) : (
          <>
            <div className="px-5 py-7 sm:px-7 lg:px-9">
              <div className="mx-auto max-w-[30rem]">
                <h2 className="mb-7 font-heading text-2xl font-bold tracking-tight text-[#1c2b4b]">
                  Select a Date & Time
                </h2>
                <BookingCalendar
                  availableDays={availableDays}
                  selectedDate={selectedDate}
                  onSelectDate={handleSelectDate}
                  isLoading={isLoadingSlots}
                />

                <div className="mt-7 max-w-sm">
                  <label
                    htmlFor="timezone-select"
                    className="mb-2 block font-heading text-lg font-bold text-[#1c2b4b]"
                  >
                    Time zone
                  </label>
                  <TimezonePickerSelect
                    id="timezone-select"
                    value={bookerTimezone}
                    onChange={handleTimezoneChange}
                  />
                </div>
              </div>
            </div>

            {step === "time" && selectedDateLabel && (
              <aside className="px-5 py-7 shadow-[inset_0_1px_0_rgba(157,175,197,0.18)] sm:px-6 lg:shadow-[inset_1px_0_0_rgba(157,175,197,0.24)]">
                <TimeSlotGrid
                  slots={slotsForDate}
                  selectedSlot={selectedSlot}
                  selectedDateLabel={selectedDateLabel}
                  notice={slotNotice}
                  onSelectSlot={handleSelectSlot}
                  onConfirmSlot={handleConfirmSlot}
                  bookerTimezone={bookerTimezone}
                  onBack={() => setStep("calendar")}
                  timeFormat={eventType.host.timeFormat}
                />
              </aside>
            )}
          </>
        )}
      </div>
    </section>
  );
}
