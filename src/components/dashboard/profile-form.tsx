"use client"

import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { updateProfileAction } from "@/lib/actions/user"
import { TIMEZONE_GROUPS, ALL_TIMEZONES } from "@/components/booking/timezone-picker"

interface ProfileFormProps {
  defaultValues: {
    name: string
    username: string
    bio: string
    timezone: string
  }
}

type FieldErrors = Partial<Record<"name" | "username" | "bio" | "timezone", string>>

export function ProfileForm({ defaultValues }: ProfileFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [values, setValues] = useState(defaultValues)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [globalError, setGlobalError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const inList = ALL_TIMEZONES.some((z) => z.value === values.timezone)

  const handleChange = (
    field: keyof typeof values,
    value: string,
  ) => {
    setValues((prev) => ({ ...prev, [field]: value }))
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }))
    }
    setSuccess(false)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFieldErrors({})
    setGlobalError(null)
    setSuccess(false)

    startTransition(async () => {
      const result = await updateProfileAction({
        name: values.name,
        username: values.username,
        bio: values.bio || undefined,
        timezone: values.timezone,
      })
      if (result.status === "error") {
        setGlobalError(result.error)
        if (result.fieldErrors) {
          setFieldErrors(result.fieldErrors as FieldErrors)
        }
      } else {
        setSuccess(true)
        router.refresh()
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Full name */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="name"
          className="text-xs font-medium text-[#5f5e68]"
        >
          Full name <span className="text-[#a8364b]">*</span>
        </label>
        <input
          id="name"
          type="text"
          value={values.name}
          onChange={(e) => handleChange("name", e.target.value)}
          required
          maxLength={120}
          placeholder="Your full name"
          className={[
            "w-full rounded-[0.75rem] px-3 py-2.5 text-sm text-[#32323b]",
            "bg-[#eae7f1] transition-all duration-150",
            "focus:bg-[#ffffff] focus:outline-none focus:ring-2 focus:ring-[rgba(74,75,215,0.3)]",
            fieldErrors.name ? "ring-2 ring-[rgba(168,54,75,0.5)]" : "",
          ].join(" ")}
        />
        {fieldErrors.name && (
          <p className="text-xs text-[#a8364b]">{fieldErrors.name}</p>
        )}
      </div>

      {/* Username */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="username"
          className="text-xs font-medium text-[#5f5e68]"
        >
          Username <span className="text-[#a8364b]">*</span>
        </label>
        <div className="relative flex items-center">
          <span className="absolute left-3 text-sm text-[#5f5e68] pointer-events-none select-none">
            fluid.app/
          </span>
          <input
            id="username"
            type="text"
            value={values.username}
            onChange={(e) =>
              handleChange("username", e.target.value.toLowerCase())
            }
            required
            minLength={3}
            maxLength={32}
            placeholder="yourname"
            className={[
              "w-full rounded-[0.75rem] py-2.5 pr-3 text-sm text-[#32323b]",
              "bg-[#eae7f1] transition-all duration-150",
              "focus:bg-[#ffffff] focus:outline-none focus:ring-2 focus:ring-[rgba(74,75,215,0.3)]",
              fieldErrors.username ? "ring-2 ring-[rgba(168,54,75,0.5)]" : "",
            ].join(" ")}
            style={{ paddingLeft: "calc(0.75rem + 4.75rem)" }}
          />
        </div>
        {fieldErrors.username ? (
          <p className="text-xs text-[#a8364b]">{fieldErrors.username}</p>
        ) : (
          <p className="text-xs text-[#5f5e68]">
            Your public booking link: fluid.app/{values.username || "yourname"}
          </p>
        )}
      </div>

      {/* Bio */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="bio"
          className="text-xs font-medium text-[#5f5e68]"
        >
          Bio{" "}
          <span className="text-[#7b7984] font-normal">(optional)</span>
        </label>
        <textarea
          id="bio"
          value={values.bio}
          onChange={(e) => handleChange("bio", e.target.value)}
          maxLength={500}
          rows={3}
          placeholder="A short bio visible on your booking page"
          className={[
            "w-full resize-none rounded-[0.75rem] px-3 py-2.5 text-sm text-[#32323b]",
            "bg-[#eae7f1] transition-all duration-150",
            "focus:bg-[#ffffff] focus:outline-none focus:ring-2 focus:ring-[rgba(74,75,215,0.3)]",
            fieldErrors.bio ? "ring-2 ring-[rgba(168,54,75,0.5)]" : "",
          ].join(" ")}
        />
        <p className="text-xs text-[#7b7984] text-right">
          {values.bio.length}/500
        </p>
        {fieldErrors.bio && (
          <p className="text-xs text-[#a8364b]">{fieldErrors.bio}</p>
        )}
      </div>

      {/* Timezone */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="timezone"
          className="text-xs font-medium text-[#5f5e68]"
        >
          Timezone <span className="text-[#a8364b]">*</span>
        </label>
        <div className="relative">
          <select
            id="timezone"
            value={values.timezone}
            onChange={(e) => handleChange("timezone", e.target.value)}
            className={[
              "w-full appearance-none rounded-[0.75rem] bg-[#eae7f1] px-3 py-2.5 pr-9",
              "text-sm text-[#32323b] transition-all duration-150",
              "focus:bg-[#ffffff] focus:outline-none focus:ring-2 focus:ring-[rgba(74,75,215,0.3)]",
              fieldErrors.timezone ? "ring-2 ring-[rgba(168,54,75,0.5)]" : "",
            ].join(" ")}
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
          <div
            className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#5f5e68]"
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
        {fieldErrors.timezone && (
          <p className="text-xs text-[#a8364b]">{fieldErrors.timezone}</p>
        )}
      </div>

      {/* Global error */}
      {globalError && !Object.values(fieldErrors).some(Boolean) && (
        <p className="rounded-lg bg-[rgba(168,54,75,0.08)] px-3 py-2 text-sm text-[#a8364b]">
          {globalError}
        </p>
      )}

      {/* Success */}
      {success && (
        <p className="rounded-lg bg-[rgba(74,75,215,0.08)] px-3 py-2 text-sm text-[#4a4bd7]">
          Profile updated successfully.
        </p>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="cta-gradient inline-flex h-10 items-center gap-2 rounded-[0.75rem] px-6 text-sm font-medium disabled:opacity-60"
        >
          {isPending ? "Saving…" : "Save changes"}
        </button>
      </div>
    </form>
  )
}
