export default function DashboardLoading() {
  return (
    <div className="flex flex-col gap-6 animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <div className="h-7 w-40 rounded-lg" style={{ backgroundColor: "#e4e1ed" }} />
          <div className="h-4 w-56 rounded-lg" style={{ backgroundColor: "#eae7f1" }} />
        </div>
        <div className="h-9 w-32 rounded-xl" style={{ backgroundColor: "#e4e1ed" }} />
      </div>
      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-2xl p-6"
            style={{ backgroundColor: "#ffffff" }}
          >
            <div className="mb-3 h-4 w-24 rounded" style={{ backgroundColor: "#eae7f1" }} />
            <div className="h-8 w-16 rounded-lg" style={{ backgroundColor: "#e4e1ed" }} />
          </div>
        ))}
      </div>
    </div>
  )
}
