const BLUE = "#006BFF"

function Blob({ className, fill }: { className?: string; fill: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        fill={fill}
        d="M45.7,-76.3C58.9,-69.3,69.1,-55.6,76.3,-41.2C83.5,-26.8,87.7,-11.7,85.8,2.8C83.9,17.3,75.9,31.2,65.1,42.3C54.3,53.4,40.7,61.7,26.4,67.1C12.1,72.5,-2.9,75,-17.8,72.1C-32.7,69.2,-47.5,60.9,-58.8,49.1C-70.1,37.3,-77.9,22,-79.8,6.1C-81.7,-9.8,-77.7,-26.3,-68.5,-39.5C-59.3,-52.7,-44.9,-62.6,-30.1,-69.1C-15.3,-75.6,-0.1,-78.7,15.2,-77.8C30.5,-76.9,46,-72,45.7,-76.3Z"
        transform="translate(100 100)"
      />
    </svg>
  )
}

/** Mini booking calendar card — steps 1 & 4 */
function BookingPageCard({ className }: { className?: string }) {
  return (
    <div
      className={`absolute rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-lg ${className ?? ""}`}
    >
      <p className="text-[10px] font-semibold text-[#64748B]">Select a Date & Time</p>
      <p className="mt-1 text-xs font-bold text-[#0F172A]">AUGUST</p>
      <div className="mt-2 grid grid-cols-7 gap-1 text-center text-[9px] text-[#94A3B8]">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <span key={`${d}-${i}`}>{d}</span>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1 text-center text-[9px]">
        {Array.from({ length: 14 }, (_, i) => (
          <span
            key={i}
            className={
              i === 8
                ? "flex h-5 w-5 items-center justify-center rounded-full bg-[#0F172A] text-white"
                : i === 7
                  ? "flex h-5 w-5 items-center justify-center rounded-full text-[#0F172A]"
                  : "text-[#CBD5E1]"
            }
          >
            {i + 1}
          </span>
        ))}
      </div>
    </div>
  )
}

/** Stacked profile cards — step 2 */
function ProfileStack({ className }: { className?: string }) {
  const people = [
    { n: "Daniel", r: "Account Executive" },
    { n: "Elena", r: "Customer success" },
    { n: "Jennifer", r: "Sales lead" },
  ]
  return (
    <div className={`absolute ${className ?? ""}`}>
      {people.map((p, i) => (
        <div
          key={p.n}
          className="absolute w-44 rounded-xl border border-[#E5E7EB] bg-white p-3 shadow-md"
          style={{
            transform: `translate(${i * 18}px, ${i * 22}px) rotate(${-4 + i * 3}deg)`,
            zIndex: 3 - i,
          }}
        >
          <div className="flex items-center gap-2">
            <div
              className="h-9 w-9 rounded-full"
              style={{
                background: `linear-gradient(135deg, ${BLUE}, #93c5fd)`,
              }}
            />
            <div>
              <p className="text-xs font-bold text-[#0F172A]">{p.n}</p>
              <p className="text-[10px] text-[#64748B]">{p.r}</p>
            </div>
          </div>
          <div
            className="mt-2 h-1 rounded-full"
            style={{ backgroundColor: `${BLUE}33` }}
          />
        </div>
      ))}
    </div>
  )
}

/** Calendar blocks — step 3 */
function CalendarBlocksCard({ className }: { className?: string }) {
  return (
    <div
      className={`absolute w-56 rounded-2xl border border-[#E5E7EB] bg-white p-3 shadow-lg ${className ?? ""}`}
    >
      <div className="mb-2 flex gap-1">
        <div className="h-8 flex-1 rounded-md" style={{ backgroundColor: `${BLUE}44` }} />
        <div className="h-8 flex-1 rounded-md bg-violet-200/80" />
        <div className="h-8 flex-1 rounded-md bg-sky-200/80" />
      </div>
      <div className="flex gap-1">
        <div className="h-10 flex-1 rounded-md bg-indigo-200/70" />
        <div className="h-10 flex-1 rounded-md" style={{ backgroundColor: `${BLUE}55` }} />
      </div>
    </div>
  )
}

/** Time slots + confirm — step 4 */
function AvailabilityPreview({ className }: { className?: string }) {
  return (
    <div className={`absolute ${className ?? ""}`}>
      <BookingPageCard className="left-0 top-0 w-52 scale-90" />
      <div className="absolute left-24 top-28 w-48 rounded-xl border border-[#E5E7EB] bg-white p-3 shadow-lg">
        <p className="text-[10px] font-semibold text-[#64748B]">Wednesday, Aug 16</p>
        <div className="mt-2 space-y-1">
          {["10:00am", "10:30am", "11:00am", "11:30am"].map((t) => (
            <div
              key={t}
              className={
                t === "11:00am"
                  ? "flex items-center justify-between rounded-lg bg-[#0F172A] px-2 py-1.5 text-[10px] text-white"
                  : "rounded-lg px-2 py-1.5 text-[10px] text-[#64748B]"
              }
            >
              <span>{t}</span>
              {t === "11:00am" ? (
                <span className="rounded-md px-2 py-0.5 text-[9px] font-semibold text-white" style={{ backgroundColor: BLUE }}>
                  Confirm
                </span>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/** Booked confirmation — step 5 */
function BookedCard({ className }: { className?: string }) {
  return (
    <div
      className={`absolute w-52 rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-lg ${className ?? ""}`}
    >
      <div className="flex items-center gap-2">
        <div
          className="h-10 w-10 rounded-full"
          style={{ background: `linear-gradient(135deg, #6366f1, ${BLUE})` }}
        />
        <div>
          <p className="text-xs font-bold text-[#0F172A]">Meeting booked!</p>
          <p className="text-[10px] text-[#64748B]">WHEN · Wed, Aug 16</p>
        </div>
      </div>
      <p className="mt-2 text-[10px] font-semibold text-[#64748B]">LOCATION</p>
      <div className="mt-1 h-1.5 rounded-full" style={{ backgroundColor: BLUE }} />
      <div className="mx-auto mt-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#F1F5F9]" aria-hidden>
        <svg width="22" height="22" viewBox="0 0 24 24" fill={BLUE} aria-hidden>
          <path d="M8 5v14l11-7L8 5z" />
        </svg>
      </div>
    </div>
  )
}

export function OnboardingArt({ step }: { step: 1 | 2 | 3 | 4 | 5 }) {
  return (
    <div className="relative h-full min-h-[560px] w-full">
      {/* ambient shapes */}
      <Blob
        className="absolute -right-16 -top-20 h-72 w-72 opacity-[0.12]"
        fill="#6366f1"
      />
      <Blob
        className="absolute -bottom-24 -left-20 h-80 w-80 opacity-[0.15]"
        fill={BLUE}
      />

      {step === 1 && (
        <>
          <div className="absolute right-[12%] top-[14%] h-24 w-24 rotate-12 rounded-3xl border-4 border-lime-400 bg-transparent" />
          <div className="absolute bottom-[18%] left-[10%] h-28 w-28 rotate-[-8deg] bg-violet-600 opacity-90" style={{ clipPath: "polygon(30% 0%, 100% 25%, 100% 75%, 30% 100%, 0% 50%)" }} />
          <BookingPageCard className="left-1/2 top-1/2 w-56 -translate-x-1/2 -translate-y-1/2" />
        </>
      )}

      {step === 2 && (
        <>
          <svg className="absolute right-8 top-16 h-32 w-32 text-teal-400/40" viewBox="0 0 100 100" aria-hidden>
            <path fill="none" stroke="currentColor" strokeWidth="3" d="M10,50 Q50,10 90,50 T90,80" />
          </svg>
          <div className="absolute bottom-12 right-[15%] h-40 w-40 rounded-full bg-indigo-900/90" />
          <ProfileStack className="left-[18%] top-[22%]" />
        </>
      )}

      {step === 3 && (
        <>
          <div className="absolute right-[8%] top-[20%] h-48 w-48 rounded-full bg-violet-500/85" />
          <CalendarBlocksCard className="left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
        </>
      )}

      {step === 4 && (
        <>
          <div className="absolute bottom-[10%] right-[12%] h-36 w-36 rounded-full bg-violet-600/80" />
          <AvailabilityPreview className="left-[12%] top-[18%]" />
        </>
      )}

      {step === 5 && (
        <>
          <div className="absolute left-[8%] top-[12%] h-32 w-32 rounded-full bg-purple-500/35" />
          <div className="absolute bottom-[15%] right-[10%] h-28 w-28 rotate-6 rounded-2xl border-4 border-purple-400" />
          <BookedCard className="left-1/2 top-[28%] -translate-x-1/2" />
        </>
      )}
    </div>
  )
}
