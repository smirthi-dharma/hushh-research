"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

const BRAND_MARK_SIZE_CLASSES = {
  sm: "h-[72px] w-[72px] rounded-[20px]",
  md: "h-24 w-24 rounded-[24px]",
  lg: "h-[112px] w-[112px] rounded-[28px]",
} as const;

export type BrandMarkSize = keyof typeof BRAND_MARK_SIZE_CLASSES;

export function BrandMark({
  size = "md",
  unframed = false,
  className,
}: {
  size?: BrandMarkSize;
  unframed?: boolean;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "grid place-items-center overflow-hidden",
        unframed
          ? "bg-transparent shadow-none"
          : "bg-black shadow-[0_18px_50px_rgba(0,0,0,0.18)] dark:bg-white",
        BRAND_MARK_SIZE_CLASSES[size],
        className,
      )}
    >
      <img
        src="/quiet-emoji-icon-transparent.png"
        alt=""
        draggable={false}
        className="h-full w-full object-contain"
      />
    </div>
  );
}
