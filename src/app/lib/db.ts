/**
 * Prisma client singleton.
 *
 * Two adapters are bundled so the same codebase works in every environment:
 *
 *  VERCEL=1  →  @prisma/adapter-neon (WebSocket pool)
 *              Neon's serverless driver reuses HTTP/WebSocket connections
 *              through Neon's proxy, avoiding TCP connection exhaustion on
 *              Vercel's short-lived serverless functions.
 *              Pool mode (not HTTP mode) is required because our booking
 *              service uses prisma.$transaction(async (tx) => { … }).
 *
 *  local dev  →  @prisma/adapter-pg (standard pg)
 *              Works with the Docker Compose Postgres on localhost:5433.
 */

import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  const url = process.env.DATABASE_URL!;

  if (process.env.VERCEL === "1") {
    // Neon's serverless WebSocket pool — transaction-safe, no TCP pool exhaustion.
    // Use require() so the ws module is not statically bundled into middleware.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    neonConfig.webSocketConstructor = require("ws");
    return new PrismaClient({ adapter: new PrismaNeon({ connectionString: url }) });
  }

  // Local Docker Compose — standard pg TCP connection pool.
  return new PrismaClient({ adapter: new PrismaPg({ connectionString: url }) });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
