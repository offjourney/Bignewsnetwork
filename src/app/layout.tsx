import type { Metadata } from "next";
import "@fontsource/pt-serif/latin-400.css";
import "@fontsource/pt-serif/latin-700.css";
import "@fontsource/pt-serif/cyrillic-400.css";
import "@fontsource/pt-serif/cyrillic-700.css";
import "@fontsource/pt-sans/latin-400.css";
import "@fontsource/pt-sans/latin-700.css";
import "@fontsource/pt-sans/cyrillic-400.css";
import "@fontsource/pt-sans/cyrillic-700.css";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { siteConfig } from "@/lib/site-config";

// PT Serif / PT Sans: a superfamily designed by ParaType specifically for
// robust Cyrillic typesetting, paired here for headline/body roles.
// Self-hosted via @fontsource (no runtime fetch to Google Fonts required),
// wired to the same --font-pt-serif / --font-pt-sans CSS vars used in
// globals.css's @theme block.

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    type: "website",
    locale: "mn_MN",
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="mn" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-paper text-ink">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
