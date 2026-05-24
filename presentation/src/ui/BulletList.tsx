import type { ReactNode } from "react";

interface BulletListProps {
  items: ReadonlyArray<ReactNode>;
  /**
   * If true, items fade in with a stagger driven by CSS animation-delay.
   */
  staggered?: boolean;
}

/**
 * Editorial bullet list — items are introduced by a thin yellow rule rather
 * than the usual filled dot. Reads more like a thesis-table than a slide
 * deck list.
 */
export function BulletList({ items, staggered = false }: BulletListProps) {
  return (
    <ul className="mt-5 divide-y divide-nebula-rule">
      {items.map((item, idx) => (
        <li
          key={idx}
          className={`flex items-start gap-4 py-3 text-[15px] leading-relaxed text-white/85 ${
            staggered ? "animate-fade-in-up" : ""
          }`}
          style={
            staggered
              ? { animationDelay: `${180 + idx * 130}ms` }
              : undefined
          }
        >
          <span
            aria-hidden
            className="mt-[10px] block h-[2px] w-5 shrink-0 bg-nebula-gold"
          />
          <span className="flex-1">{item}</span>
        </li>
      ))}
    </ul>
  );
}
