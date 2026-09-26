import Image from "next/image";

import { cn } from "@/lib/utils";

/**
 * Canonical Hussh/One "shushing face" brand mark. Renders the same raster
 * asset on every platform instead of the literal 🤫 codepoint, whose glyph
 * differs across Apple Color Emoji / Segoe UI Emoji / Noto Color Emoji.
 * Sized in `em` units so it drops into any existing font-size-driven layout.
 */
export function QuietEmoji({ className }: { className?: string }) {
  return (
    <Image
      src="/one-quiet-emoji.png"
      alt="🤫"
      aria-hidden
      width={762}
      height={766}
      unoptimized
      draggable={false}
      className={cn(
        "inline-block h-[1em] w-[1em] shrink-0 object-contain align-middle",
        className,
      )}
    />
  );
}
