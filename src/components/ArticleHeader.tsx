import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/lib/types";
import { formatFullDateMn } from "@/lib/utils";
import { CategoryBadge } from "./CategoryBadge";

export function ArticleHeader({ article }: { article: Article }) {
  return (
    <header className="mx-auto max-w-3xl lg:-translate-x-[70px]">
      <CategoryBadge
        name={article.category.name}
        href={`/${article.category.slug}`}
        size="md"
      />
      <h1 className="mt-3 font-serif text-3xl font-bold leading-[1.1] text-ink md:text-[2.75rem]">
        {article.title}
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-ink-soft">
        {article.excerpt}
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-y border-line py-3 text-sm">
        <Link
          href={`/author/${article.author.slug}`}
          className="font-semibold text-ink hover:text-accent"
        >
          {article.author.name}
        </Link>
        <time dateTime={article.publishedAt} className="text-ink-soft">
          {formatFullDateMn(article.publishedAt)}
        </time>
        {article.updatedAt && (
          <span className="text-ink-soft">
            Шинэчлэгдсэн: {formatFullDateMn(article.updatedAt)}
          </span>
        )}
      </div>

      <figure className="relative mt-6 aspect-[16/9] w-full overflow-hidden bg-paper-dim">
        <Image
          src={article.image.url}
          alt={article.image.altText}
          fill
          priority
          sizes="(min-width: 768px) 768px, 100vw"
          className="object-cover"
        />
        {article.image.caption && (
          <figcaption className="absolute bottom-0 left-0 right-0 bg-ink/70 px-3 py-1.5 text-xs text-paper">
            {article.image.caption}
            {article.image.credit ? ` — ${article.image.credit}` : ""}
          </figcaption>
        )}
      </figure>
    </header>
  );
}
