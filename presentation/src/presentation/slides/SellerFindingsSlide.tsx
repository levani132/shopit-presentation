import { useEffect, useState, type CSSProperties } from "react";
import { SlideCard } from "@/ui/SlideCard";
import { SlideHeading } from "@/ui/SlideHeading";
import { useSlideSteps } from "@/navigation/SlideNavigationContext";

/**
 * Seller research findings slide (deck slide 7).
 *
 * Translates the seller interview results (N=12 from Appendix C of the
 * thesis, plus N=10 sub-questions Q13–Q17) into four headline findings
 * arranged as a Problem → Desire → Unlock → Pricing arc:
 *
 *   01 · სტატუს-კვო       58%  no website                   (7/12)
 *   02 · მოთხოვნა          60%  would use ready platform     (6/10)
 *   03 · შესასვლელი        60%  manager help → interest      (6/10)
 *   04 · ფასწარმოქმნა      50%  prefer free tier             (5/10)
 *
 * Sample sizes differ on purpose — 58% (don't have website) is sourced
 * from Table C.1 which all 12 respondents answered. The other three
 * questions sit later in the survey (Q13–Q17) and only ten respondents
 * completed them, so the denominator is N=10 there. Both denominators
 * are flagged on the card itself so the committee can see the
 * provenance without flipping to the appendix.
 *
 * Visual model
 *
 *   A 2 × 2 grid of donut-and-number tiles. Each tile renders a thin
 *   gold arc whose sweep equals the headline %. The big number lives
 *   inside the donut (Fraunces serif, ~64px) so the chart and the
 *   number share a focal point.
 *
 *   Sub-step reveals: `useSlideSteps(4)`. All four tiles stay in the
 *   layout from step 0 so the grid never re-flows, but only tiles with
 *   `step >= idx` show their arc + number + caption. Earlier tiles
 *   stay fully visible; not-yet-revealed tiles render an empty placeholder
 *   ring + a dim section label only.
 *
 *   Arc animation is driven by CSS transitions on `strokeDasharray`,
 *   which the browser interpolates fine even across discrete steps.
 *   We delay the dash transition until after the tile has faded in,
 *   so the arc appears to draw inside an already-visible ring rather
 *   than racing in alongside the fade.
 */

interface Finding {
  /** Two-digit ordinal shown in the section eyebrow. */
  ordinal: string;
  /** Eyebrow label — the narrative role of this finding. */
  role: string;
  /** The headline percentage (0–100). Drives both the number and the arc. */
  percent: number;
  /** Sample-size denominator label (e.g. "N=12 · 7/12 რესპონდენტი"). */
  sample: string;
  /** Short Georgian description of what the % measures. */
  caption: string;
  /** One-line supporting context for thesis-defense reading. */
  detail: string;
}

const FINDINGS: ReadonlyArray<Finding> = [
  {
    ordinal: "01",
    role: "სტატუს-კვო",
    percent: 58,
    sample: "N=12 · 7 რესპონდენტი",
    caption: "საკუთარი ვებსაიტი არ აქვს",
    detail:
      "გაყიდვის არხი რჩება სოციალური მედია — Facebook, Instagram, მესენჯერი.",
  },
  {
    ordinal: "02",
    role: "მოთხოვნა",
    percent: 60,
    sample: "N=10 · 6 რესპონდენტი",
    caption: "მზადაა გამოიყენოს მზა პლატფორმა",
    detail:
      "ტექნიკური სირთულე, დროის ნაკლებობა და მიწოდების ორგანიზება — ძირითადი ბარიერი.",
  },
  {
    ordinal: "03",
    role: "შესასვლელი",
    percent: 60,
    sample: "N=10 · 6 რესპონდენტი",
    caption: "მენეჯერის დახმარება გაზრდის ჩართულობას",
    detail:
      "Managed პაკეტისთვის (499 ₾) ემპირიული საფუძველი — პერსონალური მხარდაჭერა, როგორც გადამწყვეტი ფაქტორი.",
  },
  {
    ordinal: "04",
    role: "ფასწარმოქმნა",
    percent: 50,
    sample: "N=10 · 5 რესპონდენტი",
    caption: "უპირატესობას ანიჭებს უფასო პაკეტს",
    detail:
      "დანარჩენი 50% — ფასიან პაკეტებზე გადასვლისთვისაა მზად (99, 199 ან 499 ₾).",
  },
];

export function SellerFindingsSlide() {
  // Four reveal steps — one per finding. The slide enters at step 0 with
  // only the first tile populated; each `Next` press fills the next donut.
  const step = useSlideSteps(FINDINGS.length);

  return (
    <SlideCard eyebrow="კვლევის შედეგები · გამყიდველები · 07" size="lg">
      <SlideHeading level={2}>რა გვითხრეს გამყიდველებმა</SlideHeading>

      <p className="mt-5 max-w-3xl text-[20px] leading-snug text-white/70">
        12 გამყიდველის პილოტური გამოკითხვა —{" "}
        <span className="text-white/45">
          ოთხი მიგნება, რომელმაც ShopIt-ის გადაწყვეტა ჩამოაყალიბა.
        </span>
      </p>

      <div className="mt-10 grid grid-cols-2 gap-x-14 gap-y-10">
        {FINDINGS.map((f, idx) => (
          <FindingTile key={f.ordinal} finding={f} idx={idx} step={step} />
        ))}
      </div>
    </SlideCard>
  );
}

/* ---------- Finding tile ---------- */

interface FindingTileProps {
  finding: Finding;
  idx: number;
  /** Current sub-step index (0..FINDINGS.length-1). */
  step: number;
}

function FindingTile({ finding, idx, step }: FindingTileProps) {
  // Each tile reveals when the sub-step reaches its index. Earlier tiles
  // remain visible; later tiles render a dim placeholder so the 2×2 grid
  // never reflows during the reveal sequence.
  const revealed = step >= idx;

  // Fade-in flag: state-driven (not CSS animation) so the arc transition
  // below isn't fighting the entrance transform. Mirrors §3.3 of PLAN.md.
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
      className="relative flex items-center gap-7 rounded-sm border border-nebula-rule px-7 py-6"
      style={{
        opacity: revealed ? 1 : 0.35,
        transition: "opacity 600ms cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      {/* Donut + big % number share the same focal point. */}
      <FindingDonut percent={finding.percent} drawn={entered} />

      {/* Right column: role eyebrow, caption, detail, sample. */}
      <div className="flex-1">
        <div className="flex items-baseline gap-3">
          <p className="font-mono text-[14px] uppercase tracking-eyebrow text-nebula-gold">
            {finding.ordinal}
          </p>
          <p className="font-mono text-[13px] uppercase tracking-eyebrow text-white/55">
            {finding.role}
          </p>
        </div>

        <p
          className="mt-3 text-[22px] font-medium leading-snug"
          style={{
            color: revealed ? "rgb(255 255 255)" : "rgb(255 255 255 / 0.45)",
            transition: "color 500ms ease",
          }}
        >
          {finding.caption}
        </p>

        <p
          className="mt-2 text-[14px] leading-relaxed text-white/55"
          style={{
            opacity: revealed ? 1 : 0,
            transition: "opacity 500ms ease 120ms",
          }}
        >
          {finding.detail}
        </p>

        <p className="mt-3 font-mono text-[11px] uppercase tracking-eyebrow text-white/35">
          {finding.sample}
        </p>
      </div>
    </div>
  );
}

/* ---------- Donut chart ---------- */

const DONUT_SIZE = 156; // px — outer diameter of the SVG canvas
const DONUT_STROKE = 12; // px — ring thickness
const DONUT_RADIUS = (DONUT_SIZE - DONUT_STROKE) / 2;
const DONUT_CIRCUMFERENCE = 2 * Math.PI * DONUT_RADIUS;

interface FindingDonutProps {
  /** Headline percentage, 0–100. */
  percent: number;
  /** True once the tile has finished entering — only then does the arc draw. */
  drawn: boolean;
}

function FindingDonut({ percent, drawn }: FindingDonutProps) {
  // The visible arc length, in user units. `drawn=false` collapses it to 0
  // so the gold ring is fully hidden; `drawn=true` reveals exactly `percent`
  // of the full circumference. CSS interpolates the dash length.
  const arcLength = (DONUT_CIRCUMFERENCE * percent) / 100;
  const dashStyle: CSSProperties = {
    strokeDasharray: `${drawn ? arcLength : 0} ${DONUT_CIRCUMFERENCE}`,
    transition:
      "stroke-dasharray 1100ms cubic-bezier(0.65, 0, 0.35, 1) 220ms",
  };

  return (
    <div
      className="relative shrink-0"
      style={{ width: DONUT_SIZE, height: DONUT_SIZE }}
    >
      <svg
        width={DONUT_SIZE}
        height={DONUT_SIZE}
        viewBox={`0 0 ${DONUT_SIZE} ${DONUT_SIZE}`}
        // -90° rotation puts the arc's start at 12 o'clock — the natural
        // reading position for a sweep that grows clockwise.
        style={{ transform: "rotate(-90deg)" }}
      >
        {/* Track ring (always visible, dim). */}
        <circle
          cx={DONUT_SIZE / 2}
          cy={DONUT_SIZE / 2}
          r={DONUT_RADIUS}
          fill="none"
          stroke="rgba(255, 255, 255, 0.10)"
          strokeWidth={DONUT_STROKE}
        />
        {/* Progress arc — the gold accent. Round caps soften the wedge edge. */}
        <circle
          cx={DONUT_SIZE / 2}
          cy={DONUT_SIZE / 2}
          r={DONUT_RADIUS}
          fill="none"
          stroke="#f5c518"
          strokeWidth={DONUT_STROKE}
          strokeLinecap="round"
          style={dashStyle}
        />
      </svg>

      {/* Big % number, centred inside the donut. Fraunces matches the
          editorial register established on slide 0 + slide 3. */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center"
        style={{
          opacity: drawn ? 1 : 0,
          transition: "opacity 700ms ease 350ms",
        }}
      >
        <p className="font-serif text-[64px] font-semibold leading-none tracking-tight text-white">
          {percent}
          <span className="text-white/55">%</span>
        </p>
      </div>
    </div>
  );
}
