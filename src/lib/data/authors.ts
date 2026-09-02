/**
 * PRISMA-PENDING — see src/lib/db.ts.
 */
import { prisma } from "@/lib/db";

export async function getAuthors() {
  return prisma.author.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, slug: true, biography: true, photoUrl: true },
  });
}

export async function getAuthorBySlug(slug: string) {
  return prisma.author.findUnique({
    where: { slug },
    select: { id: true, name: true, slug: true, biography: true, photoUrl: true },
  });
}
