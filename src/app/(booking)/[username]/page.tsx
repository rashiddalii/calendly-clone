import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { getPublicProfile } from "@/lib/services/event-type"
import type { Metadata } from "next"

interface PageProps {
  params: Promise<{ username: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username } = await params
  const profile = await getPublicProfile(username)
  if (!profile) return {}
  return {
    title: `Book time with ${profile.name ?? username}`,
    description: profile.bio ?? `Schedule a meeting with ${profile.name ?? username}`,
  }
}

export default async function UserProfilePage({ params }: PageProps) {
  const { username } = await params
  const profile = await getPublicProfile(username)

  if (!profile || profile.eventTypes.length === 0) {
    notFound()
  }

  const initials = (profile.name ?? username)
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="w-full max-w-2xl py-12">
      {/* Host card */}
      <div className="mb-10 flex flex-col items-center text-center">
        <div className="mb-4 h-20 w-20 overflow-hidden rounded-full bg-[#e2e0f9]">
          {profile.image ? (
            <Image
              src={profile.image}
              alt={profile.name ?? username}
              width={80}
              height={80}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center font-heading text-xl font-semibold text-[#4a4bd7]">
              {initials}
            </div>
          )}
        </div>
        <h1 className="font-heading text-2xl font-semibold text-[#32323b]">
          {profile.name ?? username}
        </h1>
        {profile.bio && (
          <p className="mt-2 max-w-md text-sm leading-relaxed text-[#5f5e68]">
            {profile.bio}
          </p>
        )}
      </div>

      {/* Event type cards */}
      <div className="space-y-3">
        {profile.eventTypes.map((et) => (
          <Link
            key={et.id}
            href={`/${username}/${et.slug}`}
            className="group flex items-center gap-5 rounded-[1rem] bg-[#ffffff] px-6 py-5 transition-all duration-200 hover:shadow-[0_4px_16px_rgba(50,50,59,0.06)]"
          >
            {/* Color accent dot */}
            <div
              className="h-3 w-3 shrink-0 rounded-full"
              style={{ backgroundColor: et.color }}
            />

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-heading text-base font-semibold text-[#32323b] group-hover:text-[#4a4bd7] transition-colors duration-150">
                  {et.title}
                </span>
                <span className="rounded-full bg-[#e2e0f9] px-2.5 py-0.5 text-xs font-medium text-[#505064]">
                  {et.duration} min
                </span>
              </div>
              {et.description && (
                <p className="mt-1 line-clamp-1 text-sm text-[#5f5e68]">
                  {et.description}
                </p>
              )}
            </div>

            {/* Arrow */}
            <svg
              className="h-5 w-5 shrink-0 text-[#b3b0bc] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-[#4a4bd7]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        ))}
      </div>
    </div>
  )
}
