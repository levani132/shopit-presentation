import { useEffect, useState, type CSSProperties } from "react";
import { SlideCard } from "@/ui/SlideCard";
import { SlideHeading } from "@/ui/SlideHeading";
import { useSlideSteps } from "@/navigation/SlideNavigationContext";

/**
 * Problem slide. Three reveal steps, advanced by the next-key:
 *
 *   step 0  →  the seven items appear as a single centered list (stagger
 *              fade-in on mount).
 *   step 1  →  the list visually splits: items 1-3 (infrastructure, dim)
 *              translate left, items 4-7 (differentiation, full color)
 *              translate right AND slide up so the two columns align on
 *              row 0. The column labels and the vertical rule reveal
 *              between them.
 *   step 2  →  closing tagline lands at the bottom.
 *
 * Implementation notes
 *
 *   The split is driven purely by React state — `splitActive` flips on
 *   step 1 and the inline `transform` re-renders. CSS handles the
 *   interpolation via `transition: transform …`.
 *
 *   Previously we used a CSS `animation: fadeInUp … both` for the entrance
 *   stagger. The `both` fill-mode preserves the animation's end-state
 *   transform (`translateY(0)`), which clobbered the inline transform we
 *   set for the split. The fix is to drive the entrance off React state
 *   too: each row has its own `entered` boolean that flips after its
 *   stagger delay, and the same `transition` handles entrance + split.
 *
 *   The items area is a FIXED-height container (7 rows tall, regardless
 *   of split state). After the split, items 4-7 simply translate up into
 *   row 0-3, leaving the bottom rows empty. The tagline below sits at a
 *   fixed offset from the container, so the overall slide layout never
 *   shifts.
 *
 *   Centering: items use a `1fr | auto | 1fr` CSS grid so the gold rule
 *   sits at the box's horizontal center. The box is positioned at
 *   `calc(50% - ITEM_WIDTH/2)` of the items container, which itself spans
 *   the card's full content width — so the rule lands on the slide's
 *   true centerline.
 */

interface Step {
  num: string;
  label: string;
  side: "infra" | "diff";
}

const ROW_HEIGHT = 60; // vertical breathing room between rows
const ITEM_WIDTH = 440;
const SPLIT_DX = 260; // horizontal travel during the split
const SPLIT_DY = -3 * ROW_HEIGHT; // right column shifts up to align row 0

const STEPS: ReadonlyArray<Step> = [
  { num: "01", label: "ვებსაიტი", side: "infra" },
  { num: "02", label: "გადახდები", side: "infra" },
  { num: "03", label: "მიწოდება", side: "infra" },
  { num: "04", label: "პროდუქცია", side: "diff" },
  { num: "05", label: "ბრენდი", side: "diff" },
  { num: "06", label: "აქციები", side: "diff" },
  { num: "07", label: "მარკეტინგი", side: "diff" },
];

export function ProblemSlide() {
  const step = useSlideSteps(3);
  const splitActive = step >= 1;
  const taglineVisible = step >= 2;

  return (
    <SlideCard eyebrow="პრობლემა · 01" size="lg">
      <SlideHeading level={2}>
        რას მოითხოვს ონლაინ მაღაზიის გაშვება?
      </SlideHeading>

      <p className="mt-4 max-w-3xl text-[22px] leading-snug text-white/70">
        შვიდი ნაბიჯი პირველი შეკვეთის მიღებამდე — თუმცა ყველა მათგანი
        თანაბრად მნიშვნელოვანი როდია.
      </p>

      <div className="mt-6">
        {/* Header strip for the column labels — fixed 56px tall so the
            items below never shift when the labels fade in. */}
        <div className="relative h-14">
          <ColumnLabel
            side="left"
            title="ინფრასტრუქტურა"
            subtitle="ShopIt-ის პასუხისმგებლობა"
            visible={splitActive}
          />
          <ColumnLabel
            side="right"
            title="დიფერენციაცია"
            subtitle="თქვენი პასუხისმგებლობა"
            visible={splitActive}
          />
        </div>

        {/* Items area. FIXED height (7 rows) for all steps. After the split
            items 4-7 vacate rows 4-6, and the tagline fades in inside that
            freed bottom band on step 2 — so the card stays the exact same
            height throughout the whole reveal. */}
        <div
          className="relative mx-auto mt-3"
          style={{
            height: `${7 * ROW_HEIGHT}px`,
            width: "100%",
          }}
        >
          {/* Vertical divider — sits between the columns after the split. */}
          <span
            aria-hidden
            className="absolute left-1/2 top-0 origin-top bg-nebula-rule"
            style={{
              width: "1px",
              height: `${4 * ROW_HEIGHT}px`,
              transform: `translateX(-50%) scaleY(${splitActive ? 1 : 0})`,
              transition:
                "transform 900ms cubic-bezier(0.65, 0, 0.35, 1) 200ms",
            }}
          />

          {STEPS.map((s, idx) => (
            <StepRow key={s.num} step={s} idx={idx} splitActive={splitActive} />
          ))}

          {/* Tagline lives INSIDE the items container, anchored to the
              bottom band that rows 4-6 used to occupy before the split.
              In step 0 it would visually collide with item 07, so we
              only fade it in on step 2 — by which point items 4-7 have
              vacated to the right column. */}
          <div
            className="absolute left-0 right-0 flex flex-col items-center justify-center text-center"
            style={{
              top: `${4 * ROW_HEIGHT}px`,
              height: `${3 * ROW_HEIGHT}px`,
              opacity: taglineVisible ? 1 : 0,
              transform: taglineVisible
                ? "translateY(0)"
                : "translateY(14px)",
              transition:
                "opacity 700ms cubic-bezier(0.22, 1, 0.36, 1) 200ms, transform 700ms cubic-bezier(0.22, 1, 0.36, 1) 200ms",
              pointerEvents: taglineVisible ? "auto" : "none",
            }}
          >
            <p className="font-serif text-[32px] italic leading-snug text-white">
              ShopIt თავის თავზე იღებს ინფრასტრუქტურულ ნაწილს —
              <br />
              თქვენ კი ფოკუსირდებით იმაზე, რაც გამოგარჩევთ.
            </p>
          </div>
        </div>
      </div>
    </SlideCard>
  );
}

/* ---------- Item row ---------- */

interface StepRowProps {
  step: Step;
  idx: number;
  splitActive: boolean;
}

function StepRow({ step, idx, splitActive }: StepRowProps) {
  // Driven by React state, NOT a CSS animation, so it doesn't fight with
  // the split transform later on.
  const [entered, setEntered] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 260 + idx * 110);
    return () => clearTimeout(t);
  }, [idx]);

  const isInfra = step.side === "infra";
  const dx = isInfra ? -SPLIT_DX : SPLIT_DX;
  const dy = isInfra ? 0 : SPLIT_DY;

  // Position cascade:
  //   !entered            → invisible, slightly below
  //   entered, no split   → resting at center (row idx)
  //   entered, split      → translated into infra (left) / diff (right) column
  let transform: string;
  let opacity: number;
  if (!entered) {
    transform = "translateY(12px)";
    opacity = 0;
  } else if (splitActive) {
    transform = `translate(${dx}px, ${dy}px)`;
    opacity = isInfra ? 0.45 : 1;
  } else {
    transform = "translate(0, 0)";
    opacity = 1;
  }

  const style: CSSProperties = {
    position: "absolute",
    top: `${idx * ROW_HEIGHT}px`,
    left: `calc(50% - ${ITEM_WIDTH / 2}px)`,
    width: `${ITEM_WIDTH}px`,
    transform,
    opacity,
    transition:
      "transform 1000ms cubic-bezier(0.65, 0, 0.35, 1), opacity 700ms ease",
  };

  return (
    <div style={style}>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-7 px-3">
        <span
          className={`text-right font-mono text-[20px] tracking-eyebrow ${
            isInfra ? "text-white/45" : "text-nebula-gold"
          }`}
        >
          {step.num}
        </span>
        <span
          aria-hidden
          className={`block h-8 w-px ${
            isInfra ? "bg-white/25" : "bg-nebula-gold"
          }`}
        />
        <span
          className={`text-left text-[30px] font-medium leading-tight ${
            isInfra ? "text-white/75" : "text-white"
          }`}
        >
          {step.label}
        </span>
      </div>
    </div>
  );
}

/* ---------- Column header ---------- */

interface ColumnLabelProps {
  side: "left" | "right";
  title: string;
  subtitle: string;
  visible: boolean;
}

function ColumnLabel({ side, title, subtitle, visible }: ColumnLabelProps) {
  // After the split each column's center sits at calc(50% ± SPLIT_DX).
  // The label box is ITEM_WIDTH wide, so its left edge is offset by
  // (SPLIT_DX + ITEM_WIDTH/2) from the slide centerline for the left
  // column, and (ITEM_WIDTH/2 - SPLIT_DX) the other way for the right.
  const isLeft = side === "left";
  const leftOffset = isLeft
    ? `calc(50% - ${SPLIT_DX + ITEM_WIDTH / 2}px)`
    : `calc(50% + ${SPLIT_DX - ITEM_WIDTH / 2}px)`;

  return (
    <div
      className="absolute text-center"
      style={{
        top: "0",
        left: leftOffset,
        width: `${ITEM_WIDTH}px`,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(10px)",
        transition:
          "opacity 700ms cubic-bezier(0.22, 1, 0.36, 1) 350ms, transform 700ms cubic-bezier(0.22, 1, 0.36, 1) 350ms",
      }}
    >
      <p className="font-mono text-[17px] uppercase tracking-eyebrow text-nebula-gold">
        {title}
      </p>
      <p className="mt-1.5 text-[18px] text-white/55">{subtitle}</p>
    </div>
  );
}
