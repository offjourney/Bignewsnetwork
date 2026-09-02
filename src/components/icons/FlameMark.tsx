/**
 * BigNewsNetwork's signature mark: a small original tri-flame glyph.
 * Used sparingly as a category eyebrow bullet and the breaking-news marker.
 * Not a reproduction of any national or organizational emblem.
 */
export function FlameMark({ className = "", color = "currentColor" }: { className?: string; color?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={className}
      fill="none"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M8 1.2C8 3 6.4 4 6.4 5.8C6.4 6.6 6.9 7.1 7.4 7.4C7 6.7 7.1 6 7.6 5.5C7.6 6.5 8.4 7 8.4 8C8.4 8.6 8 9 7.6 9.3C8.9 9.1 9.7 8.1 9.7 6.9C9.7 5.4 8 4.3 8 1.2Z" fill={color} />
      <path d="M8 15C4.7 15 2.6 13 2.6 10.3C2.6 8.5 3.6 7.2 4.5 6.2C4.3 7.5 4.9 8.3 5.6 8.9C5.4 7.9 5.7 7.1 6.3 6.5C6.1 8 7 8.7 7 9.9C7 10.5 6.7 10.9 6.3 11.2C6.9 11.5 7.6 11.3 8 10.8C8.4 11.3 9.1 11.5 9.7 11.2C9.3 10.9 9 10.5 9 9.9C9 8.7 9.9 8 9.7 6.5C10.3 7.1 10.6 7.9 10.4 8.9C11.1 8.3 11.7 7.5 11.5 6.2C12.4 7.2 13.4 8.5 13.4 10.3C13.4 13 11.3 15 8 15Z" fill={color} />
    </svg>
  );
}
