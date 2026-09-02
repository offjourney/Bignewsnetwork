import type { Metadata } from "next";
import { VideoCard } from "@/components/VideoCard";
import { getVideos } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Видео мэдээ",
};

export default async function VideoPage() {
  const videos = await getVideos(30);

  return (
    <div className="container-edit py-8">
      <header className="mb-6 border-b-2 border-ink pb-3">
        <h1 className="font-serif text-3xl font-bold text-ink md:text-4xl">
          Видео мэдээ
        </h1>
      </header>

      {videos.length === 0 ? (
        <p className="py-12 text-center text-ink-soft">Видео алга байна.</p>
      ) : (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((v) => (
            <VideoCard key={v.id} video={v} />
          ))}
        </div>
      )}
    </div>
  );
}
