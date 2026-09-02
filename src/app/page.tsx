import type { Metadata } from "next";
import Link from "next/link";

import { BreakingNews } from "@/components/BreakingNews";
import { FeaturedStory } from "@/components/FeaturedStory";
import { LatestNews } from "@/components/LatestNews";
import { CategorySection } from "@/components/CategorySection";
import { MostRead } from "@/components/MostRead";
import { PopularTags } from "@/components/PopularTags";
import { AdvertisementSlot } from "@/components/AdvertisementSlot";
import { VideoCard } from "@/components/VideoCard";
import { GalleryCard } from "@/components/GalleryCard";

import { tags as allTags } from "@/lib/mock-data";

import {
  getArticlesByCategory,
  getCategories,
  getCategoryBySlug,
  getFeaturedArticles,
  getGalleries,
  getLatestArticles,
  getMostReadArticles,
  getVideos,
} from "@/lib/queries";

export const metadata: Metadata = {
  title: "Нүүр",
};

const homepageCategorySlugs = [
  "politics",
  "economy",
  "business",
  "mining",
  "geopolitics",
  "technology",
  "analyticnews",
  "factcheck",
  "editorial",
  "video",
  "debate",
  "podcast",
];

export default async function Home() {
  const [
    featured,
    latest,
    mostRead,
    videos,
    galleries,
    allCategories,
    categorySections,
  ] = await Promise.all([
    getFeaturedArticles(4),
    getLatestArticles(8),
    getMostReadArticles("week", 5),
    getVideos(3),
    getGalleries(3),
    getCategories(),
    Promise.all(
      homepageCategorySlugs.map(async (slug) => ({
        category: await getCategoryBySlug(slug),
        articles: await getArticlesByCategory(slug, 5),
      })),
    ),
  ]);

  return (
    <>
      {/* Breaking News */}
      <BreakingNews />

      {/* Main homepage container */}
      <div className="container-edit py-6">

        {/* =====================================================
            TOP SECTION
            Hero + Latest News + Sidebar
        ====================================================== */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <main className="min-w-0">
            <FeaturedStory articles={featured} />
            <LatestNews articles={latest} />
          </main>

          <aside className="self-start space-y-8">
            <MostRead articles={mostRead} />
            <AdvertisementSlot placement="SIDEBAR" />
            <PopularTags tags={allTags.slice(0, 10)} />
          </aside>
        </div>

        {/* Full-width separator above advertisement */}
        <div className="w-full border-b border-line" />

        {/* Full-width homepage advertisement */}
        <section className="w-full border-b border-line py-8">
          <AdvertisementSlot placement="HOMEPAGE_MIDDLE" />
        </section>

        {/* =====================================================
            FULL-WIDTH CATEGORY SECTIONS
        ====================================================== */}
        <div className="w-full">
          {categorySections.map(({ category, articles }) =>
            category ? (
              <CategorySection
                key={category.slug}
                category={category}
                articles={articles}
              />
            ) : null,
          )}
        </div>

        {/* =====================================================
            VIDEO SECTION
        ====================================================== */}
        <section
          aria-labelledby="video-heading"
          className="border-b border-line py-8"
        >
          <div className="mb-5 flex items-baseline justify-between border-b-2 border-ink pb-2">
            <h2
              id="video-heading"
              className="font-serif text-xl font-bold text-ink md:text-2xl"
            >
              Видео мэдээ
            </h2>

            <Link
              href="/video"
              className="text-sm font-semibold text-accent hover:text-masthead"
            >
              Бүх видео →
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {videos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        </section>

        {/* =====================================================
            PHOTO GALLERY SECTION
        ====================================================== */}
        <section
          aria-labelledby="gallery-heading"
          className="border-b border-line py-8"
        >
          <div className="mb-5 flex items-baseline justify-between border-b-2 border-ink pb-2">
            <h2
              id="gallery-heading"
              className="font-serif text-xl font-bold text-ink md:text-2xl"
            >
              Фото агшин
            </h2>

            <Link
              href="/photos"
              className="text-sm font-semibold text-accent hover:text-masthead"
            >
              Бүх цомог →
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {galleries.map((gallery) => (
              <GalleryCard key={gallery.id} gallery={gallery} />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
