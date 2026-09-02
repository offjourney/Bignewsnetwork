/**
 * Small original monogram icons for social links.
 * The surrounding button/link controls the border and sizing.
 */
export type SocialKind = "facebook" | "x" | "youtube" | "instagram";

export function SocialGlyph({
  kind,
  className = "",
}: {
  kind: SocialKind;
  className?: string;
}) {
  const glyph: Record<SocialKind, string> = {
    facebook: "f",
    x: "𝕏",
    youtube: "▶",
    instagram: "ig",
  };

  return (
    <span
      aria-hidden="true"
      className={`inline-flex items-center justify-center font-serif font-bold leading-none ${className}`}
    >
      {glyph[kind]}
    </span>
  );
}
