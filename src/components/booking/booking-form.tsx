"use client"

import { useState, useRef, useTransition } from "react"
import { formatInTimeZone } from "date-fns-tz"
import { format } from "date-fns"
import { createBookingAction } from "@/lib/actions/booking"
import type { PublicEventTypeView, TimeSlot } from "@/types"

interface BookingFormProps {
  eventType: PublicEventTypeView
  selectedSlot: TimeSlot
  bookerTimezone: string
  onSuccess: (bookingId: string, bookerName: string) => void
  onBack: () => void
}

interface FormErrors {
  bookerName?: string
  bookerEmail?: string
  bookerNotes?: string
  _root?: string
}

export function BookingForm({
  eventType,
  selectedSlot,
  bookerTimezone,
  onSuccess,
  onBack,
}: BookingFormProps) {
  const [errors, setErrors] = useState<FormErrors>({})
  const [isPending, startTransition] = useTransition()

  const nameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const notesRef = useRef<HTMLTextAreaElement>(null)

  // Format slot time labels
  const slotDate = new Date(selectedSlot.startUtc)
  const dateLabel = format(
    new Date(
      formatInTimeZone(slotDate, bookerTimezone, "yyyy-MM-dd") + "T12:00:00",
    ),
    "EEEE, MMMM d, yyyy",
  )
  const timeLabel = formatInTimeZone(slotDate, bookerTimezone, "h:mm a")

  function validate(
    name: string,
    email: string,
  ): FormErrors {
    const errs: FormErrors = {}
    if (!name.trim()) errs.bookerName = "Please enter your name"
    if (!email.trim()) errs.bookerEmail = "Please enter your email"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errs.bookerEmail = "Please enter a valid email address"
    return errs
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const name = nameRef.current?.value ?? ""
    const email = emailRef.current?.value ?? ""
    const notes = notesRef.current?.value ?? ""

    const clientErrors = validate(name, email)
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors)
      // Focus first errored field
      if (clientErrors.bookerName) nameRef.current?.focus()
      else if (clientErrors.bookerEmail) emailRef.current?.focus()
      return
    }

    setErrors({})

    startTransition(async () => {
      const result = await createBookingAction({
        eventTypeId: eventType.id,
        bookerName: name.trim(),
        bookerEmail: email.trim(),
        bookerNotes: notes.trim() || undefined,
        startTime: selectedSlot.startUtc,
        bookerTimezone,
      })

      if (result.status === "success") {
        onSuccess(result.bookingId, name.trim())
      } else {
        if (result.fieldErrors) {
          setErrors(result.fieldErrors)
        } else {
          setErrors({ _root: result.error })
        }
      }
    })
  }

  return (
    <div className="rounded-[1rem] bg-[#ffffff] p-5 sm:p-6">
      {/* Back button */}
      <button
        type="button"
        onClick={onBack}
        disabled={isPending}
        aria-label="Go back to time selection"
        className="mb-5 flex items-center gap-1.5 text-sm text-[#5f5e68] transition-colors duration-150 hover:text-[#4a4bd7] disabled:opacity-40"
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
        Back to time selection
      </button>

      {/* Booking summary */}
      <div className="mb-6 rounded-[0.75rem] bg-[#f6f2fb] px-4 py-3">
        <p className="text-xs font-medium text-[#5f5e68]">You&apos;re booking</p>
        <p className="mt-0.5 text-sm font-semibold text-[#32323b]">
          {eventType.title}
        </p>
        <p className="mt-1 text-xs text-[#5f5e68]">
          {dateLabel} &middot; {timeLabel}
        </p>
        <p className="mt-0.5 text-xs text-[#5f5e68]">
          {eventType.duration} min · with {eventType.host.name ?? eventType.host.username}
        </p>
      </div>

      <h2 className="mb-4 font-heading text-base font-semibold text-[#32323b]">
        Your details
      </h2>

      {errors._root && (
        <div
          role="alert"
          className="mb-4 rounded-[0.75rem] bg-[#fff7f7] px-4 py-3 text-sm text-[#a8364b]"
          style={{ border: "1px solid rgba(168,54,75,0.2)" }}
        >
          {errors._root}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Name */}
        <div>
          <label
            htmlFor="booker-name"
            className="mb-1.5 block text-xs font-medium text-[#5f5e68]"
          >
            Full name <span className="text-[#a8364b]" aria-label="required">*</span>
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
            placeholder="Jane Smith"
            className={[
              "w-full rounded-[0.75rem] px-3 py-2.5 text-sm text-[#32323b] transition-all duration-150",
              "placeholder:text-[#b3b0bc]",
              "focus:outline-none focus:ring-2",
              errors.bookerName
                ? "bg-[#ffffff] ring-1 ring-[rgba(168,54,75,0.5)] focus:ring-[rgba(168,54,75,0.5)]"
                : "bg-[#eae7f1] focus:bg-[#ffffff] focus:ring-[rgba(74,75,215,0.3)]",
            ].join(" ")}
          />
          {errors.bookerName && (
            <p id="name-error" role="alert" className="mt-1 text-xs text-[#a8364b]">
              {errors.bookerName}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="booker-email"
            className="mb-1.5 block text-xs font-medium text-[#5f5e68]"
          >
            Email address <span className="text-[#a8364b]" aria-label="required">*</span>
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
            placeholder="jane@example.com"
            className={[
              "w-full rounded-[0.75rem] px-3 py-2.5 text-sm text-[#32323b] transition-all duration-150",
              "placeholder:text-[#b3b0bc]",
              "focus:outline-none focus:ring-2",
              errors.bookerEmail
                ? "bg-[#ffffff] ring-1 ring-[rgba(168,54,75,0.5)] focus:ring-[rgba(168,54,75,0.5)]"
                : "bg-[#eae7f1] focus:bg-[#ffffff] focus:ring-[rgba(74,75,215,0.3)]",
            ].join(" ")}
          />
          {errors.bookerEmail && (
            <p id="email-error" role="alert" className="mt-1 text-xs text-[#a8364b]">
              {errors.bookerEmail}
            </p>
          )}
        </div>

        {/* Notes */}
        <div>
          <label
            htmlFor="booker-notes"
            className="mb-1.5 block text-xs font-medium text-[#5f5e68]"
          >
            Additional notes{" "}
            <span className="font-normal text-[#b3b0bc]">(optional)</span>
          </label>
          <textarea
            id="booker-notes"
            ref={notesRef}
            name="bookerNotes"
            rows={3}
            placeholder="Anything you'd like to share before the meeting..."
            aria-describedby={errors.bookerNotes ? "notes-error" : undefined}
            aria-invalid={!!errors.bookerNotes}
            className={[
              "w-full resize-none rounded-[0.75rem] px-3 py-2.5 text-sm text-[#32323b] transition-all duration-150",
              "placeholder:text-[#b3b0bc]",
              "focus:outline-none focus:ring-2",
              errors.bookerNotes
                ? "bg-[#ffffff] ring-1 ring-[rgba(168,54,75,0.5)] focus:ring-[rgba(168,54,75,0.5)]"
                : "bg-[#eae7f1] focus:bg-[#ffffff] focus:ring-[rgba(74,75,215,0.3)]",
            ].join(" ")}
          />
          {errors.bookerNotes && (
            <p id="notes-error" role="alert" className="mt-1 text-xs text-[#a8364b]">
              {errors.bookerNotes}
            </p>
          )}
        </div>

        {/* Submit */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isPending}
            aria-busy={isPending}
            className={[
              "relative w-full rounded-[0.75rem] px-6 py-3 text-sm font-semibold text-[#fbf7ff] transition-all duration-150",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(74,75,215,0.4)] focus-visible:ring-offset-2",
              isPending ? "opacity-70 cursor-wait" : "hover:brightness-95",
            ].join(" ")}
            style={{
              background: "linear-gradient(135deg, #4a4bd7, #7073ff)",
            }}
          >
            {isPending ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="h-4 w-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Scheduling...
              </span>
            ) : (
              "Schedule event"
            )}
          </button>
        </div>
      </form>

      <p className="mt-4 text-center text-xs text-[#b3b0bc]">
        By scheduling, you agree to share your name and email with the host.
      </p>
    </div>
  )
}
