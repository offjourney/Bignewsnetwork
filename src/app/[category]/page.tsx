import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { NewsCard } from "@/components/NewsCard";
import { MostRead } from "@/components/MostRead";
import { PopularTags } from "@/components/PopularTags";
import { AdvertisementSlot } from "@/components/AdvertisementSlot";
import { tags as allTags } from "@/lib/mock-data";
import { categorySlugs } from "@/lib/site-config";
import { getArticlesByCategory, getCategoryBySlug, getMostReadArticles } from "@/lib/queries";

export const dynamicParams = false;

const PAGE_SIZE = 9;

export function generateStaticParams() {
  return categorySlugs.map((category) => ({ category }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category: slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return {};
  return {
    title: category.name,
    description: category.description,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { category: slug } = await params;
  const { page: pageParam } = await searchParams;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const page = Math.max(1, Number(pageParam) || 1);
  const offset = (page - 1) * PAGE_SIZE;

  const [allArticles, nextPageArticles, mostRead] = await Promise.all([
    getArticlesByCategory(slug, PAGE_SIZE, offset),
    getArticlesByCategory(slug, 1, offset + PAGE_SIZE),
    getMostReadArticles("week", 5),
  ]);
  const hasNext = nextPageArticles.length > 0;

  // On page 1, lead with a large featured story; later pages are a flat grid.
  const [lead, ...rest] = allArticles;

  return (
    <div className="container-edit py-8">
      <header className="mb-6 border-b-2 border-masthead pb-3">
        <h1 className="font-serif text-3xl font-bold text-masthead md:text-4xl">{category.name}</h1>
        {category.description && <p className="mt-1 text-ink-soft">{category.description}</p>}
      </header>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_320px]">
        <div className="min-w-0">
          {allArticles.length === 0 ? (
            <p className="py-12 text-center text-ink-soft">Одоогоор мэдээ алга байна.</p>
          ) : (
            <>
              {page === 1 && lead && (
                <div className="mb-8 border-b border-line pb-8">
                  <NewsCard article={lead} variant="hero" priority />
                </div>
              )}

              <h2 className="mb-5 border-b-2 border-ink pb-2 font-serif text-lg font-bold text-ink">
                {page === 1 ? `Шинэ мэдээ` : `Хуудас ${page}`}
              </h2>
              <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3">
                {(page === 1 ? rest : allArticles).map((a) => (
                  <NewsCard key={a.id} article={a} variant="grid" />
                ))}
              </div>
            </>
          )}

          <nav className="mt-10 flex items-center justify-center gap-3" aria-label="Хуудаслалт">
            {page > 1 && (
              <Link
                href={`/${slug}?page=${page - 1}`}
                className="border border-line px-4 py-2 text-sm font-semibold text-ink hover:border-masthead hover:text-masthead"
              >
                ← Өмнөх
              </Link>
            )}
            {(page > 1 || hasNext) && <span className="px-2 text-sm text-ink-soft">Хуудас {page}</span>}
            {hasNext && (
              <Link
                href={`/${slug}?page=${page + 1}`}
                className="border border-line px-4 py-2 text-sm font-semibold text-ink hover:border-masthead hover:text-masthead"
              >
                Дараах →
              </Link>
            )}
          </nav>
        </div>
        <aside className="space-y-8">
          <MostRead articles={mostRead} />
          <AdvertisementSlot placement="SIDEBAR" />
          <PopularTags tags={allTags.slice(0, 8)} />
        </aside>
      </div>
    </div>
  );
}
