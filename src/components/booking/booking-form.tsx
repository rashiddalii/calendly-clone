"use client";

import { useRef, useState, useTransition } from "react";
import { format } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import { createBookingAction } from "@/lib/actions/booking";
import { dateFnsFormatFor, timeFnsFormatFor } from "@/lib/utils/format";
import type { PublicEventTypeView, TimeSlot } from "@/types";

interface BookingFormProps {
  eventType: PublicEventTypeView;
  selectedSlot: TimeSlot;
  bookerTimezone: string;
  onSuccess: (bookingId: string, bookerName: string) => void;
  onSlotUnavailable: (message: string) => void;
  onBack: () => void;
}

interface FormErrors {
  bookerName?: string;
  bookerEmail?: string;
  bookerPhone?: string;
  bookerNotes?: string;
  _root?: string;
}

export function BookingForm({
  eventType,
  selectedSlot,
  bookerTimezone,
  onSuccess,
  onSlotUnavailable,
  onBack,
}: BookingFormProps) {
  const [errors, setErrors] = useState<FormErrors>({});
  const [isPending, startTransition] = useTransition();

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const notesRef = useRef<HTMLTextAreaElement>(null);

  const isPhoneEvent = eventType.location === "phone";
  const isInPersonEvent = eventType.location === "in_person";

  const slotDate = new Date(selectedSlot.startUtc);
  const dateFmt = `EEEE, ${dateFnsFormatFor(eventType.host.dateFormat)}`;
  const timeFmt = timeFnsFormatFor(eventType.host.timeFormat);
  const dateLabel = format(
    new Date(
      formatInTimeZone(slotDate, bookerTimezone, "yyyy-MM-dd") + "T12:00:00"
    ),
    dateFmt
  );
  const timeLabel = formatInTimeZone(slotDate, bookerTimezone, timeFmt);

  function validate(name: string, email: string, phone: string): FormErrors {
    const errs: FormErrors = {};
    if (!name.trim()) errs.bookerName = "Please enter your name";
    if (!email.trim()) errs.bookerEmail = "Please enter your email";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.bookerEmail = "Please enter a valid email address";
    }
    if (isPhoneEvent && !phone.trim()) {
      errs.bookerPhone = "Please enter your phone number";
    }
    return errs;
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const name = nameRef.current?.value ?? "";
    const email = emailRef.current?.value ?? "";
    const phone = phoneRef.current?.value ?? "";
    const notes = notesRef.current?.value ?? "";

    const clientErrors = validate(name, email, phone);
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      if (clientErrors.bookerName) nameRef.current?.focus();
      else if (clientErrors.bookerEmail) emailRef.current?.focus();
      else if (clientErrors.bookerPhone) phoneRef.current?.focus();
      return;
    }

    setErrors({});

    startTransition(async () => {
      const result = await createBookingAction({
        eventTypeId: eventType.id,
        bookerName: name.trim(),
        bookerEmail: email.trim(),
        bookerPhone: phone.trim() || undefined,
        bookerNotes: notes.trim() || undefined,
        startTime: selectedSlot.startUtc,
        bookerTimezone,
      });

      if (result.status === "success") {
        onSuccess(result.bookingId, name.trim());
      } else if (result.code === "SLOT_UNAVAILABLE") {
        onSlotUnavailable(result.error);
      } else if (result.fieldErrors) {
        setErrors(result.fieldErrors);
      } else {
        setErrors({ _root: result.error });
      }
    });
  }

  return (
    <div className="mx-auto w-full max-w-xl">
      <button
        type="button"
        onClick={onBack}
        disabled={isPending}
        aria-label="Go back to time selection"
        className="mb-5 inline-flex h-touch cursor-pointer items-center gap-2 rounded-lg pr-3 text-sm font-semibold text-[#006bff] transition-colors hover:text-[#005edb] disabled:opacity-40"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.8}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back
      </button>

      <h2 className="font-heading text-2xl font-bold tracking-tight text-[#1c2b4b]">
        Enter Details
      </h2>
      <p className="mt-2 text-sm text-[#4b5a6d]">
        {dateLabel} at {timeLabel}
      </p>

      {errors._root && (
        <div
          role="alert"
          className="mt-4 rounded-[0.75rem] bg-[#fff7f7] px-4 py-3 text-sm text-[#a8364b] ring-1 ring-[#a8364b]/20"
        >
          {errors._root}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
        <div>
          <label
            htmlFor="booker-name"
            className="mb-2 block text-xs font-semibold text-[#1c2b4b] sm:text-sm"
          >
            Name{" "}
            <span className="text-[#a8364b]" aria-label="required">
              *
            </span>
          </label>
          <input
            id="booker-name"
            ref={nameRef}
            type="text"
            name="bookerName"
            autoComplete="name"
            autoFocus
            required
            aria-required="true"
            aria-describedby={errors.bookerName ? "name-error" : undefined}
            aria-invalid={!!errors.bookerName}
            className={[
              "h-11 w-full rounded-[0.5rem] bg-white px-4 text-sm text-[#1c2b4b] shadow-[inset_0_0_0_1px_rgba(157,175,197,0.55)] transition-all sm:h-12",
              "focus:outline-none focus:ring-2 focus:ring-[#006bff]/30",
              errors.bookerName ? "ring-2 ring-[#a8364b]/45" : "",
            ].join(" ")}
          />
          {errors.bookerName && (
            <p
              id="name-error"
              role="alert"
              className="mt-2 text-sm text-[#a8364b]"
            >
              {errors.bookerName}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="booker-email"
            className="mb-2 block text-xs font-semibold text-[#1c2b4b] sm:text-sm"
          >
            Email{" "}
            <span className="text-[#a8364b]" aria-label="required">
              *
            </span>
          </label>
          <input
            id="booker-email"
            ref={emailRef}
            type="email"
            name="bookerEmail"
            autoComplete="email"
            required
            aria-required="true"
            aria-describedby={errors.bookerEmail ? "email-error" : undefined}
            aria-invalid={!!errors.bookerEmail}
            className={[
              "h-11 w-full rounded-[0.5rem] bg-white px-4 text-sm text-[#1c2b4b] shadow-[inset_0_0_0_1px_rgba(157,175,197,0.55)] transition-all sm:h-12",
              "focus:outline-none focus:ring-2 focus:ring-[#006bff]/30",
              errors.bookerEmail ? "ring-2 ring-[#a8364b]/45" : "",
            ].join(" ")}
          />
          {errors.bookerEmail && (
            <p
              id="email-error"
              role="alert"
              className="mt-2 text-sm text-[#a8364b]"
            >
              {errors.bookerEmail}
            </p>
          )}
        </div>

        {isPhoneEvent && (
          <div>
            <label
              htmlFor="booker-phone"
              className="mb-2 block text-xs font-semibold text-[#1c2b4b] sm:text-sm"
            >
              Phone number{" "}
              <span className="text-[#a8364b]" aria-label="required">
                *
              </span>
            </label>
            <input
              id="booker-phone"
              ref={phoneRef}
              type="tel"
              name="bookerPhone"
              autoComplete="tel"
              required
              aria-required="true"
              aria-describedby={errors.bookerPhone ? "phone-error" : undefined}
              aria-invalid={!!errors.bookerPhone}
              placeholder="+1 555 000 0000"
              className={[
                "h-11 w-full rounded-[0.5rem] bg-white px-4 text-sm text-[#1c2b4b] shadow-[inset_0_0_0_1px_rgba(157,175,197,0.55)] transition-all sm:h-12",
                "focus:outline-none focus:ring-2 focus:ring-[#006bff]/30",
                errors.bookerPhone ? "ring-2 ring-[#a8364b]/45" : "",
              ].join(" ")}
            />
            {errors.bookerPhone && (
              <p
                id="phone-error"
                role="alert"
                className="mt-2 text-sm text-[#a8364b]"
              >
                {errors.bookerPhone}
              </p>
            )}
          </div>
        )}

        {isInPersonEvent && eventType.locationAddress && (
          <div className="rounded-[0.75rem] bg-[#f0f4f9] px-4 py-3">
            <p className="mb-0.5 text-xs font-semibold uppercase tracking-wide text-[#4b5a6d]">
              Meeting location
            </p>
            <p className="text-sm font-medium text-[#1c2b4b]">
              {eventType.locationAddress}
            </p>
          </div>
        )}

        <div>
          <label
            htmlFor="booker-notes"
            className="mb-2 block text-xs font-semibold text-[#1c2b4b] sm:text-sm"
          >
            Please share anything that will help prepare for our meeting.
          </label>
          <textarea
            id="booker-notes"
            ref={notesRef}
            name="bookerNotes"
            rows={3}
            aria-describedby={errors.bookerNotes ? "notes-error" : undefined}
            aria-invalid={!!errors.bookerNotes}
            className={[
              "w-full resize-y rounded-[0.5rem] bg-white px-4 py-3 text-sm text-[#1c2b4b] shadow-[inset_0_0_0_1px_rgba(157,175,197,0.55)] transition-all",
              "focus:outline-none focus:ring-2 focus:ring-[#006bff]/30",
              errors.bookerNotes ? "ring-2 ring-[#a8364b]/45" : "",
            ].join(" ")}
          />
          {errors.bookerNotes && (
            <p
              id="notes-error"
              role="alert"
              className="mt-2 text-sm text-[#a8364b]"
            >
              {errors.bookerNotes}
            </p>
          )}
        </div>

        <p className="text-sm leading-relaxed text-[#4b5a6d]">
          By proceeding, you agree to share your name and email with the host.
        </p>

        <button
          type="submit"
          disabled={isPending}
          aria-busy={isPending}
          className="inline-flex min-h-11 w-full cursor-pointer items-center justify-center rounded-full px-6 text-sm font-semibold text-white transition-all hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006bff]/35 focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-70 sm:w-auto"
          style={{ background: "linear-gradient(135deg, #006bff, #4d94ff)" }}
        >
          {isPending ? "Scheduling..." : "Schedule Event"}
        </button>
      </form>
    </div>
  );
}
