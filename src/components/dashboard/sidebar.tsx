import { CalendarCheck } from "lucide-react"
import { SidebarNav } from "@/components/dashboard/sidebar-nav"

export function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col w-56 shrink-0 border-r bg-card h-screen sticky top-0 p-4">
      <div className="flex items-center gap-2 mb-6">
        <CalendarCheck className="h-5 w-5 text-primary" />
        <span className="font-semibold text-sm">Calendly Clone</span>
      </div>
      <SidebarNav />
    </aside>
  )
}
