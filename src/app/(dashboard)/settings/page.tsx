import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/app/lib/db"
import { isGoogleCalendarConnected } from "@/lib/services/calendar"
import { ProfileForm } from "@/components/dashboard/profile-form"
import { GoogleCalendarSection } from "./google-calendar-section"
import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header"

export const metadata = { title: "Settings — Fluid" }

export default async function SettingsPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const [user, googleConnected] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { name: true, username: true, bio: true, timezone: true },
    }),
    isGoogleCalendarConnected(session.user.id),
  ])

  if (!user) redirect("/login")

  const defaultValues = {
    name: user.name ?? "",
    username: user.username ?? "",
    bio: user.bio ?? "",
    timezone: user.timezone ?? "UTC",
  }

  return (
    <div className="mx-auto max-w-4xl">
      <DashboardPageHeader
        title="Settings"
        description="Manage your profile and connected services."
      />

      <section className="rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm md:p-8">
        <h2 className="mb-6 text-lg font-semibold text-[#111827]">Profile</h2>
        <ProfileForm defaultValues={defaultValues} />
      </section>

      <section className="mt-8 rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm md:p-8">
        <h2 className="mb-6 text-lg font-semibold text-[#111827]">
          Integrations
        </h2>
        <GoogleCalendarSection isConnected={googleConnected} />
      </section>
    </div>
  )
}
