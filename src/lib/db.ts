/**
 * PRISMA-PENDING
 * ============================================================
 * This file depends on the generated Prisma Client at
 * `src/generated/prisma`, which does not exist in this sandbox because
 * `npx prisma generate` needs to download a schema-engine binary from
 * binaries.prisma.sh — a host this sandbox's network policy blocks
 * (host_not_allowed). It's excluded from tsconfig.json's compiled set for
 * that reason, so `npm run build` stays green.
 *
 * To activate it in a normal environment:
 *   1. npx prisma generate
 *   2. Remove the "src/lib/db.ts" / "src/lib/data/**" entries from
 *      tsconfig.json's `exclude` array.
 *
 * Everything below is otherwise the real, intended Phase 4 code — a
 * standard Next.js-safe Prisma Client singleton using the binary-free
 * driver-adapter setup (@prisma/adapter-pg), matching the
 * `engineType = "client"` generator in prisma/schema.prisma.
 * ============================================================
 */
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Reuse a single client across hot reloads in development so we don't
// exhaust Postgres connections; always create a fresh one in production.
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
