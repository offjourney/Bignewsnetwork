import type { Article } from "@/lib/types";
import { NewsCard } from "./NewsCard";

export function RelatedArticles({ articles }: { articles: Article[] }) {
  if (articles.length === 0) return null;

  return (
    <section aria-labelledby="related-heading" className="mx-auto mt-12 max-w-5xl border-t border-line pt-8">
      <h2 id="related-heading" className="mb-5 border-b-2 border-ink pb-2 font-serif text-xl font-bold text-ink">
        Холбоотой мэдээ
      </h2>
      <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4">
        {articles.map((a) => (
          <NewsCard key={a.id} article={a} variant="grid" />
        ))}
      </div>
    </section>
  );
}
