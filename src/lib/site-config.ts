export const siteConfig = {
  name: "Bignewsnetwork",
  wordmark: "BIGNEWSNETWORK",
  tagline: "Монголын мэдээллийн сүлжээ",
  description:
    "Bignewsnetwork — Стратегийн мэдээлэл, анализ, хэтийн төлөвийн медиа платформ.",
  url: "https://bignewsnetwork.mn",
  social: {
    facebook: "https://facebook.com",
    twitter: "https://x.com",
    youtube: "https://youtube.com/@bignewsnetworkmn",
  },
};

export interface NavItem {
  label: string;
  href: string;
}

/** Primary navigation. Category hrefs map to the `/[category]` dynamic route. */
export const primaryNav: NavItem[] = [
  { label: "Нүүр", href: "/" },
  { label: "Улс төр", href: "/politics" },
  { label: "Эдийн засаг", href: "/economy" },
  { label: "Бизнес", href: "/business" },
  { label: "Уул уурхай", href: "/mining" },
  { label: "Геополитик", href: "/geopolitics" },
  { label: "Технологи", href: "/technology" },
  { label: "BIGNEWS | Аналитик", href: "/analyticnews" },
  { label: "BIGNEWS | Факт-чек", href: "/factcheck" },
  { label: "Нийтлэл", href: "/editorial" },
  { label: "Видео мэдээ", href: "/video" },
  { label: "Мэтгэлцээн", href: "/debate" },
  { label: "Подкаст", href: "/podcast" },  
];

/** Secondary utility links, shown in the top bar / footer. */
export const secondaryNav: NavItem[] = [
  { label: "Фото агшин", href: "/photos" },
];

/** "About" links shown in the footer — placeholders until those pages exist. */
export const footerAboutLinks: NavItem[] = [
  { label: "Бидний тухай", href: "/" },
  { label: "Редакцын бодлого", href: "/" },
  { label: "Нууцлалын бодлого", href: "/" },
  { label: "Холбоо барих", href: "/" },
];

/** All slugs the `/[category]` catch route is expected to resolve. */
export const categorySlugs = [
  "politics",
  "economy",
  "business",
  "mining",
  "geopolitics",
  "technology",
  "analyticnews",
  "factcheck",
  "editorial",
  "videonews",
  "debate",
  "podcast",
];
