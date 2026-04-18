import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { OnboardingShell } from "@/components/onboarding/onboarding-shell"
import { WizardStep3 } from "@/components/onboarding/wizard-steps"

export default async function OnboardingCalendarsPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { onboardingCompleted: true, email: true },
  })
  if (user?.onboardingCompleted) redirect("/events")

  const google = await prisma.account.findFirst({
    where: { userId: session.user.id, provider: "google" },
    select: { id: true },
  })

  return (
    <OnboardingShell step={3}>
      <div className="mx-auto w-full max-w-2xl">
        <WizardStep3 email={user?.email ?? session.user.email ?? ""} hasGoogle={!!google} />
      </div>
    </OnboardingShell>
  )
}
