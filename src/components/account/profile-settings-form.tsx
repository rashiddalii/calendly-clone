"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { Camera } from "lucide-react";
import { updateProfileAction, uploadImageAction } from "@/lib/actions/user";
import {
  TIMEZONE_GROUPS,
  ALL_TIMEZONES,
} from "@/components/booking/timezone-picker";
import { LANGUAGES, DATE_FORMATS, TIME_FORMATS } from "@/lib/validators/user";
import type { Language, DateFormat, TimeFormat } from "@/lib/validators/user";
import { cn } from "@/lib/utils";

interface ProfileSettingsFormProps {
  defaultValues: {
    name: string;
    username: string;
    bio: string;
    timezone: string;
    image: string | null;
    email: string;
    language: Language;
    dateFormat: DateFormat;
    timeFormat: TimeFormat;
    country: string | null;
  };
}

type FieldErrors = Partial<
  Record<"name" | "username" | "bio" | "timezone" | "country", string>
>;

const LANGUAGE_LABELS: Record<Language, string> = {
  "en-US": "English (US)",
  "en-GB": "English (UK)",
  es: "Spanish",
  fr: "French",
  de: "German",
  pt: "Portuguese",
  ja: "Japanese",
};

const DATE_FORMAT_LABELS: Record<DateFormat, string> = {
  "MM/DD/YYYY": "MM/DD/YYYY",
  "DD/MM/YYYY": "DD/MM/YYYY",
  "YYYY-MM-DD": "YYYY-MM-DD",
};

const TIME_FORMAT_LABELS: Record<TimeFormat, string> = {
  "12h": "12h (am/pm)",
  "24h": "24h",
};

const COUNTRIES: { code: string; name: string }[] = [
  { code: "AF", name: "Afghanistan" },
  { code: "AL", name: "Albania" },
  { code: "DZ", name: "Algeria" },
  { code: "AR", name: "Argentina" },
  { code: "AU", name: "Australia" },
  { code: "AT", name: "Austria" },
  { code: "BD", name: "Bangladesh" },
  { code: "BE", name: "Belgium" },
  { code: "BR", name: "Brazil" },
  { code: "CA", name: "Canada" },
  { code: "CL", name: "Chile" },
  { code: "CN", name: "China" },
  { code: "CO", name: "Colombia" },
  { code: "EG", name: "Egypt" },
  { code: "ET", name: "Ethiopia" },
  { code: "FI", name: "Finland" },
  { code: "FR", name: "France" },
  { code: "DE", name: "Germany" },
  { code: "GH", name: "Ghana" },
  { code: "GR", name: "Greece" },
  { code: "HU", name: "Hungary" },
  { code: "IN", name: "India" },
  { code: "ID", name: "Indonesia" },
  { code: "IR", name: "Iran" },
  { code: "IQ", name: "Iraq" },
  { code: "IE", name: "Ireland" },
  { code: "IL", name: "Israel" },
  { code: "IT", name: "Italy" },
  { code: "JP", name: "Japan" },
  { code: "JO", name: "Jordan" },
  { code: "KE", name: "Kenya" },
  { code: "MY", name: "Malaysia" },
  { code: "MX", name: "Mexico" },
  { code: "MA", name: "Morocco" },
  { code: "NL", name: "Netherlands" },
  { code: "NZ", name: "New Zealand" },
  { code: "NG", name: "Nigeria" },
  { code: "NO", name: "Norway" },
  { code: "PK", name: "Pakistan" },
  { code: "PE", name: "Peru" },
  { code: "PH", name: "Philippines" },
  { code: "PL", name: "Poland" },
  { code: "PT", name: "Portugal" },
  { code: "RO", name: "Romania" },
  { code: "RU", name: "Russia" },
  { code: "SA", name: "Saudi Arabia" },
  { code: "ZA", name: "South Africa" },
  { code: "KR", name: "South Korea" },
  { code: "ES", name: "Spain" },
  { code: "LK", name: "Sri Lanka" },
  { code: "SE", name: "Sweden" },
  { code: "CH", name: "Switzerland" },
  { code: "TW", name: "Taiwan" },
  { code: "TH", name: "Thailand" },
  { code: "TR", name: "Turkey" },
  { code: "UG", name: "Uganda" },
  { code: "UA", name: "Ukraine" },
  { code: "AE", name: "United Arab Emirates" },
  { code: "GB", name: "United Kingdom" },
  { code: "US", name: "United States" },
  { code: "VE", name: "Venezuela" },
  { code: "VN", name: "Vietnam" },
];

const inputCls = (hasError = false) =>
  cn(
    "w-full rounded-lg border border-[#E5E7EB] bg-white px-3 py-2.5 text-sm text-[#1c2b4b] outline-none transition-all duration-150",
    "placeholder:text-[#9CA3AF]",
    "focus:border-[#006BFF] focus:ring-2 focus:ring-[rgba(0,107,255,0.2)]",
    hasError && "border-[#a8364b] ring-2 ring-[rgba(168,54,75,0.2)]"
  );

const selectCls = (hasError = false) =>
  cn(
    "w-full appearance-none rounded-lg border border-[#E5E7EB] bg-white px-3 py-2.5 pr-9 text-sm text-[#1c2b4b] outline-none transition-all duration-150",
    "focus:border-[#006BFF] focus:ring-2 focus:ring-[rgba(0,107,255,0.2)]",
    hasError && "border-[#a8364b] ring-2 ring-[rgba(168,54,75,0.2)]"
  );

function SelectChevron() {
  return (
    <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#6B7280]">
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
  );
}

function Label({
  children,
  htmlFor,
  required,
}: {
  children: React.ReactNode;
  htmlFor: string;
  required?: boolean;
}) {
  return (
    <label htmlFor={htmlFor} className="text-sm font-medium text-[#374151]">
      {children}
      {required && <span className="ml-0.5 text-[#a8364b]">*</span>}
    </label>
  );
}

export function ProfileSettingsForm({
  defaultValues,
}: ProfileSettingsFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const [isUploading, setIsUploading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    defaultValues.image
  );
  const [values, setValues] = useState({
    name: defaultValues.name,
    username: defaultValues.username,
    bio: defaultValues.bio,
    timezone: defaultValues.timezone,
    language: defaultValues.language,
    dateFormat: defaultValues.dateFormat,
    timeFormat: defaultValues.timeFormat,
    country: defaultValues.country ?? "",
  });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const fmt = () =>
      new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    const timer = window.setTimeout(() => setCurrentTime(fmt()), 0);
    const id = window.setInterval(() => setCurrentTime(fmt()), 60_000);
    return () => {
      window.clearTimeout(timer);
      window.clearInterval(id);
    };
  }, []);

  const inList = ALL_TIMEZONES.some((z) => z.value === values.timezone);

  const set =
    (field: keyof typeof values) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      setValues((prev) => ({ ...prev, [field]: e.target.value }));
      if (field in fieldErrors)
        setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
      setSuccess(false);
    };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Local preview immediately
    setAvatarPreview(URL.createObjectURL(file));
    setIsUploading(true);

    const fd = new FormData();
    fd.set("file", file);
    const result = await uploadImageAction(fd, "avatar");

    setIsUploading(false);
    if ("error" in result) {
      setGlobalError(result.error);
      setAvatarPreview(defaultValues.image); // revert preview
    } else {
      setAvatarPreview(result.url);
      router.refresh();
    }
    // Reset input so the same file can be re-selected
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFieldErrors({});
    setGlobalError(null);
    setSuccess(false);

    startTransition(async () => {
      const result = await updateProfileAction({
        name: values.name,
        username: values.username,
        bio: values.bio || undefined,
        timezone: values.timezone,
        language: values.language as Language,
        dateFormat: values.dateFormat as DateFormat,
        timeFormat: values.timeFormat as TimeFormat,
        country: values.country || null,
      });
      if (result.status === "error") {
        setGlobalError(result.error);
        if (result.fieldErrors)
          setFieldErrors(result.fieldErrors as FieldErrors);
      } else {
        setSuccess(true);
        router.refresh();
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* Avatar */}
      <div className="flex items-center gap-5">
        <div className="relative">
          <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-[#E5EDFF]">
            {avatarPreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarPreview}
                alt={defaultValues.name || "Avatar"}
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <span className="text-2xl font-semibold text-[#006BFF]">
                {defaultValues.name?.[0]?.toUpperCase() ??
                  defaultValues.email?.[0]?.toUpperCase() ??
                  "?"}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="absolute bottom-0 right-0 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-[#006BFF] text-white shadow transition-colors hover:bg-[#0056CC] disabled:opacity-60"
            title="Upload picture"
          >
            <Camera className="h-3.5 w-3.5" />
          </button>
        </div>
        <div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="cursor-pointer rounded-lg border border-[#E5E7EB] bg-white px-4 py-2 text-sm font-medium text-[#374151] transition-colors hover:bg-[#F9FAFB] disabled:opacity-60"
          >
            {isUploading ? "Uploading..." : "Upload picture"}
          </button>
          <p className="mt-1.5 text-xs text-[#9CA3AF]">
            JPG, GIF or PNG. Max size of 5MB.
          </p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/gif,image/png,image/webp"
          className="sr-only"
          onChange={handleAvatarUpload}
        />
      </div>

      {/* Name */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name" required>
          Name
        </Label>
        <input
          id="name"
          type="text"
          value={values.name}
          onChange={set("name")}
          required
          maxLength={120}
          placeholder="Your full name"
          className={inputCls(!!fieldErrors.name)}
        />
        {fieldErrors.name && (
          <p className="text-xs text-[#a8364b]">{fieldErrors.name}</p>
        )}
      </div>

      {/* Welcome Message */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="bio">Welcome Message</Label>
        <textarea
          id="bio"
          value={values.bio}
          onChange={set("bio")}
          maxLength={500}
          rows={3}
          placeholder="Welcome to my scheduling page. Please follow the instructions to add an event to my calendar."
          className={cn(inputCls(!!fieldErrors.bio), "resize-none")}
        />
        {fieldErrors.bio && (
          <p className="text-xs text-[#a8364b]">{fieldErrors.bio}</p>
        )}
      </div>

      {/* Language */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="language">Language</Label>
        <div className="relative">
          <select
            id="language"
            value={values.language}
            onChange={set("language")}
            className={selectCls()}
          >
            {LANGUAGES.map((l) => (
              <option key={l} value={l}>
                {LANGUAGE_LABELS[l]}
              </option>
            ))}
          </select>
          <SelectChevron />
        </div>
      </div>

      {/* Date Format + Time Format */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="dateFormat">Date Format</Label>
          <div className="relative">
            <select
              id="dateFormat"
              value={values.dateFormat}
              onChange={set("dateFormat")}
              className={selectCls()}
            >
              {DATE_FORMATS.map((f) => (
                <option key={f} value={f}>
                  {DATE_FORMAT_LABELS[f]}
                </option>
              ))}
            </select>
            <SelectChevron />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="timeFormat">Time Format</Label>
          <div className="relative">
            <select
              id="timeFormat"
              value={values.timeFormat}
              onChange={set("timeFormat")}
              className={selectCls()}
            >
              {TIME_FORMATS.map((f) => (
                <option key={f} value={f}>
                  {TIME_FORMAT_LABELS[f]}
                </option>
              ))}
            </select>
            <SelectChevron />
          </div>
        </div>
      </div>

      {/* Country */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="country">Country</Label>
        <div className="relative">
          <select
            id="country"
            value={values.country}
            onChange={set("country")}
            className={selectCls(!!fieldErrors.country)}
          >
            <option value="">Select country...</option>
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </select>
          <SelectChevron />
        </div>
        {fieldErrors.country && (
          <p className="text-xs text-[#a8364b]">{fieldErrors.country}</p>
        )}
      </div>

      {/* Time Zone */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="timezone">Time Zone</Label>
          {currentTime && (
            <span className="text-xs text-[#6B7280]">
              Current Time: {currentTime}
            </span>
          )}
        </div>
        <div className="relative">
          <select
            id="timezone"
            value={values.timezone}
            onChange={set("timezone")}
            className={selectCls(!!fieldErrors.timezone)}
          >
            {!inList && (
              <option value={values.timezone}>{values.timezone}</option>
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
          <SelectChevron />
        </div>
        {fieldErrors.timezone && (
          <p className="text-xs text-[#a8364b]">{fieldErrors.timezone}</p>
        )}
      </div>

      {/* Global error */}
      {globalError && !Object.values(fieldErrors).some(Boolean) && (
        <p className="rounded-lg bg-[rgba(168,54,75,0.08)] px-3 py-2.5 text-sm text-[#a8364b]">
          {globalError}
        </p>
      )}

      {/* Success */}
      {success && (
        <p className="rounded-lg bg-[rgba(0,107,255,0.08)] px-3 py-2.5 text-sm text-[#006BFF]">
          Profile updated successfully.
        </p>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between border-t border-[#E5E7EB] pt-6">
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={isPending}
            className="cursor-pointer rounded-lg bg-[#006BFF] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#0056CC] disabled:opacity-60"
          >
            {isPending ? "Saving..." : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="cursor-pointer rounded-lg border border-[#E5E7EB] bg-white px-5 py-2.5 text-sm font-medium text-[#374151] transition-colors hover:bg-[#F9FAFB]"
          >
            Cancel
          </button>
        </div>
        <button
          type="button"
          className="cursor-pointer rounded-lg bg-[#EF4444] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#DC2626]"
        >
          Delete Account
        </button>
      </div>
    </form>
  );
}
