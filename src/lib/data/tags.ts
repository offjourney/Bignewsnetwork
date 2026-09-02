/**
 * PRISMA-PENDING — see src/lib/db.ts.
 */
import { prisma } from "@/lib/db";

export async function getTags() {
  return prisma.tag.findMany({ orderBy: { name: "asc" } });
}

export async function getTagBySlug(slug: string) {
  return prisma.tag.findUnique({ where: { slug } });
}

/** Tags ranked by how many published articles carry them — for "popular tags" widgets. */
export async function getPopularTags(limit = 10) {
  const tags = await prisma.tag.findMany({
    take: limit,
    include: { _count: { select: { articles: true } } },
    orderBy: { articles: { _count: "desc" } },
  });
  return tags;
}
