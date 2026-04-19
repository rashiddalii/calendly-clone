import Link from "next/link"

interface FluidLogoProps {
  /** "md" = 36px container (default, used in headers), "sm" = 32px container (used in sidebar) */
  size?: "sm" | "md"
  showText?: boolean
  href?: string
  className?: string
}

export function FluidLogo({
  size = "md",
  showText = true,
  href = "/",
  className = "",
}: FluidLogoProps) {
  const containerSize = size === "md" ? "h-9 w-9" : "h-8 w-8"
  const iconSize = size === "md" ? 22 : 20

  return (
    <Link
      href={href}
      className={`flex min-h-11 items-center gap-2 no-underline ${className}`}
      aria-label="Fluid home"
    >
      <span
        className={`flex ${containerSize} shrink-0 items-center justify-center overflow-hidden rounded-lg`}
        style={{ backgroundColor: "#1e3461" }}
      >
        <img
          src="/logo-fluid-icon.svg"
          alt=""
          width={iconSize}
          height={iconSize}
          className="object-contain"
        />
      </span>
      {showText && (
        <span
          className="font-[family-name:var(--font-manrope)] text-xl font-bold tracking-tight"
          style={{ color: "#006BFF" }}
        >
          Fluid
        </span>
      )}
    </Link>
  )
}
