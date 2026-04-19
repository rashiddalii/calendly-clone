"use client";

interface TimezonePickerSelectProps {
  id?: string;
  value: string;
  onChange: (tz: string) => void;
}

export const TIMEZONE_GROUPS: {
  label: string;
  zones: { value: string; label: string }[];
}[] = [
  {
    label: "America: North",
    zones: [
      { value: "Pacific/Honolulu", label: "Hawaii Time (HST): Honolulu" },
      { value: "America/Anchorage", label: "Alaska Time (AKST): Anchorage" },
      {
        value: "America/Los_Angeles",
        label: "Pacific Time (PT): Los Angeles, Seattle, Vancouver",
      },
      { value: "America/Tijuana", label: "Pacific Time: Tijuana" },
      {
        value: "America/Phoenix",
        label: "Mountain Time: Phoenix, Arizona (no DST)",
      },
      {
        value: "America/Denver",
        label: "Mountain Time (MT): Denver, Salt Lake City",
      },
      { value: "America/Edmonton", label: "Mountain Time: Calgary, Edmonton" },
      {
        value: "America/Chihuahua",
        label: "Mountain Time: Chihuahua, Mazatlan",
      },
      {
        value: "America/Chicago",
        label: "Central Time (CT): Chicago, Dallas, Mexico City",
      },
      { value: "America/Winnipeg", label: "Central Time: Winnipeg" },
      { value: "America/Regina", label: "Central Time: Saskatchewan (no DST)" },
      {
        value: "America/Mexico_City",
        label: "Central Time: Mexico City, Guadalajara",
      },
      {
        value: "America/New_York",
        label: "Eastern Time (ET): New York, Miami, Toronto",
      },
      { value: "America/Toronto", label: "Eastern Time: Toronto, Ottawa" },
      { value: "America/Detroit", label: "Eastern Time: Detroit" },
      {
        value: "America/Indiana/Indianapolis",
        label: "Eastern Time: Indianapolis (no DST)",
      },
      {
        value: "America/Halifax",
        label: "Atlantic Time (AT): Halifax, Nova Scotia",
      },
      {
        value: "America/Puerto_Rico",
        label: "Atlantic Time: San Juan, Puerto Rico (no DST)",
      },
      {
        value: "America/St_Johns",
        label: "Newfoundland Time: St. John's (NST)",
      },
    ],
  },
  {
    label: "America: Central & South",
    zones: [
      { value: "America/Guatemala", label: "Central America: Guatemala City" },
      { value: "America/El_Salvador", label: "Central America: San Salvador" },
      { value: "America/Managua", label: "Central America: Managua" },
      { value: "America/Costa_Rica", label: "Central America: San José" },
      { value: "America/Panama", label: "Eastern Time: Panama City (no DST)" },
      { value: "America/Bogota", label: "Colombia Time: Bogotá (COT)" },
      { value: "America/Lima", label: "Peru Time: Lima (PET)" },
      {
        value: "America/Guayaquil",
        label: "Ecuador Time: Quito, Guayaquil (ECT)",
      },
      { value: "America/Caracas", label: "Venezuela Time: Caracas (VET)" },
      { value: "America/La_Paz", label: "Bolivia Time: La Paz (BOT)" },
      { value: "America/Manaus", label: "Amazon Time: Manaus (AMT)" },
      { value: "America/Santiago", label: "Chile Time: Santiago (CLT)" },
      { value: "America/Asuncion", label: "Paraguay Time: Asunción (PYT)" },
      {
        value: "America/Argentina/Buenos_Aires",
        label: "Argentina Time: Buenos Aires (ART)",
      },
      { value: "America/Montevideo", label: "Uruguay Time: Montevideo (UYT)" },
      {
        value: "America/Sao_Paulo",
        label: "Brasília Time: São Paulo, Brasília (BRT)",
      },
      { value: "America/Recife", label: "Brasília Time: Recife, Fortaleza" },
      { value: "America/Belem", label: "Brasília Time: Belém" },
      { value: "America/Noronha", label: "Fernando de Noronha: UTC−02:00" },
    ],
  },
  {
    label: "Europe & Africa: West",
    zones: [
      { value: "Atlantic/Azores", label: "Azores Time (AZOT)" },
      { value: "Atlantic/Cape_Verde", label: "Cape Verde Time (CVT)" },
      { value: "Europe/Lisbon", label: "Western Europe: Lisbon (WET/WEST)" },
      { value: "Atlantic/Canary", label: "Western Europe: Canary Islands" },
      { value: "Europe/London", label: "London, Dublin, Edinburgh (GMT/BST)" },
      { value: "Europe/Dublin", label: "Ireland: Dublin (GMT/IST)" },
      { value: "Africa/Casablanca", label: "Morocco: Casablanca (WET)" },
      { value: "Africa/Monrovia", label: "West Africa: Monrovia (GMT)" },
      { value: "Africa/Abidjan", label: "West Africa: Abidjan, Dakar (GMT)" },
      { value: "Africa/Lagos", label: "West Africa: Lagos (WAT, UTC+01)" },
      { value: "Africa/Algiers", label: "Central Europe: Algiers (CET)" },
      { value: "Africa/Tunis", label: "North Africa: Tunis (CET)" },
    ],
  },
  {
    label: "Europe: Central",
    zones: [
      { value: "Europe/Paris", label: "Central Europe: Paris (CET/CEST)" },
      {
        value: "Europe/Berlin",
        label: "Central Europe: Berlin, Frankfurt (CET)",
      },
      { value: "Europe/Amsterdam", label: "Central Europe: Amsterdam (CET)" },
      { value: "Europe/Brussels", label: "Central Europe: Brussels (CET)" },
      {
        value: "Europe/Madrid",
        label: "Central Europe: Madrid, Barcelona (CET)",
      },
      { value: "Europe/Rome", label: "Central Europe: Rome, Milan (CET)" },
      { value: "Europe/Zurich", label: "Central Europe: Zurich, Bern (CET)" },
      { value: "Europe/Vienna", label: "Central Europe: Vienna (CET)" },
      { value: "Europe/Stockholm", label: "Central Europe: Stockholm (CET)" },
      { value: "Europe/Oslo", label: "Central Europe: Oslo (CET)" },
      { value: "Europe/Copenhagen", label: "Central Europe: Copenhagen (CET)" },
      { value: "Europe/Warsaw", label: "Central Europe: Warsaw (CET)" },
      { value: "Europe/Prague", label: "Central Europe: Prague (CET)" },
      { value: "Europe/Budapest", label: "Central Europe: Budapest (CET)" },
      { value: "Europe/Zagreb", label: "Central Europe: Zagreb (CET)" },
      { value: "Europe/Bratislava", label: "Central Europe: Bratislava (CET)" },
      { value: "Europe/Ljubljana", label: "Central Europe: Ljubljana (CET)" },
      { value: "Europe/Belgrade", label: "Central Europe: Belgrade (CET)" },
      { value: "Europe/Sarajevo", label: "Central Europe: Sarajevo (CET)" },
      { value: "Europe/Skopje", label: "Central Europe: Skopje (CET)" },
    ],
  },
  {
    label: "Europe: Eastern",
    zones: [
      { value: "Europe/Athens", label: "Eastern Europe: Athens (EET)" },
      { value: "Europe/Helsinki", label: "Eastern Europe: Helsinki (EET)" },
      { value: "Europe/Tallinn", label: "Eastern Europe: Tallinn (EET)" },
      { value: "Europe/Riga", label: "Eastern Europe: Riga (EET)" },
      { value: "Europe/Vilnius", label: "Eastern Europe: Vilnius (EET)" },
      { value: "Europe/Kyiv", label: "Eastern Europe: Kyiv (EET)" },
      { value: "Europe/Bucharest", label: "Eastern Europe: Bucharest (EET)" },
      { value: "Europe/Sofia", label: "Eastern Europe: Sofia (EET)" },
      { value: "Europe/Chisinau", label: "Eastern Europe: Chișinău (EET)" },
      { value: "Europe/Istanbul", label: "Turkey: Istanbul (TRT, UTC+03)" },
      { value: "Europe/Moscow", label: "Russia: Moscow (MSK, UTC+03)" },
      { value: "Europe/Minsk", label: "Belarus: Minsk (FET, UTC+03)" },
      {
        value: "Europe/Kaliningrad",
        label: "Russia: Kaliningrad (EET, UTC+02)",
      },
      { value: "Europe/Samara", label: "Russia: Samara (SAMT, UTC+04)" },
      { value: "Europe/Ulyanovsk", label: "Russia: Ulyanovsk (UTC+04)" },
    ],
  },
  {
    label: "Africa: East & South",
    zones: [
      { value: "Africa/Cairo", label: "Egypt: Cairo (EET, UTC+02)" },
      {
        value: "Africa/Johannesburg",
        label: "South Africa: Johannesburg (SAST, UTC+02)",
      },
      { value: "Africa/Harare", label: "Zimbabwe: Harare (CAT, UTC+02)" },
      { value: "Africa/Lusaka", label: "Zambia: Lusaka (CAT)" },
      { value: "Africa/Maputo", label: "Mozambique: Maputo (CAT)" },
      { value: "Africa/Khartoum", label: "Sudan: Khartoum (CAT, UTC+03)" },
      {
        value: "Africa/Addis_Ababa",
        label: "Ethiopia: Addis Ababa (EAT, UTC+03)",
      },
      { value: "Africa/Nairobi", label: "Kenya: Nairobi (EAT, UTC+03)" },
      { value: "Africa/Dar_es_Salaam", label: "Tanzania: Dar es Salaam (EAT)" },
      { value: "Africa/Kampala", label: "Uganda: Kampala (EAT)" },
    ],
  },
  {
    label: "Middle East",
    zones: [
      { value: "Asia/Jerusalem", label: "Israel: Jerusalem (IST, UTC+02/+03)" },
      { value: "Asia/Amman", label: "Jordan: Amman (AST, UTC+03)" },
      { value: "Asia/Beirut", label: "Lebanon: Beirut (EET, UTC+02/+03)" },
      { value: "Asia/Damascus", label: "Syria: Damascus (UTC+03)" },
      { value: "Asia/Baghdad", label: "Iraq: Baghdad (AST, UTC+03)" },
      { value: "Asia/Kuwait", label: "Kuwait: Kuwait City (AST, UTC+03)" },
      { value: "Asia/Riyadh", label: "Saudi Arabia: Riyadh (AST, UTC+03)" },
      { value: "Asia/Qatar", label: "Qatar: Doha (AST, UTC+03)" },
      { value: "Asia/Bahrain", label: "Bahrain: Manama (AST, UTC+03)" },
      { value: "Asia/Aden", label: "Yemen: Aden (AST, UTC+03)" },
      { value: "Asia/Dubai", label: "UAE: Dubai, Abu Dhabi (GST, UTC+04)" },
      { value: "Asia/Muscat", label: "Oman: Muscat (GST, UTC+04)" },
      { value: "Asia/Tehran", label: "Iran: Tehran (IRST, UTC+03:30)" },
      { value: "Asia/Kabul", label: "Afghanistan: Kabul (AFT, UTC+04:30)" },
    ],
  },
  {
    label: "Asia: South",
    zones: [
      { value: "Asia/Yerevan", label: "Armenia: Yerevan (AMT, UTC+04)" },
      { value: "Asia/Baku", label: "Azerbaijan: Baku (AZT, UTC+04)" },
      { value: "Asia/Tbilisi", label: "Georgia: Tbilisi (GET, UTC+04)" },
      {
        value: "Asia/Karachi",
        label: "Pakistan: Karachi, Islamabad (PKT, UTC+05)",
      },
      { value: "Asia/Tashkent", label: "Uzbekistan: Tashkent (UZT, UTC+05)" },
      { value: "Asia/Samarkand", label: "Uzbekistan: Samarkand (UZT)" },
      { value: "Asia/Dushanbe", label: "Tajikistan: Dushanbe (TJT, UTC+05)" },
      { value: "Asia/Ashgabat", label: "Turkmenistan: Ashgabat (TMT, UTC+05)" },
      {
        value: "Asia/Yekaterinburg",
        label: "Russia: Yekaterinburg (YEKT, UTC+05)",
      },
      {
        value: "Asia/Kolkata",
        label: "India: Mumbai, New Delhi, Kolkata (IST, UTC+05:30)",
      },
      { value: "Asia/Colombo", label: "Sri Lanka: Colombo (SLST, UTC+05:30)" },
      { value: "Asia/Kathmandu", label: "Nepal: Kathmandu (NPT, UTC+05:45)" },
      { value: "Asia/Dhaka", label: "Bangladesh: Dhaka (BST, UTC+06)" },
      { value: "Asia/Almaty", label: "Kazakhstan: Almaty (ALMT, UTC+06)" },
      { value: "Asia/Bishkek", label: "Kyrgyzstan: Bishkek (KGT, UTC+06)" },
      {
        value: "Asia/Novosibirsk",
        label: "Russia: Novosibirsk (NOVT, UTC+07)",
      },
      { value: "Asia/Omsk", label: "Russia: Omsk (OMST, UTC+06)" },
      { value: "Asia/Rangoon", label: "Myanmar: Yangon (MMT, UTC+06:30)" },
      { value: "Asia/Thimphu", label: "Bhutan: Thimphu (BTT, UTC+06)" },
    ],
  },
  {
    label: "Asia: Southeast",
    zones: [
      { value: "Asia/Bangkok", label: "Thailand: Bangkok (ICT, UTC+07)" },
      {
        value: "Asia/Ho_Chi_Minh",
        label: "Vietnam: Ho Chi Minh City, Hanoi (ICT)",
      },
      { value: "Asia/Phnom_Penh", label: "Cambodia: Phnom Penh (ICT)" },
      { value: "Asia/Vientiane", label: "Laos: Vientiane (ICT)" },
      {
        value: "Asia/Krasnoyarsk",
        label: "Russia: Krasnoyarsk (KRAT, UTC+07)",
      },
      {
        value: "Asia/Jakarta",
        label: "Indonesia: Jakarta, West Java (WIB, UTC+07)",
      },
      {
        value: "Asia/Kuala_Lumpur",
        label: "Malaysia: Kuala Lumpur (MYT, UTC+08)",
      },
      { value: "Asia/Singapore", label: "Singapore (SGT, UTC+08)" },
      {
        value: "Asia/Brunei",
        label: "Brunei: Bandar Seri Begawan (BNT, UTC+08)",
      },
      { value: "Asia/Manila", label: "Philippines: Manila (PHT, UTC+08)" },
      {
        value: "Asia/Makassar",
        label: "Indonesia: Makassar, Bali (WITA, UTC+08)",
      },
      { value: "Asia/Jayapura", label: "Indonesia: Jayapura (WIT, UTC+09)" },
    ],
  },
  {
    label: "Asia: East",
    zones: [
      {
        value: "Asia/Shanghai",
        label: "China: Shanghai, Beijing, Chongqing (CST, UTC+08)",
      },
      { value: "Asia/Chongqing", label: "China: Chongqing (CST)" },
      { value: "Asia/Urumqi", label: "China: Urumqi (XJT, UTC+06)" },
      { value: "Asia/Hong_Kong", label: "Hong Kong (HKT, UTC+08)" },
      { value: "Asia/Macau", label: "Macau (CST, UTC+08)" },
      { value: "Asia/Taipei", label: "Taiwan: Taipei (CST, UTC+08)" },
      {
        value: "Asia/Ulaanbaatar",
        label: "Mongolia: Ulaanbaatar (ULAT, UTC+08)",
      },
      { value: "Asia/Irkutsk", label: "Russia: Irkutsk (IRKT, UTC+08)" },
      { value: "Asia/Seoul", label: "South Korea: Seoul (KST, UTC+09)" },
      {
        value: "Asia/Pyongyang",
        label: "North Korea: Pyongyang (KST, UTC+09)",
      },
      {
        value: "Asia/Tokyo",
        label: "Japan: Tokyo, Osaka, Sapporo (JST, UTC+09)",
      },
      { value: "Asia/Yakutsk", label: "Russia: Yakutsk (YAKT, UTC+09)" },
      {
        value: "Asia/Vladivostok",
        label: "Russia: Vladivostok (VLAT, UTC+10)",
      },
      { value: "Asia/Magadan", label: "Russia: Magadan (MAGT, UTC+11)" },
      {
        value: "Asia/Kamchatka",
        label: "Russia: Petropavlovsk-Kamchatsky (PETT, UTC+12)",
      },
      { value: "Asia/Srednekolymsk", label: "Russia: Srednekolymsk (UTC+11)" },
    ],
  },
  {
    label: "Australia & Pacific",
    zones: [
      { value: "Australia/Perth", label: "Australia: Perth (AWST, UTC+08)" },
      {
        value: "Australia/Eucla",
        label: "Australia: Eucla (ACWST, UTC+08:45)",
      },
      {
        value: "Australia/Darwin",
        label: "Australia: Darwin (ACST, UTC+09:30)",
      },
      {
        value: "Australia/Adelaide",
        label: "Australia: Adelaide (ACST/ACDT, UTC+09:30)",
      },
      {
        value: "Australia/Brisbane",
        label: "Australia: Brisbane (AEST, UTC+10, no DST)",
      },
      {
        value: "Australia/Melbourne",
        label: "Australia: Melbourne, Canberra (AEST/AEDT)",
      },
      {
        value: "Australia/Sydney",
        label: "Australia: Sydney (AEST/AEDT, UTC+10/11)",
      },
      {
        value: "Australia/Hobart",
        label: "Australia: Hobart, Tasmania (AEST/AEDT)",
      },
      {
        value: "Australia/Lord_Howe",
        label: "Australia: Lord Howe Island (UTC+10:30/+11)",
      },
      {
        value: "Pacific/Port_Moresby",
        label: "Papua New Guinea: Port Moresby (PGT, UTC+10)",
      },
      {
        value: "Pacific/Guam",
        label: "Guam, Northern Mariana Islands (ChST, UTC+10)",
      },
      { value: "Pacific/Noumea", label: "New Caledonia: Noumea (NCT, UTC+11)" },
      { value: "Pacific/Guadalcanal", label: "Solomon Islands (SBT, UTC+11)" },
      { value: "Pacific/Efate", label: "Vanuatu: Port Vila (VUT, UTC+11)" },
      { value: "Pacific/Fiji", label: "Fiji: Suva (FJT, UTC+12)" },
      {
        value: "Pacific/Auckland",
        label: "New Zealand: Auckland, Wellington (NZST/NZDT)",
      },
      {
        value: "Pacific/Chatham",
        label: "New Zealand: Chatham Islands (CHAST, UTC+12:45)",
      },
      { value: "Pacific/Tongatapu", label: "Tonga: Nukualofa (TOT, UTC+13)" },
      { value: "Pacific/Apia", label: "Samoa: Apia (WST, UTC+13)" },
      { value: "Pacific/Fakaofo", label: "Tokelau (TKT, UTC+13)" },
      {
        value: "Pacific/Kiritimati",
        label: "Kiribati: Line Islands (LINT, UTC+14)",
      },
      { value: "Pacific/Midway", label: "Midway Island (SST, UTC−11)" },
      {
        value: "Pacific/Pago_Pago",
        label: "American Samoa: Pago Pago (SST, UTC−11)",
      },
      {
        value: "Pacific/Tahiti",
        label: "French Polynesia: Tahiti (TAHT, UTC−10)",
      },
      {
        value: "Pacific/Marquesas",
        label: "French Polynesia: Marquesas (MART, UTC−09:30)",
      },
      {
        value: "Pacific/Gambier",
        label: "French Polynesia: Gambier Islands (GAMT, UTC−09)",
      },
    ],
  },
  {
    label: "UTC",
    zones: [
      { value: "UTC", label: "UTC: Coordinated Universal Time (UTC+00)" },
    ],
  },
];

// Sort zones within each group alphabetically by label
for (const group of TIMEZONE_GROUPS) {
  group.zones.sort((a, b) => a.label.localeCompare(b.label));
}

// Flat list for fallback lookup
export const ALL_TIMEZONES = TIMEZONE_GROUPS.flatMap((g) => g.zones);

// Globally sorted flat list (used by onboarding flat select)
export const ALL_TIMEZONES_SORTED = [...ALL_TIMEZONES].sort((a, b) =>
  a.label.localeCompare(b.label)
);

export function TimezonePickerSelect({
  id,
  value,
  onChange,
}: TimezonePickerSelectProps) {
  const inList = ALL_TIMEZONES.some((z) => z.value === value);

  return (
    <div className="relative max-w-full">
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Select your timezone"
        className={[
          "h-touch w-full max-w-full appearance-none truncate rounded-[0.75rem] bg-[#dae6ff] px-3 py-2.5 pr-9",
          "text-sm text-[#1c2b4b] transition-all duration-150",
          "focus:bg-[#ffffff] focus:outline-none",
          "focus:ring-2 focus:ring-[rgba(0,107,255,0.3)]",
        ].join(" ")}
      >
        {!inList && <option value={value}>{value}</option>}
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

      <div
        className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#4b5a6d]"
        aria-hidden="true"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  );
}
