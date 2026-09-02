import type { Article } from "@/lib/types";
import { NewsCard } from "./NewsCard";

export function FeaturedStory({ articles }: { articles: Article[] }) {
  if (articles.length === 0) return null;

  const [main, ...rest] = articles;

  // Only show two secondary stories beside the main story.
  // This prevents additional text-only stories from appearing
  // underneath the image cards.
  const secondary = rest.slice(0, 2);

  return (
    <section
      aria-labelledby="featured-heading"
      className="border-b border-line pb-8"
    >
      <h2 id="featured-heading" className="sr-only">
        Онцлох мэдээ
      </h2>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main hero */}
        <div className="lg:col-span-2 min-w-0">
          <NewsCard article={main} variant="hero" priority />
        </div>

        {/* Two secondary stories */}
        <div className="grid min-w-0 grid-cols-1 gap-4 lg:grid-rows-2 lg:gap-4">
          {secondary.map((article) => (
            <div key={article.id} className="min-h-0">
              <NewsCard article={article} variant="secondary" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
