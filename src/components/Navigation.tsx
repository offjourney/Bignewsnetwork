"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { primaryNav, secondaryNav } from "@/lib/site-config";

interface NavigationProps {
  scrolled?: boolean;
}

export function Navigation({ scrolled = false }: NavigationProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const [prevPathname, setPrevPathname] = useState(pathname);

  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  return (
    <nav
      aria-label="Үндсэн цэс"
      className="border-t border-b bg-paper text-ink"
      style={{
        borderTopColor: "#333333",
        borderBottomColor: "var(--bnn-line)",
      }}
    >
      <div className="container-edit flex h-[42px] items-center">
        {/* Desktop navigation */}
        <ul className="hidden items-center gap-1 lg:flex">
          {primaryNav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="
                  group relative block whitespace-nowrap
                  px-3 py-2
                  text-sm font-semibold tracking-wide
                  text-ink transition-colors duration-200
                  hover:text-accent
                  "
                >
                {item.label}

                {/* Red underline ONLY on hover */}
                <span
                  className="absolute bottom-0 left-[20%] right-[20%] h-[2px] origin-center scale-x-0 bg-accent transition-transform duration-200 ease-out group-hover:scale-x-100"
                  aria-hidden="true"
                />
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile menu */}
        <button
          type="button"
          className="flex items-center gap-2 py-2.5 text-sm font-semibold text-ink transition-colors hover:text-accent lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav-drawer"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="relative block h-4 w-5" aria-hidden="true">
            <span
              className={`absolute left-0 top-0 h-0.5 w-5 bg-current transition-transform ${
                open ? "translate-y-[7px] rotate-45" : ""
              }`}
            />

            <span
              className={`absolute left-0 top-[7px] h-0.5 w-5 bg-current transition-opacity ${
                open ? "opacity-0" : ""
              }`}
            />

            <span
              className={`absolute left-0 top-[14px] h-0.5 w-5 bg-current transition-transform ${
                open ? "-translate-y-[7px] -rotate-45" : ""
              }`}
            />
          </span>
          Цэс
        </button>

        {/* Secondary links */}
        <ul className="hidden shrink-0 items-center gap-5 pl-6 lg:flex">
          {secondaryNav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="whitespace-nowrap text-xs font-medium text-ink-soft transition-colors hover:text-accent"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Mobile drawer */}
      <div
        id="mobile-nav-drawer"
        className={`overflow-hidden bg-paper-dim transition-[max-height] duration-300 lg:hidden ${
          open ? "max-h-[70vh]" : "max-h-0"
        }`}
      >
        <ul className="container-edit divide-y divide-line py-1">
          {[...primaryNav, ...secondaryNav].map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="block py-3 text-[15px] font-medium text-ink transition-colors hover:text-accent"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
