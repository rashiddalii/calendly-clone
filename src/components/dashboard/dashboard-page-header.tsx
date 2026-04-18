import { CircleHelp } from "lucide-react"
import { cn } from "@/lib/utils"

export function DashboardPageHeader({
  title,
  description,
  showHelp = false,
  className,
}: {
  title: string
  description?: string
  showHelp?: boolean
  className?: string
}) {
  return (
    <header className={cn("mb-8", className)}>
      <div className="flex flex-wrap items-center gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-[#111827] sm:text-[28px]">
          {title}
        </h1>
        {showHelp && (
          <button
            type="button"
            className="inline-flex size-7 items-center justify-center rounded-full border border-[#E5E7EB] bg-white text-[#6B7280] shadow-sm transition-colors hover:bg-[#F9FAFB]"
            aria-label="Help"
          >
            <CircleHelp className="h-4 w-4" />
          </button>
        )}
      </div>
      {description ? (
        <p className="mt-1 max-w-2xl text-sm text-[#6B7280]">{description}</p>
      ) : null}
    </header>
  )
}
