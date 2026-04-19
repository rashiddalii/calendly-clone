import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { OnboardingShell } from "@/components/onboarding/onboarding-shell"
import { WizardStep1 } from "@/components/onboarding/wizard-steps"

export default async function OnboardingStep1Page() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { onboardingCompleted: true, onboardingData: true },
  })
  if (user?.onboardingCompleted) redirect("/events")

  const data = (user?.onboardingData ?? {}) as Record<string, unknown>
  const firstName = session.user.name?.split(" ")[0] ?? "there"

  return (
    <OnboardingShell step={1}>
      <div className="mx-auto w-full max-w-2xl">
        <WizardStep1
          firstName={firstName}
          initialUsage={(data.usageMode as "solo" | "team") ?? null}
          initialGoals={(data.helpGoals as string[]) ?? []}
        />
      </div>
    </OnboardingShell>
  )
}
