import type { ReactNode } from "react";

interface SlideCardProps {
  /** Optional eyebrow label rendered above the card content (e.g., section). */
  eyebrow?: string;
  /** Tighter or roomier card. */
  size?: "md" | "lg";
  children: ReactNode;
}

// Sized for a lecture-hall projector / a remote-viewing committee, not for
// a laptop preview. `lg` fills most of the screen so the audience can read
// 28-30px body text comfortably from a distance; `md` is a notch smaller
// for sparser slides.
const sizeClass: Record<NonNullable<SlideCardProps["size"]>, string> = {
  md: "w-[min(1200px,86vw)] min-h-[74vh] px-16 py-14",
  lg: "w-[min(1520px,92vw)] min-h-[82vh] px-20 py-16",
};

/**
 * Editorial slide frame — no glass-morph blur, no shadow halo, no rounded
 * pill border. Just a soft dark panel with a thin yellow top rule and a
 * monospaced eyebrow label. Reads like a thesis chapter, not a SaaS card.
 */
export function SlideCard({ eyebrow, size = "md", children }: SlideCardProps) {
  return (
    <article
      className={`relative ${sizeClass[size]} animate-fade-in-up rounded-sm bg-nebula-ink/85 ring-1 ring-nebula-rule backdrop-blur-[6px]`}
    >
      <span
        aria-hidden
        className="absolute left-0 top-0 h-[3px] w-24 bg-nebula-gold animate-rule-grow"
      />
      {eyebrow ? (
        <p className="mb-8 font-mono text-[18px] uppercase tracking-eyebrow text-nebula-gold">
          {eyebrow}
        </p>
      ) : null}
      {children}
    </article>
  );
}
