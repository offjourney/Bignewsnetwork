/**
 * BigNewsNetwork database seed.
 *
 * Written against `pg` directly rather than `@prisma/client`, because the
 * generated Prisma Client isn't available in this sandbox (see
 * src/lib/db.ts for why). The schema it populates is exactly
 * prisma/schema.prisma / prisma/migrations/20260815130000_init, so once
 * `npx prisma generate` runs somewhere with normal network access, this
 * same data is fully queryable through the real Prisma Client — nothing
 * about the database itself is a stand-in.
 *
 * Run with: npm run db:seed
 *
 * All content below is original, fictional development data — not copied
 * from any real news source. All user accounts use an obviously fake,
 * clearly-documented development password (see DEV_PASSWORD below); this
 * is not suitable for any real deployment.
 */
import { randomUUID } from "node:crypto";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const DEV_PASSWORD = "DevPassword123!"; // Development credential only. Never use in production.

function id(): string {
  return randomUUID();
}

function isoDaysAgo(days: number, hours = 0): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(d.getHours() - hours);
  return d.toISOString();
}

function isoDaysFromNow(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

const img = (seed: string, w = 1200, h = 800) => `https://picsum.photos/seed/${seed}/${w}/${h}`;

/** Minimal ProseMirror/TipTap-shaped JSON document builder for article content. */
type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "quote"; text: string };

function doc(blocks: Block[]) {
  return {
    type: "doc",
    content: blocks.map((b) => {
      if (b.type === "p") return { type: "paragraph", content: [{ type: "text", text: b.text }] };
      if (b.type === "h2")
        return { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: b.text }] };
      return {
        type: "blockquote",
        content: [{ type: "paragraph", content: [{ type: "text", text: b.text }] }],
      };
    }),
  };
}

async function main() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    console.log("Clearing existing seed data...");
    await client.query(`
      TRUNCATE TABLE
        gallery_images, galleries, article_media, article_revisions,
        article_tags, videos, articles, media, tags, categories,
        authors, advertisements, site_settings, users
      RESTART IDENTITY CASCADE
    `);

    // ---------------------------------------------------------------
    // Users
    // ---------------------------------------------------------------
    console.log("Seeding users...");
    const passwordHash = await bcrypt.hash(DEV_PASSWORD, 10);

    const users = {
      admin: { id: id(), name: "Б.Түвшинбаяр", email: "admin@bignewsnetwork.mn", role: "ADMIN" },
      editor: { id: id(), name: "Г.Мөнхжаргал", email: "editor@bignewsnetwork.mn", role: "EDITOR" },
      journalistPolitics: { id: id(), name: "Б.Оюунцэцэг", email: "b.oyunatsetseg@bignewsnetwork.mn", role: "JOURNALIST" },
      journalistEconomy: { id: id(), name: "Д.Ганбаатар", email: "d.ganbaatar@bignewsnetwork.mn", role: "JOURNALIST" },
      journalistTech: { id: id(), name: "Н.Сарангэрэл", email: "n.sarangerel@bignewsnetwork.mn", role: "JOURNALIST" },
      journalistSports: { id: id(), name: "Ц.Мөнхбат", email: "ts.munkhbat@bignewsnetwork.mn", role: "JOURNALIST" },
      journalistCulture: { id: id(), name: "Э.Номин", email: "e.nomin@bignewsnetwork.mn", role: "JOURNALIST" },
      photographer: { id: id(), name: "Г.Батжаргал", email: "g.batjargal@bignewsnetwork.mn", role: "PHOTOGRAPHER" },
      adManager: { id: id(), name: "С.Эрдэнэчимэг", email: "s.erdenechimeg@bignewsnetwork.mn", role: "AD_MANAGER" },
    } as const;

    for (const u of Object.values(users)) {
      await client.query(
        `INSERT INTO users (id, name, email, "passwordHash", role, active, "updatedAt")
         VALUES ($1, $2, $3, $4, $5, true, now())`,
        [u.id, u.name, u.email, passwordHash, u.role],
      );
    }

    // ---------------------------------------------------------------
    // Authors (byline profiles for editor + journalists)
    // ---------------------------------------------------------------
    console.log("Seeding authors...");
    const authorSeeds = [
      { user: users.editor, slug: "g-munkhjargal", bio: "Ерөнхий редактор. Улс төр, нийгмийн сэдвээр 15 жил ажилласан." },
      { user: users.journalistPolitics, slug: "b-oyunatsetseg", bio: "Улс төр, нийгмийн сэдвээр бичдэг сэтгүүлч." },
      { user: users.journalistEconomy, slug: "d-ganbaatar", bio: "Эдийн засаг, дэлхийн мэдээллийн сэтгүүлч." },
      { user: users.journalistTech, slug: "n-sarangerel", bio: "Технологи, шинжлэх ухааны сэдвээр бичдэг." },
      { user: users.journalistSports, slug: "ts-munkhbat", bio: "Спортын сэтгүүлч, тайлбарлагч." },
      { user: users.journalistCulture, slug: "e-nomin", bio: "Соёл, урлаг, энтертайнментийн сэдвээр бичдэг." },
    ];
    const authors: Record<string, string> = {};
    for (const a of authorSeeds) {
      const authorId = id();
      authors[a.slug] = authorId;
      await client.query(
        `INSERT INTO authors (id, "userId", name, slug, biography, "photoUrl", "updatedAt")
         VALUES ($1, $2, $3, $4, $5, $6, now())`,
        [authorId, a.user.id, a.user.name, a.slug, a.bio, img(`bnn-author-${a.slug}`, 200, 200)],
      );
    }

    // ---------------------------------------------------------------
    // Categories
    // ---------------------------------------------------------------
    console.log("Seeding categories...");
    const categorySeeds = [
      { slug: "politics", name: "Улс төр", description: "Улс төрийн мэдээ, шийдвэрүүд" },
      { slug: "economy", name: "Эдийн засаг", description: "Эдийн засаг, бизнесийн мэдээ" },
      { slug: "society", name: "Нийгэм", description: "Нийгмийн мэдээ, үйл явдал" },
      { slug: "world", name: "Дэлхий", description: "Дэлхийн мэдээ" },
      { slug: "technology", name: "Технологи", description: "Технологийн мэдээ" },
      { slug: "sports", name: "Спорт", description: "Спортын мэдээ" },
      { slug: "culture", name: "Соёл", description: "Соёл, урлагийн мэдээ" },
      { slug: "geopolitics", name: "Геополитик", description: "Геополитик мэдээ" },
      { slug: "opinion", name: "Санал бодол", description: "Нийтлэл, шинжилгээ" },
    ];
    const categories: Record<string, string> = {};
    for (const [i, c] of categorySeeds.entries()) {
      const categoryId = id();
      categories[c.slug] = categoryId;
      await client.query(
        `INSERT INTO categories (id, name, slug, description, "sortOrder", active, "updatedAt")
         VALUES ($1, $2, $3, $4, $5, true, now())`,
        [categoryId, c.name, c.slug, c.description, i],
      );
    }

    // ---------------------------------------------------------------
    // Tags
    // ---------------------------------------------------------------
    console.log("Seeding tags...");
    const tagSeeds = [
      { slug: "mongolia", name: "Монгол Улс" },
      { slug: "ulaanbaatar", name: "Улаанбаатар" },
      { slug: "government", name: "Засгийн газар" },
      { slug: "parliament", name: "УИХ" },
      { slug: "economy-tag", name: "Эдийн засаг" },
      { slug: "education", name: "Боловсрол" },
      { slug: "china", name: "Хятад" },
      { slug: "russia", name: "Орос" },
      { slug: "usa", name: "АНУ" },
      { slug: "technology-tag", name: "Технологи" },
      { slug: "sports-tag", name: "Спорт" },
      { slug: "mining", name: "Уул уурхай" },
      { slug: "health", name: "Эрүүл мэнд" },
    ];
    const tags: Record<string, string> = {};
    for (const t of tagSeeds) {
      const tagId = id();
      tags[t.slug] = tagId;
      await client.query(`INSERT INTO tags (id, name, slug) VALUES ($1, $2, $3)`, [tagId, t.name, t.slug]);
    }

    // ---------------------------------------------------------------
    // Articles
    // ---------------------------------------------------------------
    console.log("Seeding articles, media, tags, revisions...");

    type ArticleSeed = {
      title: string;
      slug: string;
      excerpt: string;
      body: Block[];
      category: string;
      author: string;
      tagSlugs: string[];
      status: "DRAFT" | "REVIEW" | "SCHEDULED" | "PUBLISHED" | "ARCHIVED";
      featured?: boolean;
      breaking?: boolean;
      views: number;
      publishedDaysAgo?: number;
      publishedHoursAgo?: number;
      scheduledDaysFromNow?: number;
      imgSeed: string;
    };

    const articleSeeds: ArticleSeed[] = [
      {
        title: "Засгийн газар дэд бүтцийн шинэ хөтөлбөр баталлаа",
        slug: "zasgiin-gazar-ded-butetsiin-shine-hutulbur",
        excerpt: "Улаанбаатар хотын гудамж, зам, дулааны шугам сүлжээг сайжруулах таван жилийн хөтөлбөрийг Засгийн газар өнөөдөр баталлаа.",
        body: [
          { type: "p", text: "Засгийн газрын хуралдаанаар нийслэлийн дэд бүтцийг шинэчлэх таван жилийн хөтөлбөрийг баталлаа. Хөтөлбөрт зам, дулааны шугам сүлжээ, ус хангамжийн системийг үе шаттайгаар шинэчлэх төлөвлөгөө багтжээ." },
          { type: "p", text: "Холбогдох сайд мэдээлэл хийхдээ эхний ээлжинд Улаанбаатар хотын төвийн болон гэр хорооллын дулааны шугамыг шинэчлэхэд анхаарах болно гэдгийг онцолсон." },
          { type: "quote", text: "Дэд бүтцийн шинэчлэл бол хотын иргэдийн өдөр тутмын амьдралд шууд нөлөөлөх хамгийн чухал асуудлын нэг." },
          { type: "h2", text: "Дараагийн алхмууд" },
          { type: "p", text: "Холбогдох яамд ирэх сард дэлгэрэнгүй хэрэгжилтийн төлөвлөгөөгөө танилцуулна гэж мэдэгдсэн." },
        ],
        category: "politics",
        author: "b-oyunatsetseg",
        tagSlugs: ["ulaanbaatar", "government"],
        status: "PUBLISHED",
        featured: true,
        breaking: true,
        views: 15420,
        publishedDaysAgo: 0,
        publishedHoursAgo: 2,
        imgSeed: "bnn-politics-1",
      },
      {
        title: "Парламентын хаврын чуулган өндөрлөлөө",
        slug: "parlamentyn-khavryn-chuulgan-undurlulee",
        excerpt: "Улсын Их Хурлын хаврын чуулганы хуралдаанаар хэд хэдэн хуулийн төслийг хэлэлцэж, эцсийн шатны санал хураалт явуулав.",
        body: [
          { type: "p", text: "Улсын Их Хурлын хаврын ээлжит чуулган өнөөдөр өндөрлөлөө. Чуулганы хугацаанд гишүүд эдийн засаг, боловсролын салбарт хамаарах хэд хэдэн хуулийн төслийг хэлэлцэж баталсан." },
          { type: "p", text: "Дарга даргалагчид намрын чуулганаар үргэлжлүүлэн хэлэлцэх асуудлын жагсаалтыг танилцуулав." },
        ],
        category: "politics",
        author: "b-oyunatsetseg",
        tagSlugs: ["parliament", "government"],
        status: "PUBLISHED",
        views: 6210,
        publishedDaysAgo: 1,
        publishedHoursAgo: 4,
        imgSeed: "bnn-politics-2",
      },
      {
        title: "Орон нутгийн сонгуулийн бэлтгэл ажил хянагдаж байна",
        slug: "oron-nutgiin-songuuliin-beltgel-ajil-hyanagdaj",
        excerpt: "Сонгуулийн ерөнхий хороо орон нутгийн сонгуультай холбоотой бэлтгэл ажлын явцад хяналт тавьж эхэллээ.",
        body: [{ type: "p", text: "Сонгуулийн ерөнхий хороо орон нутгийн сонгуулийн бэлтгэл ажлын нэгдсэн хуваарийг баталж, хэрэгжилтэд нь хяналт тавьж эхэллээ. Ажлын хэсэг энэ долоо хоногт хэд хэдэн аймагт ажиллана." }],
        category: "politics",
        author: "b-oyunatsetseg",
        tagSlugs: ["government"],
        status: "REVIEW",
        views: 0,
        imgSeed: "bnn-politics-3",
      },
      {
        title: "Гадаад бодлогын шинэ баримт бичгийг ирэх сард танилцуулна",
        slug: "gadaad-bodlogyn-shine-barimt-bichig",
        excerpt: "Гадаад харилцааны яам гадаад бодлогын шинэчилсэн баримт бичгийг боловсруулж, ирэх сард олон нийтэд танилцуулахаар төлөвлөж байна.",
        body: [{ type: "p", text: "Яамны мэдээлснээр баримт бичигт бүс нутгийн хамтын ажиллагаа, худалдаа, соёлын харилцааг өргөжүүлэх чиглэлүүд тусгагдана." }],
        category: "politics",
        author: "b-oyunatsetseg",
        tagSlugs: ["government"],
        status: "SCHEDULED",
        views: 0,
        scheduledDaysFromNow: 5,
        imgSeed: "bnn-politics-4",
      },
      {
        title: "Уул уурхайн экспорт өссөн үзүүлэлттэй байна",
        slug: "uul-uurkhainiy-export-usssen",
        excerpt: "Энэ оны эхний хагас жилд уул уурхайн салбарын экспортын орлого өнгөрсөн оны мөн үеэс өссөн дүнтэй гарлаа гэж Үндэсний статистикийн хороо мэдээлэв.",
        body: [
          { type: "p", text: "Үндэсний статистикийн хорооны мэдээллээр энэ оны эхний хагас жилд нүүрс, зэсийн баяжмалын экспортын хэмжээ өссөн байна. Энэ нь дэлхийн зах зээл дэх түүхий эдийн үнийн өсөлттэй холбоотой гэж шинжээчид тайлбарлаж байна." },
          { type: "h2", text: "Хөрөнгө оруулалтын орчин" },
          { type: "p", text: "Гадаадын шууд хөрөнгө оруулалтын хэмжээ мөн өссөн бөгөөд ялангуяа дэд бүтэц, эрчим хүчний төслүүдэд хөрөнгө оруулалт нэмэгдэж байна." },
        ],
        category: "economy",
        author: "d-ganbaatar",
        tagSlugs: ["mining", "economy-tag"],
        status: "PUBLISHED",
        featured: true,
        views: 11230,
        publishedDaysAgo: 0,
        publishedHoursAgo: 6,
        imgSeed: "bnn-economy-1",
      },
      {
        title: "Төв банк бодлогын хүүг өөрчлөхгүй орхилоо",
        slug: "tuv-bank-bodlogyn-huug-uurchlukhgui-orkhilo",
        excerpt: "Монголбанк бодлогын хүүгийн шийдвэрээ танилцуулж, инфляцийн төлөв тогтвортой хэвээр байгааг мэдэгдэв.",
        body: [{ type: "p", text: "Монголбанкны Мөнгөний бодлогын хорооны хуралдаанаар бодлогын хүүг өнөөгийн түвшинд хэвээр үлдээхээр шийдвэрлэлээ." }],
        category: "economy",
        author: "d-ganbaatar",
        tagSlugs: ["government", "economy-tag"],
        status: "PUBLISHED",
        views: 5340,
        publishedDaysAgo: 1,
        imgSeed: "bnn-economy-2",
      },
      {
        title: "Жижиг, дунд бизнесийг дэмжих зээлийн хөтөлбөр эхэллээ",
        slug: "jijig-dund-bizneseg-demjih-zeeliin-hutulbur",
        excerpt: "Жижиг, дунд үйлдвэрлэл эрхлэгчдэд зориулсан хөнгөлөлттэй зээлийн шинэ хөтөлбөрийг арилжааны банкуудтай хамтран эхлүүллээ.",
        body: [{ type: "p", text: "Эдийн засгийн хөгжлийн яам арилжааны банкуудтай хамтран жижиг, дунд бизнес эрхлэгчдэд зориулсан хөнгөлөлттэй хүүтэй зээлийн хөтөлбөрийг эхлүүллээ." }],
        category: "economy",
        author: "d-ganbaatar",
        tagSlugs: ["economy-tag"],
        status: "PUBLISHED",
        views: 2870,
        publishedDaysAgo: 2,
        imgSeed: "bnn-economy-3",
      },
      {
        title: "Экспортын бүтцийг олон төрөлжүүлэх төлөвлөгөөний ноорог бэлэн боллоо",
        slug: "exportyn-butetsiig-olon-turuljuuleh-tulevlugu",
        excerpt: "Эдийн засгийн хөгжлийн яам экспортын бүтцийг олон төрөлжүүлэх дунд хугацааны төлөвлөгөөний ноороо боловсруулж дуусгалаа.",
        body: [{ type: "p", text: "Ноороог холбогдох байгууллагуудад хүргэж, санал авах шатандаа явж байна гэж яамныхан мэдэгдэв." }],
        category: "economy",
        author: "d-ganbaatar",
        tagSlugs: ["economy-tag"],
        status: "DRAFT",
        views: 0,
        imgSeed: "bnn-economy-4",
      },
      {
        title: "Нийслэлд агаарын чанарыг сайжруулах шинэ арга хэмжээ",
        slug: "niislelde-agaaryn-chanaryg-saijruulakh-shine-arga-hemjee",
        excerpt: "Улаанбаатар хотын агаарын бохирдлыг бууруулах зорилготой цогц арга хэмжээг эрчимжүүлэхээр төлөвлөж байна.",
        body: [{ type: "p", text: "Нийслэлийн Агаарын чанарын алба өвлийн улиралд агаарын бохирдлыг бууруулах зорилготой цогц арга хэмжээний хэрэгжилтийг эрчимжүүлэхээ мэдэгдэв. Гэр хорооллын өрхүүдэд шинэ төрлийн түлш, дулаалгын материал түгээх ажил үргэлжилж байна." }],
        category: "society",
        author: "b-oyunatsetseg",
        tagSlugs: ["ulaanbaatar", "health"],
        status: "PUBLISHED",
        featured: true,
        views: 9870,
        publishedDaysAgo: 0,
        publishedHoursAgo: 9,
        imgSeed: "bnn-society-1",
      },
      {
        title: "Сургуулийн шинэ жилийн бэлтгэл ажил дуусах шатандаа",
        slug: "surguuliin-shine-jiliin-beltgel-ajil",
        excerpt: "Нийслэлийн ерөнхий боловсролын сургуулиуд хичээлийн шинэ жилийн бэлтгэл ажлаа эцэслэж байна.",
        body: [{ type: "p", text: "Боловсролын газраас өгсөн мэдээллээр нийслэлийн ихэнх сургууль хичээлийн шинэ жилийн бэлтгэл ажлаа дуусгах шатандаа явж байна." }],
        category: "society",
        author: "b-oyunatsetseg",
        tagSlugs: ["education", "ulaanbaatar"],
        status: "PUBLISHED",
        views: 4120,
        publishedDaysAgo: 1,
        publishedHoursAgo: 3,
        imgSeed: "bnn-society-2",
      },
      {
        title: "Эмнэлгүүдэд цахим цаг захиалгын систем нэвтэрч байна",
        slug: "emnelguuded-tsahim-tsag-zahialgyn-sistem",
        excerpt: "Улсын нэгдсэн эмнэлгүүдэд цахим цаг захиалгын шинэ системийг үе шаттайгаар нэвтрүүлж байна.",
        body: [{ type: "p", text: "Эрүүл мэндийн яамны хэрэгжүүлж буй цахимжуулалтын хөтөлбөрийн хүрээнд томоохон эмнэлгүүдэд цахим цаг захиалгын систем нэвтэрч эхэллээ." }],
        category: "society",
        author: "n-sarangerel",
        tagSlugs: ["health"],
        status: "PUBLISHED",
        views: 3210,
        publishedDaysAgo: 4,
        imgSeed: "bnn-society-3",
      },
      {
        title: "Гэр хорооллын дахин төлөвлөлтийн төслийг эргэн хянаж байна",
        slug: "ger-horoollyn-dakhin-tulevlultiin-tuslig",
        excerpt: "Нийслэлийн засаг захиргаа гэр хорооллын дахин төлөвлөлтийн одоогийн явцад хяналт-шинжилгээ хийж байна.",
        body: [{ type: "p", text: "Ажлын хэсэг иргэдийн саналыг тусган, төслийн хэрэгжилтийн хуваарьт нэмэлт өөрчлөлт оруулах эсэхийг судалж байна." }],
        category: "society",
        author: "b-oyunatsetseg",
        tagSlugs: ["ulaanbaatar"],
        status: "REVIEW",
        views: 0,
        imgSeed: "bnn-society-4",
      },
      {
        title: "Ази номхон далайн орнуудын эдийн засгийн чуулган эхэллээ",
        slug: "azi-nomhon-dalain-ornuudyn-edin-zasgiin-chuulgan",
        excerpt: "Бүс нутгийн эдийн засгийн хамтын ажиллагааг хэлэлцэх олон улсын чуулган өнөөдрөөс эхэлж, хэд хэдэн орны төлөөлөгчид оролцож байна.",
        body: [{ type: "p", text: "Ази, номхон далайн бүсийн орнуудын эдийн засгийн хамтын ажиллагааны чуулган өнөөдөр эхэллээ. Чуулганы хүрээнд худалдаа, дэд бүтэц, цахим шилжилтийн чиглэлээр хэд хэдэн уулзалт, хэлэлцүүлэг зохион байгуулагдана." }],
        category: "world",
        author: "d-ganbaatar",
        tagSlugs: ["china", "usa"],
        status: "PUBLISHED",
        featured: true,
        views: 8340,
        publishedDaysAgo: 0,
        publishedHoursAgo: 12,
        imgSeed: "bnn-world-1",
      },
      {
        title: "Хилийн боомтуудын ачаа тээвэр нэмэгдэж байна",
        slug: "khiliin-boomtuudyn-achaa-teever-nemegdej",
        excerpt: "Хилийн боомтоор дамжин өнгөрөх ачаа тээврийн хэмжээ өссөн бөгөөд энэ нь хилийн худалдааны эргэлтэд эерэгээр нөлөөлж байна.",
        body: [{ type: "p", text: "Гаалийн ерөнхий газрын мэдээллээр хилийн боомтуудаар дамжин өнгөрөх ачаа тээврийн хэмжээ өмнөх оны мөн үеэс өссөн үзүүлэлттэй байна." }],
        category: "world",
        author: "d-ganbaatar",
        tagSlugs: ["china", "russia"],
        status: "PUBLISHED",
        views: 2130,
        publishedDaysAgo: 5,
        imgSeed: "bnn-world-2",
      },
      {
        title: "Уур амьсгалын өөрчлөлтийн талаарх шинэ тайлан бэлдэж байна",
        slug: "uur-amisgalyn-uurchloltiin-shine-tailan",
        excerpt: "Олон улсын шинжээчдийн баг уур амьсгалын өөрчлөлтийн нөлөөллийг үнэлсэн шинэ тайлангаа бэлдэж байна.",
        body: [{ type: "p", text: "Тайланд дэлхийн дундаж температурын өөрчлөлт, түүний бүс нутгийн экосистемд үзүүлэх нөлөөллийг дэлгэрэнгүй дүгнэх юм." }],
        category: "world",
        author: "n-sarangerel",
        tagSlugs: [],
        status: "DRAFT",
        views: 0,
        imgSeed: "bnn-world-3",
      },
      {
        title: "Улаанбаатарт хиймэл оюун ухааны стартап хөтөлбөр эхэллээ",
        slug: "ulaanbaatart-hiimel-oyun-ukhaany-startap-hutulbur",
        excerpt: "Залуу инженерүүдийг дэмжих зорилготой хиймэл оюун ухааны стартапуудын хурдасгуур хөтөлбөр нээлтээ хийлээ.",
        body: [
          { type: "p", text: "Технологийн паркийн дэргэд ажиллах хурдасгуур хөтөлбөрт эхний ээлжинд арван стартап баг сонгогдож, зургаан сарын турш зөвлөх, санхүүжилтийн дэмжлэг авах юм." },
          { type: "h2", text: "Хөтөлбөрийн агуулга" },
          { type: "p", text: "Оролцогч багууд бүтээгдэхүүнээ зах зээлд гаргах, хөрөнгө оруулагчидтай холбогдох боломжтой болно гэж зохион байгуулагчид мэдэгдэв." },
        ],
        category: "technology",
        author: "n-sarangerel",
        tagSlugs: ["technology-tag"],
        status: "PUBLISHED",
        featured: true,
        breaking: true,
        views: 13980,
        publishedDaysAgo: 0,
        publishedHoursAgo: 1,
        imgSeed: "bnn-tech-1",
      },
      {
        title: "Цахим засгийн шинэ үйлчилгээ нэвтэрлээ",
        slug: "tsahim-zasgiin-shine-uilchilgee-nevterlee",
        excerpt: "Иргэд онлайнаар бүрдүүлдэг маягтын тоог цөөрүүлэх зорилготой цахим засгийн шинэ платформ нээлтээ хийв.",
        body: [{ type: "p", text: "Шинэ платформоор дамжуулан иргэд төрийн зарим үйлчилгээг цахимаар, дараалалгүйгээр авах боломжтой болно гэж хэрэгжүүлэгч байгууллага мэдэгдэв." }],
        category: "technology",
        author: "n-sarangerel",
        tagSlugs: ["government", "technology-tag"],
        status: "PUBLISHED",
        views: 4560,
        publishedDaysAgo: 1,
        publishedHoursAgo: 8,
        imgSeed: "bnn-tech-2",
      },
      {
        title: "Орон нутагт өндөр хурдны интернэт сүлжээ өргөжиж байна",
        slug: "oron-nutagt-undur-hurdny-internet-sulzhee",
        excerpt: "Холбооны компаниуд орон нутагт шилэн кабелийн сүлжээг өргөтгөх төслөө үргэлжлүүлж байна.",
        body: [{ type: "p", text: "Мэдээлэл, харилцаа холбооны газрын мэдээллээр энэ жил хэд хэдэн аймагт шилэн кабелийн шугам шинээр татагдаж, интернэт үйлчилгээний хамрах хүрээ нэмэгдэх юм." }],
        category: "technology",
        author: "n-sarangerel",
        tagSlugs: ["technology-tag"],
        status: "PUBLISHED",
        views: 1870,
        publishedDaysAgo: 3,
        imgSeed: "bnn-tech-3",
      },
      {
        title: "Өгөгдлийн нууцлалын шинэ дүрэм танилцуулагдана",
        slug: "ugugdliin-nuutslalyn-shine-durem",
        excerpt: "Харилцаа холбооны зохицуулах хороо хувийн өгөгдлийн нууцлалыг хамгаалах шинэ дүрмийн төслийг ирэх сард танилцуулна.",
        body: [{ type: "p", text: "Дүрмийн төсөлд компаниудын өгөгдөл цуглуулах, хадгалах үйл ажиллагаанд тавигдах шаардлагыг тодорхойлсон зүйл багтжээ." }],
        category: "technology",
        author: "n-sarangerel",
        tagSlugs: ["technology-tag"],
        status: "SCHEDULED",
        views: 0,
        scheduledDaysFromNow: 3,
        imgSeed: "bnn-tech-4",
      },
      {
        title: "Үндэсний шигшээ баг тэмцээний хагас шигшээ шатанд гарлаа",
        slug: "undesnii-shigshee-bag-tsemtseenii-shatand-garlaa",
        excerpt: "Хөл бөмбөгийн үндэсний шигшээ баг бүсийн тэмцээний хагас шигшээ шатанд гарч, тайлбарлагчдын сайшаалыг хүлээлээ.",
        body: [
          { type: "p", text: "Өчигдрийн шөнийн тоглолтоор үндэсний шигшээ баг өрсөлдөгч багаа ялж, тэмцээний хагас шигшээ шатанд гарлаа. Тайлбарлагчид багийн хамгаалалтын тоглолт ялалтын гол түлхэц болсон гэж дүгнэж байна." },
          { type: "h2", text: "Дараагийн тоглолт" },
          { type: "p", text: "Багийнхан ирэх долоо хоногт болох хагас шигшээ тоглолтод бэлтгэл ажлаа эхлүүлнэ." },
        ],
        category: "sports",
        author: "ts-munkhbat",
        tagSlugs: ["sports-tag"],
        status: "PUBLISHED",
        featured: true,
        views: 17650,
        publishedDaysAgo: 0,
        publishedHoursAgo: 5,
        imgSeed: "bnn-sports-1",
      },
      {
        title: "Бөхийн улсын аварга шалгаруулах тэмцээн эхэллээ",
        slug: "bukhiin-ulsyn-avarga-shalgaruulakh-tsemtseen",
        excerpt: "Улсын аварга шалгаруулах бөхийн тэмцээн Улаанбаатар хотод эхэлж, өндөр зэрэглэлийн бөхчүүд өрсөлдөж байна.",
        body: [{ type: "p", text: "Тэмцээнд аймаг, нийслэлийн шилдэг бөхчүүд оролцож байгаа бөгөөд эцсийн байр эзлэх тэмцээн энэ долоо хоногийн эцэс гэхэд тодрох юм." }],
        category: "sports",
        author: "ts-munkhbat",
        tagSlugs: ["sports-tag"],
        status: "PUBLISHED",
        views: 6120,
        publishedDaysAgo: 1,
        imgSeed: "bnn-sports-2",
      },
      {
        title: "Залуу шатрчдын бэлтгэлийн хуваарийг баталлаа",
        slug: "zaluu-shatrchdyn-beltgeliin-huvaariig-batallaa",
        excerpt: "Шатрын холбоо олон улсын нэрэмжит тэмцээний өмнөх бэлтгэлийн хуваарийг баталж, бэлтгэл хуралдаан эхлүүлэхээр төлөвлөж байна.",
        body: [{ type: "p", text: "Бэлтгэл хуралдаан ойрын долоо хоногт эхлэх бөгөөд насны ангилал тус бүрээр тусдаа хуваарь мөрдөнө." }],
        category: "sports",
        author: "ts-munkhbat",
        tagSlugs: ["sports-tag"],
        status: "DRAFT",
        views: 0,
        imgSeed: "bnn-sports-3",
      },
      {
        title: "Үндэсний музейд шинэ үзэсгэлэн нээлээ",
        slug: "undesnii-muzeid-shine-uzesgelen-neelee",
        excerpt: "Эртний түүх, соёлын өвийг харуулсан шинэ үзэсгэлэн Үндэсний музейд нээлтээ хийлээ.",
        body: [{ type: "p", text: "Үзэсгэлэнд түүхэн дурсгалт зүйлсийн цуглуулгыг шинэлэг аргаар толилуулж байгаа бөгөөд айлчлагчид дижитал технологи ашигласан танилцуулгатай танилцах боломжтой." }],
        category: "culture",
        author: "e-nomin",
        tagSlugs: ["ulaanbaatar"],
        status: "PUBLISHED",
        views: 4980,
        publishedDaysAgo: 1,
        publishedHoursAgo: 2,
        imgSeed: "bnn-culture-1",
      },
      {
        title: "Уран зохиолын наадам жил бүрийн зан заншил болжээ",
        slug: "uran-zohiolyn-naadam-jil-buriin-zan-zanshil",
        excerpt: "Залуу зохиолчдыг дэмжих зорилготой уран зохиолын наадам энэ жил ч зохион байгуулагдлаа.",
        body: [{ type: "p", text: "Наадамд оролцогчид шүлэг, өгүүллэгийн уралдаанд оролцож, шилдэг бүтээлүүдээ уншигчдад толилуулав." }],
        category: "culture",
        author: "e-nomin",
        tagSlugs: [],
        status: "PUBLISHED",
        views: 1560,
        publishedDaysAgo: 3,
        imgSeed: "bnn-culture-2",
      },
      {
        title: "Дуу бүжгийн чуулга гадаад тайзнаа амжилттай тоглолоо",
        slug: "duu-buujgiin-chuulga-gadaad-taizand-togloloo",
        excerpt: "Үндэсний дуу бүжгийн чуулга олон улсын урлагийн наадамд амжилттай тоглож, алдаршуулах ажлаа үргэлжлүүлж байна.",
        body: [{ type: "p", text: "Тоглолтын дараа үзэгчид уран бүтээлчдийг халуунаар угтсан бөгөөд зохион байгуулагчид ирэх онд дахин зочилохоор төлөвлөж байгаагаа мэдэгдэв." }],
        category: "culture",
        author: "e-nomin",
        tagSlugs: [],
        status: "PUBLISHED",
        views: 1290,
        publishedDaysAgo: 6,
        imgSeed: "bnn-culture-3",
      },
      {
        title: "Шинэ уран сайхны кино театруудад гарлаа",
        slug: "shine-uran-saikhny-kino-teatruudad-garlaa",
        excerpt: "Дотоодын бүтээлчдийн шинэ кино театруудад нээлтээ хийж, үзэгчдийн эрч хүчтэй хариу үйлдлийг хүлээж байна.",
        body: [{ type: "p", text: "Кино бүтээгчид зургаан сарын турш зураг авалт хийсэн бөгөөд туурвилдаа орчин үеийн Улаанбаатарын амьдралыг тусгасан гэдгээ мэдэгдэв." }],
        category: "geopolitics",
        author: "e-nomin",
        tagSlugs: [],
        status: "PUBLISHED",
        views: 8760,
        publishedDaysAgo: 0,
        publishedHoursAgo: 10,
        imgSeed: "bnn-entertainment-1",
      },
      {
        title: "Хамтлагийн шинэ цомог гарлаа",
        slug: "khamtlagiin-shine-tsomog-garlaa",
        excerpt: "Алдартай хамтлаг гурван жилийн завсарлагааны дараа шинэ цомгоо уншигчдад толилуулав.",
        body: [{ type: "p", text: "Цомогт орсон дуунуудыг тус хамтлаг ойрын сард болох тусгай тоглолтоороо шууд тоглох аж." }],
        category: "geopolitics",
        author: "e-nomin",
        tagSlugs: [],
        status: "PUBLISHED",
        views: 5430,
        publishedDaysAgo: 2,
        imgSeed: "bnn-entertainment-2",
      },
      {
        title: "Телевизийн шинэ ситком бэлдэж байна",
        slug: "televiziin-shine-sitkom-beldej-baina",
        excerpt: "Дотоодын продакшн компани залуучуудад зориулсан шинэ ситком бэлтгэж, намар нээлтээ хийхээр төлөвлөж байна.",
        body: [{ type: "p", text: "Продакшн компанийхан кастингийн үйл явц дуусах шатандаа явж байгааг мэдэгдэв." }],
        category: "geopolitics",
        author: "e-nomin",
        tagSlugs: [],
        status: "REVIEW",
        views: 0,
        imgSeed: "bnn-entertainment-3",
      },
      {
        title: "Шинжилгээ: Дэд бүтцийн хөрөнгө оруулалт яагаад чухал вэ",
        slug: "shinjilgee-ded-butetsiin-khurungu-oruulalt",
        excerpt: "Эдийн засагч зочин нийтлэлдээ дэд бүтцийн хөрөнгө оруулалтын урт хугацааны ач холбогдлыг тайлбарлав.",
        body: [
          { type: "p", text: "Дэд бүтцийн хөрөнгө оруулалт нь богино хугацаанд өртөг өндөр мэт боловч урт хугацаанд эдийн засгийн өсөлтийг тэтгэх суурь хөрөнгө оруулалт юм гэж уг нийтлэлд дурджээ." },
          { type: "quote", text: "Энэ нийтлэлд илэрхийлсэн үзэл бодол нь зохиогчийн хувийн байр суурь болно." },
        ],
        category: "opinion",
        author: "d-ganbaatar",
        tagSlugs: ["economy-tag"],
        status: "PUBLISHED",
        views: 3120,
        publishedDaysAgo: 2,
        imgSeed: "bnn-opinion-1",
      },
      {
        title: "Санал бодол: Хот төлөвлөлт иргэдийн оролцоотой байх ёстой",
        slug: "sanal-bodol-hot-tulevlult-irgediin-orolzootoi",
        excerpt: "Хот төлөвлөлтийн шинжээч зочин нийтлэлдээ шийдвэр гаргах үйл явцад иргэдийн оролцоог нэмэгдүүлэх шаардлагатайг тэмдэглэв.",
        body: [{ type: "p", text: "Иргэдийн саналыг эрт шатанд тусгах нь төслийн хэрэгжилтийг хурдасгах, зөрчлийг багасгах боломж олгодог гэж зохиогч бичжээ." }],
        category: "opinion",
        author: "g-munkhjargal",
        tagSlugs: ["ulaanbaatar"],
        status: "PUBLISHED",
        views: 1870,
        publishedDaysAgo: 4,
        imgSeed: "bnn-opinion-2",
      },
    ];

    const articleIds: Record<string, string> = {};

    for (const a of articleSeeds) {
      const articleId = id();
      articleIds[a.slug] = articleId;

      const mediaId = id();
      await client.query(
        `INSERT INTO media (id, type, url, "thumbnailUrl", filename, "mimeType", "altText", credit, width, height, "updatedAt")
         VALUES ($1, 'IMAGE', $2, $3, $4, 'image/jpeg', $5, 'BigNewsNetwork', 1200, 800, now())`,
        [mediaId, img(a.imgSeed), img(a.imgSeed, 480, 320), `${a.imgSeed}.jpg`, a.title],
      );

      const publishedAt =
        a.status === "PUBLISHED"
          ? isoDaysAgo(a.publishedDaysAgo ?? 0, a.publishedHoursAgo ?? 0)
          : null;
      const scheduledAt = a.status === "SCHEDULED" ? isoDaysFromNow(a.scheduledDaysFromNow ?? 3) : null;

      await client.query(
        `INSERT INTO articles
           (id, title, slug, excerpt, content, status, featured, breaking, views,
            "authorId", "categoryId", "featuredMediaId", "publishedAt", "scheduledAt", "updatedAt")
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14, now())`,
        [
          articleId,
          a.title,
          a.slug,
          a.excerpt,
          JSON.stringify(doc(a.body)),
          a.status,
          !!a.featured,
          !!a.breaking,
          a.views,
          authors[a.author],
          categories[a.category],
          mediaId,
          publishedAt,
          scheduledAt,
        ],
      );

      await client.query(
        `INSERT INTO article_media (id, "articleId", "mediaId", position, role) VALUES ($1,$2,$3,0,'FEATURED')`,
        [id(), articleId, mediaId],
      );

      for (const tagSlug of a.tagSlugs) {
        await client.query(`INSERT INTO article_tags ("articleId", "tagId") VALUES ($1,$2)`, [
          articleId,
          tags[tagSlug],
        ]);
      }

      if (a.status !== "DRAFT") {
        const authorUserId = authorSeeds.find((s) => s.slug === a.author)!.user.id;
        await client.query(
          `INSERT INTO article_revisions (id, "articleId", "userId", title, excerpt, content, "createdAt")
           VALUES ($1,$2,$3,$4,$5,$6, now())`,
          [id(), articleId, authorUserId, a.title, a.excerpt, JSON.stringify(doc(a.body))],
        );
      }
    }

    console.log("Seeding videos...");
    const videoSeeds = [
      {
        title: "Шууд: Засгийн газрын хэвлэлийн бага хурал",
        platform: "YOUTUBE",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        thumbSeed: "bnn-video-1",
        articleSlug: "zasgiin-gazar-ded-butetsiin-shine-hutulbur" as string | null,
        daysAgo: 0,
        hoursAgo: 3,
        duration: 1820,
      },
      {
        title: "Репортаж: Шинэ дэд бүтцийн барилгын явц",
        platform: "YOUTUBE",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        thumbSeed: "bnn-video-2",
        articleSlug: null,
        daysAgo: 1,
        hoursAgo: 0,
        duration: 245,
      },
      {
        title: "Ярилцлага: Технологийн салбарын мэргэжилтэнтэй",
        platform: "EXTERNAL",
        videoUrl: "https://example.com/video/interview",
        embedUrl: null,
        thumbSeed: "bnn-video-3",
        articleSlug: "ulaanbaatart-hiimel-oyun-ukhaany-startap-hutulbur",
        daysAgo: 2,
        hoursAgo: 0,
        duration: 610,
      },
      {
        title: "Онцлох: Хагас шигшээ тоглолтын хураангуй",
        platform: "FACEBOOK",
        videoUrl: "https://www.facebook.com/watch/?v=10153231379946729",
        embedUrl: null,
        thumbSeed: "bnn-video-4",
        articleSlug: "undesnii-shigshee-bag-tsemtseenii-shatand-garlaa",
        daysAgo: 0,
        hoursAgo: 6,
        duration: 180,
      },
      {
        title: "Урлагийн наадмын нээлтийн үйл явдал",
        platform: "YOUTUBE",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        thumbSeed: "bnn-video-5",
        articleSlug: null,
        daysAgo: 3,
        hoursAgo: 0,
        duration: 390,
      },
    ];
    for (const v of videoSeeds) {
      const publishedAt = isoDaysAgo(v.daysAgo, v.hoursAgo);
      await client.query(
        `INSERT INTO videos (id, title, description, platform, "videoUrl", "embedUrl", "thumbnailUrl", duration, "articleId", "publishedAt", "updatedAt")
         VALUES ($1,$2,NULL,$3,$4,$5,$6,$7,$8,$9, now())`,
        [
          id(),
          v.title,
          v.platform,
          v.videoUrl,
          v.embedUrl,
          img(v.thumbSeed, 800, 450),
          v.duration,
          v.articleSlug ? articleIds[v.articleSlug] : null,
          publishedAt,
        ],
      );
    }

    console.log("Seeding galleries...");
    const gallerySeeds = [
      {
        title: "Улаанбаатар хотын өглөөний тэнгэр",
        slug: "ulaanbaatar-hotyn-ugluunii-tenger",
        description: "Нийслэлийн өглөөний тэнгэрийг харуулсан гэрэл зургийн цуврал.",
        imageCount: 6,
        daysAgo: 0,
        hoursAgo: 8,
      },
      {
        title: "Хагас шигшээ тоглолтын гэрэл зураг",
        slug: "khagas-shigshee-togloltyn-gerel-zurag",
        description: "Үндэсний шигшээ багийн хагас шигшээ тоглолтын онцлох мөчүүд.",
        imageCount: 4,
        daysAgo: 1,
        hoursAgo: 0,
      },
      {
        title: "Үндэсний музейн шинэ үзэсгэлэнгээс",
        slug: "undesnii-muzeiin-shine-uzesgelengees",
        description: "Музейн шинэ үзэсгэлэнгийн нээлтийн үеийн гэрэл зураг.",
        imageCount: 5,
        daysAgo: 2,
        hoursAgo: 0,
      },
    ];
    for (const g of gallerySeeds) {
      const coverMediaId = id();
      await client.query(
        `INSERT INTO media (id, type, url, "thumbnailUrl", filename, "mimeType", "altText", credit, width, height, "updatedAt")
         VALUES ($1, 'IMAGE', $2, $3, $4, 'image/jpeg', $5, 'BigNewsNetwork', 1200, 800, now())`,
        [coverMediaId, img(`${g.slug}-cover`), img(`${g.slug}-cover`, 480, 320), `${g.slug}-cover.jpg`, g.title],
      );

      const galleryId = id();
      const publishedAt = isoDaysAgo(g.daysAgo, g.hoursAgo);
      await client.query(
        `INSERT INTO galleries (id, title, slug, description, "coverMediaId", "publishedAt", "updatedAt")
         VALUES ($1,$2,$3,$4,$5,$6, now())`,
        [galleryId, g.title, g.slug, g.description, coverMediaId, publishedAt],
      );

      for (let n = 1; n <= g.imageCount; n++) {
        const imgMediaId = id();
        await client.query(
          `INSERT INTO media (id, type, url, "thumbnailUrl", filename, "mimeType", "altText", credit, width, height, "updatedAt")
           VALUES ($1, 'IMAGE', $2, $3, $4, 'image/jpeg', $5, 'BigNewsNetwork', 1000, 700, now())`,
          [imgMediaId, img(`${g.slug}-${n}`, 1000, 700), img(`${g.slug}-${n}`, 400, 280), `${g.slug}-${n}.jpg`, `${g.title} — ${n}`],
        );
        await client.query(
          `INSERT INTO gallery_images (id, "galleryId", "mediaId", caption, credit, "sortOrder")
           VALUES ($1,$2,$3,$4,'BigNewsNetwork',$5)`,
          [id(), galleryId, imgMediaId, `${g.title}, зураг ${n}`, n - 1],
        );
      }
    }

    console.log("Seeding advertisements...");
    const adSeeds: { name: string; placement: string; w: number; h: number; active: boolean }[] = [
      { name: "Homepage Top Banner", placement: "HOMEPAGE_TOP", w: 970, h: 90, active: true },
      { name: "Homepage Middle Banner", placement: "HOMEPAGE_MIDDLE", w: 970, h: 250, active: true },
      { name: "Article Top Banner", placement: "ARTICLE_TOP", w: 728, h: 90, active: true },
      { name: "Article Middle Banner", placement: "ARTICLE_MIDDLE", w: 728, h: 200, active: true },
      { name: "Sidebar Banner", placement: "SIDEBAR", w: 300, h: 600, active: true },
      { name: "Mobile Top Banner", placement: "MOBILE_TOP", w: 320, h: 100, active: false },
    ];
    for (const [i, ad] of adSeeds.entries()) {
      await client.query(
        `INSERT INTO advertisements (id, name, "imageUrl", "targetUrl", placement, "startDate", "endDate", active, "updatedAt")
         VALUES ($1,$2,$3,'https://example.com',$4,$5,$6,$7, now())`,
        [id(), ad.name, img(`bnn-ad-${i}`, ad.w, ad.h), ad.placement, isoDaysAgo(14), isoDaysFromNow(30), ad.active],
      );
    }

    console.log("Seeding site settings...");
    const settings: [string, string][] = [
      ["site_title", "BigNewsNetwork"],
      ["site_description", "BigNewsNetwork — Монголын үндэсний мэдээллийн платформ."],
      ["contact_email", "info@bignewsnetwork.mn"],
      ["social_facebook", "https://facebook.com"],
      ["social_youtube", "https://youtube.com"],
      ["social_twitter", "https://x.com"],
    ];
    for (const [key, value] of settings) {
      await client.query(`INSERT INTO site_settings (id, key, value, "updatedAt") VALUES ($1,$2,$3, now())`, [
        id(),
        key,
        value,
      ]);
    }

    await client.query("COMMIT");
    console.log("Seed complete.");
    console.log(`  Users: ${Object.values(users).length}`);
    console.log(`  Authors: ${authorSeeds.length}`);
    console.log(`  Categories: ${categorySeeds.length}`);
    console.log(`  Tags: ${tagSeeds.length}`);
    console.log(`  Articles: ${articleSeeds.length}`);
    console.log(`  Videos: ${videoSeeds.length}`);
    console.log(`  Galleries: ${gallerySeeds.length}`);
    console.log(`  Advertisements: ${adSeeds.length}`);
    console.log(`\nDev login: any seeded email above, password: ${DEV_PASSWORD}`);
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
