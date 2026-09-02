import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { formatFullDateMn } from "@/lib/utils";
import { galleries } from "@/lib/mock-data";
import { getGalleryBySlug } from "@/lib/queries";

export function generateStaticParams() {
  return galleries.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const gallery = await getGalleryBySlug(slug);
  if (!gallery) return {};
  return {
    title: gallery.title,
    description: gallery.description,
    openGraph: { images: [gallery.coverImage.url] },
  };
}

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const gallery = await getGalleryBySlug(slug);
  if (!gallery) notFound();

  return (
    <div className="container-edit py-8">
      <header className="mx-auto mb-8 max-w-3xl border-b-2 border-ink pb-4">
        <h1 className="font-serif text-3xl font-bold text-ink md:text-4xl">{gallery.title}</h1>
        {gallery.description && <p className="mt-2 text-ink-soft">{gallery.description}</p>}
        <div className="mt-2 flex gap-3 text-sm text-ink-soft">
          <time dateTime={gallery.publishedAt}>{formatFullDateMn(gallery.publishedAt)}</time>
          {gallery.photographer && <span>Зурагчин: {gallery.photographer}</span>}
        </div>
      </header>

      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-2">
        {gallery.images.map((img) => (
          <figure key={img.id} className="border border-line bg-white p-2">
            <div className="relative aspect-[4/3] w-full overflow-hidden">
              <Image
                src={img.url}
                alt={img.caption ?? gallery.title}
                fill
                sizes="(min-width: 640px) 45vw, 90vw"
                className="object-cover"
              />
            </div>
            {(img.caption || img.credit) && (
              <figcaption className="mt-2 px-1 text-xs text-ink-soft">
                {img.caption}
                {img.credit ? ` — ${img.credit}` : ""}
              </figcaption>
            )}
          </figure>
        ))}
      </div>
    </div>
  );
}
