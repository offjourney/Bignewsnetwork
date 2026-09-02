import type { Metadata } from "next";
import Link from "next/link";
import { NewsCard } from "@/components/NewsCard";
import { getLatestArticles } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Сүүлийн үеийн мэдээ",
};

const PAGE_SIZE = 12;

export default async function LatestPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const offset = (page - 1) * PAGE_SIZE;

  const [articles, nextPageArticles] = await Promise.all([
    getLatestArticles(PAGE_SIZE, offset),
    getLatestArticles(1, offset + PAGE_SIZE),
  ]);
  const hasNext = nextPageArticles.length > 0;

  return (
    <div className="container-edit py-8">
      <header className="mb-6 border-b-2 border-ink pb-3">
        <h1 className="font-serif text-3xl font-bold text-ink md:text-4xl">Сүүлийн үеийн мэдээ</h1>
      </header>

      {articles.length === 0 ? (
        <p className="py-12 text-center text-ink-soft">Мэдээ олдсонгүй.</p>
      ) : (
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
          {articles.map((a) => (
            <NewsCard key={a.id} article={a} variant="grid" />
          ))}
        </div>
      )}

      <nav className="mt-10 flex items-center justify-center gap-3" aria-label="Хуудаслалт">
        {page > 1 && (
          <Link
            href={`/latest?page=${page - 1}`}
            className="border border-line px-4 py-2 text-sm font-semibold text-ink hover:border-masthead hover:text-masthead"
          >
            ← Өмнөх
          </Link>
        )}
        <span className="px-2 text-sm text-ink-soft">Хуудас {page}</span>
        {hasNext && (
          <Link
            href={`/latest?page=${page + 1}`}
            className="border border-line px-4 py-2 text-sm font-semibold text-ink hover:border-masthead hover:text-masthead"
          >
            Дараах →
          </Link>
        )}
      </nav>
    </div>
  );
}
