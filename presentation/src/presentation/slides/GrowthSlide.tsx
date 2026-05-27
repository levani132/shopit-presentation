import { useSlideSteps } from "@/navigation/SlideNavigationContext";
import { SlideCard } from "@/ui/SlideCard";
import { SlideHeading } from "@/ui/SlideHeading";

/**
 * Pilot & phased growth slide (deck slide 12).
 *
 * Visualises the three-phase growth plan from the thesis (pp. 40–42):
 *
 *   MVP        0–3 months    10 sellers      ~75k ₾ GMV / month
 *   Expansion  3–9 months    50 sellers      ~375k ₾ GMV / month
 *   Scale      9–18 months   100–200 sellers ~750k–1,500k ₾ GMV / month
 *
 * Long-term target line: 600 sellers (5% of addressable market, slide 3).
 *
 * Visual model (vertical, to fit the standard 78vh card)
 *
 *   1. Heading + one-line intro
 *   2. Wide SVG line chart, ~220px tall — three coloured segments draw
 *      in sequence, dashed gold target line for the 600-seller SOM.
 *   3. Three horizontal phase cards in a row underneath the chart —
 *      each reveals on its own sub-step.
 *
 *   The chart-on-top / cards-in-a-row layout matches the standard pattern
 *   used by other slides (intro → focal visual → editorial cards) and
 *   keeps the slide within the card's normal vertical budget instead of
 *   stacking a tall chart next to a tall column of cards.
 *
 *   Sub-steps:
 *     0 — empty chart, all cards in their placeholder state
 *     1 — Phase 1 segment + card 1 populated
 *     2 — Phase 2 segment + card 2 populated
 *     3 — Phase 3 segment + card 3 populated
 *     4 — long-term 600-seller target highlighted
 */

interface Phase {
  /** Two-digit ordinal shown above the phase label. */
  ordinal: string;
  /** Phase name in Georgian (matches the thesis section headings). */
  name: string;
  /** English label for the mono row underneath. */
  englishLabel: string;
  /** Calendar range for this phase (e.g. "0–3 თვე"). */
  timing: string;
  /** Headline seller count at the end of the phase (e.g. "10 გამყიდველი"). */
  sellerCount: string;
  /** GMV for the phase (already weighted). */
  gmv: string;
  /** 2–3 short headline bullets. */
  bullets: ReadonlyArray<string>;
}

const PHASES: ReadonlyArray<Phase> = [
  {
    ordinal: "01",
    name: "MVP — ვალიდაცია",
    englishLabel: "Pilot · 0–3 თვე",
    timing: "0–3 თვე",
    sellerCount: "10 გამყიდველი",
    gmv: "~75,000 ₾ GMV/თვე",
    bullets: [
      "დამფუძნებლის მიერ მართული ჩართვა · პერსონალური მხარდაჭერა",
      "1 Seller + 1 Courier Manager · 2–3 კურიერი",
      "Break-even ~2 გამყიდველთან",
    ],
  },
  {
    ordinal: "02",
    name: "Expansion — გაფართოება",
    englishLabel: "Expansion · 3–9 თვე",
    timing: "3–9 თვე",
    sellerCount: "~50 გამყიდველი",
    gmv: "~375,000 ₾ GMV/თვე",
    bullets: [
      "ღია რეგისტრაცია · საფასო პაკეტებზე გადასვლა",
      "4–5 Sales Manager · 10–15 კურიერი",
      "~33–37k ₾ თვიური შემოსავალი",
    ],
  },
  {
    ordinal: "03",
    name: "Scale — მასშტაბირება",
    englishLabel: "Scale · 9–18 თვე",
    timing: "9–18 თვე",
    sellerCount: "150–200 გამყიდველი",
    gmv: "~0.75–1.5 მლნ ₾ GMV/თვე",
    bullets: [
      "მდგრადი პლატფორმული ბიზნესი",
      "8–12 გაყიდვების თანამშრომელი · 3–6 ტექნიკური როლი",
      "შემდგომი მიზანი — 600 გამყიდველი (SOM 5%)",
    ],
  },
];

/* ---------- Chart geometry ---------- */

// Chart geometry — sized so the rendered aspect ratio is roughly 760×220
// (≈ 3.45 : 1). Narrowing the horizontal axis compresses the timeline
// while leaving vertical headroom for the 600-seller SOM target, so the
// gold Scale segment reads as a steeper, more convincing climb. Because
// the SVG's preserveAspectRatio default is "meet", these viewBox numbers
// drive both the coordinate system and the rendered aspect ratio.
const CHART_WIDTH = 760;
const CHART_HEIGHT = 220;
const CHART_PADDING = { top: 14, right: 30, bottom: 32, left: 56 };
const CHART_INNER_WIDTH = CHART_WIDTH - CHART_PADDING.left - CHART_PADDING.right;
const CHART_INNER_HEIGHT =
  CHART_HEIGHT - CHART_PADDING.top - CHART_PADDING.bottom;

const MONTH_MAX = 18; // we plot months 0 → 18
const SELLER_MAX = 600; // y-axis ceiling matches the SOM target

function x(months: number) {
  return CHART_PADDING.left + (months / MONTH_MAX) * CHART_INNER_WIDTH;
}
function y(sellers: number) {
  return (
    CHART_PADDING.top +
    CHART_INNER_HEIGHT -
    (sellers / SELLER_MAX) * CHART_INNER_HEIGHT
  );
}

interface PhaseSegment {
  from: { months: number; sellers: number };
  to: { months: number; sellers: number };
  stroke: string;
  width: number;
}

const SEGMENTS: ReadonlyArray<PhaseSegment> = [
  {
    from: { months: 0, sellers: 0 },
    to: { months: 3, sellers: 10 },
    stroke: "rgba(255, 255, 255, 0.78)",
    width: 2,
  },
  {
    from: { months: 3, sellers: 10 },
    to: { months: 9, sellers: 50 },
    stroke: "rgba(255, 255, 255, 0.88)",
    width: 2.5,
  },
  {
    from: { months: 9, sellers: 50 },
    to: { months: 18, sellers: 175 },
    stroke: "#f5c518",
    width: 3,
  },
];

export function GrowthSlide() {
  // 5 steps — three phase reveals + a "+target" final step.
  const step = useSlideSteps(PHASES.length + 1);
  const targetEmphasis = step >= PHASES.length;

  return (
    <SlideCard eyebrow="გაშვება და ზრდა · 12" size="lg">
      <SlideHeading level={2}>პილოტიდან ბაზრის წილამდე</SlideHeading>

      <p className="mt-4 max-w-4xl text-[17px] leading-snug text-white/70">
        სამი ფაზის გრაფიკი —{" "}
        <span className="text-white/90">
          MVP → Expansion → Scale → 600 გამყიდველი
        </span>
        .{" "}
        <span className="text-white/45">
          ფინანსური მოდელი ეფუძნება bottom-up ვარაუდებს (ნაშრომი გვ. 40–42).
        </span>
      </p>

      <GrowthChart step={step} targetEmphasis={targetEmphasis} />

      <div className="mt-5 grid grid-cols-3 gap-3">
        {PHASES.map((phase, idx) => (
          <PhaseCard
            key={phase.ordinal}
            phase={phase}
            revealed={step >= idx + 1}
            highlight={idx === 2}
          />
        ))}
      </div>
    </SlideCard>
  );
}

/* ---------- Phase callout card ---------- */

interface PhaseCardProps {
  phase: Phase;
  revealed: boolean;
  highlight: boolean;
}

function PhaseCard({ phase, revealed, highlight }: PhaseCardProps) {
  return (
    <div
      className={[
        "rounded-sm px-4 py-3 ring-1 transition-all duration-500",
        highlight
          ? "ring-nebula-gold/60 bg-nebula-ink/95"
          : "ring-nebula-rule bg-nebula-ink/70",
      ].join(" ")}
      style={{
        opacity: revealed ? 1 : 0,
        transform: revealed ? "translateY(0)" : "translateY(18px)",
        transition:
          "opacity 600ms cubic-bezier(0.22, 1, 0.36, 1), transform 600ms cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      <div className="flex items-baseline justify-between">
        <p className="font-mono text-[11px] uppercase tracking-eyebrow text-nebula-gold">
          {phase.ordinal} · {phase.timing}
        </p>
        <p className="font-mono text-[10px] uppercase tracking-eyebrow text-white/35">
          {phase.englishLabel}
        </p>
      </div>

      <p className="mt-2 text-[18px] font-semibold leading-tight text-white">
        {phase.name}
      </p>

      <div className="mt-2 flex items-baseline gap-3">
        <p className="font-serif text-[22px] font-semibold leading-none tracking-tight text-white">
          {phase.sellerCount}
        </p>
      </div>
      <p className="mt-1 text-[12px] text-white/55">{phase.gmv}</p>

      <ul className="mt-3 flex flex-col gap-1.5 border-t border-nebula-rule pt-2">
        {phase.bullets.map((b) => (
          <li key={b} className="flex items-start gap-2">
            <span
              aria-hidden
              className="mt-[7px] block h-[2px] w-3 shrink-0 bg-nebula-gold/70"
            />
            <p className="text-[12px] leading-snug text-white/80">{b}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- Growth chart (SVG) ---------- */

interface GrowthChartProps {
  step: number;
  targetEmphasis: boolean;
}

function GrowthChart({ step, targetEmphasis }: GrowthChartProps) {
  const xTicks = [0, 3, 9, 18];
  const yTicks = [0, 50, 150, 300, 600];

  return (
    <div className="mx-auto mt-6 w-full max-w-[760px] rounded-sm ring-1 ring-nebula-rule bg-nebula-ink/60 p-3">
      {/* Narrowing the chart's max-width tightens the horizontal scale so
          the gold Scale-phase segment reads as a steeper climb — same
          data, more visually convincing growth slope. The SVG viewBox is
          unchanged; we just let it shrink to fit the smaller container. */}
      <svg
        viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
        width="100%"
        style={{ display: "block" }}
      >
        {/* Grid lines */}
        {yTicks.map((tick) => (
          <line
            key={`y-grid-${tick}`}
            x1={CHART_PADDING.left}
            x2={CHART_WIDTH - CHART_PADDING.right}
            y1={y(tick)}
            y2={y(tick)}
            stroke="rgba(255, 255, 255, 0.06)"
            strokeWidth={1}
          />
        ))}

        {/* Y-axis labels */}
        {yTicks.map((tick) => (
          <text
            key={`y-label-${tick}`}
            x={CHART_PADDING.left - 10}
            y={y(tick) + 4}
            fill="rgba(255, 255, 255, 0.45)"
            fontSize={12}
            fontFamily="IBM Plex Mono, monospace"
            textAnchor="end"
          >
            {tick}
          </text>
        ))}

        {/* X-axis labels (months) */}
        {xTicks.map((tick) => (
          <text
            key={`x-label-${tick}`}
            x={x(tick)}
            y={CHART_HEIGHT - 12}
            fill="rgba(255, 255, 255, 0.45)"
            fontSize={12}
            fontFamily="IBM Plex Mono, monospace"
            textAnchor="middle"
          >
            {tick} თვე
          </text>
        ))}

        {/* Axis label */}
        <text
          x={16}
          y={CHART_PADDING.top + 10}
          fill="rgba(255, 255, 255, 0.55)"
          fontSize={11}
          fontFamily="IBM Plex Mono, monospace"
          letterSpacing={1.2}
        >
          გამყიდველი
        </text>

        {/* 600-seller target band */}
        <line
          x1={CHART_PADDING.left}
          x2={CHART_WIDTH - CHART_PADDING.right}
          y1={y(600)}
          y2={y(600)}
          stroke="#f5c518"
          strokeWidth={1}
          strokeDasharray="4 6"
          style={{
            opacity: targetEmphasis ? 0.9 : 0.25,
            transition: "opacity 700ms ease",
          }}
        />
        <text
          x={CHART_WIDTH - CHART_PADDING.right}
          y={y(600) - 6}
          fill="#f5c518"
          fontSize={12}
          fontFamily="IBM Plex Mono, monospace"
          textAnchor="end"
          style={{
            opacity: targetEmphasis ? 1 : 0.4,
            transition: "opacity 700ms ease",
          }}
        >
          SOM · 600 გამყიდველი
        </text>

        {/* Phase line segments */}
        {SEGMENTS.map((seg, idx) => (
          <PhaseLine
            key={`seg-${idx}`}
            segment={seg}
            revealed={step >= idx + 1}
          />
        ))}

        {/* End-point markers */}
        {SEGMENTS.map((seg, idx) =>
          step >= idx + 1 ? (
            <circle
              key={`dot-${idx}`}
              cx={x(seg.to.months)}
              cy={y(seg.to.sellers)}
              r={4}
              fill={seg.stroke}
            />
          ) : null,
        )}

        {/* Target dot at month 18, 600 sellers — appears on the final step */}
        {targetEmphasis ? (
          <g>
            <circle
              cx={x(18)}
              cy={y(600)}
              r={6}
              fill="#f5c518"
              fillOpacity={0.18}
            />
            <circle cx={x(18)} cy={y(600)} r={3.5} fill="#f5c518" />
          </g>
        ) : null}
      </svg>
    </div>
  );
}

/* ---------- Single phase line ---------- */

interface PhaseLineProps {
  segment: PhaseSegment;
  revealed: boolean;
}

function PhaseLine({ segment, revealed }: PhaseLineProps) {
  const x1 = x(segment.from.months);
  const y1 = y(segment.from.sellers);
  const x2 = x(segment.to.months);
  const y2 = y(segment.to.sellers);
  const length = Math.hypot(x2 - x1, y2 - y1);

  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={segment.stroke}
      strokeWidth={segment.width}
      strokeLinecap="round"
      style={{
        strokeDasharray: length,
        strokeDashoffset: revealed ? 0 : length,
        transition:
          "stroke-dashoffset 1100ms cubic-bezier(0.65, 0, 0.35, 1) 80ms",
      }}
    />
  );
}
