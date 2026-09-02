/**
 * Server-side data access layer.
 *
 * Phase 1: reads from `src/lib/mock-data.ts`.
 * Phase 3/4: these same function signatures will run Prisma queries
 * against PostgreSQL instead. UI code should only ever import from here,
 * never reach into mock-data.ts directly, so that swap is invisible to
 * every component (project spec, section 37).
 */

import {
  advertisements,
  articles,
  authors,
  categories,
  galleries,
  videos,
} from "./mock-data";
import type {
  Advertisement,
  AdPlacement,
  Article,
  Author,
  Category,
  Gallery,
  VideoItem,
} from "./types";

const published = () => articles.filter((a) => a.status === "PUBLISHED");

const byDateDesc = (a: Article, b: Article) =>
  new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();

export async function getCategories(): Promise<Category[]> {
  return categories;
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  return categories.find((c) => c.slug === slug) ?? null;
}

export async function getBreakingNews(): Promise<Article[]> {
  return published()
    .filter((a) => a.breaking)
    .sort(byDateDesc);
}

export async function getFeaturedArticles(limit = 4): Promise<Article[]> {
  return published()
    .filter((a) => a.featured)
    .sort(byDateDesc)
    .slice(0, limit);
}

export async function getLatestArticles(limit = 12, offset = 0): Promise<Article[]> {
  return published().sort(byDateDesc).slice(offset, offset + limit);
}

export async function getArticlesByCategory(
  categorySlug: string,
  limit = 8,
  offset = 0,
): Promise<Article[]> {
  return published()
    .filter((a) => a.category?.slug === categorySlug)
    .sort(byDateDesc)
    .slice(offset, offset + limit);
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  return published().find((a) => a.slug === slug) ?? null;
}

export async function getMostReadArticles(
  window: "today" | "week" | "month" = "week",
  limit = 5,
): Promise<Article[]> {
  // NOTE: with real analytics this will filter by a rolling window;
  // for now all sample articles are recent, so we just rank by views.
  void window;
  return [...published()].sort((a, b) => b.views - a.views).slice(0, limit);
}

export async function getRelatedArticles(article: Article, limit = 4): Promise<Article[]> {
  return published()
    .filter((a) => a.id !== article.id && a.category.slug === article.category.slug)
    .sort(byDateDesc)
    .slice(0, limit);
}

export async function getAuthorBySlug(slug: string): Promise<Author | null> {
  return authors.find((a) => a.slug === slug) ?? null;
}

export async function getAuthorArticles(authorSlug: string, limit = 20): Promise<Article[]> {
  return published()
    .filter((a) => a.author.slug === authorSlug)
    .sort(byDateDesc)
    .slice(0, limit);
}

export async function getArticlesByTag(tagSlug: string, limit = 20): Promise<Article[]> {
  return published()
    .filter((a) => a.tags.some((t) => t.slug === tagSlug))
    .sort(byDateDesc)
    .slice(0, limit);
}

export async function searchArticles(query: string, limit = 20): Promise<Article[]> {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return published()
    .filter((a) => {
      const haystack = [
        a.title,
        a.excerpt,
        a.content,
        a.author.name,
        ...a.tags.map((t) => t.name),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    })
    .sort(byDateDesc)
    .slice(0, limit);
}

export async function getVideos(limit = 12): Promise<VideoItem[]> {
  return [...videos]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, limit);
}

export async function getGalleries(limit = 12): Promise<Gallery[]> {
  return [...galleries]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, limit);
}

export async function getGalleryBySlug(slug: string): Promise<Gallery | null> {
  return galleries.find((g) => g.slug === slug) ?? null;
}

export async function getActiveAdvertisement(
  placement: AdPlacement,
): Promise<Advertisement | null> {
  const candidates = advertisements.filter((a) => a.active && a.placement === placement);
  if (candidates.length === 0) return null;
  return candidates[Math.floor(Math.random() * candidates.length)];
}
