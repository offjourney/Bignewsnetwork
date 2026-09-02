import Link from "next/link";
import type { Tag } from "@/lib/types";

export function PopularTags({ tags, title = "Түлхүүр үг" }: { tags: Tag[]; title?: string }) {
  if (tags.length === 0) return null;

  return (
    <aside aria-labelledby="popular-tags-heading" className="border border-line bg-white p-4">
      <h2 id="popular-tags-heading" className="mb-3 border-b-2 border-ink pb-2 font-serif text-lg font-bold text-ink">
        {title}
      </h2>
      <ul className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <li key={tag.id}>
            <Link
              href={`/tag/${tag.slug}`}
              className="inline-block border border-line px-3 py-1.5 text-xs font-semibold text-ink-soft hover:border-masthead hover:text-masthead"
            >
              #{tag.name}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
