import { PrismaClient } from "@prisma/client";

// Changing the global key name to force a new instance and avoid stale cache
const globalForPrisma = global as unknown as { prisma_v2: PrismaClient };

export const prisma =
  globalForPrisma.prisma_v2 ||
  new PrismaClient({
    log: ["query"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma_v2 = prisma;
