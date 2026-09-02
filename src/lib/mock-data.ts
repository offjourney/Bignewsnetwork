/**
 * ============================================================
 *  SAMPLE / DEVELOPMENT CONTENT — REMOVE BEFORE PRODUCTION
 * ============================================================
 * Everything in this file is placeholder editorial content for local
 * development only. It stands in for PostgreSQL + Prisma records until
 * Phase 3/4 wires up the real database (see project spec, sections 15 & 41).
 * Names of officials, companies and events below are invented for layout
 * purposes and do not describe real people or real news.
 */

import type {
  Advertisement,
  Article,
  Author,
  Category,
  Gallery,
  Tag,
  VideoItem,
} from "./types";

export const categories: Category[] = [
  { id: "cat-politics", name: "Улс төр", slug: "politics", description: "Улс төрийн мэдээ, шийдвэрүүд" },
  { id: "cat-economy", name: "Эдийн засаг", slug: "economy", description: "Эдийн засаг, бизнесийн мэдээ" },
  { id: "cat-mining", name: "Уул уурхай", slug: "mining", description: "Уул уурхай мэдээ, үйл явдал" },
  { id: "cat-investment", name: "Хөрөнгө оруулалт", slug: "investment", description: "Хөрөнгө оруулалт мэдээ" },
  { id: "cat-technology", name: "Технологи", slug: "technology", description: "Технологийн мэдээ" },
  { id: "cat-analyticnews", name: "Аналитик мэдээ", slug: "analyticnews", description: "Аналитик мэдээ" },
  { id: "cat-editorial", name: "Нийтлэл", slug: "editorial", description: "Нийтлэл" },
  { id: "cat-geopolitics", name: "Геополитик", slug: "geopolitics", description: "Геополитик мэдээ" },
  { id: "cat-opinion", name: "Санал бодол", slug: "opinion", description: "Нийтлэл, шинжилгээ" },
];

export const categoryBySlug = (slug: string): Category | undefined =>
  categories.find((c) => c.slug === slug);

export const authors: Author[] = [
  {
    id: "author-1",
    name: "Б.Оюунцэцэг",
    slug: "b-oyunatsetseg",
    biography: "Улс төр, нийгмийн сэдвээр 12 жил ажилласан сэтгүүлч.",
    photoUrl: "https://picsum.photos/seed/bnn-author-1/200/200",
  },
  {
    id: "author-2",
    name: "Д.Ганбаатар",
    slug: "d-ganbaatar",
    biography: "Эдийн засаг, бизнесийн мэдээллийн сэтгүүлч.",
    photoUrl: "https://picsum.photos/seed/bnn-author-2/200/200",
  },
  {
    id: "author-3",
    name: "Н.Сарангэрэл",
    slug: "n-sarangerel",
    biography: "Технологи, шинжлэх ухааны сэдвээр бичдэг.",
    photoUrl: "https://picsum.photos/seed/bnn-author-3/200/200",
  },
  {
    id: "author-4",
    name: "Ц.Мөнхбат",
    slug: "ts-munkhbat",
    biography: "Спортын сэтгүүлч, тайлбарлагч.",
    photoUrl: "https://picsum.photos/seed/bnn-author-4/200/200",
  },
  {
    id: "author-5",
    name: "Э.Номин",
    slug: "e-nomin",
    biography: "Соёл, урлагийн мэдээллийн сэтгүүлч.",
    photoUrl: "https://picsum.photos/seed/bnn-author-5/200/200",
  },
];

export const tags: Tag[] = [
  { id: "tag-1", name: "Улаанбаатар", slug: "ulaanbaatar" },
  { id: "tag-2", name: "Засгийн газар", slug: "government" },
  { id: "tag-3", name: "Уул уурхай", slug: "mining" },
  { id: "tag-4", name: "Хөрөнгө оруулалт", slug: "investment" },
  { id: "tag-5", name: "Боловсрол", slug: "education" },
  { id: "tag-6", name: "Эрүүл мэнд", slug: "health" },
  { id: "tag-7", name: "Хиймэл оюун ухаан", slug: "ai" },
  { id: "tag-8", name: "Шилжилт хөдөлгөөн", slug: "migration" },
  { id: "tag-9", name: "Тэргүүлэх лиг", slug: "premier-league" },
  { id: "tag-10", name: "Кино", slug: "film" },
];

const img = (seed: string, w = 1200, h = 800) => `https://picsum.photos/seed/${seed}/${w}/${h}`;

function daysAgoIso(days: number, hours = 0): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(d.getHours() - hours);
  return d.toISOString();
}

interface Seed {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  categorySlug: string;
  authorSlug: string;
  tagSlugs: string[];
  featured?: boolean;
  breaking?: boolean;
  views: number;
  daysAgo: number;
  hoursAgo?: number;
  imgSeed: string;
}

const seeds: Seed[] = [
  // ---- Politics ----
  {
    id: "a-politics-1",
    title: "Засгийн газар дэд бүтцийн шинэ хөтөлбөр баталлаа",
    slug: "zasgiin-gazar-ded-butetsiin-shine-hutulbur",
    excerpt:
      "Улаанбаатар хотын гудамж, зам, дулааны шугам сүлжээг сайжруулах таван жилийн хөтөлбөрийг Засгийн газар өнөөдөр баталлаа.",
    content: `
      <p>Засгийн газрын хуралдаанаар нийслэлийн дэд бүтцийг шинэчлэх таван жилийн хөтөлбөрийг баталлаа. Хөтөлбөрт зам, дулааны шугам сүлжээ, ус хангамжийн системийг үе шаттайгаар шинэчлэх төлөвлөгөө багтжээ.</p>
      <p>Холбогдох сайд мэдээлэл хийхдээ эхний ээлжинд Улаанбаатар хотын төвийн болон гэр хорооллын дулааны шугамыг шинэчлэхэд анхаарах болно гэдгийг онцолсон.</p>
      <blockquote>Дэд бүтцийн шинэчлэл бол хотын иргэдийн өдөр тутмын амьдралд шууд нөлөөлөх хамгийн чухал асуудлын нэг.</blockquote>
      <p>Хөтөлбөрийг санхүүжүүлэх эх үүсвэрийг улсын төсөв болон гадаадын хөнгөлөлттэй зээлийн хослолоор бүрдүүлэхээр төлөвлөж байгаа аж.</p>
      <h2>Дараагийн алхмууд</h2>
      <p>Холбогдох яамд ирэх сард дэлгэрэнгүй хэрэгжилтийн төлөвлөгөөгөө танилцуулна гэж мэдэгдсэн.</p>
    `,
    categorySlug: "politics",
    authorSlug: "b-oyunatsetseg",
    tagSlugs: ["ulaanbaatar", "government", "investment"],
    featured: true,
    breaking: true,
    views: 15420,
    daysAgo: 0,
    hoursAgo: 2,
    imgSeed: "bnn-politics-1",
  },
  {
    id: "a-politics-2",
    title: "Парламентын хаврын чуулган өндөрлөлөө",
    slug: "parlamentyn-khavryn-chuulgan-undurlulee",
    excerpt:
      "Улсын Их Хурлын хаврын чуулганы хуралдаанаар хэд хэдэн хуулийн төслийг хэлэлцэж, эцсийн шатны санал хураалт явуулав.",
    content: `
      <p>Улсын Их Хурлын хаврын ээлжит чуулган өнөөдөр өндөрлөлөө. Чуулганы хугацаанд гишүүд эдийн засаг, боловсролын салбарт хамаарах хэд хэдэн хуулийн төслийг хэлэлцэж баталсан.</p>
      <p>Дарга даргалагчид намрын чуулганаар үргэлжлүүлэн хэлэлцэх асуудлын жагсаалтыг танилцуулав.</p>
    `,
    categorySlug: "politics",
    authorSlug: "b-oyunatsetseg",
    tagSlugs: ["government"],
    views: 6210,
    daysAgo: 1,
    hoursAgo: 4,
    imgSeed: "bnn-politics-2",
  },
  {
    id: "a-politics-3",
    title: "Орон нутгийн сонгуулийн бэлтгэл ажил эхэллээ",
    slug: "oron-nutgiin-songuuliin-beltgel-ajil-ehellee",
    excerpt:
      "Сонгуулийн ерөнхий хороо орон нутгийн сонгуультай холбоотой бэлтгэл ажлын хуваарийг баталж, аймаг, нийслэлд танилцуулж эхэллээ.",
    content: `
      <p>Сонгуулийн ерөнхий хороо орон нутгийн сонгуулийн бэлтгэл ажлын нэгдсэн хуваарийг баталлаа. Хуваарийн дагуу санал авах байрны бүртгэл, ажиглагчдын мэдээллийг ойрын өдрүүдэд эхлүүлнэ.</p>
    `,
    categorySlug: "politics",
    authorSlug: "b-oyunatsetseg",
    tagSlugs: ["government", "ulaanbaatar"],
    views: 3980,
    daysAgo: 3,
    imgSeed: "bnn-politics-3",
  },

  // ---- Economy ----
  {
    id: "a-economy-1",
    title: "Уул уурхайн экспорт өссөн үзүүлэлттэй байна",
    slug: "uul-uurkhainiy-export-usssen",
    excerpt:
      "Энэ оны эхний хагас жилд уул уурхайн салбарын экспортын орлого өнгөрсөн оны мөн үеэс өссөн дүнтэй гарлаа гэж Үндэсний статистикийн хороо мэдээлэв.",
    content: `
      <p>Үндэсний статистикийн хорооны мэдээллээр энэ оны эхний хагас жилд нүүрс, зэсийн баяжмалын экспортын хэмжээ өссөн байна. Энэ нь дэлхийн зах зээл дэх түүхий эдийн үнийн өсөлттэй холбоотой гэж шинжээчид тайлбарлаж байна.</p>
      <p>Гэсэн хэдий ч экспортын бүтцийг олон төрлийн бүтээгдэхүүнээр баяжуулах шаардлагатай хэвээр байгааг мэргэжилтнүүд онцолж байна.</p>
      <h2>Хөрөнгө оруулалтын орчин</h2>
      <p>Гадаадын шууд хөрөнгө оруулалтын хэмжээ мөн өссөн бөгөөд ялангуяа дэд бүтэц, эрчим хүчний төслүүдэд хөрөнгө оруулалт нэмэгдэж байна.</p>
    `,
    categorySlug: "economy",
    authorSlug: "d-ganbaatar",
    tagSlugs: ["mining", "investment"],
    featured: true,
    views: 11230,
    daysAgo: 0,
    hoursAgo: 6,
    imgSeed: "bnn-economy-1",
  },
  {
    id: "a-economy-2",
    title: "Төв банк бодлогын хүүг өөрчлөхгүй орхилоо",
    slug: "tuv-bank-bodlogyn-huug-uurchlukhgui-orkhilo",
    excerpt:
      "Мongolbank бодлогын хүүгийн шийдвэрээ танилцуулж, инфляцийн төлөв тогтвортой хэвээр байгааг мэдэгдэв.",
    content: `
      <p>Мongolbank-ны Мөнгөний бодлогын хорооны хуралдаанаар бодлогын хүүг өнөөгийн түвшинд хэвээр үлдээхээр шийдвэрлэлээ. Хорооны гишүүд инфляцийн төлөв тогтвортой байгааг шийдвэрийнхээ үндэслэл болгожээ.</p>
    `,
    categorySlug: "economy",
    authorSlug: "d-ganbaatar",
    tagSlugs: ["government"],
    views: 5340,
    daysAgo: 1,
    imgSeed: "bnn-economy-2",
  },
  {
    id: "a-economy-3",
    title: "Жижиг, дунд бизнесийг дэмжих зээлийн хөтөлбөр эхэллээ",
    slug: "jijig-dund-bizneseg-demjih-zeeliin-hutulbur",
    excerpt:
      "Жижиг, дунд үйлдвэрлэл эрхлэгчдэд зориулсан хөнгөлөлттэй зээлийн шинэ хөтөлбөрийг арилжааны банкуудтай хамтран эхлүүллээ.",
    content: `
      <p>Эдийн засгийн хөгжлийн яам арилжааны банкуудтай хамтран жижиг, дунд бизнес эрхлэгчдэд зориулсан хөнгөлөлттэй хүүтэй зээлийн хөтөлбөрийг эхлүүллээ. Хөтөлбөрт хөдөө орон нутгийн жижиг үйлдвэрлэгчдийг тэргүүн ээлжинд хамруулна.</p>
    `,
    categorySlug: "economy",
    authorSlug: "d-ganbaatar",
    tagSlugs: ["investment"],
    views: 2870,
    daysAgo: 2,
    imgSeed: "bnn-economy-3",
  },

  // ---- Mining ----
  {
    id: "a-society-1",
    title: "Нийслэлд агаарын чанарыг сайжруулах шинэ арга хэмжээ",
    slug: "niislelde-agaaryn-chanaryg-saijruulakh-shine-arga-hemjee",
    excerpt:
      "Улаанбаатар хотын агаарын бохирдлыг бууруулах зорилготой цогц арга хэмжээг эрчимжүүлэхээр төлөвлөж байна.",
    content: `
      <p>Нийслэлийн Агаарын чанарын алба өвлийн улиралд агаарын бохирдлыг бууруулах зорилготой цогц арга хэмжээний хэрэгжилтийг эрчимжүүлэхээ мэдэгдэв. Гэр хорооллын өрхүүдэд шинэ төрлийн түлш, дулаалгын материал түгээх ажил үргэлжилж байна.</p>
    `,
    categorySlug: "mining",
    authorSlug: "b-oyunatsetseg",
    tagSlugs: ["ulaanbaatar", "health"],
    featured: true,
    views: 9870,
    daysAgo: 0,
    hoursAgo: 9,
    imgSeed: "bnn-society-1",
  },
  {
    id: "a-society-2",
    title: "Сургуулийн шинэ жилийн бэлтгэл ажил дуусах шатандаа",
    slug: "surguuliin-shine-jiliin-beltgel-ajil",
    excerpt:
      "Нийслэлийн ерөнхий боловсролын сургуулиуд хичээлийн шинэ жилийн бэлтгэл ажлаа эцэслэж байна.",
    content: `
      <p>Боловсролын газраас өгсөн мэдээллээр нийслэлийн ихэнх сургууль хичээлийн шинэ жилийн бэлтгэл ажлаа дуусгах шатандаа явж байна. Хүүхдийн тоо өссөнтэй холбоотой цэцэрлэг, сургуулийн хүчин чадлыг нэмэгдүүлэх ажил үргэлжилж байгааг тэмдэглэжээ.</p>
    `,
    categorySlug: "mining",
    authorSlug: "b-oyunatsetseg",
    tagSlugs: ["education", "ulaanbaatar"],
    views: 4120,
    daysAgo: 1,
    hoursAgo: 3,
    imgSeed: "bnn-society-2",
  },
  {
    id: "a-society-3",
    title: "Эмнэлгүүдэд цахим цаг захиалгын систем нэвтэрч байна",
    slug: "emnelguuded-tsahim-tsag-zahialgyn-sistem",
    excerpt:
      "Улсын нэгдсэн эмнэлгүүдэд цахим цаг захиалгын шинэ системийг үе шаттайгаар нэвтрүүлж байна.",
    content: `
      <p>Эрүүл мэндийн яамны хэрэгжүүлж буй цахимжуулалтын хөтөлбөрийн хүрээнд томоохон эмнэлгүүдэд цахим цаг захиалгын систем нэвтэрч эхэллээ. Энэ нь иргэдийн дараалалд зарцуулах хугацааг бууруулах зорилготой.</p>
    `,
    categorySlug: "mining",
    authorSlug: "n-sarangerel",
    tagSlugs: ["health"],
    views: 3210,
    daysAgo: 4,
    imgSeed: "bnn-society-3",
  },

  // ---- Investment ----
  {
    id: "a-world-1",
    title: "Ази номхон далайн орнуудын эдийн засгийн чуулган эхэллээ",
    slug: "azi-nomhon-dalain-ornuudyn-edin-zasgiin-chuulgan",
    excerpt:
      "Бүс нутгийн эдийн засгийн хамтын ажиллагааг хэлэлцэх олон улсын чуулган өнөөдрөөс эхэлж, хэд хэдэн орны төлөөлөгчид оролцож байна.",
    content: `
      <p>Ази, номхон далайн бүсийн орнуудын эдийн засгийн хамтын ажиллагааны чуулган өнөөдөр эхэллээ. Чуулганы хүрээнд худалдаа, дэд бүтэц, цахим шилжилтийн чиглэлээр хэд хэдэн уулзалт, хэлэлцүүлэг зохион байгуулагдана.</p>
    `,
    categorySlug: "investment",
    authorSlug: "d-ganbaatar",
    tagSlugs: ["investment"],
    featured: true,
    views: 8340,
    daysAgo: 0,
    hoursAgo: 12,
    imgSeed: "bnn-world-1",
  },
  {
    id: "a-world-2",
    title: "Уур амьсгалын өөрчлөлтийн талаарх шинэ тайлан хэвлэгдлээ",
    slug: "uur-amisgalyn-uurchloltiin-shine-tailan",
    excerpt:
      "Олон улсын шинжээчдийн баг уур амьсгалын өөрчлөлтийн нөлөөллийг үнэлсэн шинэ тайлангаа танилцууллаа.",
    content: `
      <p>Тайланд дэлхийн дундаж температурын өөрчлөлт, түүний бүс нутгийн экосистемд үзүүлэх нөлөөллийг дэлгэрэнгүй дүгнэсэн байна. Шинжээчид улс орнуудыг уур амьсгалд дасан зохицох бодлогоо эрчимжүүлэхийг уриаллаа.</p>
    `,
    categorySlug: "investment",
    authorSlug: "n-sarangerel",
    tagSlugs: [],
    views: 5670,
    daysAgo: 2,
    imgSeed: "bnn-world-2",
  },
  {
    id: "a-world-3",
    title: "Хилийн боомтуудын ачаа тээвэр нэмэгдэж байна",
    slug: "khiliin-boomtuudyn-achaa-teever-nemegdej",
    excerpt:
      "Хилийн боомтоор дамжин өнгөрөх ачаа тээврийн хэмжээ өссөн бөгөөд энэ нь хилийн худалдааны эргэлтэд эерэгээр нөлөөлж байна.",
    content: `
      <p>Гаалийн ерөнхий газрын мэдээллээр хилийн боомтуудаар дамжин өнгөрөх ачаа тээврийн хэмжээ өмнөх оны мөн үеэс өссөн үзүүлэлттэй байна. Энэ нь дэд бүтцийн шинэчлэл, гаалийн цахим үйлчилгээний сайжралттай холбоотой гэж холбогдох байгууллагаас мэдээлэв.</p>
    `,
    categorySlug: "investment",
    authorSlug: "d-ganbaatar",
    tagSlugs: ["migration"],
    views: 2130,
    daysAgo: 5,
    imgSeed: "bnn-world-3",
  },

  // ---- Technology ----
  {
    id: "a-technology-1",
    title: "Улаанбаатарт хиймэл оюун ухааны стартап хөтөлбөр эхэллээ",
    slug: "ulaanbaatart-hiimel-oyun-ukhaany-startap-hutulbur",
    excerpt:
      "Залуу инженерүүдийг дэмжих зорилготой хиймэл оюун ухааны стартапуудын хурдасгуур хөтөлбөр нээлтээ хийлээ.",
    content: `
      <p>Технологийн паркийн дэргэд ажиллах хурдасгуур хөтөлбөрт эхний ээлжинд арван стартап баг сонгогдож, зургаан сарын турш зөвлөх, санхүүжилтийн дэмжлэг авах юм. Зохион байгуулагчид энэ нь орон нутгийн хиймэл оюун ухааны экосистемийг хөгжүүлэх эхлэл гэдгийг онцолж байна.</p>
      <h2>Хөтөлбөрийн агуулга</h2>
      <p>Оролцогч багууд бүтээгдэхүүнээ зах зээлд гаргах, хөрөнгө оруулагчидтай холбогдох боломжтой болно гэж зохион байгуулагчид мэдэгдэв.</p>
    `,
    categorySlug: "technology",
    authorSlug: "n-sarangerel",
    tagSlugs: ["ai", "investment"],
    featured: true,
    breaking: true,
    views: 13980,
    daysAgo: 0,
    hoursAgo: 1,
    imgSeed: "bnn-tech-1",
  },
  {
    id: "a-technology-2",
    title: "Цахим засгийн шинэ үйлчилгээ нэвтэрлээ",
    slug: "tsahim-zasgiin-shine-uilchilgee-nevterlee",
    excerpt:
      "Иргэд онлайнаар бүрдүүлдэг маягтын тоог цөөрүүлэх зорилготой цахим засгийн шинэ платформ нээлтээ хийв.",
    content: `
      <p>Шинэ платформоор дамжуулан иргэд төрийн зарим үйлчилгээг цахимаар, дараалалгүйгээр авах боломжтой болно гэж хэрэгжүүлэгч байгууллага мэдэгдэв.</p>
    `,
    categorySlug: "technology",
    authorSlug: "n-sarangerel",
    tagSlugs: ["government"],
    views: 4560,
    daysAgo: 1,
    hoursAgo: 8,
    imgSeed: "bnn-tech-2",
  },
  {
    id: "a-technology-3",
    title: "Орон нутагт өндөр хурдны интернэт сүлжээ өргөжиж байна",
    slug: "oron-nutagt-undur-hurdny-internet-sulzhee",
    excerpt:
      "Холбооны компаниуд орон нутагт шилэн кабелийн сүлжээг өргөтгөх төслөө үргэлжлүүлж байна.",
    content: `
      <p>Мэдээлэл, харилцаа холбооны газрын мэдээллээр энэ жил хэд хэдэн аймагт шилэн кабелийн шугам шинээр татагдаж, өндөр хурдны интернэт үйлчилгээний хамрах хүрээ нэмэгдэх юм.</p>
    `,
    categorySlug: "technology",
    authorSlug: "n-sarangerel",
    tagSlugs: [],
    views: 1870,
    daysAgo: 3,
    imgSeed: "bnn-tech-3",
  },

  // ---- Analytic news ----
  {
    id: "a-sports-1",
    title: "Үндэсний шигшээ баг тэмцээний шатанд гарлаа",
    slug: "undesnii-shigshee-bag-tsemtseenii-shatand-garlaa",
    excerpt:
      "Хөл бөмбөгийн үндэсний шигшээ баг бүсийн тэмцээний хагас шигшээ шатанд гарч, тайлбарлагчдын сайшаалыг хүлээлээ.",
    content: `
      <p>Өчигдрийн шөнийн тоглолтоор үндэсний шигшээ баг өрсөлдөгч багаа ялж, тэмцээний хагас шигшээ шатанд гарлаа. Тайлбарлагчид багийн хамгаалалтын тоглолт ялалтын гол түлхэц болсон гэж дүгнэж байна.</p>
      <h2>Дараагийн тоглолт</h2>
      <p>Багийнхан ирэх долоо хоногт болох хагас шигшээ тоглолтод бэлтгэл ажлаа эхлүүлнэ.</p>
    `,
    categorySlug: "analyticnews",
    authorSlug: "ts-munkhbat",
    tagSlugs: ["premier-league"],
    featured: true,
    views: 17650,
    daysAgo: 0,
    hoursAgo: 5,
    imgSeed: "bnn-sports-1",
  },
  {
    id: "a-sports-2",
    title: "Бөхийн улсын аварга шалгаруулах тэмцээн эхэллээ",
    slug: "bukhiin-ulsyn-avarga-shalgaruulakh-tsemtseen",
    excerpt:
      "Улсын аварга шалгаруулах бөхийн тэмцээн Улаанбаатар хотод эхэлж, өндөр зэрэглэлийн бөхчүүд өрсөлдөж байна.",
    content: `
      <p>Тэмцээнд аймаг, нийслэлийн шилдэг бөхчүүд оролцож байгаа бөгөөд эцсийн байр эзлэх тэмцээн энэ долоо хоногийн эцэс гэхэд тодрох юм.</p>
    `,
    categorySlug: "analyticnews",
    authorSlug: "ts-munkhbat",
    tagSlugs: [],
    views: 6120,
    daysAgo: 1,
    imgSeed: "bnn-sports-2",
  },
  {
    id: "a-sports-3",
    title: "Залуу шатрчид олон улсын тэмцээнд амжилт үзүүллээ",
    slug: "zaluu-shatrchid-olon-ulsyn-tsemtseend-amjilt",
    excerpt:
      "Монголын залуу шатрчид олон улсын нэрэмжит тэмцээнээс медаль хүртлээ.",
    content: `
      <p>Тэмцээнд 20 гаруй орны тамирчид өрсөлдсөн бөгөөд манай залуу шатрчид насны ангиллаараа шагналт байр эзэлж чадсан байна.</p>
    `,
    categorySlug: "analyticnews",
    authorSlug: "ts-munkhbat",
    tagSlugs: [],
    views: 2340,
    daysAgo: 4,
    imgSeed: "bnn-sports-3",
  },

  // ---- editorial ----
  {
    id: "a-culture-1",
    title: "Үндэсний музейд шинэ үзэсгэлэн нээлээ",
    slug: "undesnii-muzeid-shine-uzesgelen-neelee",
    excerpt:
      "Эртний түүх, соёлын өвийг харуулсан шинэ үзэсгэлэн Үндэсний музейд нээлтээ хийлээ.",
    content: `
      <p>Үзэсгэлэнд түүхэн дурсгалт зүйлсийн цуглуулгыг шинэлэг аргаар толилуулж байгаа бөгөөд айлчлагчид дижитал технологи ашигласан танилцуулгатай танилцах боломжтой.</p>
    `,
    categorySlug: "editorial",
    authorSlug: "e-nomin",
    tagSlugs: ["ulaanbaatar"],
    views: 4980,
    daysAgo: 1,
    hoursAgo: 2,
    imgSeed: "bnn-culture-1",
  },
  {
    id: "a-culture-2",
    title: "Уран зохиолын наадам жил бүрийн зан заншил болжээ",
    slug: "uran-zohiolyn-naadam-jil-buriin-zan-zanshil",
    excerpt:
      "Залуу зохиолчдыг дэмжих зорилготой уран зохиолын наадам энэ жил ч зохион байгуулагдлаа.",
    content: `
      <p>Наадамд оролцогчид шүлэг, өгүүллэгийн уралдаанд оролцож, шилдэг бүтээлүүдээ уншигчдад толилуулав.</p>
    `,
    categorySlug: "editorial",
    authorSlug: "e-nomin",
    tagSlugs: [],
    views: 1560,
    daysAgo: 3,
    imgSeed: "bnn-culture-2",
  },
  {
    id: "a-culture-3",
    title: "Дэвшилтэт дуу бүжгийн чуулга гадаад тайзнаа тоглолоо",
    slug: "duu-buujgiin-chuulga-gadaad-taizand-togloloo",
    excerpt:
      "Үндэсний дуу бүжгийн чуулга олон улсын урлагийн наадамд амжилттай тоглож, алдаршуулах ажлаа үргэлжлүүлж байна.",
    content: `
      <p>Тоглолтын дараа үзэгчид уран бүтээлчдийг халуунаар угтсан бөгөөд зохион байгуулагчид ирэх онд дахин зочилохоор төлөвлөж байгаагаа мэдэгдэв.</p>
    `,
    categorySlug: "editorial",
    authorSlug: "e-nomin",
    tagSlugs: [],
    views: 1290,
    daysAgo: 6,
    imgSeed: "bnn-culture-3",
  },

  // ---- Geopolitics ----
  {
    id: "a-entertainment-1",
    title: "Шинэ уран сайхны кино театруудад гарлаа",
    slug: "shine-uran-saikhny-kino-teatruudad-garlaa",
    excerpt:
      "Дотоодын бүтээлчдийн шинэ кино театруудад нээлтээ хийж, үзэгчдийн эрч хүчтэй хариу үйлдлийг хүлээж байна.",
    content: `
      <p>Кино бүтээгчид зургаан сарын турш зураг авалт хийсэн бөгөөд туурвилдаа орчин үеийн Улаанбаатарын амьдралыг тусгасан гэдгээ мэдэгдэв.</p>
    `,
    categorySlug: "geopolitics",
    authorSlug: "e-nomin",
    tagSlugs: ["film"],
    views: 8760,
    daysAgo: 0,
    hoursAgo: 10,
    imgSeed: "bnn-entertainment-1",
  },
  {
    id: "a-entertainment-2",
    title: "Хамтлагийн шинэ цомог гарлаа",
    slug: "khamtlagiin-shine-tsomog-garlaa",
    excerpt:
      "Алдартай хамтлаг гурван жилийн завсарлагааны дараа шинэ цомгоо уншигчдад толилуулав.",
    content: `
      <p>Цомогт орсон дуунуудыг тус хамтлаг ойрын сард болох тусгай тоглолтоороо шууд тоглох аж.</p>
    `,
    categorySlug: "geopolitics",
    authorSlug: "e-nomin",
    tagSlugs: [],
    views: 5430,
    daysAgo: 2,
    imgSeed: "bnn-entertainment-2",
  },

  // ---- Opinion ----
  {
    id: "a-opinion-1",
    title: "Шинжилгээ: Дэд бүтцийн хөрөнгө оруулалт яагаад чухал вэ",
    slug: "shinjilgee-ded-butetsiin-khurungu-oruulalt",
    excerpt:
      "Эдийн засагч зочин нийтлэлдээ дэд бүтцийн хөрөнгө оруулалтын урт хугацааны ач холбогдлыг тайлбарлав.",
    content: `
      <p>Дэд бүтцийн хөрөнгө оруулалт нь богино хугацаанд өртөг өндөр мэт боловч урт хугацаанд эдийн засгийн өсөлтийг тэтгэх суурь хөрөнгө оруулалт юм гэж уг нийтлэлд дурджээ.</p>
      <p><em>Энэ нийтлэлд илэрхийлсэн үзэл бодол нь зохиогчийн хувийн байр суурь болно.</em></p>
    `,
    categorySlug: "opinion",
    authorSlug: "d-ganbaatar",
    tagSlugs: ["investment"],
    views: 3120,
    daysAgo: 2,
    imgSeed: "bnn-opinion-1",
  },
];

export const articles: Article[] = seeds.map((s) => {
  const category = categoryBySlug(s.categorySlug)!;
  const author = authors.find((a) => a.slug === s.authorSlug)!;
  const articleTags = tags.filter((t) => s.tagSlugs.includes(t.slug));
  return {
    id: s.id,
    title: s.title,
    slug: s.slug,
    excerpt: s.excerpt,
    content: s.content,
    author,
    category,
    tags: articleTags,
    status: "PUBLISHED",
    featured: !!s.featured,
    breaking: !!s.breaking,
    views: s.views,
    image: {
      id: `media-${s.id}`,
      type: "IMAGE",
      url: img(s.imgSeed),
      thumbnailUrl: img(s.imgSeed, 480, 320),
      altText: s.title,
      credit: "BigNewsNetwork",
    },
    
    publishedAt: daysAgoIso(s.daysAgo, s.hoursAgo ?? 0),
    sample: true,
  };
});

export const videos: VideoItem[] = [
  {
    id: "video-1",
    title: "Рио Тинто ба ЗГ-ын хэлэлцээрийг ямар шалгуураар хэмжих вэ? | Эдийн засагч Мөнгөнтуул.О",
    slug: "zasgiin-gazryn-hevleliin-baga-khural",
    source: "YOUTUBE",
    url: "https://www.youtube.com/watch?v=1ruEgAYWh_I",
    publishedAt: daysAgoIso(0, 3),
    sample: true,
  },
  {
    id: "video-2",
    title: "Түүхий эд нийлүүлэгчээс аж үйлдвэржсэн түнш - шинэ үе эхлэх үү | Эдийн засагч Мөнгөнтуул.О",
    slug: "shine-ded-butetsiin-bariligyn-yavts",
    source: "YOUTUBE",
    url: "https://www.youtube.com/watch?v=eipWCyHUZ5o",
    publishedAt: daysAgoIso(0, 5),
    sample: true,
  },
  {
    id: "video-3",
    title: "Стармер огцорсны дараах Их британи, дэлхийн улс төр ба монгол | Эдийн засагч Мөнгөнтуул.О",
    slug: "technologiin-salbaryn-mergejilten-yarilstsaga",
    source: "YOUTUBE",
    url: "https://www.youtube.com/watch?v=FmNFsdvHtzA",
    publishedAt: daysAgoIso(2),
    sample: true,
  },
  {
    id: "video-4",
    title: "Авилга нь зөвхөн эдийн засгийн гэмт хэрэг биш ҮАБ-ын асуудал | Эдийн засагч Мөнгөнтуул.О",
    slug: "khagas-shigshee-togloltyn-huraangui",
    source: "YOUTUBE",
    url: "https://www.youtube.com/watch?v=4LTXK_qqeY8",
    publishedAt: daysAgoIso(2),
    sample: true,
  },
];

export const galleries: Gallery[] = [
  {
    id: "gallery-1",
    title: "Улаанбаатар хотын өглөөний тэнгэр",
    slug: "ulaanbaatar-hotyn-ugluunii-tenger",
    description: "Нийслэлийн өглөөний тэнгэрийг харуулсан гэрэл зургийн цуврал.",
    coverImage: {
      id: "gi-1-cover",
      url: img("bnn-gallery-1-cover", 1200, 800),
      width: 1200,
      height: 800,
      credit: "BigNewsNetwork",
    },
    images: [1, 2, 3, 4, 5, 6].map((n) => ({
      id: `gi-1-${n}`,
      url: img(`bnn-gallery-1-${n}`, 1000, 700),
      caption: `Улаанбаатар хотын өглөө, зураг ${n}`,
      credit: "BigNewsNetwork",
      width: 1000,
      height: 700,
    })),
    publishedAt: daysAgoIso(0, 8),
    photographer: "Г.Батжаргал",
    sample: true,
  },
  {
    id: "gallery-2",
    title: "Хагас шигшээ тоглолтын гэрэл зураг",
    slug: "khagas-shigshee-togloltyn-gerel-zurag",
    description: "Үндэсний шигшээ багийн хагас шигшээ тоглолтын онцлох мөчүүд.",
    coverImage: {
      id: "gi-2-cover",
      url: img("bnn-gallery-2-cover", 1200, 800),
      width: 1200,
      height: 800,
      credit: "BigNewsNetwork",
    },
    images: [1, 2, 3, 4].map((n) => ({
      id: `gi-2-${n}`,
      url: img(`bnn-gallery-2-${n}`, 1000, 700),
      caption: `Тоглолтын мөч ${n}`,
      credit: "BigNewsNetwork",
      width: 1000,
      height: 700,
    })),
    publishedAt: daysAgoIso(1),
    photographer: "Ц.Мөнхбат",
    sample: true,
  },
];

export const advertisements: Advertisement[] = [
  {
    id: "ad-1",
    name: "Homepage Top Banner",
    imageUrl: img("bnn-ad-1", 970, 250),
    targetUrl: "https://example.com",
    placement: "HOMEPAGE_TOP",
    active: true,
    sample: true,
  },
  {
    id: "ad-2",
    name: "Sidebar Banner",
    imageUrl: img("bnn-ad-2", 300, 600),
    targetUrl: "https://example.com",
    placement: "SIDEBAR",
    active: true,
    sample: true,
  },
  {
    id: "ad-3",
    name: "Article Middle Banner",
    imageUrl: img("bnn-ad-3", 728, 200),
    targetUrl: "https://example.com",
    placement: "ARTICLE_MIDDLE",
    active: true,
    sample: true,
  },
  {
    id: "ad-4",
    name: "Homepage Middle Banner",
    imageUrl: img("bnn-ad-4", 970, 250),
    targetUrl: "https://example.com",
    placement: "HOMEPAGE_MIDDLE",
    active: true,
    sample: true,
  },
];
