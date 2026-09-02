import Image from "next/image";
import Link from "next/link";
import type { Gallery } from "@/lib/types";

export function GalleryCard({ gallery }: { gallery: Gallery }) {
  return (
    <article className="group">
      <Link href={`/photos/${gallery.slug}`} className="relative block aspect-[4/3] w-full overflow-hidden bg-paper-dim">
        <Image
          src={gallery.coverImage.url}
          alt={gallery.title}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
        <span className="absolute bottom-2 right-2 flex items-center gap-1 bg-ink/80 px-2 py-1 text-xs font-semibold text-paper">
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current">
            <path d="M4 5h3l1.6-2h6.8L17 5h3a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Zm8 3a5 5 0 1 0 0 10 5 5 0 0 0 0-10Z" />
          </svg>
          {gallery.images.length}
        </span>
      </Link>
      <div className="mt-2.5 space-y-1">
        <h3 className="font-serif text-base font-bold leading-snug text-ink">
          <Link href={`/photos/${gallery.slug}`} className="hover:underline decoration-2 underline-offset-2">
            {gallery.title}
          </Link>
        </h3>
        {gallery.photographer && <p className="text-xs text-ink-soft">Зурагчин: {gallery.photographer}</p>}
      </div>
    </article>
  );
}
