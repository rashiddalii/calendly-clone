// prisma.config.ts
// In Prisma 7, database connection moved HERE from schema.prisma

import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Fallback lets `prisma generate` (postinstall) succeed without a live DB.
    // At runtime DATABASE_URL must be set — Prisma will throw on the first query if not.
    url: process.env.DATABASE_URL ?? "postgresql://localhost/placeholder",
  },
});