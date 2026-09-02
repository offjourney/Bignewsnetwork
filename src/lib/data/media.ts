/**
 * PRISMA-PENDING — see src/lib/db.ts.
 */
import { prisma } from "@/lib/db";
import type { MediaType } from "@/generated/prisma/client";

export async function getMediaLibrary(params: { type?: MediaType; search?: string; limit?: number; offset?: number } = {}) {
  const { type, search, limit = 40, offset = 0 } = params;
  return prisma.media.findMany({
    where: {
      type,
      ...(search
        ? {
            OR: [
              { filename: { contains: search, mode: "insensitive" } },
              { altText: { contains: search, mode: "insensitive" } },
              { caption: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: offset,
  });
}

export async function getMediaById(id: string) {
  return prisma.media.findUnique({ where: { id } });
}

export async function getGalleries(limit = 12) {
  return prisma.gallery.findMany({
    orderBy: { publishedAt: "desc" },
    take: limit,
    include: { coverMedia: true },
  });
}

export async function getGalleryBySlug(slug: string) {
  return prisma.gallery.findUnique({
    where: { slug },
    include: {
      coverMedia: true,
      images: { include: { media: true }, orderBy: { sortOrder: "asc" } },
    },
  });
}

export async function getVideos(limit = 12) {
  return prisma.video.findMany({
    orderBy: { publishedAt: "desc" },
    take: limit,
  });
}
