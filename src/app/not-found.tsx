import Link from "next/link"

export default function NotFound() {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center px-6 text-center"
      style={{ backgroundColor: "#ffffff" }}
    >
      {/* Logo */}
      <div
        className="mb-8 flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl"
        style={{ backgroundColor: "#1e3461" }}
      >
        <img src="/logo-fluid-icon.svg" alt="Fluid" width={32} height={32} style={{ objectFit: "contain" }} />
      </div>

      <p
        className="mb-3 text-7xl font-bold"
        style={{ color: "#006bff", fontFamily: "var(--font-heading)" }}
      >
        404
      </p>
      <h1
        className="mb-3 text-2xl font-semibold"
        style={{ color: "#1c2b4b", fontFamily: "var(--font-heading)" }}
      >
        Page not found
      </h1>
      <p className="mb-8 max-w-sm text-base" style={{ color: "#4b5a6d" }}>
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>

      <div className="flex gap-3">
        <Link
          href="/"
          className="rounded-xl px-6 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90"
          style={{
            background: "linear-gradient(135deg, #006bff, #4d94ff)",
            color: "#ffffff",
          }}
        >
          Go home
        </Link>
        <Link
          href="/dashboard"
          className="rounded-xl px-6 py-2.5 text-sm font-semibold transition-colors"
          style={{ backgroundColor: "#e5edff", color: "#006bff" }}
        >
          Dashboard
        </Link>
      </div>
    </div>
  )
}
