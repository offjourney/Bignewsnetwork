const monthsMn = [
  "1-р сар",
  "2-р сар",
  "3-р сар",
  "4-р сар",
  "5-р сар",
  "6-р сар",
  "7-р сар",
  "8-р сар",
  "9-р сар",
  "10-р сар",
  "11-р сар",
  "12-р сар",
];

/** Relative-ish Mongolian timestamp: "5 минутын өмнө", "3 цагийн өмнө", or a full date. */
export function formatRelativeMn(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / (1000 * 60));
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffMin < 1) return "дөнгөж сая";
  if (diffMin < 60) return `${diffMin} минутын өмнө`;
  if (diffHour < 24) return `${diffHour} цагийн өмнө`;
  if (diffDay < 7) return `${diffDay} өдрийн өмнө`;

  return formatFullDateMn(iso);
}

export function formatFullDateMn(iso: string): string {
  const date = new Date(iso);
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  return `${date.getFullYear()} оны ${monthsMn[date.getMonth()]}ын ${date.getDate()}, ${hh}:${mm}`;
}

export function formatViews(views: number): string {
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}сая`;
  if (views >= 1_000) return `${(views / 1_000).toFixed(1)}мянга`;
  return String(views);
}

export function todayLongMn(): string {
  const days = ["Ням", "Даваа", "Мягмар", "Лхагва", "Пүрэв", "Баасан", "Бямба"];
  const now = new Date();
  return `${now.getFullYear()} оны ${monthsMn[now.getMonth()]}ын ${now.getDate()}, ${days[now.getDay()]} гараг`;
}

export function getYoutubeThumbnail(url: string) {
  try {
    const parsedUrl = new URL(url);

    let videoId = parsedUrl.searchParams.get("v");

    if (!videoId && parsedUrl.hostname === "youtu.be") {
      videoId = parsedUrl.pathname.slice(1);
    }

    if (!videoId && parsedUrl.pathname.startsWith("/shorts/")) {
      videoId = parsedUrl.pathname.split("/")[2];
    }

    return videoId
      ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
      : null;
  } catch {
    return null;
  }
}
