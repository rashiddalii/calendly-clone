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
        >
          <span className="inline-block h-2 w-2 rounded-full bg-[color:var(--brand)]" />
          Fluid
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
