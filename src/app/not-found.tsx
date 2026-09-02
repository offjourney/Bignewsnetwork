import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-edit flex min-h-[50vh] flex-col items-center justify-center py-20 text-center">
      <p className="font-serif text-7xl font-black text-line-strong">404</p>
      <h1 className="mt-4 font-serif text-2xl font-bold text-ink">Хуудас олдсонгүй</h1>
      <p className="mt-2 max-w-md text-ink-soft">
        Таны хайсан хуудас устсан эсвэл хаяг нь буруу байна. Мэдээллийн санд байхгүй нийтлэлд холбогдсон байж болзошгүй.
      </p>
      <Link
        href="/"
        className="mt-6 border border-masthead bg-masthead px-5 py-2.5 text-sm font-semibold text-paper hover:bg-masthead-soft"
      >
        Нүүр хуудас руу буцах
      </Link>
    </div>
  );
}
