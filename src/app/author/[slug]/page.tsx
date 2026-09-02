import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { NewsCard } from "@/components/NewsCard";
import { authors } from "@/lib/mock-data";
import { getAuthorArticles, getAuthorBySlug } from "@/lib/queries";

export function generateStaticParams() {
  return authors.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const author = await getAuthorBySlug(slug);
  if (!author) return {};
  return { title: author.name, description: author.biography };
}

export default async function AuthorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const author = await getAuthorBySlug(slug);
  if (!author) notFound();

  const articles = await getAuthorArticles(slug);

  return (
    <div className="container-edit py-8">
      <header className="mb-8 flex items-center gap-4 border-b-2 border-ink pb-6">
        {author.photoUrl && (
          <div className="relative h-20 w-20 shrink-0 overflow-hidden border border-line">
            <Image src={author.photoUrl} alt={author.name} fill sizes="80px" className="object-cover" />
          </div>
        )}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-accent">Сэтгүүлч</p>
          <h1 className="font-serif text-2xl font-bold text-ink md:text-3xl">{author.name}</h1>
          {author.biography && <p className="mt-1 max-w-xl text-sm text-ink-soft">{author.biography}</p>}
        </div>
      </header>

      {articles.length === 0 ? (
        <p className="py-12 text-center text-ink-soft">Нийтлэл алга байна.</p>
      ) : (
        <div className="grid grid-cols-1 divide-y divide-line">
          {articles.map((a) => (
            <NewsCard key={a.id} article={a} variant="row" />
          ))}
        </div>
      )}
    </div>
  );
}
