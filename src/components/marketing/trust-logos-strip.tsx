/**
 * Brand marks via Simple Icons (MIT): dropbox, zendesk, salesforce, hubspot.
 * L'Oréal: wordmark approximation (no official glyph in Simple Icons).
 */
function DropboxLogo({ className }: { className?: string }) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Dropbox"
      className={className}
    >
      <title>Dropbox</title>
      <path
        fill="currentColor"
        d="M6 1.807L0 5.629l6 3.822 6.001-3.822L6 1.807zM18 1.807l-6 3.822 6 3.822 6-3.822-6-3.822zM0 13.274l6 3.822 6.001-3.822L6 9.452l-6 3.822zM18 9.452l-6 3.822 6 3.822 6-3.822-6-3.822zM6 18.371l6.001 3.822 6-3.822-6-3.822L6 18.371z"
      />
    </svg>
  )
}

function ZendeskLogo({ className }: { className?: string }) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Zendesk"
      className={className}
    >
      <title>Zendesk</title>
      <path
        fill="currentColor"
        d="M12.914 2.904V16.29L24 2.905H12.914zM0 2.906C0 5.966 2.483 8.45 5.543 8.45s5.542-2.484 5.543-5.544H0zm11.086 4.807L0 21.096h11.086V7.713zm7.37 7.84c-3.063 0-5.542 2.48-5.542 5.543H24c0-3.06-2.48-5.543-5.543-5.543z"
      />
    </svg>
  )
}

function SalesforceLogo({ className }: { className?: string }) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Salesforce"
      className={className}
    >
      <title>Salesforce</title>
      <path
        fill="currentColor"
        d="M10.006 5.415a4.195 4.195 0 013.045-1.306c1.56 0 2.954.9 3.69 2.205.63-.3 1.35-.45 2.1-.45 2.85 0 5.159 2.34 5.159 5.22s-2.31 5.22-5.176 5.22c-.345 0-.69-.044-1.02-.104a3.75 3.75 0 01-3.3 1.95c-.6 0-1.155-.15-1.65-.375A4.314 4.314 0 018.88 20.4a4.302 4.302 0 01-4.05-2.82c-.27.062-.54.076-.825.076-2.204 0-4.005-1.8-4.005-4.05 0-1.5.811-2.805 2.01-3.51-.255-.57-.39-1.2-.39-1.846 0-2.58 2.1-4.65 4.65-4.65 1.53 0 2.85.705 3.72 1.8"
      />
    </svg>
  )
}

function HubSpotLogo({ className }: { className?: string }) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="HubSpot"
      className={className}
    >
      <title>HubSpot</title>
      <path
        fill="currentColor"
        d="M18.164 7.93V5.084a2.198 2.198 0 001.267-1.978v-.067A2.2 2.2 0 0017.238.845h-.067a2.2 2.2 0 00-2.193 2.193v.067a2.196 2.196 0 001.252 1.973l.013.006v2.852a6.22 6.22 0 00-2.969 1.31l.012-.01-7.828-6.095A2.497 2.497 0 104.3 4.656l-.012.006 7.697 5.991a6.176 6.176 0 00-1.038 3.446c0 1.343.425 2.588 1.147 3.607l-.013-.02-2.342 2.343a1.968 1.968 0 00-.58-.095h-.002a2.033 2.033 0 102.033 2.033 1.978 1.978 0 00-.1-.595l.005.014 2.317-2.317a6.247 6.247 0 104.782-11.134l-.036-.005zm-.964 9.378a3.206 3.206 0 113.215-3.207v.002a3.206 3.206 0 01-3.207 3.207z"
      />
    </svg>
  )
}

function LorealWordmark({ className }: { className?: string }) {
  return (
    <svg
      role="img"
      viewBox="0 0 100 20"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="L'Oréal"
      className={className}
    >
      <title>L&apos;Oréal</title>
      <text
        x="0"
        y="15"
        fill="currentColor"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="13"
        fontWeight="700"
        letterSpacing="0.14em"
      >
        L&apos;ORÉAL
      </text>
    </svg>
  )
}

const logoClass = "h-6 w-auto shrink-0 sm:h-7"

export function TrustLogosStrip() {
  return (
    <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-5 text-[#0F172A]/50">
      <DropboxLogo className={logoClass} />
      <ZendeskLogo className={logoClass} />
      <LorealWordmark className="h-5 w-[5.5rem] shrink-0 sm:h-6 sm:w-[6.25rem]" />
      <SalesforceLogo className={logoClass} />
      <HubSpotLogo className={logoClass} />
    </div>
  )
}
