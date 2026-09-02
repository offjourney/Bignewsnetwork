/**
 * PRISMA-PENDING — see src/lib/db.ts for why this file is excluded from
 * the current tsc build and how to activate it (run `npx prisma generate`,
 * then remove the exclusion in tsconfig.json).
 *
 * Article data-access layer. The public site continues reading from
 * src/lib/mock-data.ts + src/lib/queries.ts until Phase 4 — nothing here
 * is imported by the UI yet.
 */
import { prisma } from "@/lib/db";
import type { Prisma } from "@/generated/prisma/client";

/** Shared include shape so every article-returning query gets consistent, minimal relations. */
const articleListInclude = {
  author: { select: { id: true, name: true, slug: true, photoUrl: true } },
  category: { select: { id: true, name: true, slug: true } },
  featuredMedia: true,
  tags: { include: { tag: true } },
} satisfies Prisma.ArticleInclude;

export type ArticleListItem = Prisma.ArticleGetPayload<{ include: typeof articleListInclude }>;

const articleDetailInclude = {
  ...articleListInclude,
  media: { include: { media: true }, orderBy: { position: "asc" } },
} satisfies Prisma.ArticleInclude;

export type ArticleDetail = Prisma.ArticleGetPayload<{ include: typeof articleDetailInclude }>;

export async function getArticleBySlug(slug: string): Promise<ArticleDetail | null> {
  return prisma.article.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: articleDetailInclude,
  });
}

export async function getLatestArticles(limit = 12, offset = 0): Promise<ArticleListItem[]> {
  return prisma.article.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    include: articleListInclude,
    take: limit,
    skip: offset,
  });
}

export async function getFeaturedArticles(limit = 4): Promise<ArticleListItem[]> {
  return prisma.article.findMany({
    where: { status: "PUBLISHED", featured: true },
    orderBy: { publishedAt: "desc" },
    include: articleListInclude,
    take: limit,
  });
}

export async function getBreakingArticles(limit = 10): Promise<ArticleListItem[]> {
  return prisma.article.findMany({
    where: { status: "PUBLISHED", breaking: true },
    orderBy: { publishedAt: "desc" },
    include: articleListInclude,
    take: limit,
  });
}

export async function getArticlesByCategory(
  categorySlug: string,
  limit = 8,
  offset = 0,
): Promise<ArticleListItem[]> {
  return prisma.article.findMany({
    where: { status: "PUBLISHED", category: { slug: categorySlug } },
    orderBy: { publishedAt: "desc" },
    include: articleListInclude,
    take: limit,
    skip: offset,
  });
}

export async function getArticlesByAuthor(
  authorSlug: string,
  limit = 20,
  offset = 0,
): Promise<ArticleListItem[]> {
  return prisma.article.findMany({
    where: { status: "PUBLISHED", author: { slug: authorSlug } },
    orderBy: { publishedAt: "desc" },
    include: articleListInclude,
    take: limit,
    skip: offset,
  });
}

export async function getArticlesByTag(tagSlug: string, limit = 20, offset = 0): Promise<ArticleListItem[]> {
  return prisma.article.findMany({
    where: { status: "PUBLISHED", tags: { some: { tag: { slug: tagSlug } } } },
    orderBy: { publishedAt: "desc" },
    include: articleListInclude,
    take: limit,
    skip: offset,
  });
}

/**
 * Ranks published articles by view count. `window` is accepted now for
 * API stability; once view events are tracked with timestamps (Phase 5+,
 * likely via Redis or a dedicated analytics table) this can filter to a
 * rolling 24h/7d/30d window instead of ranking all-time views.
 */
export async function getMostReadArticles(
  window: "today" | "week" | "month" = "week",
  limit = 5,
): Promise<ArticleListItem[]> {
  void window;
  return prisma.article.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { views: "desc" },
    include: articleListInclude,
    take: limit,
  });
}

export async function getRelatedArticles(article: { id: string; categoryId: string }, limit = 4) {
  return prisma.article.findMany({
    where: {
      status: "PUBLISHED",
      categoryId: article.categoryId,
      id: { not: article.id },
    },
    orderBy: { publishedAt: "desc" },
    include: articleListInclude,
    take: limit,
  });
}

export async function searchArticles(query: string, limit = 20): Promise<ArticleListItem[]> {
  const q = query.trim();
  if (!q) return [];
  return prisma.article.findMany({
    where: {
      status: "PUBLISHED",
      OR: [
        { title: { contains: q, mode: "insensitive" } },
        { excerpt: { contains: q, mode: "insensitive" } },
        { author: { name: { contains: q, mode: "insensitive" } } },
        { tags: { some: { tag: { name: { contains: q, mode: "insensitive" } } } } },
      ],
    },
    orderBy: { publishedAt: "desc" },
    include: articleListInclude,
    take: limit,
  });
}

/**
 * Increments the view counter for a single article. Called on article-page
 * render in Phase 4+. A single atomic UPDATE is cheap, but at real traffic
 * volumes this should move to a batched/queued counter (e.g. Redis
 * INCR + periodic flush) rather than one write per pageview — see spec
 * §23 "do not increment the database inefficiently".
 */
export async function incrementArticleViews(id: string): Promise<void> {
  await prisma.article.update({
    where: { id },
    data: { views: { increment: 1 } },
  });
}
