import { useEffect, useState } from "react";
import { SlideCard } from "@/ui/SlideCard";
import { SlideHeading } from "@/ui/SlideHeading";
import { useSlideSteps } from "@/navigation/SlideNavigationContext";

/**
 * Solution overview slide (deck slide 8).
 *
 * Three-pillar product anatomy. After 7 slides of problem, market and
 * evidence framing, this is the first slide that shows what ShopIt
 * concretely *is* as a product. The thesis itself organises the
 * platform's architecture into four blocks (store builder, additional
 * components, courier marketplace, payments) — we collapse the latter
 * two into the third pillar ("local integrations") so the slide reads
 * as a clean rule of three and the dedicated payments / logistics
 * slides (9 + 10) can drill in.
 *
 *   01 · მაღაზიის ამწყობი            no-code builder, fast launch
 *   02 · დეველოპერთა მარკეტპლეისი    local templates + integrations
 *   03 · ლოკალური ინტეგრაციები       payments, couriers, Georgian stack
 *
 * Per user direction, the third pillar stays bank-agnostic — no Keepz /
 * TBC / BoG brand callouts. The thesis itself treats payments as a
 * generic "local payment providers" layer (pp. 36, 42) and that's
 * faithful to where the implementation actually sits.
 *
 * Visual model
 *
 *   Three column cards in a row, separated by thin vertical rules.
 *   Each card carries a two-digit ordinal eyebrow, an English caption,
 *   a Georgian section title (28px), a one-line claim (18px white), and
 *   three feature bullets with the same thin gold rule used elsewhere
 *   in the deck.
 *
 *   Sub-step reveals (3 steps): each `Next` brings in the next pillar.
 *   Pillars that haven't been revealed yet stay in the layout (so the
 *   grid never reflows) but render dimmed with only the ordinal +
 *   English caption visible. Once a pillar is revealed it stays at
 *   full opacity for the rest of the slide.
 */

interface Pillar {
  /** Two-digit ordinal used in the eyebrow. */
  ordinal: string;
  /** Latin caption rendered alongside the ordinal. */
  englishLabel: string;
  /** Georgian section title (~28px). */
  title: string;
  /** One-line summary (white, 18px) — the "what is it". */
  claim: string;
  /** Three feature bullets. Sourced from thesis pp. 33–36. */
  bullets: ReadonlyArray<string>;
  /** Stagger delay in ms for the bullets within this pillar. */
  baseDelayMs: number;
}

const PILLARS: ReadonlyArray<Pillar> = [
  {
    ordinal: "01",
    englishLabel: "Store builder",
    title: "მაღაზიის ამწყობი",
    claim:
      "ტექნიკური ცოდნის გარეშე — ფუნქციონალური მაღაზია რამდენიმე ნაბიჯში.",
    bullets: [
      "პროდუქტის მართვა, კატალოგი, შეკვეთები — ერთ ინტერფეისში",
      "უნიკალური მისამართი storename.shopit.ge — ავტომატური გენერაცია",
      "ფერების, ლოგოს და გარეკანის ვიზუალური მორგება",
    ],
    baseDelayMs: 0,
  },
  {
    ordinal: "02",
    englishLabel: "Developer marketplace",
    title: "დეველოპერთა მარკეტპლეისი",
    claim:
      "ლოკალური ეკოსისტემა — შაბლონები, ინტეგრაციები და დამატებითი ფუნქციონალი.",
    bullets: [
      "შაბლონების მარკეტპლეისი — დეველოპერი აქვეყნებს, გამყიდველი იყენებს",
      "ქართულ ბიზნესზე მორგებული ინტეგრაციები და დანამატები",
      "ვალუტა-ეფექტი ეკოსისტემაში — შემოსავალი ქართულ დეველოპერებთან",
    ],
    baseDelayMs: 120,
  },
  {
    ordinal: "03",
    englishLabel: "Local integrations",
    title: "ლოკალური ინტეგრაციები",
    claim:
      "გადახდები, კურიერები და ქართული ენის ფენა — პლატფორმაში ჩაშენებულად.",
    bullets: [
      "ადგილობრივი გადახდის სისტემები — ჩაშენებული მხარდაჭერა",
      "კურიერების მარკეტპლეისი — დამოუკიდებელი კურიერი პლატფორმაზე",
      "ქართული ინტერფეისი, SMS / ნოტიფიკაცია, ფასი ლარში",
    ],
    baseDelayMs: 240,
  },
];

export function SolutionSlide() {
  // Three reveal steps — one per pillar. The slide enters at step 0 with
  // only the first pillar populated; each `Next` press fills the next column.
  const step = useSlideSteps(PILLARS.length);

  return (
    <SlideCard eyebrow="გადაწყვეტა · 08" size="lg">
      <SlideHeading level={2}>ShopIt — ერთიანი ლოკალური ინფრასტრუქტურა</SlideHeading>

      <p className="mt-5 max-w-4xl text-[20px] leading-snug text-white/70">
        ბაზრის ხარვეზებსა და კვლევის შედეგებზე პასუხია სამი ერთმანეთთან
        დაკავშირებული ფენა —{" "}
        <span className="text-white/45">
          ერთად აყალიბებენ მცირე გამყიდველისთვის შესვლის დაბალ ბარიერს.
        </span>
      </p>

      {/* Three-column grid. Thin vertical rules in the gaps tie the columns
          together as one stack rather than three isolated cards. */}
      <div className="relative mt-12 grid grid-cols-3 gap-x-10">
        {/* Vertical separators sit on the two column boundaries. */}
        <span
          aria-hidden
          className="pointer-events-none absolute left-1/3 top-0 h-full w-px bg-nebula-rule"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute left-2/3 top-0 h-full w-px bg-nebula-rule"
        />

        {PILLARS.map((pillar, idx) => (
          <PillarColumn key={pillar.ordinal} pillar={pillar} idx={idx} step={step} />
        ))}
      </div>

      {/* Footnote tying the third pillar to slides 9 + 10 so the audience
          knows the deeper dive is coming. */}
      <div className="mt-10 flex items-start gap-3 border-t border-nebula-rule pt-4">
        <span
          aria-hidden
          className="mt-[7px] block h-[2px] w-6 shrink-0 bg-nebula-gold"
        />
        <p className="text-[14px] leading-relaxed text-white/55">
          გადახდის და მიწოდების ფენებს მომდევნო ორი სლაიდი დეტალურად
          მიმოიხილავს — ფაზობრივი მიდგომა გადახდის ინფრასტრუქტურისთვის (09),
          მიწოდების სამი მოდელის შერწყმა კურიერების მარკეტპლეისში (10).
        </p>
      </div>
    </SlideCard>
  );
}

/* ---------- Pillar column ---------- */

interface PillarColumnProps {
  pillar: Pillar;
  idx: number;
  /** Current sub-step (0..PILLARS.length-1). */
  step: number;
}

function PillarColumn({ pillar, idx, step }: PillarColumnProps) {
  // Each pillar reveals when the sub-step reaches its index. Earlier pillars
  // stay revealed; later pillars sit in a dim placeholder state so the
  // three-column grid never reflows during the build.
  const revealed = step >= idx;

  // State-driven entry (PLAN §3.3) so the bullet transitions don't fight a
  // CSS animation transform on the wrapper.
  const [entered, setEntered] = useState(false);
  useEffect(() => {
    if (!revealed) {
      setEntered(false);
      return;
    }
    const t = setTimeout(() => setEntered(true), 80);
    return () => clearTimeout(t);
  }, [revealed]);

  return (
    <div
      className="px-3"
      style={{
        opacity: revealed ? 1 : 0.32,
        transition: "opacity 700ms cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      {/* Ordinal + English caption — always visible so the dim placeholder
          still reads as a numbered slot. */}
      <div className="flex items-baseline justify-between">
        <p className="font-mono text-[14px] uppercase tracking-eyebrow text-nebula-gold">
          {pillar.ordinal}
        </p>
        <p className="font-mono text-[11px] uppercase tracking-eyebrow text-white/35">
          {pillar.englishLabel}
        </p>
      </div>

      {/* Georgian section title — the focal anchor for the column. */}
      <h2
        className="mt-4 text-[28px] font-semibold leading-tight tracking-tight text-white"
        style={{
          transform: entered ? "translateY(0)" : "translateY(8px)",
          opacity: entered ? 1 : 0,
          transition:
            "opacity 600ms ease 80ms, transform 600ms cubic-bezier(0.22, 1, 0.36, 1) 80ms",
        }}
      >
        {pillar.title}
      </h2>

      {/* One-line claim — the "what" of the pillar. */}
      <p
        className="mt-3 text-[18px] leading-snug text-white/85"
        style={{
          opacity: entered ? 1 : 0,
          transition: "opacity 600ms ease 220ms",
        }}
      >
        {pillar.claim}
      </p>

      {/* Three feature bullets. Thin gold rule + body text, identical
          pattern to ResearchMethodologySlide so the deck feels of-a-piece. */}
      <ul className="mt-6 flex flex-col gap-3">
        {pillar.bullets.map((bullet, bIdx) => (
          <li
            key={bullet}
            className="flex items-start gap-3"
            style={{
              opacity: entered ? 1 : 0,
              transform: entered ? "translateY(0)" : "translateY(6px)",
              transition: `opacity 500ms ease ${360 + bIdx * 120}ms, transform 500ms cubic-bezier(0.22, 1, 0.36, 1) ${360 + bIdx * 120}ms`,
            }}
          >
            <span
              aria-hidden
              className="mt-[10px] block h-[2px] w-4 shrink-0 bg-nebula-gold/70"
            />
            <p className="flex-1 text-[14px] leading-snug text-white/75">
              {bullet}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
