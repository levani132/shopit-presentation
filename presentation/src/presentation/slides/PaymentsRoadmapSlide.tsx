import { useEffect, useState } from "react";
import { SlideCard } from "@/ui/SlideCard";
import { SlideHeading } from "@/ui/SlideHeading";
import { useSlideSteps } from "@/navigation/SlideNavigationContext";

/**
 * Payments slide (deck slide 9).
 *
 * Two-stage narrative, intentionally simple:
 *
 *   01 · ამჟამად       ShopIt-ის მაღაზიები იღებენ ონლაინ გადახდას
 *                       ადგილობრივი გადახდის სისტემების მეშვეობით.
 *
 *   02 · მომავალში     განვადება ხდება ხელმისაწვდომი ShopIt-ში
 *                       დარეგისტრირებული ნებისმიერი მაღაზიისთვის.
 *
 * Earlier draft tried to lay out three engineering phases with take-
 * rates and dependency bullets — Levan's call was that this read as
 * over-engineered for a thesis defense slide. Replaced with the
 * simpler "what we do today vs what we add next" story.
 *
 * Visual model
 *
 *   Two stage blocks side-by-side, separated by a thin gold connector.
 *   Each block: an ordinal eyebrow, a Latin shadow label, a Georgian
 *   stage title, a single-paragraph body. Sub-step reveals (2 steps):
 *   stage 1 visible at step 0, stage 2 lights at step 1. The
 *   connector arrow extends from stage 1 to stage 2 on the same step.
 */

interface Stage {
  ordinal: string;
  /** Georgian stage label — "ამჟამად" / "მომავალში". */
  label: string;
  /** Latin shadow label. */
  englishLabel: string;
  /** Title of what the stage offers. */
  title: string;
  /** One-paragraph body — the "what does this mean" line. */
  body: string;
}

const STAGES: ReadonlyArray<Stage> = [
  {
    ordinal: "01",
    label: "ამჟამად",
    englishLabel: "Today",
    title: "გადახდის მიღება",
    body: "დამატებითი ტექნიკური ცოდნის გარეშე, გამყიდველს პლატფორმაზე ხვდება მზა გადახდის სისტემა.",
  },
  {
    ordinal: "02",
    label: "მომავალში",
    englishLabel: "Next",
    title: "განვადება ყველა მაღაზიისთვის",
    body: "ShopIt-ში დარეგისტრირებული ნებისმიერი მაღაზიის მომხმარებელს ეძლევა შესაძლებლობა, შესყიდვა შეასრულოს განვადებით — პარტნიორი ბანკების მეშვეობით, ცალკეული ხელშეკრულებების გარეშე.",
  },
];

export function PaymentsRoadmapSlide() {
  // Two reveal steps — stage 1 (today), stage 2 (future). The slide
  // enters at step 0 with only stage 1 lit; one `Next` press lights
  // stage 2 + extends the gold connector.
  const step = useSlideSteps(STAGES.length);

  return (
    <SlideCard eyebrow="გადახდა · 09" size="lg">
      <SlideHeading level={2}>როგორ იღებს გამყიდველი თანხას</SlideHeading>

      <p className="mt-5 max-w-4xl text-[20px] leading-snug text-white/70">
        ShopIt-ის გადახდის ფენა ვითარდება ეტაპობრივად —{" "}
        <span className="text-white/45">
          დღევანდელი ერთიანი გადახდის გამოცდილებიდან მომავალში დამატებითი
          ფინანსური მექანიკის ფენამდე.
        </span>
      </p>

      {/* Two stage blocks side-by-side. A gold connector sits behind them
          at title-line height; the visible portion grows with `step` so
          the eye reads "stage 1 → stage 2" once the second is revealed. */}
      <div className="relative mt-16 grid grid-cols-2 gap-x-16">
        {/* Background track + foreground gold fill — same primitive as
            the bottom-bar in MarketOpportunitySlide. */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-[10%] right-[10%] top-[58px] h-[2px] bg-nebula-rule"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute left-[10%] top-[58px] h-[2px] origin-left bg-nebula-gold/80"
          style={{
            width: "80%",
            transform: `scaleX(${(step + 1) / STAGES.length})`,
            transition:
              "transform 900ms cubic-bezier(0.22, 1, 0.36, 1) 80ms",
          }}
        />

        {STAGES.map((stage, idx) => (
          <StageBlock key={stage.ordinal} stage={stage} idx={idx} step={step} />
        ))}
      </div>
    </SlideCard>
  );
}

/* ---------- Stage block ---------- */

interface StageBlockProps {
  stage: Stage;
  idx: number;
  /** Current sub-step (0..STAGES.length-1). */
  step: number;
}

function StageBlock({ stage, idx, step }: StageBlockProps) {
  const revealed = step >= idx;

  // State-driven entry (PLAN §3.3).
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
      className="relative px-3"
      style={{
        opacity: revealed ? 1 : 0.32,
        transition: "opacity 700ms cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      {/* Eyebrow: ordinal + Georgian label. */}
      <div className="flex items-baseline gap-3">
        <p className="font-mono text-[14px] uppercase tracking-eyebrow text-nebula-gold">
          {stage.ordinal}
        </p>
        <p className="font-mono text-[12px] uppercase tracking-eyebrow text-white/45">
          {stage.label}
        </p>
      </div>

      {/* Marker on the connector rail. */}
      <div className="relative mt-6 flex h-[16px] items-center">
        <span
          aria-hidden
          className="block h-[12px] w-[12px] rounded-full"
          style={{
            backgroundColor: revealed
              ? "#f5c518"
              : "rgba(255, 255, 255, 0.18)",
            boxShadow: revealed
              ? "0 0 0 4px rgba(245, 197, 24, 0.18)"
              : "none",
            transition:
              "background-color 500ms ease, box-shadow 700ms ease",
          }}
        />
      </div>

      {/* Latin shadow label — a quiet caption under the marker. */}
      <p
        className="mt-5 font-mono text-[11px] uppercase tracking-eyebrow text-white/35"
        style={{
          opacity: entered ? 1 : 0,
          transition: "opacity 500ms ease 100ms",
        }}
      >
        {stage.englishLabel}
      </p>

      {/* Stage title — the focal anchor of the block. */}
      <h2
        className="mt-2 text-[34px] font-semibold leading-tight tracking-tight text-white"
        style={{
          transform: entered ? "translateY(0)" : "translateY(8px)",
          opacity: entered ? 1 : 0,
          transition:
            "opacity 600ms ease 160ms, transform 600ms cubic-bezier(0.22, 1, 0.36, 1) 160ms",
        }}
      >
        {stage.title}
      </h2>

      {/* Body — one paragraph, no bullets. Calmer, less defensive. */}
      <p
        className="mt-5 max-w-[26rem] text-[16px] leading-relaxed text-white/80"
        style={{
          opacity: entered ? 1 : 0,
          transition: "opacity 600ms ease 280ms",
        }}
      >
        {stage.body}
      </p>
    </div>
  );
}
