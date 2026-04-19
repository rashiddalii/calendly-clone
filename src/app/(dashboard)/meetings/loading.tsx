export default function MeetingsLoading() {
  return (
    <div className="flex flex-col gap-6 animate-pulse">
      <div className="h-7 w-28 rounded-lg" style={{ backgroundColor: "#d0deff" }} />
      <div className="flex gap-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-9 w-24 rounded-lg" style={{ backgroundColor: "#d0deff" }} />
        ))}
      </div>
      <div className="flex flex-col gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-2xl p-5"
            style={{ backgroundColor: "#ffffff" }}
          >
            <div className="flex items-center gap-4">
              <div className="h-10 w-1.5 rounded-full" style={{ backgroundColor: "#d0deff" }} />
              <div className="flex flex-1 flex-col gap-2">
                <div className="h-4 w-40 rounded" style={{ backgroundColor: "#d0deff" }} />
                <div className="h-3 w-56 rounded" style={{ backgroundColor: "#dae6ff" }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
