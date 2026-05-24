import type { ReactNode } from "react";

interface PillProps {
  children: ReactNode;
}

/**
 * Minimal text label — replaces the previous rounded-pill chips with
 * a typography-only treatment: monospaced uppercase eyebrow with a small
 * yellow square marker. Less "AI-website" pill, more editorial label.
 *
 * The component is kept for any slide that still wants an inline tag.
 */
export function Pill({ children }: PillProps) {
  return (
    <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-eyebrow text-white/75">
      <span aria-hidden className="block h-[6px] w-[6px] bg-nebula-gold" />
      {children}
    </span>
  );
}
