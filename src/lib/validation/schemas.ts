/**
 * Zod schemas for entity input validation. These don't depend on the
 * generated Prisma client, so — unlike src/lib/data/** — they compile and
 * can be used right away. Nothing calls them yet; admin forms land in a
 * later phase, but request validation for that CMS should reuse these
 * rather than duplicating rules.
 */
import { z } from "zod";

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const slugField = z
  .string()
  .min(1, "Slug is required")
  .max(200)
  .regex(slugPattern, "Slug must be lowercase, alphanumeric, and hyphen-separated");

export const articleStatusSchema = z.enum(["DRAFT", "REVIEW", "SCHEDULED", "PUBLISHED", "ARCHIVED"]);

export const articleInputSchema = z
  .object({
    title: z.string().min(1, "Title is required").max(300),
    slug: slugField,
    excerpt: z.string().min(1, "Excerpt is required").max(500),
    /** Structured TipTap JSON document — validated loosely here; the editor enforces shape client-side. */
    content: z.record(z.string(), z.unknown()),
    authorId: z.string().min(1, "Author is required"),
    categoryId: z.string().min(1, "Category is required"),
    featuredMediaId: z.string().optional(),
    tagIds: z.array(z.string()).default([]),
    status: articleStatusSchema.default("DRAFT"),
    featured: z.boolean().default(false),
    breaking: z.boolean().default(false),
    publishedAt: z.coerce.date().optional(),
    scheduledAt: z.coerce.date().optional(),
  })
  .refine((data) => data.status !== "SCHEDULED" || data.scheduledAt, {
    message: "scheduledAt is required when status is SCHEDULED",
    path: ["scheduledAt"],
  });

export type ArticleInput = z.infer<typeof articleInputSchema>;

export const categoryInputSchema = z.object({
  name: z.string().min(1, "Name is required").max(120),
  slug: slugField,
  description: z.string().max(500).optional(),
  parentId: z.string().optional(),
  sortOrder: z.number().int().default(0),
  active: z.boolean().default(true),
});

export type CategoryInput = z.infer<typeof categoryInputSchema>;

export const tagInputSchema = z.object({
  name: z.string().min(1, "Name is required").max(80),
  slug: slugField,
});

export type TagInput = z.infer<typeof tagInputSchema>;

export const adPlacementSchema = z.enum([
  "HOMEPAGE_TOP",
  "HOMEPAGE_MIDDLE",
  "ARTICLE_TOP",
  "ARTICLE_MIDDLE",
  "ARTICLE_BOTTOM",
  "SIDEBAR",
  "MOBILE_TOP",
  "MOBILE_MIDDLE",
]);

export const advertisementInputSchema = z
  .object({
    name: z.string().min(1, "Name is required").max(200),
    imageUrl: z.string().url("Must be a valid URL"),
    targetUrl: z.string().url("Must be a valid URL"),
    placement: adPlacementSchema,
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    active: z.boolean().default(true),
  })
  .refine((data) => data.endDate > data.startDate, {
    message: "endDate must be after startDate",
    path: ["endDate"],
  });

export type AdvertisementInput = z.infer<typeof advertisementInputSchema>;

export const mediaInputSchema = z.object({
  type: z.enum(["IMAGE", "VIDEO"]),
  url: z.string().url("Must be a valid URL"),
  thumbnailUrl: z.string().url().optional(),
  filename: z.string().min(1),
  mimeType: z.string().min(1),
  altText: z.string().min(1, "Alt text is required for accessibility"),
  caption: z.string().max(500).optional(),
  credit: z.string().max(200).optional(),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  fileSize: z.number().int().positive().optional(),
});

export type MediaInput = z.infer<typeof mediaInputSchema>;
