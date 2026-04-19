interface OnboardingProgressProps {
  current: 1 | 2 | 3 | 4
}

const STEPS = [
  { label: "Welcome" },
  { label: "Username" },
  { label: "Timezone" },
  { label: "Availability" },
]

export function OnboardingProgress({ current }: OnboardingProgressProps) {
  return (
    <div className="mb-8 flex items-center gap-2">
      {STEPS.map((step, i) => {
        const num = i + 1
        const isDone = num < current
        const isActive = num === current

        return (
          <div key={step.label} className="flex items-center gap-2">
            {i > 0 && (
              <div
                className="h-px w-8"
                style={{ backgroundColor: isDone ? "#006bff" : "#9dafc5" }}
              />
            )}
            <div className="flex items-center gap-1.5">
              <div
                className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold"
                style={
                  isActive
                    ? {
                        background: "linear-gradient(135deg, #006bff, #4d94ff)",
                        color: "#ffffff",
                      }
                    : isDone
                      ? { backgroundColor: "#d9e8ff", color: "#006bff" }
                      : { backgroundColor: "#d0deff", color: "#4b5a6d" }
                }
              >
                {isDone ? "✓" : num}
              </div>
              <span
                className="hidden text-xs font-medium sm:block"
                style={{ color: isActive ? "#1c2b4b" : "#4b5a6d" }}
              >
                {step.label}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
