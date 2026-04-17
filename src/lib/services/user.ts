import { prisma } from "@/app/lib/db"
import { startOfMonth, endOfMonth } from "date-fns"

export async function generateUsername(user: {
  name?: string | null
  email: string
}): Promise<string> {
  const base = user.name ?? user.email.split("@")[0]
  const slug = base
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 20)

  let candidate = slug
  let counter = 2
  while (true) {
    const existing = await prisma.user.findUnique({
      where: { username: candidate },
    })
    if (!existing) break
    candidate = `${slug}-${counter++}`
    if (counter > 20) {
      candidate = `${slug}-${Math.random().toString(36).slice(2, 6)}`
      break
    }
  }
  return candidate
}

export async function getDashboardStats(userId: string) {
  const now = new Date()
  const monthStart = startOfMonth(now)
  const monthEnd = endOfMonth(now)

  const [totalEventTypes, upcomingBookings, bookingsThisMonth] =
    await prisma.$transaction([
      prisma.eventType.count({ where: { userId, deletedAt: null } }),
      prisma.booking.count({
        where: {
          hostId: userId,
          status: "CONFIRMED",
          startTime: { gt: now },
        },
      }),
      prisma.booking.count({
        where: {
          hostId: userId,
          status: { not: "CANCELLED" },
          startTime: { gte: monthStart, lte: monthEnd },
        },
      }),
    ])

  return { totalEventTypes, upcomingBookings, bookingsThisMonth }
}
