import Link from "next/link"

export default function BookingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <header className="px-6 py-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-heading text-lg font-bold text-on-surface"
          style={{ textDecoration: "none" }}
        >
          <span
            className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg"
            style={{ backgroundColor: "#1e3461" }}
          >
            <img src="/logo-fluid-icon.svg" alt="" width={20} height={20} style={{ objectFit: "contain" }} />
          </span>
          <span style={{ color: "#006BFF" }}>Fluid</span>
        </Link>
      </header>
      <main className="flex flex-1 flex-col items-center px-4 pb-16">
        {children}
      </main>
      <footer className="px-6 py-6 text-center text-xs text-on-surface-variant">
        Scheduled with{" "}
        <Link href="/" className="font-medium text-[color:var(--brand)]">
          Fluid
        </Link>
      </footer>
    </div>
  )
}
