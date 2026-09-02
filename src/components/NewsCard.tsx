import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/lib/types";
import { formatRelativeMn } from "@/lib/utils";
import { CategoryBadge } from "./CategoryBadge";

interface NewsCardProps {
  article: Article;
  variant?: "hero" | "secondary" | "row" | "compact" | "grid";
  priority?: boolean;
}

export function NewsCard({
  article,
  variant = "grid",
  priority = false,
}: NewsCardProps) {
  const href = `/article/${article.slug}`;

  /*
   * HERO
   */
  if (variant === "hero") {
    return (
      <article className="group relative">
        <Link href={href} className="block">
          <div className="relative aspect-[16/10] w-full overflow-hidden bg-paper-dim">
            <Image
              src={article.image.url}
              alt={article.image.altText}
              fill
              priority={priority}
              sizes="(min-width: 1024px) 66vw, 100vw"
              className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />

          </div>
        </Link>

        <div className="mt-3 space-y-2">
          <CategoryBadge
            name={article.category.name}
            href={`/${article.category.slug}`}
          />

          <h2 className="font-serif text-2xl font-bold leading-tight text-ink md:text-[2rem] md:leading-[1.1]">
            <Link
              href={href}
              className="hover:underline decoration-2 underline-offset-2"
            >
              {article.title}
            </Link>
          </h2>

          <p className="max-w-prose text-[15px] leading-relaxed text-ink-soft">
            {article.excerpt}
          </p>

          <div className="flex items-center gap-2 text-xs text-ink-soft">
            <span>{article.author.name}</span>
            <span aria-hidden="true">&middot;</span>
            <time dateTime={article.publishedAt}>
              {formatRelativeMn(article.publishedAt)}
            </time>
          </div>
        </div>
      </article>
    );
  }

  /*
   * SECONDARY
   */
  if (variant === "secondary") {
    return (
      <article className="group flex gap-3 border-t border-line pt-3 first:border-t-0 first:pt-0 md:block md:border-l md:border-t-0 md:pl-4 md:pt-0 first:md:border-l-0 first:md:pl-0">
        <Link
          href={href}
          className="relative block aspect-[4/3] w-28 shrink-0 overflow-hidden bg-paper-dim md:w-full"
        >
          <Image
            src={article.image.url}
            alt={article.image.altText}
            fill
            sizes="(min-width: 768px) 22vw, 30vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        </Link>

        <div className="min-w-0 space-y-1.5 md:mt-2.5">
          <CategoryBadge
            name={article.category.name}
            href={`/${article.category.slug}`}
          />

          <h3 className="font-serif text-base font-bold leading-snug text-ink">
            <Link
              href={href}
              className="hover:underline decoration-2 underline-offset-2"
            >
              {article.title}
            </Link>
          </h3>

          <time
            dateTime={article.publishedAt}
            className="block text-xs text-ink-soft"
          >
            {formatRelativeMn(article.publishedAt)}
          </time>
        </div>
      </article>
    );
  }

  /*
   * ROW
   *
   * Used by CategorySection.
   * Larger image + more available text space.
   */
  if (variant === "row") {
    return (
      <article className="group flex h-full items-start gap-5">
        <Link
          href={href}
          className="relative block aspect-[4/3] w-40 shrink-0 overflow-hidden bg-paper-dim sm:w-48 lg:w-52"
        >
          <Image
            src={article.image.url}
            alt={article.image.altText}
            fill
            sizes="208px"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        </Link>

        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <CategoryBadge
              name={article.category.name}
              href={`/${article.category.slug}`}
            />

            <time
              dateTime={article.publishedAt}
              className="text-xs text-ink-soft"
            >
              {formatRelativeMn(article.publishedAt)}
            </time>
          </div>

          <h3 className="font-serif text-lg font-bold leading-snug text-ink md:text-xl">
            <Link
              href={href}
              className="hover:underline decoration-2 underline-offset-2"
            >
              {article.title}
            </Link>
          </h3>

          <p className="text-sm leading-relaxed text-ink-soft">
            {article.excerpt}
          </p>
        </div>
      </article>
    );
  }

  /*
   * COMPACT
   */
  if (variant === "compact") {
    return (
      <article className="flex items-start gap-2 border-t border-line pt-2.5 first:border-t-0 first:pt-0">
        <h4 className="font-serif text-sm font-bold leading-snug text-ink">
          <Link
            href={href}
            className="hover:underline decoration-2 underline-offset-2"
          >
            {article.title}
          </Link>
        </h4>
      </article>
    );
  }

  /*
   * GRID
   */
  return (
    <article className="group flex flex-col">
      <Link
        href={href}
        className="relative block aspect-[4/3] w-full overflow-hidden bg-paper-dim"
      >
        <Image
          src={article.image.url}
          alt={article.image.altText}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </Link>

      <div className="mt-2.5 space-y-1.5">
        <CategoryBadge
          name={article.category.name}
          href={`/${article.category.slug}`}
        />

        <h3 className="font-serif text-base font-bold leading-snug text-ink">
          <Link
            href={href}
            className="hover:underline decoration-2 underline-offset-2"
          >
            {article.title}
          </Link>
        </h3>

        <time
          dateTime={article.publishedAt}
          className="block text-xs text-ink-soft"
        >
          {formatRelativeMn(article.publishedAt)}
        </time>
      </div>
    </article>
  );
}
