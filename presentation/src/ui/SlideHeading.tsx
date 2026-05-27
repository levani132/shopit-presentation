import type { ReactNode } from "react";

interface SlideHeadingProps {
  /** Visual level — controls size and font family. */
  level?: 1 | 2;
  /** Optional editorial style: 'serif' for hero titles, 'sans' for sections. */
  variant?: "serif" | "sans";
  children: ReactNode;
}

// Slide-audience sizing — large enough to read from across a lecture hall
// but not so large the rest of the slide has no room to breathe. Level 1
// is reserved for hero titles (the opening card); level 2 carries the
// rest of the deck.
const sizeClass: Record<NonNullable<SlideHeadingProps["level"]>, string> = {
  1: "text-[88px] leading-[1.02] tracking-tight",
  2: "text-[52px] leading-[1.1] tracking-tight",
};

const variantClass: Record<NonNullable<SlideHeadingProps["variant"]>, string> = {
  serif: "font-serif font-semibold",
  sans: "font-sans font-semibold",
};

/**
 * Heading. Visually distinguishes hero titles (serif) from section
 * headings (sans) while staying semantically <h1> (each slide is a page).
 */
export function SlideHeading({
  level = 1,
  variant = "sans",
  children,
}: SlideHeadingProps) {
  return (
    <h1 className={`${variantClass[variant]} ${sizeClass[level]} text-white`}>
      {children}
    </h1>
  );
}
