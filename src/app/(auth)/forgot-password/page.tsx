import { redirect } from "next/navigation"
import Link from "next/link"
import { auth } from "@/lib/auth"
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form"
import { FluidLogo } from "@/components/shared/fluid-logo"
import { ArrowLeft } from "lucide-react"

const BLUE = "#006BFF"

export default async function ForgotPasswordPage() {
  const session = await auth()
  if (session) redirect("/events")

  return (
    <div className="flex min-h-screen flex-col bg-white text-[#0F172A]">
      <header className="border-b border-[#E5E7EB] px-4 py-4 sm:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <FluidLogo />
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#E5E7EB] bg-white px-4 py-2 text-[15px] font-medium text-[#444444] no-underline transition-colors hover:bg-[#F8F9FB]"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Back to login
          </Link>
        </div>
      </header>

      <div className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="w-full max-w-[440px]">
          <h1 className="font-[family-name:var(--font-manrope)] text-3xl font-bold tracking-tight text-[#0F172A]">
            Reset your password
          </h1>
          <p className="mt-2 text-[17px] text-[#64748B]">
            Enter your email and we will send you a reset link if an account exists.
          </p>

          <div className="mt-8">
            <ForgotPasswordForm />
          </div>

          <p className="mt-6 text-center text-[14px] text-[#64748B]">
            Remembered it?{" "}
            <Link
              href="/login"
              className="font-semibold no-underline hover:underline"
              style={{ color: BLUE }}
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
