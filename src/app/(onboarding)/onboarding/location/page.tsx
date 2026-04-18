import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { OnboardingShell } from "@/components/onboarding/onboarding-shell"
import { WizardStep5 } from "@/components/onboarding/wizard-steps"

export default async function OnboardingLocationPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { onboardingCompleted: true },
  })
  if (user?.onboardingCompleted) redirect("/events")

  return (
    <OnboardingShell step={5}>
      <div className="mx-auto w-full max-w-2xl">
        <WizardStep5 />
      </div>
    </OnboardingShell>
  )
}
