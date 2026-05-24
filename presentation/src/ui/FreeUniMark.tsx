/**
 * A compact Free University wordmark in the academic-program eyebrow style.
 * Two stacked lines: the institution name + program code, separated by a
 * short yellow rule. Deliberately understated — feels like a thesis cover
 * page, not a tech-brand logo.
 */
export function FreeUniMark() {
  return (
    <div className="flex items-center gap-4 font-mono text-[16px] uppercase tracking-eyebrow text-white/80">
      <span aria-hidden className="block h-5 w-[3px] bg-nebula-gold" />
      <div className="leading-tight">
        <div>თავისუფალი უნივერსიტეტი</div>
        <div className="mt-1 text-white/55">Free University · MBA 22</div>
      </div>
    </div>
  );
}
