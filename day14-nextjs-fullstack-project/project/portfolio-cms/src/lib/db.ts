import { PrismaClient } from "@prisma/client";

// TODO: Implement Prisma singleton (prevents too many connections in dev)
// YOUR IDEA:

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const db = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}

// ─── ANSWER: That's it! Use `db` everywhere instead of `new PrismaClient()` ───
