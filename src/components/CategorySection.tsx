import Link from "next/link";
import type { Article, Category } from "@/lib/types";
import { NewsCard } from "./NewsCard";

export function CategorySection({
  category,
  articles,
}: {
  category: Category;
  articles: Article[];
}) {
  if (articles.length === 0) return null;

  const [lead, ...rest] = articles;

  const smaller = rest.slice(0, 2);

  return (
    <section
      aria-labelledby={`section-${category.slug}`}
      className="border-b border-line py-8"
    >
      {/* Header */}
      <div className="mb-5 flex items-baseline justify-between border-b-2 border-masthead pb-2">
        <h2
          id={`section-${category.slug}`}
          className="font-serif text-xl font-bold text-masthead md:text-2xl"
        >
          {category.name}
        </h2>

        <Link
          href={`/${category.slug}`}
          className="text-sm font-semibold text-accent hover:text-masthead"
        >
          Бүх мэдээ →
        </Link>
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.25fr_1fr]">
        {/* Lead article */}
        <div className="min-w-0">
          <NewsCard article={lead} variant="hero" />
        </div>

        {/* Secondary articles */}
        <div className="flex flex-col">
          {smaller.map((article, index) => (
            <div
              key={article.id}
              className={`
                ${index === 1 ? "mt-5 border-t border-line pt-5" : ""}
              `}
            >
              <NewsCard article={article} variant="row" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
