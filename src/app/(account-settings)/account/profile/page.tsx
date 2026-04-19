import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { ProfileSettingsForm } from "@/components/account/profile-settings-form"
import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header"
import type { Language, DateFormat, TimeFormat } from "@/lib/validators/user"

export const metadata = { title: "Profile | Account Settings" }

export default async function ProfileSettingsPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      username: true,
      bio: true,
      timezone: true,
      image: true,
      email: true,
      language: true,
      dateFormat: true,
      timeFormat: true,
      country: true,
    },
  })

  if (!user) redirect("/login")

  return (
    <div className="mx-auto max-w-4xl">
      <DashboardPageHeader
        title="Profile"
        description="Manage your personal information and preferences."
      />
      <section className="rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm md:p-8">
        <ProfileSettingsForm
          defaultValues={{
            name: user.name ?? "",
            username: user.username ?? "",
            bio: user.bio ?? "",
            timezone: user.timezone ?? "UTC",
            image: user.image ?? null,
            email: user.email,
            language: (user.language ?? "en-US") as Language,
            dateFormat: (user.dateFormat ?? "MM/DD/YYYY") as DateFormat,
            timeFormat: (user.timeFormat ?? "12h") as TimeFormat,
            country: user.country ?? null,
          }}
        />
      </section>
    </div>
  )
}
