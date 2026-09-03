import Link from "next/link";
import { getBreakingNews } from "@/lib/queries";
import { FlameMark } from "./icons/FlameMark";

export async function BreakingNews() {
  const items = await getBreakingNews();

  if (items.length === 0) return null;

  const latestTime = new Date(items[0].publishedAt);
  const hh = String(latestTime.getHours()).padStart(2, "0");
  const mm = String(latestTime.getMinutes()).padStart(2, "0");

  return (
    <div className="border-b border-line bg-paper text-ink">
      <div className="container-edit flex min-h-[34px] items-stretch">
        {/* Breaking label */}
        <div className="flex shrink-0 items-center gap-2 border-r border-line pr-4">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
          </span>

          <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-accent">
            Шуурхай мэдээ
          </span>

          <span className="hidden text-[11px] text-ink-soft sm:inline">
            {hh}:{mm}
          </span>
        </div>

        {/* Ticker */}
        <div className="min-w-0 flex-1 overflow-hidden">
          <div className="ticker-track flex h-full w-max items-center whitespace-nowrap">
            {/* First copy */}
            <ul className="flex h-full shrink-0 items-center gap-10 pr-10">
              {items.map((item) => (
                <li key={`first-${item.id}`} className="text-[13px]">
                  <Link
                    href={`/article/${item.slug}`}
                    className="transition-colors hover:text-accent"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Second copy */}
            <ul className="flex h-full shrink-0 items-center gap-10 pr-10">
              {items.map((item) => (
                <li key={`second-${item.id}`} className="text-[13px]">
                  <Link
                    href={`/article/${item.slug}`}
                    className="transition-colors hover:text-accent"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Latest link */}
        <Link
          href="/latest"
          className="hidden shrink-0 items-center border-l border-line pl-4 text-[11px] font-semibold text-ink-soft transition-colors hover:text-accent md:flex"
        >
          Бүгдийг харах →
        </Link>
      </div>

      <style>{`
        .ticker-track {
          animation: breakingTicker 32s linear infinite;
          will-change: transform;
        }

        @keyframes breakingTicker {
          from {
            transform: translate3d(0, 0, 0);
          }

          to {
            transform: translate3d(-50%, 0, 0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .ticker-track {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
