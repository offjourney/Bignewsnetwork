import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/lib/types";

const img = (seed: string) => `https://picsum.photos/seed/${seed}/480/320`;

export function CategoryTiles({ categories }: { categories: Category[] }) {
  if (categories.length === 0) return null;

  return (
    <section aria-labelledby="browse-heading" className="border-b border-line py-8">
      <h2 id="browse-heading" className="mb-5 border-b-2 border-ink pb-2 font-serif text-xl font-bold text-ink md:text-2xl">
        Ангилалаар үзэх
      </h2>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
        {categories.map((c) => (
          <li key={c.slug}>
            <Link
              href={`/${c.slug}`}
              className="group relative block aspect-[3/2] overflow-hidden bg-ink"
            >
              <Image
                src={img(`bnn-tile-${c.slug}`)}
                alt=""
                fill
                sizes="(min-width: 768px) 18vw, 45vw"
                className="object-cover opacity-70 transition-all duration-300 group-hover:scale-105 group-hover:opacity-55"
              />
              <span className="absolute inset-0 flex items-center justify-center bg-ink/25 px-2 text-center font-serif text-sm font-bold uppercase tracking-wide text-paper md:text-base">
                {c.name}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
