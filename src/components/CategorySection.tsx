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

  // Use only two secondary stories.
  // This keeps the section visually balanced.
  const smaller = rest.slice(0, 2);

  return (
    <section
      aria-labelledby={`section-${category.slug}`}
      className="border-b border-line py-8"
    >
      {/* Category heading */}
      <div className="mb-5 flex items-baseline justify-between border-b-2 border-masthead pb-2">
        <h2
          id={`section-${category.slug}`}
          className="font-serif text-xl font-bold text-masthead md:text-2xl"
        >
          {category.name}
        </h2>

        <Link
          href={`/${category.slug}`}
          className="text-sm font-semibold text-accent transition-colors hover:text-masthead"
        >
          Бүх мэдээ →
        </Link>
      </div>

      {/* Category stories */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.45fr]">
        {/* Main story */}
        <div className="min-w-0">
          <NewsCard article={lead} variant="grid" />
        </div>

        {/* Two secondary stories */}
        <div className="grid min-w-0 grid-rows-2">
          {smaller.map((article, index) => (
            <div
              key={article.id}
              className={`
                min-h-0
                ${index === 0 ? "pb-5" : "border-t border-line pt-5"}
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