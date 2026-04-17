"use client"

// A lightweight timezone selector with ~60 common IANA zones grouped by region.
// No external packages — just a <select> with optgroups.

interface TimezonePickerSelectProps {
  id?: string
  value: string
  onChange: (tz: string) => void
}

export const TIMEZONE_GROUPS: { label: string; zones: { value: string; label: string }[] }[] = [
  {
    label: "America",
    zones: [
      { value: "America/Anchorage", label: "Alaska (AKST/AKDT)" },
      { value: "America/Chicago", label: "Central Time (CT)" },
      { value: "America/Denver", label: "Mountain Time (MT)" },
      { value: "America/Halifax", label: "Atlantic Time (AT)" },
      { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
      { value: "America/Mexico_City", label: "Mexico City (CST)" },
      { value: "America/New_York", label: "Eastern Time (ET)" },
      { value: "America/Phoenix", label: "Arizona (MST)" },
      { value: "America/Santiago", label: "Santiago (CLT)" },
      { value: "America/Sao_Paulo", label: "São Paulo (BRT)" },
      { value: "America/Toronto", label: "Toronto (ET)" },
      { value: "America/Vancouver", label: "Vancouver (PT)" },
      { value: "Pacific/Honolulu", label: "Hawaii (HST)" },
    ],
  },
  {
    label: "Europe",
    zones: [
      { value: "Europe/Amsterdam", label: "Amsterdam (CET)" },
      { value: "Europe/Athens", label: "Athens (EET)" },
      { value: "Europe/Berlin", label: "Berlin (CET)" },
      { value: "Europe/Brussels", label: "Brussels (CET)" },
      { value: "Europe/Dublin", label: "Dublin (GMT/IST)" },
      { value: "Europe/Helsinki", label: "Helsinki (EET)" },
      { value: "Europe/Istanbul", label: "Istanbul (TRT)" },
      { value: "Europe/Kyiv", label: "Kyiv (EET)" },
      { value: "Europe/Lisbon", label: "Lisbon (WET)" },
      { value: "Europe/London", label: "London (GMT/BST)" },
      { value: "Europe/Madrid", label: "Madrid (CET)" },
      { value: "Europe/Moscow", label: "Moscow (MSK)" },
      { value: "Europe/Paris", label: "Paris (CET)" },
      { value: "Europe/Prague", label: "Prague (CET)" },
      { value: "Europe/Rome", label: "Rome (CET)" },
      { value: "Europe/Stockholm", label: "Stockholm (CET)" },
      { value: "Europe/Warsaw", label: "Warsaw (CET)" },
      { value: "Europe/Zurich", label: "Zurich (CET)" },
    ],
  },
  {
    label: "Asia",
    zones: [
      { value: "Asia/Almaty", label: "Almaty (ALMT)" },
      { value: "Asia/Bangkok", label: "Bangkok (ICT)" },
      { value: "Asia/Colombo", label: "Colombo (IST)" },
      { value: "Asia/Dubai", label: "Dubai (GST)" },
      { value: "Asia/Hong_Kong", label: "Hong Kong (HKT)" },
      { value: "Asia/Jakarta", label: "Jakarta (WIB)" },
      { value: "Asia/Karachi", label: "Karachi (PKT)" },
      { value: "Asia/Kolkata", label: "Mumbai / Kolkata (IST)" },
      { value: "Asia/Kuwait", label: "Kuwait (AST)" },
      { value: "Asia/Manila", label: "Manila (PHT)" },
      { value: "Asia/Riyadh", label: "Riyadh (AST)" },
      { value: "Asia/Seoul", label: "Seoul (KST)" },
      { value: "Asia/Shanghai", label: "Shanghai / Beijing (CST)" },
      { value: "Asia/Singapore", label: "Singapore (SGT)" },
      { value: "Asia/Taipei", label: "Taipei (CST)" },
      { value: "Asia/Tashkent", label: "Tashkent (UZT)" },
      { value: "Asia/Tehran", label: "Tehran (IRST)" },
      { value: "Asia/Tokyo", label: "Tokyo (JST)" },
    ],
  },
  {
    label: "Africa",
    zones: [
      { value: "Africa/Cairo", label: "Cairo (EET)" },
      { value: "Africa/Casablanca", label: "Casablanca (WET)" },
      { value: "Africa/Johannesburg", label: "Johannesburg (SAST)" },
      { value: "Africa/Lagos", label: "Lagos (WAT)" },
      { value: "Africa/Nairobi", label: "Nairobi (EAT)" },
    ],
  },
  {
    label: "Pacific",
    zones: [
      { value: "Pacific/Auckland", label: "Auckland (NZST)" },
      { value: "Pacific/Fiji", label: "Fiji (FJT)" },
      { value: "Pacific/Guam", label: "Guam (ChST)" },
      { value: "Pacific/Midway", label: "Midway (SST)" },
    ],
  },
  {
    label: "Other",
    zones: [
      { value: "UTC", label: "UTC (Coordinated Universal Time)" },
      { value: "Australia/Adelaide", label: "Adelaide (ACST)" },
      { value: "Australia/Brisbane", label: "Brisbane (AEST)" },
      { value: "Australia/Melbourne", label: "Melbourne (AEST)" },
      { value: "Australia/Perth", label: "Perth (AWST)" },
      { value: "Australia/Sydney", label: "Sydney (AEST)" },
    ],
  },
]

// Flat list for fallback lookup
export const ALL_TIMEZONES = TIMEZONE_GROUPS.flatMap((g) => g.zones)

export function TimezonePickerSelect({
  id,
  value,
  onChange,
}: TimezonePickerSelectProps) {
  // If the current value isn't in our list, add it as the first option
  const inList = ALL_TIMEZONES.some((z) => z.value === value)

  return (
    <div className="relative">
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Select your timezone"
        className={[
          "w-full appearance-none rounded-[0.75rem] bg-[#eae7f1] px-3 py-2.5 pr-9",
          "text-sm text-[#32323b] transition-all duration-150",
          "focus:bg-[#ffffff] focus:outline-none",
          "focus:ring-2 focus:ring-[rgba(74,75,215,0.3)]",
        ].join(" ")}
      >
        {!inList && (
          <option value={value}>{value}</option>
        )}
        {TIMEZONE_GROUPS.map((group) => (
          <optgroup key={group.label} label={group.label}>
            {group.zones.map((zone) => (
              <option key={zone.value} value={zone.value}>
                {zone.label}
              </option>
            ))}
          </optgroup>
        ))}
      </select>

      {/* Custom chevron */}
      <div
        className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#5f5e68]"
        aria-hidden="true"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  )
}
