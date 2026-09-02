"use client";

import { useState } from "react";
import { SocialGlyph } from "./icons/SocialGlyph";

export function SocialShare({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const links = [
    {
      label: "Facebook",
      kind: "facebook" as const,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      label: "X",
      kind: "x" as const,
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    },
  ];

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      // Clipboard API unavailable.
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Label */}
      <span className="mr-1 text-[10px] font-bold uppercase tracking-[0.15em] text-ink-soft">
        Хуваалцах:
      </span>

      {/* Facebook / X */}
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Share on ${link.label}`}
          className="flex h-9 w-9 items-center justify-center border border-line text-ink-soft transition-colors hover:border-masthead hover:text-ink"
        >
          <SocialGlyph kind={link.kind} className="h-5 w-5" />
        </a>
      ))}

      {/* Copy link */}
      <button
        type="button"
        onClick={copyLink}
        aria-label="Copy article link"
        className="flex h-9 items-center gap-2 border border-line px-3 text-ink-soft transition-colors hover:border-masthead hover:text-ink"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5 shrink-0"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path
            d="M10 13a5 5 0 0 0 7.07.07l2-2a5 5 0 0 0-7.07-7.07l-1.15 1.15"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M14 11a5 5 0 0 0-7.07-.07l-2 2A5 5 0 0 0 7 20l1.15-1.15"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <span className="text-[10px] font-bold uppercase tracking-[0.08em]">
          {copied ? "Хуулагдлаа" : "Холбоос хуулах"}
        </span>
      </button>
    </div>
  );
}
