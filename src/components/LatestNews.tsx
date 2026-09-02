import Link from "next/link";
import type { Article } from "@/lib/types";
import { NewsCard } from "./NewsCard";

export function LatestNews({ articles, viewAllHref = "/latest" }: { articles: Article[]; viewAllHref?: string }) {
  if (articles.length === 0) return null;

  return (
    <section aria-labelledby="latest-heading" className="border-b border-line py-8">
      <div className="mb-5 flex items-baseline justify-between border-b-2 border-ink pb-2">
        <h2 id="latest-heading" className="font-serif text-xl font-bold text-ink md:text-2xl">
          Цаг үеийн мэдээ, мэдээлэл
        </h2>
        <Link href={viewAllHref} className="text-sm font-semibold text-accent hover:text-masthead">
          Бүх мэдээ →
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
        {articles.map((a) => (
          <NewsCard key={a.id} article={a} variant="grid" />
        ))}
      </div>
    </section>
  );
}
