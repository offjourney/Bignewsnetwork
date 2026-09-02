"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { siteConfig } from "@/lib/site-config";
import { todayLongMn } from "@/lib/utils";
import { Navigation } from "./Navigation";

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-paper">
      {/* Masthead */}
      <div
        className={`container-edit flex items-center justify-between gap-6 transition-all duration-300 ${
          scrolled ? "py-2" : "py-3 md:py-4"
          }`}
      >

        <div className="flex items-center">
          {/* Logo */}
          <Link
            href="/"
            className={`relative -ml-7 flex shrink-0 items-center transition-[width] duration-500 ease-in-out ${
              scrolled ? "w-[210px]" : "w-[180px] md:w-[210px]"
            }`}
            aria-label="BigNewsNetwork home"
          >
            {/* Full logo */}
            <Image
              src="/logo.png"
              alt="BigNewsNetwork"
              width={220}
              height={60}
              priority
              className={`h-auto transition-all duration-500 ease-in-out ${
                scrolled
                  ? "absolute w-0 scale-95 opacity-0"
                  : "w-[180px] scale-100 opacity-100 md:w-[210px]"
              }`}
            />

            {/* Scrolled logo */}
            <Image
              src="/logo_text.png"
              alt="BigNewsNetwork"
              width={824}
              height={86}
              priority
              className={`absolute left-0 top-1/2 h-auto -translate-y-1/2 transition-all duration-500 ease-in-out ${
                scrolled
                  ? "w-[210px] scale-100 opacity-100"
                  : "w-[210px] scale-95 opacity-0"
              }`}
            />
          </Link>

          {/* Slogan */}
          <div className="ml-8 flex items-center">
            {/* Red divider */}
            <div className="mr-7 h-14 w-px bg-accent" />

            <div className="flex flex-col">
              <span
                className="
                  font-serif
                  text-[17px]
                  font-bold
                  leading-tight
                  tracking-[0.02em]
                  text-ink
                  xl:text-[19px]
                "
              >
                Монголын мэдээлэл, аналитикийн
                <br />
                үндэсний платформ
              </span>

              {/* Small editorial accent 
              <span className="mt-3 h-[2px] w-12 bg-accent" />*/}
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
            Хайх
          </label>

          <div className="flex w-full items-center border-b border-line-strong transition-colors focus-within:border-accent">
            <input
              id="site-search"
              type="search"
              name="q"
              placeholder="Хайх..."
              className="min-w-0 flex-1 bg-transparent px-1 py-2 text-sm text-ink placeholder:text-ink-soft focus:outline-none"
            />

            <button
              type="submit"
              aria-label="Хайх"
              className="flex h-8 w-8 shrink-0 items-center justify-center text-ink-soft transition-colors hover:text-accent"
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
          className="flex h-9 w-9 items-center justify-center text-ink transition-colors hover:text-accent md:hidden"
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
