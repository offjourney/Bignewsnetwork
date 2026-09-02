import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NewsCard } from "@/components/NewsCard";
import { tags } from "@/lib/mock-data";
import { getArticlesByTag } from "@/lib/queries";

export function generateStaticParams() {
  return tags.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tag = tags.find((t) => t.slug === slug);
  if (!tag) return {};
  return { title: `#${tag.name}` };
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tag = tags.find((t) => t.slug === slug);
  if (!tag) notFound();

  const articles = await getArticlesByTag(slug);

  return (
    <div className="container-edit py-8">
      <header className="mb-6 border-b-2 border-ink pb-3">
        <p className="text-xs font-bold uppercase tracking-widest text-accent">Түлхүүр үг</p>
        <h1 className="font-serif text-3xl font-bold text-ink md:text-4xl">#{tag.name}</h1>
      </header>

      {articles.length === 0 ? (
        <p className="py-12 text-center text-ink-soft">Энэ түлхүүр үгтэй мэдээ алга байна.</p>
      ) : (
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
          {articles.map((a) => (
            <NewsCard key={a.id} article={a} variant="grid" />
          ))}
        </div>
      )}
    </div>
  );
}
