import type { Metadata } from "next";
import { GalleryCard } from "@/components/GalleryCard";
import { getGalleries } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Гэрэл зураг",
};

export default async function PhotosPage() {
  const galleries = await getGalleries(30);

  return (
    <div className="container-edit py-8">
      <header className="mb-6 border-b-2 border-ink pb-3">
        <h1 className="font-serif text-3xl font-bold text-ink md:text-4xl">Гэрэл зураг</h1>
      </header>

      {galleries.length === 0 ? (
        <p className="py-12 text-center text-ink-soft">Цомог алга байна.</p>
      ) : (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {galleries.map((g) => (
            <GalleryCard key={g.id} gallery={g} />
          ))}
        </div>
      )}
    </div>
  );
}
