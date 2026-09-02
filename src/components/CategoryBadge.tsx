import Link from "next/link";
import { FlameMark } from "./icons/FlameMark";

export function CategoryBadge({
  name,
  href,
  size = "sm",
}: {
  name: string;
  href: string;
  size?: "sm" | "md";
}) {
  const text = size === "md" ? "text-[13px]" : "text-[11px]";
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-1 ${text} font-sans font-bold uppercase tracking-wider text-accent hover:text-masthead transition-colors`}
    >
      {name}
    </Link>
  );
}
