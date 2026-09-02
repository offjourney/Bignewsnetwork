import Image from "next/image";
import Link from "next/link";
import type { VideoItem } from "@/lib/types";
import { formatRelativeMn, getYoutubeThumbnail } from "@/lib/utils";

export function VideoCard({ video }: { video: VideoItem }) {
  const thumbnailUrl =
    video.source === "YOUTUBE"
      ? getYoutubeThumbnail(video.url)
      : video.thumbnailUrl;

  return (
    <article className="group">
      <Link
        href={video.url}
        target="_blank"
        rel="noopener noreferrer"
        className="relative block aspect-video w-full overflow-hidden bg-ink"
      >
        <Image
          src={thumbnailUrl || "/placeholder.jpg"}
          alt={video.title}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className="object-cover opacity-90 transition-opacity group-hover:opacity-70"
        />

        <span className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/90 text-paper shadow-lg transition-transform group-hover:scale-110">
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5 translate-x-0.5 fill-current"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </span>
      </Link>

      <div className="mt-2.5 space-y-1">
        <h3 className="font-serif text-base font-bold leading-snug text-ink">
          <Link
            href={video.url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline decoration-2 underline-offset-2"
          >
            {video.title}
          </Link>
        </h3>

        <time
          dateTime={video.publishedAt}
          className="block text-xs text-ink-soft"
        >
          {formatRelativeMn(video.publishedAt)}
        </time>
      </div>
    </article>
  );
}
