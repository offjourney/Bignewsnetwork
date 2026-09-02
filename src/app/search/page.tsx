import type { Metadata } from "next";
import { NewsCard } from "@/components/NewsCard";
import { searchArticles } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Хайлт",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const results = q ? await searchArticles(q, 30) : [];

  return (
    <div className="container-edit py-8">
      <header className="mb-6 border-b-2 border-ink pb-3">
        <h1 className="font-serif text-3xl font-bold text-ink md:text-4xl">Хайлт</h1>
        <form action="/search" method="GET" role="search" className="mt-4 flex max-w-lg">
          <label htmlFor="q" className="sr-only">
            Мэдээ хайх
          </label>
          <input
            id="q"
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Түлхүүр үг оруулна уу..."
            className="w-full border border-line bg-white px-3 py-2.5 text-sm text-ink placeholder:text-ink-soft focus:border-masthead focus:outline-none"
          />
          <button
            type="submit"
            className="shrink-0 border border-l-0 border-line bg-masthead px-5 text-sm font-semibold text-paper hover:bg-masthead-soft"
          >
            Хайх
          </button>
        </form>
      </header>

      {q ? (
        <>
          <p className="mb-6 text-sm text-ink-soft">
            &ldquo;{q}&rdquo; хайлтад {results.length} илэрц олдлоо.
          </p>
          {results.length === 0 ? (
            <p className="py-12 text-center text-ink-soft">Илэрц олдсонгүй. Өөр түлхүүр үгээр хайж үзнэ үү.</p>
          ) : (
            <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((a) => (
                <NewsCard key={a.id} article={a} variant="grid" />
              ))}
            </div>
          )}
        </>
      ) : (
        <p className="py-12 text-center text-ink-soft">Хайх түлхүүр үгээ оруулна уу.</p>
      )}
    </div>
  );
}
