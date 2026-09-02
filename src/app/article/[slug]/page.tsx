import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleHeader } from "@/components/ArticleHeader";
import { ArticleBody } from "@/components/ArticleBody";
import { SocialShare } from "@/components/SocialShare";
import { RelatedArticles } from "@/components/RelatedArticles";
import { MostRead } from "@/components/MostRead";
import { PopularTags } from "@/components/PopularTags";
import { AdvertisementSlot } from "@/components/AdvertisementSlot";
import { articles, tags as allTags } from "@/lib/mock-data";
import { siteConfig } from "@/lib/site-config";
import {
  getArticleBySlug,
  getMostReadArticles,
  getRelatedArticles,
} from "@/lib/queries";

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};

  const url = `${siteConfig.url}/article/${article.slug}`;

  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: url },
    authors: [{ name: article.author.name }],
    openGraph: {
      type: "article",
      title: article.title,
      description: article.excerpt,
      url,
      images: [{ url: article.image.url }],
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt ?? article.publishedAt,
      authors: [article.author.name],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: [article.image.url],
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const [related, mostRead] = await Promise.all([
    getRelatedArticles(article, 4),
    getMostReadArticles("week", 5),
  ]);

  const url = `${siteConfig.url}/article/${article.slug}`;

  const newsArticleLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    image: [article.image.url],
    datePublished: article.publishedAt,
    dateModified: article.updatedAt ?? article.publishedAt,
    author: { "@type": "Person", name: article.author.name },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: { "@type": "ImageObject", url: `${siteConfig.url}/icon.png` },
    },
    description: article.excerpt,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Нүүр", item: siteConfig.url },
      {
        "@type": "ListItem",
        position: 2,
        name: article.category.name,
        item: `${siteConfig.url}/${article.category.slug}`,
      },
      { "@type": "ListItem", position: 3, name: article.title, item: url },
    ],
  };

  return (
    <div className="container-edit py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(newsArticleLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <nav
        aria-label="Хажуугийн зам"
        className="mx-auto mb-4 max-w-3xl text-xs text-ink-soft lg:-translate-x-[70px]"
      >
        <ol className="flex flex-wrap items-center gap-1">
          <li>
            <Link href="/" className="hover:text-masthead">
              Нүүр
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link
              href={`/${article.category.slug}`}
              className="hover:text-masthead"
            >
              {article.category.name}
            </Link>
          </li>
        </ol>
      </nav>

      <article>
        <ArticleHeader article={article} />

        <div className="relative mt-6">
         
          {/* Article body */}
          <div className="mx-auto max-w-3xl lg:-translate-x-[90px]">
            <ArticleBody article={article} />

            <div className="mt-8">
              <AdvertisementSlot placement="ARTICLE_MIDDLE" />
            </div>

            <div className="mt-8">
              <SocialShare url={url} title={article.title} />
            </div>
          </div>

          {/* Independent sidebar */}
          <aside
            className="
            mt-10 space-y-8
            lg:absolute
            lg:left-[calc(50%+400px)]
            lg:top-[-550px]
            lg:mt-0
            lg:w-[320px]
    "
          >
            <MostRead articles={mostRead} title="Хамгийн их уншсан" />
            <AdvertisementSlot placement="SIDEBAR" />
            <PopularTags tags={allTags.slice(0, 8)} />
          </aside>
        </div>
      </article>

      <RelatedArticles articles={related} />

    </div>
  );
}
