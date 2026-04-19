export default function EventsLoading() {
  return (
    <div className="flex flex-col gap-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-7 w-32 rounded-lg" style={{ backgroundColor: "#d0deff" }} />
        <div className="h-9 w-36 rounded-xl" style={{ backgroundColor: "#d0deff" }} />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-2xl p-6"
            style={{ backgroundColor: "#ffffff" }}
          >
            <div className="mb-3 flex items-center gap-3">
              <div className="h-4 w-4 rounded-full" style={{ backgroundColor: "#d0deff" }} />
              <div className="h-5 w-32 rounded-lg" style={{ backgroundColor: "#d0deff" }} />
            </div>
            <div className="mb-4 h-4 w-full rounded" style={{ backgroundColor: "#dae6ff" }} />
            <div className="h-4 w-20 rounded" style={{ backgroundColor: "#dae6ff" }} />
          </div>
        ))}
      </div>
    </div>
  )
}
