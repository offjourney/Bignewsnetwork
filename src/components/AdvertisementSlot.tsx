import Image from "next/image";
import type { AdPlacement } from "@/lib/types";
import { getActiveAdvertisement } from "@/lib/queries";

const dims: Record<AdPlacement, { w: number; h: number }> = {
  HOMEPAGE_TOP: { w: 970, h: 90 },
  HOMEPAGE_MIDDLE: { w: 970, h: 160 },
  ARTICLE_TOP: { w: 728, h: 90 },
  ARTICLE_MIDDLE: { w: 728, h: 200 },
  ARTICLE_BOTTOM: { w: 728, h: 90 },
  SIDEBAR: { w: 300, h: 600 },
  MOBILE_TOP: { w: 320, h: 100 },
  MOBILE_MIDDLE: { w: 320, h: 100 },
};

/**
 * Renders the active advertisement for a placement, or a clearly-labelled
 * placeholder when none is active. `width`/`height` can override the
 * placement's default footprint for one-off layout needs.
 */
export async function AdvertisementSlot({
  placement,
  width,
  height,
  className = "",
}: {
  placement: AdPlacement;
  width?: number;
  height?: number;
  className?: string;
}) {
  const ad = await getActiveAdvertisement(placement);
  const w = width ?? dims[placement].w;
  const h = height ?? dims[placement].h;

  return (
    <div className={`w-full ${className}`}>
      <p className="mb-1.5 text-center text-[10px] font-sans font-semibold uppercase tracking-widest text-ink-soft/70">
        Сурталчилгаа
      </p>
      {ad ? (
        <a
          href={ad.targetUrl}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="mx-auto block border border-line bg-paper-dim"
          style={{ maxWidth: w }}
        >
          <Image
            src={ad.imageUrl}
            alt={ad.name}
            width={w}
            height={h}
            className="w-full object-cover"
            style={{ height: `${h}px` }}
          />
        </a>
      ) : (
        <div
          className="mx-auto flex items-center justify-center border border-dashed border-line-strong bg-paper-dim text-xs font-medium text-ink-soft"
          style={{ maxWidth: w, aspectRatio: `${w} / ${h}` }}
        >
          {w} &times; {h}
        </div>
      )}
    </div>
  );
}
