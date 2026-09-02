/**
 * PRISMA-PENDING — see src/lib/db.ts.
 */
import { prisma } from "@/lib/db";
import type { AdPlacement } from "@/generated/prisma/client";

/** Returns one active, in-date-range ad for a placement, picked at random among matches. */
export async function getActiveAdvertisement(placement: AdPlacement) {
  const now = new Date();
  const candidates = await prisma.advertisement.findMany({
    where: {
      placement,
      active: true,
      startDate: { lte: now },
      endDate: { gte: now },
    },
  });
  if (candidates.length === 0) return null;
  return candidates[Math.floor(Math.random() * candidates.length)];
}

export async function getAllAdvertisements() {
  return prisma.advertisement.findMany({ orderBy: { createdAt: "desc" } });
}
