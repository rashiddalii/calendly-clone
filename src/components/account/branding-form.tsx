"use client"

import { useRef, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { ImagePlus } from "lucide-react"
import { updateBrandingAction, uploadImageAction } from "@/lib/actions/user"
import { cn } from "@/lib/utils"

interface BrandingFormProps {
  defaultLogoUrl: string | null
  defaultUseAppBranding: boolean
}

export function BrandingForm({ defaultLogoUrl, defaultUseAppBranding }: BrandingFormProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isPending, startTransition] = useTransition()
  const [isUploading, setIsUploading] = useState(false)
  const [useAppBranding, setUseAppBranding] = useState(defaultUseAppBranding)
  const [applyToAll, setApplyToAll] = useState(false)
  const [logoUrl, setLogoUrl] = useState<string | null>(defaultLogoUrl)
  const [logoPreview, setLogoPreview] = useState<string | null>(defaultLogoUrl)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setLogoPreview(URL.createObjectURL(file))
    setIsUploading(true)
    setError(null)

    const fd = new FormData()
    fd.set("file", file)
    const result = await uploadImageAction(fd, "logo")

    setIsUploading(false)
    if ("error" in result) {
      setError(result.error)
      setLogoPreview(defaultLogoUrl)
    } else {
      setLogoUrl(result.url)
      setLogoPreview(result.url)
    }

    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleSave = () => {
    setError(null)
    setSuccess(false)
    startTransition(async () => {
      const result = await updateBrandingAction({ logoUrl, useAppBranding })
      if (result.status === "error") {
        setError(result.error)
      } else {
        setSuccess(true)
        router.refresh()
      }
    })
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Logo section */}
      <section className="flex flex-col gap-4">
        <div>
          <h2 className="text-base font-semibold text-[#1c2b4b]">Logo</h2>
          <p className="mt-0.5 text-sm text-[#6B7280]">
            Your company branding will appear at the top-left corner of the scheduling page.
          </p>
        </div>

        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={applyToAll}
            onChange={(e) => setApplyToAll(e.target.checked)}
            className="h-4 w-4 cursor-pointer rounded border-[#D1D5DB] accent-[#006BFF]"
          />
          <span className="text-sm text-[#374151]">Apply to all users in your organization</span>
        </label>

        {/* Logo upload area */}
        <div className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-[#F9FAFB]">
          <div className="flex min-h-[160px] items-center justify-center">
            {logoPreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logoPreview}
                alt="Company logo"
                className="max-h-[120px] max-w-[280px] object-contain"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-[#9CA3AF]">
                <ImagePlus className="h-10 w-10 opacity-40" />
                <span className="text-sm font-medium">No Logo</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="inline-flex cursor-pointer items-center rounded-lg border border-[#E5E7EB] bg-white px-4 py-2 text-sm font-medium text-[#374151] transition-colors hover:bg-[#F9FAFB] disabled:opacity-60"
          >
            {isUploading ? "Uploading..." : "Upload image"}
          </button>
          {logoUrl && (
            <button
              type="button"
              onClick={() => { setLogoUrl(null); setLogoPreview(null) }}
              className="text-sm text-[#EF4444] hover:underline"
            >
              Remove
            </button>
          )}
          <span className="text-xs text-[#9CA3AF]">JPG, GIF or PNG. Max size of 5MB.</span>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/gif,image/png,image/webp"
          className="sr-only"
          onChange={handleLogoUpload}
        />
      </section>

      <div className="border-t border-[#E5E7EB]" />

      {/* App branding toggle */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="text-base font-semibold text-[#1c2b4b]">Use App branding</span>
          <button
            type="button"
            role="switch"
            aria-checked={useAppBranding}
            onClick={() => setUseAppBranding((v) => !v)}
            className={cn(
              "relative inline-flex h-6 w-11 cursor-pointer items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006BFF] focus-visible:ring-offset-2",
              useAppBranding ? "bg-[#006BFF]" : "bg-[#D1D5DB]",
            )}
          >
            <span
              className={cn(
                "inline-block h-4 w-4 rounded-full bg-white shadow transition-transform",
                useAppBranding ? "translate-x-6" : "translate-x-1",
              )}
            />
          </button>
        </div>

        {useAppBranding && (
          <div className="rounded-lg border border-[#BFDBFE] bg-[#EFF6FF] px-4 py-3 text-sm text-[#374151]">
            App branding will be displayed on your scheduling page, notifications, and confirmations.
          </div>
        )}

        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={applyToAll}
            onChange={(e) => setApplyToAll(e.target.checked)}
            className="h-4 w-4 cursor-pointer rounded border-[#D1D5DB] accent-[#006BFF]"
          />
          <span className="text-sm text-[#374151]">Apply to all users in your organization</span>
        </label>
      </section>

      {/* Feedback */}
      {error && (
        <p className="rounded-lg bg-[rgba(168,54,75,0.08)] px-3 py-2.5 text-sm text-[#a8364b]">
          {error}
        </p>
      )}
      {success && (
        <p className="rounded-lg bg-[rgba(0,107,255,0.08)] px-3 py-2.5 text-sm text-[#006BFF]">
          Branding saved successfully.
        </p>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3 border-t border-[#E5E7EB] pt-6">
        <button
          type="button"
          onClick={handleSave}
          disabled={isPending || isUploading}
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
    </div>
  )
}
