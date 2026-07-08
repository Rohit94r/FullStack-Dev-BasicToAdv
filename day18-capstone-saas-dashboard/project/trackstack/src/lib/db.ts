// =============================================================================
// Prisma client singleton — avoid too many connections in dev hot reload
// =============================================================================

// TODO: Import PrismaClient from @prisma/client
// TODO: Export db — reuse global in dev, new instance in prod
// YOUR IDEA: write your attempt here first ↓


// ─── ANSWER ───
// import { PrismaClient } from "@prisma/client";
// const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };
// export const db = globalForPrisma.prisma ?? new PrismaClient();
// if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;

export const db = null; // replace with Prisma client
