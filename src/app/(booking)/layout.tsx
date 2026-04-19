import Link from "next/link";
import { auth } from "@/lib/auth";
import { BookingCopyLinkButton } from "@/components/booking/booking-copy-link-button";
import { FluidLogo } from "@/components/shared/fluid-logo";

export default async function BookingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const isAuthenticated = Boolean(session?.user?.id);

  return (
    <div className="flex min-h-screen flex-col bg-[#f7f8fa]">
      <header className="sticky top-0 z-40 bg-white px-5 py-3 shadow-[0_1px_0_rgba(157,175,197,0.18)] sm:px-8">
        <nav
          aria-label="Booking navigation"
          className="mx-auto flex max-w-6xl items-center justify-between gap-4"
        >
          <FluidLogo />
          <div className="flex items-center gap-2 sm:gap-3">
            {isAuthenticated ? (
              <>
                <Link
                  href="/events"
                  className="inline-flex h-11 cursor-pointer items-center rounded-full px-4 text-sm font-semibold text-[#1c2b4b] no-underline transition-colors hover:bg-[#f0f5ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006bff]/30"
                >
                  Home
                </Link>
                <BookingCopyLinkButton />
              </>
            ) : (
              <Link
                href="/signup"
                className="inline-flex h-11 cursor-pointer items-center rounded-full bg-[#006bff] px-5 text-sm font-semibold text-white no-underline transition-colors hover:bg-[#005edb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006bff]/30"
              >
                Sign up
              </Link>
            )}
          </div>
        </nav>
      </header>
      <main className="flex flex-1 flex-col items-center px-3 py-6 sm:px-6 sm:py-12 lg:px-8">
        {children}
      </main>
    </div>
  );
}
