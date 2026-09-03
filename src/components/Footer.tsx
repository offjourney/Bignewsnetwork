import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { SocialGlyph } from "./icons/SocialGlyph";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-line-strong bg-masthead text-paper">
      <div className="container-edit">
        {/* Main footer */}
        <div className="flex flex-col gap-10 py-10 md:flex-row md:items-start md:justify-between">
          {/* Left side — Logo + description */}
          <div className="max-w-xl">
            {/* Text logo */}
            <Link
              href="/"
              aria-label="BigNewsNetwork home"
              className="inline-block font-serif text-2xl font-black tracking-tight text-paper"
            >
              BIG<span className="text-accent-soft">NEWS</span>NETWORK
            </Link>

            {/* Description / slogan */}
            <p className="mt-3 max-w-md text-sm leading-relaxed text-paper/70">
              {siteConfig.description}
            </p>

            {/* Social buttons */}
            <div className="mt-5 flex gap-2">
              <a
                href={siteConfig.social.facebook}
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center border border-paper/20 text-paper/70 transition-colors hover:border-paper/50 hover:text-paper"
              >
                <SocialGlyph kind="facebook" className="h-5 w-5" />
              </a>

              <a
                href={siteConfig.social.youtube}
                aria-label="YouTube"
                className="flex h-9 w-9 items-center justify-center border border-paper/20 text-paper/70 transition-colors hover:border-paper/50 hover:text-paper"
              >
                <SocialGlyph kind="youtube" className="h-5 w-5" />
              </a>

              <a
                href={siteConfig.social.twitter}
                aria-label="X"
                className="flex h-9 w-9 items-center justify-center border border-paper/20 text-paper/70 transition-colors hover:border-paper/50 hover:text-paper"
              >
                <SocialGlyph kind="x" className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Right side — Contact */}
          <div className="md:min-w-[260px] md:text-right">
            <h2 className="mb-3 text-[10px] font-bold uppercase tracking-[0.15em] text-paper/50">
              Холбоо барих
            </h2>

            <div className="space-y-1.5 text-sm text-paper/70">
              <a
                href="mailto:info@bignewsnetwork.mn"
                className="block transition-colors hover:text-paper"
              >
                info@bignewsnetwork.mn
              </a>

              <a
                href="tel:+97691112955"
                className="block transition-colors hover:text-paper"
              >
                +976 9111 2955
              </a>

              <p className="pt-1 text-paper/50">Улаанбаатар хот, Монгол улс</p>
            </div>

            {/* Small navigation */}
            <nav
              aria-label="Footer navigation"
              className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs text-paper/50 md:justify-end"
            >
              <Link
                href="/latest"
                className="transition-colors hover:text-paper"
              >
                Сүүлийн үеийн мэдээ
              </Link>

              <Link
                href="/video"
                className="transition-colors hover:text-paper"
              >
                Видео
              </Link>

              <Link
                href="/photos"
                className="transition-colors hover:text-paper"
              >
                Фото
              </Link>

              <Link
                href="/about"
                className="transition-colors hover:text-paper"
              >
                Бидний тухай
              </Link>
            </nav>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-paper/10">
          <div className="flex flex-col gap-2 py-4 text-xs text-paper/50 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {new Date().getFullYear()} BigNewsNetwork. Бүх эрх хуулиар
              хамгаалагдсан.
            </p>

            <Link
              href="/admin/login"
              className="transition-colors hover:text-paper"
            >
              Админ
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
