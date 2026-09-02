/**
 * Domain types for BigNewsNetwork.
 *
 * These shapes intentionally mirror the Prisma schema described in the
 * project spec (Article, Author, Category, Tag, Media, Advertisement,
 * Gallery, ...). Phase 1 reads mock data through the functions in
 * `src/lib/queries.ts`; when the database lands in Phase 3/4, those
 * functions swap to Prisma calls without any UI code changing, because
 * the shapes stay the same.
 */

export type ArticleStatus =
  | "DRAFT"
  | "REVIEW"
  | "SCHEDULED"
  | "PUBLISHED"
  | "ARCHIVED";

export type AdPlacement =
  | "HOMEPAGE_TOP"
  | "HOMEPAGE_MIDDLE"
  | "ARTICLE_TOP"
  | "ARTICLE_MIDDLE"
  | "ARTICLE_BOTTOM"
  | "SIDEBAR"
  | "MOBILE_TOP"
  | "MOBILE_MIDDLE";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string | null;
}

export interface Author {
  id: string;
  name: string;
  slug: string;
  biography?: string;
  photoUrl?: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface Media {
  id: string;
  type: "IMAGE" | "VIDEO";
  url: string;
  thumbnailUrl?: string;
  altText: string;
  caption?: string;
  credit?: string;
  width?: number;
  height?: number;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  /** Rendered HTML body (stand-in for the future TipTap/JSON -> HTML output). */
  content: string;
  author: Author;
  category: Category;
  tags: Tag[];
  status: ArticleStatus;
  featured: boolean;
  breaking: boolean;
  views: number;
  image: Media;
  publishedAt: string; // ISO date string
  updatedAt?: string;
  /** Marks development/sample content so it can be found and removed later. */
  sample: true;
}

export interface VideoItem {
  id: string;
  title: string;
  slug: string;
  source: "YOUTUBE" | "FACEBOOK" | "EXTERNAL";
  url: string;
  thumbnailUrl?: string;
  publishedAt: string;
  sample: true;
}

export interface GalleryImage {
  id: string;
  url: string;
  caption?: string;
  credit?: string;
  width: number;
  height: number;
}

export interface Gallery {
  id: string;
  title: string;
  slug: string;
  description?: string;
  coverImage: GalleryImage;
  images: GalleryImage[];
  publishedAt: string;
  photographer?: string;
  sample: true;
}

export interface Advertisement {
  id: string;
  name: string;
  imageUrl: string;
  targetUrl: string;
  placement: AdPlacement;
  active: boolean;
  sample: true;
}
