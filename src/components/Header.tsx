"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Navigation } from "./Navigation";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (animating) return;

      const y = window.scrollY;

      if (!scrolled && y > 150) {
        setAnimating(true);
        setScrolled(true);

        setTimeout(() => {
          setAnimating(false);
        }, 500);
      }

      if (scrolled && y < 20) {
        setAnimating(true);
        setScrolled(false);

        setTimeout(() => {
          setAnimating(false);
        }, 500);
      }
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled, animating]);

  return (
    <header className="sticky top-0 z-50 bg-paper">
      {/* Masthead */}
      <div
        className={`
          container-edit flex items-center  justify-between gap-6
          transition-all duration-500 ease-in-out
          ${scrolled ? "h-[52px]" : "h-[140px] md:h-[150px]"}
        `}
      >
        <div className="flex -translate-x-4 items-center">
          {/* Logo */}
          <Link
            href="/"
            className={`
              relative block
              transition-all duration-500 ease-in-out
              ${scrolled ? "h-[35px] w-[210px]" : "h-[100px] w-[230px]"}
            `}
            aria-label="BigNewsNetwork home"
          >
            {/* Full logo */}
            <Image
              src="/logo.png"
              alt="BigNewsNetwork"
              width={220}
              height={60}
              priority
              className={`
                absolute left-0 top-1/2
                h-auto -translate-y-1/2 -translate-x-6
                transition-all duration-500 ease-in-out
                ${scrolled ? "scale-90 opacity-0" : "scale-100 opacity-100"}
              `}
            />

            {/* Compact scrolled logo */}
            <Image
              src="/logo_text.png"
              alt="BigNewsNetwork"
              width={824}
              height={86}
              priority
              className={`
                absolute left-0 top-1/2
                h-auto w-[300px]
                -translate-y-1/2
                -translate-x-4
                transition-all duration-500 ease-in-out
                ${scrolled ? "scale-100 opacity-100" : "scale-90 opacity-0"}
              `}
            />
          </Link>

          {/* Slogan */}
          <div className="flex items-center">
            <div className="flex flex-col">
              <span
                className={`
                  font-serif
                  font-bold
                  leading-tight
                  tracking-[0.02em]
                  text-ink
                  transition-all duration-500 delay-100 ease-in-out
                  ${
                    scrolled
                      ? "text-[14px] xl:text-[16px]"
                      : "text-[17px] xl:text-[19px]"
                  }
                `}
              >
                Стратегийн мэдээлэл, анализ, хэтийн төлөвийн медиа платформ
              </span>

              <span
                className={`
                  font-serif
                  font-medium
                  leading-tight
                  tracking-[0.02em]
                  italic
                  text-ink
                  transition-all duration-500 delay-100 ease-in-out
                  ${
                    scrolled
                      ? "text-[14px] xl:text-[16px]"
                      : "text-[17px] xl:text-[19px]"
                  }
                `}
              >
                Таны өгсөх замын алсын хараа.
              </span>
            </div>
          </div>
        </div>

        {/* Desktop search */}
        <form
          action="/search"
          method="GET"
          role="search"
          className="hidden w-full max-w-sm md:flex"
        >
          <label htmlFor="site-search" className="sr-only">
            Хайлт
          </label>

          <div
            className="
              flex w-full items-center
              border-b border-line-strong
              transition-colors
              focus-within:border-accent
            "
          >
            <input
              id="site-search"
              type="search"
              name="q"
              placeholder="Хайлт ..."
              className="
                min-w-0 flex-1
                bg-transparent
                px-1 py-2
                text-sm
                text-ink
                placeholder:text-ink-soft
                focus:outline-none
              "
            />

            <button
              type="submit"
              aria-label="Хайх"
              className="
                flex h-8 w-8 shrink-0
                items-center justify-center
                text-ink-soft
                transition-colors
                hover:text-accent
              "
            >
              <svg
                viewBox="0 0 24 24"
                className="h-[18px] w-[18px]"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
            </button>
          </div>
        </form>

        {/* Mobile search */}
        <Link
          href="/search"
          aria-label="Мэдээ хайх"
          className="
            flex h-9 w-9
            items-center justify-center
            text-ink
            transition-colors
            hover:text-accent
            md:hidden
          "
        >
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
        </Link>
      </div>

      <Navigation scrolled={scrolled} />
    </header>
  );
}
