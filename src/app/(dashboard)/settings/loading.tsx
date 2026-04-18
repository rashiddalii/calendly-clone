export default function SettingsLoading() {
  return (
    <div className="flex flex-col gap-10 animate-pulse">
      <div className="h-8 w-24 rounded-lg" style={{ backgroundColor: "#e4e1ed" }} />
      <div className="rounded-2xl p-8" style={{ backgroundColor: "#f6f2fb" }}>
        <div className="mb-6 h-6 w-20 rounded-lg" style={{ backgroundColor: "#e4e1ed" }} />
        <div className="rounded-xl p-6" style={{ backgroundColor: "#ffffff" }}>
          <div className="flex flex-col gap-5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col gap-2">
                <div className="h-3 w-20 rounded" style={{ backgroundColor: "#eae7f1" }} />
                <div className="h-10 w-full rounded-xl" style={{ backgroundColor: "#eae7f1" }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
