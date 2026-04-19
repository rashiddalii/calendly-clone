import { redirect } from "next/navigation"
import Link from "next/link"
import { auth } from "@/lib/auth"
import { isPasswordResetTokenValid } from "@/lib/services/auth-tokens"
import { ResetPasswordForm } from "@/components/auth/reset-password-form"
import { FluidLogo } from "@/components/shared/fluid-logo"

const BLUE = "#006BFF"

interface ResetPasswordPageProps {
  searchParams: Promise<{ token?: string }>
}

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const session = await auth()
  if (session) redirect("/events")

  const { token } = await searchParams

  const isValid = token ? await isPasswordResetTokenValid(token) : false

  return (
    <div className="flex min-h-screen flex-col bg-white text-[#0F172A]">
      <header className="border-b border-[#E5E7EB] px-4 py-4 sm:px-8">
        <div className="mx-auto flex max-w-6xl items-center">
          <FluidLogo />
        </div>
      </header>

      <div className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="w-full max-w-[440px]">
          {!isValid ? (
            <>
              <h1 className="font-[family-name:var(--font-manrope)] text-3xl font-bold tracking-tight text-[#0F172A]">
                Link expired
              </h1>
              <p className="mt-2 text-[17px] text-[#64748B]">
                This password reset link is invalid or has expired.
              </p>
              <div className="mt-8">
                <Link
                  href="/forgot-password"
                  className="inline-flex h-11 w-full cursor-pointer items-center justify-center rounded-[10px] text-[15px] font-semibold text-white no-underline"
                  style={{ backgroundColor: BLUE }}
                >
                  Request a new reset link
                </Link>
              </div>
            </>
          ) : (
            <>
              <h1 className="font-[family-name:var(--font-manrope)] text-3xl font-bold tracking-tight text-[#0F172A]">
                Choose a new password
              </h1>
              <p className="mt-2 text-[17px] text-[#64748B]">
                Use at least 8 characters with a letter and a number.
              </p>

              <div className="mt-8">
                <ResetPasswordForm token={token!} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
