export function FluidCornerBadge({ hide = false }: { hide?: boolean }) {
  if (hide) return null
  return (
    <div
      className="pointer-events-none absolute right-0 top-0 hidden h-24 w-24 overflow-hidden rounded-tr-[1rem] sm:block"
      aria-hidden="true"
    >
      <div className="absolute right-[-48px] top-[15px] flex h-8 w-36 rotate-45 items-center justify-center bg-[#46515d] text-center text-[9px] font-bold uppercase leading-none tracking-wide text-white">
        <span className="flex flex-col items-center">
          <span className="text-[7px] opacity-80">Powered by</span>
          <span className="font-heading text-xs normal-case tracking-normal">
            Fluid
          </span>
        </span>
      </div>
    </div>
  )
}
