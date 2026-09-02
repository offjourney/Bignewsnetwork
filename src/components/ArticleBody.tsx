import Link from "next/link";
import type { Article } from "@/lib/types";

export function ArticleBody({ article }: { article: Article }) {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 md:px-6">
      {/*
        `content` is sanitized, editor-authored HTML (from TipTap in later
        phases). Sample content here is static and authored by us.
      */}
      <div
        className="prose-article font-serif text-[19px] leading-[1.75] text-ink [&_blockquote]:my-6 [&_blockquote]:border-l-4 [&_blockquote]:border-accent [&_blockquote]:pl-4 [&_blockquote]:font-sans [&_blockquote]:text-[17px] [&_blockquote]:italic [&_blockquote]:text-ink-soft [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:font-bold [&_p]:mb-5 [&_ul]:mb-5 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:mb-5 [&_ol]:list-decimal [&_ol]:pl-6 [&_a]:text-accent [&_a]:underline [&_a]:underline-offset-2 [&_hr]:my-8 [&_hr]:border-line"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      {article.tags.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-2 border-t border-line pt-5">
          {article.tags.map((tag) => (
            <Link
              key={tag.id}
              href={`/tag/${tag.slug}`}
              className="border border-line px-3 py-1 text-xs font-semibold text-ink-soft hover:border-masthead hover:text-masthead"
            >
              #{tag.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
