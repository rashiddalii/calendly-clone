import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { MyLinkForm } from "@/components/account/my-link-form"
import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header"

export const metadata = { title: "My Link | Account Settings" }

export default async function MyLinkSettingsPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { username: true },
  })

  if (!user) redirect("/login")

  return (
    <div className="mx-auto max-w-4xl">
      <DashboardPageHeader
        title="My Link"
        description="Your personal booking URL. Changing it will break any previously shared links."
      />
      <section className="rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm md:p-8">
        <MyLinkForm username={user.username ?? ""} />
      </section>
    </div>
  )
}
