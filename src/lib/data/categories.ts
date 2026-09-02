/**
 * PRISMA-PENDING — see src/lib/db.ts.
 */
import { prisma } from "@/lib/db";

export async function getCategories(includeInactive = false) {
  return prisma.category.findMany({
    where: includeInactive ? undefined : { active: true },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({ where: { slug } });
}

export async function getSubcategories(parentId: string) {
  return prisma.category.findMany({
    where: { parentId, active: true },
    orderBy: { sortOrder: "asc" },
  });
}
