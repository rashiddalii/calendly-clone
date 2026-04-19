import { redirect } from "next/navigation"
import Link from "next/link"
import { auth } from "@/lib/auth"
import { verifyEmailAction } from "@/lib/actions/auth"
import { FluidLogo } from "@/components/shared/fluid-logo"
import { CheckCircle, XCircle } from "lucide-react"

const BLUE = "#006BFF"

interface VerifyEmailPageProps {
  searchParams: Promise<{ token?: string }>
}

export default async function VerifyEmailPage({
  searchParams,
}: VerifyEmailPageProps) {
  const session = await auth()
  if (session) redirect("/events")

  const { token } = await searchParams

  if (!token) {
    return <VerifyErrorUI message="No verification token provided." />
  }

  let verifyError: string | null = null
  try {
    await verifyEmailAction(token)
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    if (msg.includes("NEXT_REDIRECT")) throw err
    verifyError = "This verification link is invalid or has already been used."
  }

  if (verifyError) {
    return <VerifyErrorUI message={verifyError} />
  }

  // If verifyEmailAction succeeded it already redirected; this is unreachable
  return null
}

function VerifyErrorUI({ message }: { message: string }) {
  return (
    <div className="flex min-h-screen flex-col bg-white text-[#0F172A]">
      <header className="border-b border-[#E5E7EB] px-4 py-4 sm:px-8">
        <div className="mx-auto flex max-w-6xl items-center">
          <FluidLogo />
        </div>
      </header>

      <div className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="w-full max-w-[440px] text-center">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
            <XCircle className="h-7 w-7 text-red-500" aria-hidden />
          </span>
          <h1 className="font-[family-name:var(--font-manrope)] mt-5 text-2xl font-bold tracking-tight text-[#0F172A]">
            Verification failed
          </h1>
          <p className="mt-2 text-[17px] text-[#64748B]">{message}</p>
          <div className="mt-8 flex flex-col gap-3">
            <Link
              href="/login"
              className="inline-flex h-11 w-full cursor-pointer items-center justify-center rounded-[10px] text-[15px] font-semibold text-white no-underline"
              style={{ backgroundColor: BLUE }}
            >
              Back to login
            </Link>
            <p className="text-[13px] text-[#64748B]">
              Need a new verification email? Sign in and we will prompt you.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
