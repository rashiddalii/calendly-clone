import { auth } from "@/lib/auth"
import { MobileNav } from "@/components/dashboard/mobile-nav"
import { UserMenu } from "@/components/dashboard/user-menu"

export async function Topbar() {
  const session = await auth()

  return (
    <header className="flex h-14 items-center justify-between border-b bg-card px-4 md:px-6">
      <MobileNav />
      <div className="flex-1" />
      <UserMenu
        name={session?.user?.name}
        email={session?.user?.email}
        image={session?.user?.image}
      />
    </header>
  )
}
