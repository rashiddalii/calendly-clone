import { prisma } from "@/app/lib/db"
import type { Prisma } from "@/generated/prisma/client"
import type {
  CreateEventTypeInput,
  UpdateEventTypeInput,
} from "@/lib/validators/event-type"

/**
 * List all non-deleted event types for a user, newest first.
 */
export async function listEventTypes(userId: string) {
  return prisma.eventType.findMany({
    where: { userId, deletedAt: null },
    orderBy: { createdAt: "desc" },
  })
}

/**
 * Fetch a single event type the user owns. Returns null if not found or deleted.
 */
export async function getEventTypeById(userId: string, id: string) {
  return prisma.eventType.findFirst({
    where: { id, userId, deletedAt: null },
  })
}

/**
 * Public lookup used by the booking page. Only returns active, non-deleted types.
 */
export async function getPublicEventType(username: string, slug: string) {
  return prisma.eventType.findFirst({
    where: {
      slug,
      isActive: true,
      deletedAt: null,
      user: { username },
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          username: true,
          bio: true,
          image: true,
          timezone: true,
          dateFormat: true,
          timeFormat: true,
          logoUrl: true,
          useAppBranding: true,
        },
      },
    },
  })
}

/**
 * Public profile: all active event types for a username.
 */
export async function getPublicProfile(username: string) {
  return prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      name: true,
      username: true,
      bio: true,
      image: true,
      timezone: true,
      logoUrl: true,
      useAppBranding: true,
      eventTypes: {
        where: { isActive: true, deletedAt: null },
        orderBy: { createdAt: "asc" },
      },
    },
  })
}

export class SlugConflictError extends Error {
  constructor() {
    super("You already have an event type with this slug")
    this.name = "SlugConflictError"
  }
}

export async function createEventType(
  userId: string,
  input: CreateEventTypeInput,
) {
  try {
    return await prisma.eventType.create({
      data: {
        userId,
        title: input.title,
        slug: input.slug,
        description: input.description || null,
        duration: input.duration,
        color: input.color,
        location: input.location ?? "google_meet",
        locationAddress: input.locationAddress || null,
        bufferBefore: input.bufferBefore,
        bufferAfter: input.bufferAfter,
        minNotice: input.minNotice,
        maxDaysInFuture: input.maxDaysInFuture,
        isActive: input.isActive,
      },
    })
  } catch (err) {
    if (isUniqueConstraint(err)) throw new SlugConflictError()
    throw err
  }
}

export async function updateEventType(
  userId: string,
  input: UpdateEventTypeInput,
) {
  const existing = await getEventTypeById(userId, input.id)
  if (!existing) throw new Error("Event type not found")

  const data: Prisma.EventTypeUpdateInput = {}
  if (input.title !== undefined) data.title = input.title
  if (input.slug !== undefined) data.slug = input.slug
  if (input.description !== undefined)
    data.description = input.description || null
  if (input.duration !== undefined) data.duration = input.duration
  if (input.color !== undefined) data.color = input.color
  if (input.bufferBefore !== undefined) data.bufferBefore = input.bufferBefore
  if (input.bufferAfter !== undefined) data.bufferAfter = input.bufferAfter
  if (input.minNotice !== undefined) data.minNotice = input.minNotice
  if (input.maxDaysInFuture !== undefined)
    data.maxDaysInFuture = input.maxDaysInFuture
  if (input.location !== undefined) data.location = input.location
  if (input.locationAddress !== undefined) data.locationAddress = input.locationAddress || null
  if (input.isActive !== undefined) data.isActive = input.isActive

  try {
    return await prisma.eventType.update({
      where: { id: input.id },
      data,
    })
  } catch (err) {
    if (isUniqueConstraint(err)) throw new SlugConflictError()
    throw err
  }
}

export async function softDeleteEventType(userId: string, id: string) {
  const existing = await getEventTypeById(userId, id)
  if (!existing) return null
  return prisma.eventType.update({
    where: { id },
    data: { deletedAt: new Date(), isActive: false },
  })
}

export async function toggleEventTypeActive(userId: string, id: string) {
  const existing = await getEventTypeById(userId, id)
  if (!existing) throw new Error("Event type not found")
  return prisma.eventType.update({
    where: { id },
    data: { isActive: !existing.isActive },
  })
}

function isUniqueConstraint(err: unknown): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    (err as { code?: string }).code === "P2002"
  )
}
