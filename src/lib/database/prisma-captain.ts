import { PrismaClient } from "@prisma/client";

// This file is a placeholder for a second Prisma client pointing to the Captain DB.
// In practice, we recommend creating a separate Prisma schema (e.g., prisma/captain.prisma)
// with datasource url = env("CAPTAIN_DATABASE_URL") and generating a namespaced client.

// Temporary approach: allow overriding the DATABASE_URL at runtime for a dedicated client.
// Warning: Using two clients from the same generated package shares the same schema.
// Prefer dedicated schema + generator if the captain DB diverges.

const globalForPrisma = globalThis as unknown as {
  prismaCaptain?: PrismaClient;
};

export const prismaCaptain =
  globalForPrisma.prismaCaptain ??
  new PrismaClient({
    datasources: { db: { url: process.env.CAPTAIN_DATABASE_URL } },
  });

if (process.env.NODE_ENV !== "production")
  globalForPrisma.prismaCaptain = prismaCaptain;
