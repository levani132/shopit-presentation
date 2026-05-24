import type { CSSProperties } from "react";
import { SlideCard } from "@/ui/SlideCard";
import { SlideHeading } from "@/ui/SlideHeading";
import { useSlideSteps } from "@/navigation/SlideNavigationContext";

/**
 * Problem slide. Three reveal steps, advanced by the next-key:
 *
 *   step 0  →  the seven steps appear as a single centered list
 *   step 1  →  list visually splits: 1-3 (infrastructure, dim) move left
 *              and stay put, 4-7 (differentiation, full color) move right
 *              AND slide up so the two columns align on row 0; the column
 *              labels and the vertical rule reveal between them
 *   step 2  →  closing tagline lands below
 *
 * Why CSS-transition state changes instead of timed CSS animations:
 *   the user wants the split to fire on a next-press, not on a wall clock.
 *   Driving everything off `step` means React state changes the inline
 *   styles, and the browser interpolates between them via CSS transitions.
 *
 * Centering note: items live inside an absolutely-positioned grid layout
 *   (number-right | gold rule | label-left). The grid is fixed-width with
 *   1fr / auto / 1fr columns so the gold rule sits at the box's horizontal
 *   center — that's the vertical axis the reader's eye locks onto. The box
 *   itself is centered at `calc(50% - boxWidth/2)`, so the axis lands at
 *   the card's true centerline.
 */

interface Step {
  num: string;
  label: string;
  side: "infra" | "diff";
}

const ROW_HEIGHT = 78; // includes generous vertical breathing room
const ITEM_WIDTH = 520;
const SPLIT_DX = 310; // horizontal travel during split
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
        რა შედის ონლაინ მაღაზიის გაშვებაში?
      </SlideHeading>

      <p className="mt-6 max-w-3xl text-[26px] leading-snug text-white/70">
        შვიდი ნაბიჯი — სანამ პირველი შეკვეთა გაიყიდება. ყველა მათგანი
        თანაბრად მნიშვნელოვანი არ არის.
      </p>

      <div className="mt-10">
        {/* Dedicated header strip for the column labels. Always reserves
            ~88px of vertical space so the items below never jump when the
            labels fade in. The labels themselves are absolute inside this
            strip — fading in on step 1 without affecting layout. */}
        <div className="relative h-20">
          <ColumnLabel
            side="left"
            title="ინფრასტრუქტურა"
            subtitle="ShopIt ფარავს"
            visible={splitActive}
          />
          <ColumnLabel
            side="right"
            title="დიფერენციაცია"
            subtitle="თქვენი საქმეა"
            visible={splitActive}
          />
        </div>

        {/* Items area — independent positioning context. Auto-shrinks after
            the split so the tagline rises up to fill the freed space. */}
        <div
          className="relative mx-auto mt-4"
          style={{
            height: `${(splitActive ? 4 : 7) * ROW_HEIGHT}px`,
            width: "100%",
            transition: "height 900ms cubic-bezier(0.65, 0, 0.35, 1)",
          }}
        >
          {/* Vertical divider — sits between the columns after the split. */}
          <span
            aria-hidden
            className="absolute left-1/2 top-0 -translate-x-1/2 origin-top bg-nebula-rule"
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
        </div>
      </div>

      <p
        className="mt-12 text-center font-serif text-[34px] italic leading-snug text-white"
        style={{
          opacity: taglineVisible ? 1 : 0,
          transform: taglineVisible ? "translateY(0)" : "translateY(12px)",
          transition:
            "opacity 700ms cubic-bezier(0.22, 1, 0.36, 1), transform 700ms cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        ShopIt ფარავს ინფრასტრუქტურულ ნაწილს —
        <br />
        დანარჩენი თქვენი მთავარი საქმეა.
      </p>
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
  const isInfra = step.side === "infra";
  const dx = isInfra ? -SPLIT_DX : SPLIT_DX;
  const dy = isInfra ? 0 : SPLIT_DY;

  const baseStyle: CSSProperties = {
    position: "absolute",
    top: `${idx * ROW_HEIGHT}px`,
    left: `calc(50% - ${ITEM_WIDTH / 2}px)`,
    width: `${ITEM_WIDTH}px`,
    transform: splitActive ? `translate(${dx}px, ${dy}px)` : "translate(0, 0)",
    opacity: splitActive && isInfra ? 0.45 : 1,
    transition:
      "transform 1000ms cubic-bezier(0.65, 0, 0.35, 1), opacity 800ms ease",
    // First-entry stagger fade — only runs on initial mount.
    animation: `fadeInUp 700ms cubic-bezier(0.22, 1, 0.36, 1) ${
      260 + idx * 110
    }ms both`,
  };

  return (
    <div style={baseStyle}>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-7 px-4">
        <span
          className={`text-right font-mono text-[22px] tracking-eyebrow ${
            isInfra ? "text-white/45" : "text-nebula-gold"
          }`}
        >
          {step.num}
        </span>
        <span
          aria-hidden
          className={`block h-9 w-px ${
            isInfra ? "bg-white/25" : "bg-nebula-gold"
          }`}
        />
        <span
          className={`text-left text-[32px] font-medium leading-tight ${
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
  // After the split:
  //   left  column center → calc(50% − SPLIT_DX)
  //   right column center → calc(50% + SPLIT_DX)
  // The label sits centered on its column. It lives ABOVE the items area
  // at top = -ROW_HEIGHT-ish; we offset it inside the same relative parent
  // so it never reaches into the standfirst.
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
      <p className="font-mono text-[18px] uppercase tracking-eyebrow text-nebula-gold">
        {title}
      </p>
      <p className="mt-2 text-[20px] text-white/55">{subtitle}</p>
    </div>
  );
}
