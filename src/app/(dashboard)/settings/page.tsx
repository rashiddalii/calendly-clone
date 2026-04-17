import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/app/lib/db"
import { isGoogleCalendarConnected } from "@/lib/services/calendar"
import { ProfileForm } from "@/components/dashboard/profile-form"
import { GoogleCalendarSection } from "./google-calendar-section"

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
    <div className="flex flex-col gap-10">
      <header>
        <h1 className="font-heading text-3xl font-semibold text-on-surface">
          Settings
        </h1>
        <p className="mt-1 text-sm text-on-surface-variant">
          Manage your profile and connected services.
        </p>
      </header>

      {/* Section 1 — Profile */}
      <section className="rounded-2xl bg-[#f6f2fb] p-6 md:p-8">
        <h2 className="font-heading text-xl font-semibold text-[#32323b] mb-6">
          Profile
        </h2>
        <div className="rounded-xl bg-[#ffffff] p-6">
          <ProfileForm defaultValues={defaultValues} />
        </div>
      </section>

      {/* Section 2 — Integrations */}
      <section className="rounded-2xl bg-[#f0ecf6] p-6 md:p-8">
        <h2 className="font-heading text-xl font-semibold text-[#32323b] mb-6">
          Integrations
        </h2>
        <GoogleCalendarSection isConnected={googleConnected} />
      </section>
    </div>
  )
}
