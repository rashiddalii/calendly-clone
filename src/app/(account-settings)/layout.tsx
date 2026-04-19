import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { AccountSettingsSidebar } from "@/components/account/account-settings-sidebar"
import { Topbar } from "@/components/dashboard/topbar"

export default async function AccountSettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  return (
    <div className="flex min-h-screen bg-white">
      <AccountSettingsSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">{children}</main>
      </div>
    </div>
  )
}
