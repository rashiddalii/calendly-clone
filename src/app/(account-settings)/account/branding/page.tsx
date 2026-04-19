import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { BrandingForm } from "@/components/account/branding-form"
import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header"

export const metadata = { title: "Branding | Account Settings" }

export default async function BrandingSettingsPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { logoUrl: true, useAppBranding: true },
  })

  if (!user) redirect("/login")

  return (
    <div className="mx-auto max-w-4xl">
      <DashboardPageHeader
        title="Branding"
        description="Customize how your scheduling page looks to bookers."
      />
      <section className="rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm md:p-8">
        <BrandingForm
          defaultLogoUrl={user.logoUrl ?? null}
          defaultUseAppBranding={user.useAppBranding}
        />
      </section>
    </div>
  )
}
