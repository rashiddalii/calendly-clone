import Link from "next/link";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "event-types" as const, label: "Event types", param: "event-types" },
  { id: "single-use" as const, label: "Single-use links", param: "single-use" },
  { id: "polls" as const, label: "Meeting polls", param: "polls" },
];

export function SchedulingTabs({
  active,
}: {
  active: (typeof TABS)[number]["id"];
}) {
  return (
    <div className="flex gap-4 overflow-x-auto border-b border-[#E5E7EB] md:gap-8">
      {TABS.map((t) => {
        const isActive = active === t.id;
        return (
          <Link
            key={t.id}
            href={t.id === "event-types" ? "/events" : `/events?tab=${t.param}`}
            className={cn(
              "-mb-px shrink-0 border-b-2 pb-3 text-sm font-medium transition-colors",
              isActive
                ? "border-[#006BFF] text-[#006BFF]"
                : "border-transparent text-[#6B7280] hover:text-[#111827]"
            )}
          >
            {t.label}
          </Link>
        );
      })}
    </div>
  );
}
