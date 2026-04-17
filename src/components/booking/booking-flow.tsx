"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { format, addDays } from "date-fns"
import { formatInTimeZone } from "date-fns-tz"
import { getAvailabilityAction } from "@/lib/actions/booking"
import { BookingCalendar } from "@/components/booking/booking-calendar"
import { TimeSlotGrid } from "@/components/booking/time-slot-grid"
import { BookingForm } from "@/components/booking/booking-form"
import { BookingSuccess } from "@/components/booking/booking-success"
import type { PublicEventTypeView, AvailableDay, TimeSlot } from "@/types"

type Step = "calendar" | "time" | "form" | "success"

interface BookingFlowProps {
  eventType: PublicEventTypeView
  hostId: string
}

interface SuccessData {
  bookingId: string
  bookerName: string
}

export function BookingFlow({ eventType, hostId }: BookingFlowProps) {
  const [step, setStep] = useState<Step>("calendar")
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null)
  const [availableDays, setAvailableDays] = useState<AvailableDay[]>([])
  const [isLoadingSlots, setIsLoadingSlots] = useState(true)
  const [bookerTimezone, setBookerTimezone] = useState("UTC")
  const [successData, setSuccessData] = useState<SuccessData | null>(null)

  // Detect timezone on mount then trigger fetch
  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
      setBookerTimezone(tz)
    } catch {
      // keep "UTC"
    }
  }, [])

  const fetchSlots = useCallback(
    async (tz: string) => {
      if (!hostId) return
      setIsLoadingSlots(true)
      try {
        const today = format(new Date(), "yyyy-MM-dd")
        const end = format(addDays(new Date(), 60), "yyyy-MM-dd")
        const days = await getAvailabilityAction({
          userId: hostId,
          eventTypeId: eventType.id,
          bookerTimezone: tz,
          from: today,
          to: end,
        })
        setAvailableDays(days)
      } catch {
        setAvailableDays([])
      } finally {
        setIsLoadingSlots(false)
      }
    },
    [hostId, eventType.id],
  )

  // Fetch whenever the resolved timezone changes
  useEffect(() => {
    fetchSlots(bookerTimezone)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookerTimezone])

  function handleSelectDate(date: string) {
    setSelectedDate(date)
    setSelectedSlot(null)
    setStep("time")
  }

  function handleSelectSlot(slot: TimeSlot) {
    setSelectedSlot(slot)
    setStep("form")
  }

  function handleTimezoneChange(tz: string) {
    setBookerTimezone(tz)
    // fetchSlots is triggered by the bookerTimezone useEffect
  }

  function handleSuccess(bookingId: string, bookerName: string) {
    setSuccessData({ bookingId, bookerName })
    setStep("success")
  }

  const slotsForDate =
    availableDays.find((d) => d.date === selectedDate)?.slots ?? []

  const hostDisplayName = eventType.host.name ?? eventType.host.username ?? "Host"
  const initials = hostDisplayName
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  // Format selected date label safely
  const selectedDateLabel = selectedDate
    ? format(new Date(selectedDate + "T12:00:00"), "EEEE, MMMM d, yyyy")
    : null

  // Format selected slot label in booker timezone
  const selectedSlotLabel = selectedSlot
    ? formatInTimeZone(new Date(selectedSlot.startUtc), bookerTimezone, "h:mm a")
    : null

  if (step === "success" && selectedSlot && successData) {
    return (
      <BookingSuccess
        eventType={eventType}
        slot={selectedSlot}
        bookerTimezone={bookerTimezone}
        bookerName={successData.bookerName}
      />
    )
  }

  return (
    <div className="w-full max-w-5xl py-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
        {/* ── Left panel: Event info ── */}
        <aside className="w-full shrink-0 lg:sticky lg:top-8 lg:w-72 lg:self-start">
          <div className="rounded-[1rem] bg-[#ffffff] p-6">
            {/* Host */}
            <div className="mb-5 flex items-center gap-3">
              <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-[#e2e0f9]">
                {eventType.host.image ? (
                  <Image
                    src={eventType.host.image}
                    alt={hostDisplayName}
                    width={40}
                    height={40}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-[#4a4bd7]">
                    {initials}
                  </div>
                )}
              </div>
              <p className="text-sm text-[#5f5e68]">{hostDisplayName}</p>
            </div>

            {/* Color + title */}
            <div className="mb-3 flex items-start gap-2">
              <div
                className="mt-1.5 h-3 w-3 shrink-0 rounded-full"
                style={{ backgroundColor: eventType.color }}
                aria-hidden="true"
              />
              <h1 className="font-heading text-xl font-semibold leading-snug text-[#32323b]">
                {eventType.title}
              </h1>
            </div>

            {/* Duration badge */}
            <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-[#f6f2fb] px-3 py-1 text-xs font-medium text-[#5f5e68]">
              <svg
                className="h-3.5 w-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" strokeWidth="1.8" />
                <path
                  d="M12 6v6l4 2"
                  strokeLinecap="round"
                  strokeWidth="1.8"
                />
              </svg>
              {eventType.duration} minutes
            </div>

            {eventType.description && (
              <p className="text-sm leading-relaxed text-[#5f5e68]">
                {eventType.description}
              </p>
            )}

            {/* Selection summary shown after date/slot chosen */}
            {(step === "time" || step === "form") && selectedDateLabel && (
              <div className="mt-5 space-y-1 pt-5" style={{ borderTop: "1px solid rgba(179,176,188,0.15)" }}>
                <p className="text-xs font-medium text-[#5f5e68]">Date</p>
                <p className="text-sm font-medium text-[#32323b]">
                  {selectedDateLabel}
                </p>
              </div>
            )}
            {step === "form" && selectedSlotLabel && (
              <div className="mt-3 space-y-1">
                <p className="text-xs font-medium text-[#5f5e68]">Time</p>
                <p className="text-sm font-medium text-[#32323b]">
                  {selectedSlotLabel}
                </p>
              </div>
            )}
          </div>
        </aside>

        {/* ── Right panel: Steps ── */}
        <div className="flex-1 min-w-0">
          {step === "calendar" && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <BookingCalendar
                availableDays={availableDays}
                selectedDate={selectedDate}
                onSelectDate={handleSelectDate}
                isLoading={isLoadingSlots}
              />
            </div>
          )}

          {step === "time" && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <TimeSlotGrid
                slots={slotsForDate}
                selectedSlot={selectedSlot}
                onSelectSlot={handleSelectSlot}
                bookerTimezone={bookerTimezone}
                onTimezoneChange={handleTimezoneChange}
                onBack={() => setStep("calendar")}
              />
            </div>
          )}

          {step === "form" && selectedSlot && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <BookingForm
                eventType={eventType}
                selectedSlot={selectedSlot}
                bookerTimezone={bookerTimezone}
                onSuccess={handleSuccess}
                onBack={() => setStep("time")}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
