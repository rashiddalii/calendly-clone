import type { ReactNode } from "react"
import { OnboardingArt } from "@/components/onboarding/onboarding-art"
import { FluidLogo } from "@/components/shared/fluid-logo"

const BLUE = "#006BFF"

export function OnboardingShell({
  step,
  children,
}: {
  step: 1 | 2 | 3 | 4 | 5
  children: ReactNode
}) {
  const pct = (step / 5) * 100

  return (
    <div className="flex min-h-screen flex-col bg-white text-[#0F172A]">
      <header className="relative flex h-[72px] shrink-0 items-center border-b border-[#E5E7EB] px-4 sm:px-8">
        <div className="flex flex-1 items-center">
          <FluidLogo />
        </div>

        <div className="absolute left-1/2 top-1/2 hidden w-[min(100%,280px)] -translate-x-1/2 -translate-y-1/2 md:block">
          <p className="mb-1.5 text-center text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
            Step {step} of 5
          </p>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#E5E7EB]">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{ width: `${pct}%`, backgroundColor: BLUE }}
            />
          </div>
        </div>

        <div className="flex flex-1 justify-end" aria-hidden />
      </header>

      <div className="grid flex-1 lg:grid-cols-[minmax(0,1fr)_minmax(320px,42%)]">
        <div className="flex flex-col px-4 py-8 sm:px-10 lg:px-14 lg:py-12 xl:px-20">
          {children}
        </div>

        <aside
          className="relative hidden min-h-[420px] overflow-hidden lg:block"
          style={{ backgroundColor: "#EEF2F6" }}
          aria-hidden
        >
          <OnboardingArt step={step} />
        </aside>
      </div>

      <div className="border-t border-[#E5E7EB] px-4 py-3 md:hidden">
        <p className="mb-1 text-center text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
          Step {step} of 5
        </p>
        <div className="mx-auto h-1.5 max-w-xs overflow-hidden rounded-full bg-[#E5E7EB]">
          <div
            className="h-full rounded-full"
            style={{ width: `${pct}%`, backgroundColor: BLUE }}
          />
        </div>
      </div>
    </div>
  )
}
