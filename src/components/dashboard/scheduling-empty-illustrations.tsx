/** Lightweight decorative graphics for Scheduling tab empty states (Calendly-inspired). */

export function SingleUseLinksIllustration() {
  return (
    <div className="relative h-44 w-full max-w-[280px] shrink-0">
      <div
        className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#EBF5FF] to-[#F9FAFB]"
        aria-hidden
      />
      <div className="absolute left-4 top-4 w-[85%] rounded-xl border border-[#E5E7EB] bg-white p-3 shadow-sm">
        <p className="text-[10px] font-semibold text-[#006BFF]">Coffee chat</p>
        <p className="mt-1 text-xs font-medium text-[#111827]">9:00 AM – 10:00 AM</p>
      </div>
      <div className="absolute bottom-4 right-2 w-[90%] rounded-xl border border-[#E5E7EB] bg-white p-3 shadow-md">
        <p className="text-[11px] font-semibold text-[#374151]">Single-use link</p>
        <div className="mt-2 flex gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F3F4F6] text-xs text-[#6B7280]">
            @
          </span>
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F3F4F6] text-xs text-[#6B7280]">
            link
          </span>
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#006BFF] text-xs font-bold text-white">
            ···
          </span>
        </div>
      </div>
      <svg
        className="absolute -right-2 top-1/2 h-16 w-24 text-[#006BFF]/20"
        viewBox="0 0 100 40"
        fill="none"
        aria-hidden
      >
        <path
          d="M0 20 Q 25 0 50 20 T 100 20"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    </div>
  )
}

export function MeetingPollsIllustration() {
  const votes = [
    { d: "Mon", n: 0 },
    { d: "Tue", n: 2 },
    { d: "Wed", n: 3 },
    { d: "Thu", n: 0 },
    { d: "Fri", n: 1 },
  ]
  return (
    <div className="relative h-44 w-full max-w-[280px] shrink-0">
      <div
        className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#1e3461]/8 to-[#006BFF]/10"
        aria-hidden
      />
      <div className="absolute left-3 top-3 w-[55%] rounded-xl border border-[#E5E7EB] bg-white p-2.5 shadow-sm">
        {votes.map(({ d, n }) => (
          <div
            key={d}
            className="flex items-center justify-between py-1 text-[10px] text-[#374151]"
          >
            <span>{d}</span>
            <span className="tabular-nums text-[#006BFF]">
              {n > 0 ? `${n} votes` : "—"}
            </span>
          </div>
        ))}
      </div>
      <div className="absolute bottom-4 right-2 w-[48%] rounded-xl border border-[#E5E7EB] bg-white p-3 shadow-md">
        <p className="text-[10px] font-semibold text-[#166534]">Top pick</p>
        <p className="text-[11px] font-semibold text-[#111827]">Wednesday</p>
        <div className="mt-2 flex h-9 items-center justify-center rounded-lg bg-[#F0FDF4] text-sm font-semibold text-[#166534]">
          Confirmed
        </div>
      </div>
    </div>
  )
}
