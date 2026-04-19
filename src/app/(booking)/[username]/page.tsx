import Link from "next/link";
import Image from "next/image";
import { getPublicProfile } from "@/lib/services/event-type";
import { FluidCornerBadge } from "@/components/booking/fluid-corner-badge";
import { FluidLogo } from "@/components/shared/fluid-logo";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { username } = await params;
  const profile = await getPublicProfile(username);
  if (!profile) return { title: "Page not found" };
  return {
    title: `Book time with ${profile.name ?? username}`,
    description:
      profile.bio ?? `Schedule a meeting with ${profile.name ?? username}`,
  };
}

export default async function UserProfilePage({ params }: PageProps) {
  const { username } = await params;
  const profile = await getPublicProfile(username);

  if (!profile || profile.eventTypes.length === 0) {
    return (
      <section className="relative flex min-h-[420px] w-full max-w-[66rem] flex-col items-center justify-center overflow-hidden rounded-[1rem] bg-white px-5 py-10 text-center shadow-[0_18px_50px_rgba(28,43,75,0.08)] ring-1 ring-[#9dafc5]/20">
        <FluidCornerBadge />
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#f0f5ff]">
          <svg
            className="h-7 w-7 text-[#9dafc5]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.6}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h1 className="font-heading text-xl font-semibold text-[#1c2b4b]">
          This page isn&apos;t available
        </h1>
        <p className="mt-2 text-sm text-[#4b5a6d]">
          The scheduling page you&apos;re looking for doesn&apos;t exist or has
          no active events.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex h-touch cursor-pointer items-center rounded-lg bg-[#006bff] px-5 text-sm font-semibold text-white no-underline hover:bg-[#005edb]"
        >
          Go home
        </Link>
      </section>
    );
  }

  const displayName = profile.name ?? username;
  const initials = displayName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <section className="relative min-h-[520px] w-full max-w-[1020px] overflow-hidden rounded-[1rem] bg-white px-5 py-10 shadow-[0_18px_50px_rgba(28,43,75,0.08)] ring-1 ring-[#9dafc5]/20 sm:px-8 lg:px-10">
      <FluidCornerBadge hide={!profile.useAppBranding} />
      <div className="mx-auto w-full max-w-xl">
        {profile.logoUrl ? (
          <div className="mb-6 h-20 overflow-hidden rounded-[0.75rem] bg-[#f0f4f9] sm:h-[120px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={profile.logoUrl}
              alt="Company logo"
              className="h-full w-full object-contain"
            />
          </div>
        ) : (
          <div className="mb-6 flex justify-center">
            <FluidLogo />
          </div>
        )}

        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 h-16 w-16 overflow-hidden rounded-full bg-[#d9e8ff]">
            {profile.image ? (
              <Image
                src={profile.image}
                alt={displayName}
                width={64}
                height={64}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center font-heading text-lg font-semibold text-[#006bff]">
                {initials}
              </div>
            )}
          </div>
          <h1 className="font-heading text-2xl font-semibold text-[#1c2b4b]">
            {displayName}
          </h1>
          {profile.bio && (
            <p className="mt-2 max-w-md text-sm leading-relaxed text-[#4b5a6d]">
              {profile.bio}
            </p>
          )}
        </div>

        <div className="mx-auto max-w-xl space-y-3">
          {profile.eventTypes.map((et) => (
            <Link
              key={et.id}
              href={`/${username}/${et.slug}`}
              className="group flex cursor-pointer items-center gap-4 rounded-[0.75rem] bg-white px-5 py-4 text-left no-underline shadow-[inset_0_0_0_1px_rgba(157,175,197,0.25)] transition-all duration-200 hover:bg-[#f8fbff] hover:shadow-[inset_0_0_0_1px_rgba(0,107,255,0.28)]"
            >
              <div
                className="h-3 w-3 shrink-0 rounded-full"
                style={{ backgroundColor: et.color }}
                aria-hidden="true"
              />

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-heading text-base font-semibold text-[#1c2b4b] transition-colors duration-150 group-hover:text-[#006bff]">
                    {et.title}
                  </span>
                  <span className="rounded-full bg-[#d9e8ff] px-2.5 py-0.5 text-xs font-medium text-[#1c3a6e]">
                    {et.duration} min
                  </span>
                </div>
                {et.description && (
                  <p className="mt-1 line-clamp-1 text-sm text-[#4b5a6d]">
                    {et.description}
                  </p>
                )}
              </div>

              <svg
                className="h-5 w-5 shrink-0 text-[#9dafc5] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-[#006bff]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
