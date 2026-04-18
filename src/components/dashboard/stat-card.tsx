import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value: number | string
  description?: string
  icon: LucideIcon
}

export function StatCard({ title, value, description, icon: Icon }: StatCardProps) {
  return (
    <Card className="border-[#E5E7EB] bg-white shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-[#6B7280]">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-[#9CA3AF]" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tracking-tight text-[#111827]">
          {value}
        </div>
        {description && (
          <p className="mt-1 text-xs text-[#6B7280]">{description}</p>
        )}
      </CardContent>
    </Card>
  )
}
