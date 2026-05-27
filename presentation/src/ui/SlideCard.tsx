import type { ReactNode } from "react";

interface SlideCardProps {
  /** Optional eyebrow label rendered above the card content (e.g., section). */
  eyebrow?: string;
  /** Tighter or roomier card. */
  size?: "md" | "lg" | "xl";
  children: ReactNode;
}

// Sized to feel like a slide on a lecture-hall projector — readable from
// the back row, but with margin around it so the deep-space background
// reads as a frame, not as a thin border. Roughly 3/4 of the viewport.
// `xl` is reserved for slides where the content takes over the whole
// frame (the demo video) and benefits from extra vertical room.
const sizeClass: Record<NonNullable<SlideCardProps["size"]>, string> = {
  md: "w-[min(1100px,76vw)] min-h-[72vh] px-14 py-12",
  lg: "w-[min(1400px,84vw)] min-h-[78vh] px-16 py-14",
  xl: "w-[min(1500px,88vw)] min-h-[88vh] px-16 py-14",
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
