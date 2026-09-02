import Link from "next/link";
import type { Article } from "@/lib/types";
import { formatViews } from "@/lib/utils";

export function MostRead({ articles, title = "Хамгийн их уншсан" }: { articles: Article[]; title?: string }) {
  if (articles.length === 0) return null;

  return (
    <aside aria-labelledby="most-read-heading" className="border border-line bg-white p-4">
      <h2 id="most-read-heading" className="mb-3 border-b-2 border-ink pb-2 font-serif text-lg font-bold text-ink">
        {title}
      </h2>
      <ol className="space-y-3">
        {articles.map((a, i) => (
          <li key={a.id} className="flex gap-3">
            <span className="font-serif text-2xl font-black leading-none text-line-strong">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="min-w-0">
              <h3 className="font-serif text-sm font-bold leading-snug text-ink">
                <Link href={`/article/${a.slug}`} className="hover:underline decoration-2 underline-offset-2">
                  {a.title}
                </Link>
              </h3>
          
              {/*<p className="mt-1 text-xs text-ink-soft">{formatViews(a.views)} үзсэн</p>*/}
            </div>
          </li>
        ))}
      </ol>
    </aside>
  );
}
