import { auth } from "@/lib/auth"
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar"

export async function Topbar() {
  const session = await auth()
  const u = session?.user
  if (!u) return null

  const marketingHref =
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || "/"

  return (
    <DashboardTopbar
      name={u.name}
      email={u.email}
      image={u.image}
      username={u.username ?? null}
      marketingHref={marketingHref}
    />
  )
}
