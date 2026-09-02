-- BigNewsNetwork initial schema.
--
-- Generated to exactly match prisma/schema.prisma. This was applied by hand
-- because this sandbox's network egress blocks binaries.prisma.sh (the
-- Prisma CLI's schema-engine download host), so `prisma migrate dev` could
-- not run here. In any environment with normal network access, running
-- `npx prisma migrate dev` against this same schema.prisma will produce an
-- equivalent migration; this file follows Prisma's own SQL conventions
-- (quoted camelCase identifiers, snake_case table names via @map) so it
-- stays a drop-in match.

-- Enums -----------------------------------------------------------------

CREATE TYPE "Role" AS ENUM ('ADMIN', 'EDITOR', 'JOURNALIST', 'PHOTOGRAPHER', 'AD_MANAGER');
CREATE TYPE "ArticleStatus" AS ENUM ('DRAFT', 'REVIEW', 'SCHEDULED', 'PUBLISHED', 'ARCHIVED');
CREATE TYPE "MediaType" AS ENUM ('IMAGE', 'VIDEO');
CREATE TYPE "ArticleMediaRole" AS ENUM ('FEATURED', 'INLINE', 'GALLERY');
CREATE TYPE "VideoPlatform" AS ENUM ('YOUTUBE', 'FACEBOOK', 'EXTERNAL');
CREATE TYPE "AdPlacement" AS ENUM ('HOMEPAGE_TOP', 'HOMEPAGE_MIDDLE', 'ARTICLE_TOP', 'ARTICLE_MIDDLE', 'ARTICLE_BOTTOM', 'SIDEBAR', 'MOBILE_TOP', 'MOBILE_MIDDLE');

-- users -------------------------------------------------------------------

CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE INDEX "users_role_idx" ON "users"("role");

-- authors -------------------------------------------------------------------

CREATE TABLE "authors" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "biography" TEXT,
    "photoUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "authors_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "authors_userId_key" ON "authors"("userId");
CREATE UNIQUE INDEX "authors_slug_key" ON "authors"("slug");
CREATE INDEX "authors_slug_idx" ON "authors"("slug");

-- categories -------------------------------------------------------------------

CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "parentId" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");
CREATE INDEX "categories_slug_idx" ON "categories"("slug");
CREATE INDEX "categories_parentId_idx" ON "categories"("parentId");

-- tags -------------------------------------------------------------------

CREATE TABLE "tags" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "tags_slug_key" ON "tags"("slug");
CREATE INDEX "tags_slug_idx" ON "tags"("slug");

-- media -------------------------------------------------------------------

CREATE TABLE "media" (
    "id" TEXT NOT NULL,
    "type" "MediaType" NOT NULL,
    "url" TEXT NOT NULL,
    "thumbnailUrl" TEXT,
    "filename" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "altText" TEXT NOT NULL,
    "caption" TEXT,
    "credit" TEXT,
    "width" INTEGER,
    "height" INTEGER,
    "fileSize" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "media_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "media_type_idx" ON "media"("type");

-- article_media -------------------------------------------------------------------

CREATE TABLE "article_media" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "role" "ArticleMediaRole" NOT NULL DEFAULT 'INLINE',

    CONSTRAINT "article_media_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "article_media_articleId_mediaId_role_key" ON "article_media"("articleId", "mediaId", "role");
CREATE INDEX "article_media_articleId_idx" ON "article_media"("articleId");

-- articles -------------------------------------------------------------------

CREATE TABLE "articles" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "status" "ArticleStatus" NOT NULL DEFAULT 'DRAFT',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "breaking" BOOLEAN NOT NULL DEFAULT false,
    "views" INTEGER NOT NULL DEFAULT 0,
    "authorId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "featuredMediaId" TEXT,
    "publishedAt" TIMESTAMP(3),
    "scheduledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "articles_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "articles_slug_key" ON "articles"("slug");
CREATE INDEX "articles_slug_idx" ON "articles"("slug");
CREATE INDEX "articles_status_idx" ON "articles"("status");
CREATE INDEX "articles_publishedAt_idx" ON "articles"("publishedAt");
CREATE INDEX "articles_categoryId_idx" ON "articles"("categoryId");
CREATE INDEX "articles_authorId_idx" ON "articles"("authorId");
CREATE INDEX "articles_featured_idx" ON "articles"("featured");
CREATE INDEX "articles_breaking_idx" ON "articles"("breaking");
CREATE INDEX "articles_views_idx" ON "articles"("views");

-- article_tags -------------------------------------------------------------------

CREATE TABLE "article_tags" (
    "articleId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "article_tags_pkey" PRIMARY KEY ("articleId", "tagId")
);
CREATE INDEX "article_tags_tagId_idx" ON "article_tags"("tagId");

-- article_revisions -------------------------------------------------------------------

CREATE TABLE "article_revisions" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "article_revisions_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "article_revisions_articleId_idx" ON "article_revisions"("articleId");

-- videos -------------------------------------------------------------------

CREATE TABLE "videos" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "platform" "VideoPlatform" NOT NULL,
    "videoUrl" TEXT NOT NULL,
    "embedUrl" TEXT,
    "thumbnailUrl" TEXT NOT NULL,
    "duration" INTEGER,
    "articleId" TEXT,
    "publishedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "videos_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "videos_platform_idx" ON "videos"("platform");
CREATE INDEX "videos_publishedAt_idx" ON "videos"("publishedAt");

-- galleries -------------------------------------------------------------------

CREATE TABLE "galleries" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "coverMediaId" TEXT NOT NULL,
    "publishedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "galleries_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "galleries_slug_key" ON "galleries"("slug");
CREATE INDEX "galleries_slug_idx" ON "galleries"("slug");

-- gallery_images -------------------------------------------------------------------

CREATE TABLE "gallery_images" (
    "id" TEXT NOT NULL,
    "galleryId" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "caption" TEXT,
    "credit" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "gallery_images_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "gallery_images_galleryId_idx" ON "gallery_images"("galleryId");

-- advertisements -------------------------------------------------------------------

CREATE TABLE "advertisements" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "targetUrl" TEXT NOT NULL,
    "placement" "AdPlacement" NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "advertisements_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "advertisements_placement_idx" ON "advertisements"("placement");
CREATE INDEX "advertisements_active_idx" ON "advertisements"("active");
CREATE INDEX "advertisements_startDate_idx" ON "advertisements"("startDate");
CREATE INDEX "advertisements_endDate_idx" ON "advertisements"("endDate");

-- site_settings -------------------------------------------------------------------

CREATE TABLE "site_settings" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "site_settings_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "site_settings_key_key" ON "site_settings"("key");

-- Foreign keys ------------------------------------------------------------

ALTER TABLE "authors" ADD CONSTRAINT "authors_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "categories" ADD CONSTRAINT "categories_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "article_media" ADD CONSTRAINT "article_media_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "article_media" ADD CONSTRAINT "article_media_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "media"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "articles" ADD CONSTRAINT "articles_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "authors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "articles" ADD CONSTRAINT "articles_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "articles" ADD CONSTRAINT "articles_featuredMediaId_fkey" FOREIGN KEY ("featuredMediaId") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "article_tags" ADD CONSTRAINT "article_tags_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "article_tags" ADD CONSTRAINT "article_tags_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "article_revisions" ADD CONSTRAINT "article_revisions_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "article_revisions" ADD CONSTRAINT "article_revisions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "videos" ADD CONSTRAINT "videos_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "galleries" ADD CONSTRAINT "galleries_coverMediaId_fkey" FOREIGN KEY ("coverMediaId") REFERENCES "media"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "gallery_images" ADD CONSTRAINT "gallery_images_galleryId_fkey" FOREIGN KEY ("galleryId") REFERENCES "galleries"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "gallery_images" ADD CONSTRAINT "gallery_images_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "media"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
