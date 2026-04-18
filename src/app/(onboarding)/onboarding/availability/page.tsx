import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { getWeeklyAvailability, normalizeWeeklySchedule } from "@/lib/services/availability"
import { OnboardingShell } from "@/components/onboarding/onboarding-shell"
import { WizardStep4 } from "@/components/onboarding/wizard-steps"

export default async function OnboardingAvailabilityPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { onboardingCompleted: true, timezone: true },
  })
  if (user?.onboardingCompleted) redirect("/events")

  const rows = await getWeeklyAvailability(session.user.id)
  const initial = normalizeWeeklySchedule(rows)

  return (
    <OnboardingShell step={4}>
      <div className="mx-auto w-full max-w-2xl">
        <WizardStep4 initialSchedule={initial} defaultTimezone={user?.timezone ?? "UTC"} />
      </div>
    </OnboardingShell>
  )
}
