import { useEffect, useState } from "react";
import { SlideCard } from "@/ui/SlideCard";
import { SlideHeading } from "@/ui/SlideHeading";
import { useSlideSteps } from "@/navigation/SlideNavigationContext";

/**
 * Logistics slide (deck slide 10).
 *
 * Courier marketplace + three-model framing from thesis pp. 33–35.
 *
 * Important framing correction from an earlier draft: ShopIt is NOT a
 * hybrid of the three models. The thesis is explicit on p. 34:
 *
 *   "ShopIt-ისთვის ყველაზე შესაფერისად განიხილება მარშრუტზე
 *    დაფუძნებული მოდელი"
 *
 * — i.e. ShopIt picks the third model (route-based, pre-optimised),
 * the same family of logistics that large operators like Amazon use
 * for last-mile delivery. The earlier "hybrid" framing was Claude's
 * misreading and got corrected by Levan.
 *
 * Empirical anchor (top row) — three numbers from the N=10 courier
 * survey on pp. 33–34:
 *
 *   90% (9 / 10)   მარშრუტისა და ანაზღაურების წინასწარი ხილვადობა
 *   80% (8 / 10)   მიწოდების სავარაუდო დროის წინასწარი ჩვენება
 *   ⌀ 4.0 / 5      წინასწარ დაგეგმილი სამუშაო ბლოკების მოწონება
 *
 * Visual model
 *
 *   Sub-step gating (5 steps):
 *     step 0 — three courier-stat tiles lit
 *     step 1 — Model 1: დისტრიბუცია
 *     step 2 — Model 2: პლატფორმული (Glovo / Wolt)
 *     step 3 — Model 3: მარშრუტზე დაფუძნებული · highlighted as
 *               ShopIt-ის არჩევანი
 *     step 4 — right column swaps from the comparison matrix to a
 *               ShopIt-choice panel that says explicitly: ShopIt
 *               adopts model 3.
 */

interface CourierStat {
  value: string;
  sample: string;
  caption: string;
}

const COURIER_STATS: ReadonlyArray<CourierStat> = [
  {
    value: "90%",
    sample: "10-დან 9",
    caption: "მარშრუტისა და ანაზღაურების წინასწარი ხილვადობა — დათანხმებამდე",
  },
  {
    value: "80%",
    sample: "10-დან 8",
    caption: "მიწოდების სავარაუდო დროის წინასწარი ჩვენება",
  },
  {
    value: "4.0",
    sample: "⌀ შეფასება / 5",
    caption: "წინასწარ დაგეგმილი სამუშაო ბლოკები — საშუალო შეფასება",
  },
];

interface DeliveryModel {
  ordinal: string;
  title: string;
  englishLabel: string;
  /** Short body — one sentence, tight. */
  body: string;
  /** Is this the model ShopIt adopts? Drives the gold "არჩევანი" badge. */
  isShopItChoice?: boolean;
}

const MODELS: ReadonlyArray<DeliveryModel> = [
  {
    ordinal: "01",
    title: "ფიქსირებული შემოსავალი — დისტრიბუცია",
    englishLabel: "Distribution",
    body: "სტაბილური გრაფიკი და კომპანიის მიერ განსაზღვრული მარშრუტი. პროგნოზირებადობა მაღალია, შემოსავლის ზრდის ფანჯარა — შეზღუდული.",
  },
  {
    ordinal: "02",
    title: "პლატფორმული მოდელი — Glovo, Wolt, Bolt",
    englishLabel: "Platform / on-demand",
    body: "ანაზღაურება შეკვეთის რაოდენობასთან მიბმული. მოქნილობა მაღალია, თუმცა შემოსავალი არასტაბილური და სამუშაო დღის დაგეგმვა რთული.",
  },
  {
    ordinal: "03",
    title: "მარშრუტზე დაფუძნებული მოდელი",
    englishLabel: "Route-based",
    body: "კურიერი იღებს დროითა და მანძილით წინასწარ ოპტიმიზებულ მარშრუტს. ოპერაციულად ეფექტიანი, წინასწარ ხილვადი ანაზღაურებითა და დროით.",
    isShopItChoice: true,
  },
];

export function LogisticsSlide() {
  const step = useSlideSteps(5);
  const showChoicePanel = step >= 4;

  return (
    <SlideCard eyebrow="მიწოდება · 10" size="lg">
      <SlideHeading level={2}>
        კურიერების მარკეტპლეისი — სამი მოდელის შედარება
      </SlideHeading>

      <p className="mt-3 max-w-4xl text-[15px] leading-snug text-white/70">
        N = 10 კურიერის გამოკითხვა (60% კორპორაციული დისტრიბუცია, 40% Glovo /
        Wolt / Bolt){" "}
        <span className="text-white/45">
          — პროგნოზირებადობა და მოქნილობა ერთად მოთხოვნადია.
        </span>
      </p>

      {/* Top row — three courier stats. Tighter than the earlier draft:
          smaller Fraunces values + leading-none so the row hugs ~70px. */}
      <div className="mt-5 grid grid-cols-3 gap-x-8 border-y border-nebula-rule py-4">
        {COURIER_STATS.map((stat, idx) => (
          <CourierStatTile key={stat.value} stat={stat} idx={idx} />
        ))}
      </div>

      {/* Two-column layout: model rows (left) + matrix or choice panel (right). */}
      <div className="mt-6 grid grid-cols-[1.55fr_1fr] gap-x-10">
        {/* Model rows — tightened gaps and font sizes vs the original. */}
        <div className="flex flex-col gap-3">
          {MODELS.map((model, idx) => (
            <ModelRow key={model.ordinal} model={model} idx={idx} step={step} />
          ))}
        </div>

        {/* Right column — matrix swaps to ShopIt-choice panel at step 4. */}
        <div className="relative min-h-[200px]">
          <div
            style={{
              opacity: showChoicePanel ? 0 : 1,
              transform: showChoicePanel ? "translateY(-8px)" : "translateY(0)",
              transition:
                "opacity 600ms ease, transform 600ms cubic-bezier(0.22, 1, 0.36, 1)",
              pointerEvents: showChoicePanel ? "none" : "auto",
              position: showChoicePanel ? "absolute" : "relative",
              inset: showChoicePanel ? 0 : "auto",
            }}
          >
            <ComparisonMatrix step={step} />
          </div>

          <div
            style={{
              opacity: showChoicePanel ? 1 : 0,
              transform: showChoicePanel ? "translateY(0)" : "translateY(8px)",
              transition:
                "opacity 700ms ease 120ms, transform 700ms cubic-bezier(0.22, 1, 0.36, 1) 120ms",
              pointerEvents: showChoicePanel ? "auto" : "none",
              position: showChoicePanel ? "relative" : "absolute",
              inset: showChoicePanel ? "auto" : 0,
            }}
          >
            <ShopItChoicePanel />
          </div>
        </div>
      </div>
    </SlideCard>
  );
}

/* ---------- Courier stat tile ---------- */

interface CourierStatTileProps {
  stat: CourierStat;
  idx: number;
}

function CourierStatTile({ stat, idx }: CourierStatTileProps) {
  return (
    <div
      className="flex items-start gap-4 opacity-0 animate-fade-in-up"
      style={{ animationDelay: `${260 + idx * 180}ms` }}
    >
      <p className="font-serif text-[42px] font-semibold leading-none tracking-tight text-white">
        {stat.value}
      </p>

      <div className="flex-1 pt-1">
        <p className="font-mono text-[10px] uppercase tracking-eyebrow text-white/45">
          {stat.sample}
        </p>
        <p className="mt-1 text-[12.5px] leading-snug text-white/80">
          {stat.caption}
        </p>
      </div>
    </div>
  );
}

/* ---------- Model row (left column) ---------- */

interface ModelRowProps {
  model: DeliveryModel;
  idx: number;
  step: number;
}

function ModelRow({ model, idx, step }: ModelRowProps) {
  // Models reveal starting at step 1.
  const revealed = step >= idx + 1;

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
      className="flex items-start gap-4 border-l-2 pl-4"
      style={{
        borderLeftColor: revealed ? "#f5c518" : "rgba(255,255,255,0.16)",
        opacity: revealed ? 1 : 0.3,
        transition:
          "opacity 700ms cubic-bezier(0.22, 1, 0.36, 1), border-color 600ms ease",
      }}
    >
      <div className="flex-1">
        {/* Eyebrow row. The ShopIt-choice model carries a gold badge on
            the right so the audience reads "this is the one" at a glance
            once it's revealed. */}
        <div className="flex items-baseline justify-between gap-3">
          <div className="flex items-baseline gap-3">
            <p className="font-mono text-[13px] uppercase tracking-eyebrow text-nebula-gold">
              {model.ordinal}
            </p>
            <p className="font-mono text-[10px] uppercase tracking-eyebrow text-white/45">
              {model.englishLabel}
            </p>
          </div>

          {model.isShopItChoice ? (
            <span
              className="rounded-sm border border-nebula-gold/70 px-2 py-[2px] font-mono text-[9px] uppercase tracking-eyebrow text-nebula-gold"
              style={{
                opacity: entered ? 1 : 0,
                transition: "opacity 600ms ease 360ms",
              }}
            >
              ShopIt-ის არჩევანი
            </span>
          ) : null}
        </div>

        <h3
          className="mt-1 text-[17px] font-semibold leading-snug tracking-tight text-white"
          style={{
            transform: entered ? "translateY(0)" : "translateY(6px)",
            opacity: entered ? 1 : 0,
            transition:
              "opacity 600ms ease 80ms, transform 600ms cubic-bezier(0.22, 1, 0.36, 1) 80ms",
          }}
        >
          {model.title}
        </h3>

        <p
          className="mt-1.5 text-[12.5px] leading-snug text-white/72"
          style={{
            opacity: entered ? 1 : 0,
            transition: "opacity 600ms ease 220ms",
          }}
        >
          {model.body}
        </p>
      </div>
    </div>
  );
}

/* ---------- Comparison matrix (right column, default) ---------- */

interface ComparisonMatrixProps {
  step: number;
}

function ComparisonMatrix({ step }: ComparisonMatrixProps) {
  // Mirrors the table on thesis pp. 35. The third row is labelled with
  // "ShopIt" attached so the audience reads it as "model 3 is ShopIt's
  // choice", not as a separate fourth row.
  const rows: ReadonlyArray<{
    model: string;
    stability: string;
    flexibility: string;
    revealsAt: number;
    isShopIt?: boolean;
  }> = [
    { model: "დისტრიბუცია", stability: "მაღალი", flexibility: "დაბალი", revealsAt: 1 },
    { model: "Glovo / Wolt", stability: "დაბალი", flexibility: "მაღალი", revealsAt: 2 },
    {
      model: "მარშრუტი · ShopIt",
      stability: "საშუალო",
      flexibility: "მაღალი",
      revealsAt: 3,
      isShopIt: true,
    },
  ];

  return (
    <div className="border-l border-nebula-rule pl-5">
      <p className="font-mono text-[10px] uppercase tracking-eyebrow text-white/45">
        შედარების მატრიცა
      </p>
      <p className="mt-1 text-[11px] leading-snug text-white/50">
        ნაშრომი, გვ. 35 — სტაბილურობა და მოქნილობა.
      </p>

      <div className="mt-4 grid grid-cols-[1.2fr_1fr_1fr] gap-2 border-b border-nebula-rule pb-2">
        <span className="font-mono text-[10px] uppercase tracking-eyebrow text-white/45">
          მოდელი
        </span>
        <span className="font-mono text-[10px] uppercase tracking-eyebrow text-white/45">
          სტაბილ.
        </span>
        <span className="font-mono text-[10px] uppercase tracking-eyebrow text-white/45">
          მოქნილ.
        </span>
      </div>

      <ul className="flex flex-col">
        {rows.map((row) => {
          const revealed = step >= row.revealsAt;
          return (
            <li
              key={row.model}
              className="grid grid-cols-[1.2fr_1fr_1fr] gap-2 border-b border-nebula-rule py-2.5"
              style={{
                opacity: revealed ? 1 : 0.32,
                transition: "opacity 600ms ease",
              }}
            >
              <span
                className="text-[12px] leading-snug"
                style={{
                  color: row.isShopIt && revealed ? "#f5c518" : "rgba(255,255,255,0.9)",
                  fontWeight: row.isShopIt ? 600 : 400,
                }}
              >
                {row.model}
              </span>
              <span className="text-[12px] leading-snug text-white/75">
                {row.stability}
              </span>
              <span className="text-[12px] leading-snug text-white/75">
                {row.flexibility}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ---------- ShopIt choice panel (right column, final step) ---------- */

function ShopItChoicePanel() {
  // Final-step panel. States ShopIt's choice plainly: model 3 is what
  // ShopIt adopts. No "hybrid" framing — the thesis (p. 34) explicitly
  // names the route-based model as the chosen approach.
  return (
    <div className="border-l-2 border-nebula-gold pl-5">
      <p className="font-mono text-[10px] uppercase tracking-eyebrow text-nebula-gold">
        ShopIt-ის არჩევანი
      </p>

      <h3 className="mt-2 text-[20px] font-semibold leading-tight tracking-tight text-white">
        წინასწარ ოპტიმიზებული მარშრუტი
      </h3>

      <p className="mt-3 text-[12.5px] leading-snug text-white/80">
        ShopIt იყენებს მესამე მოდელს — კურიერი იღებს დროითა და მანძილით
        წინასწარ ოპტიმიზებულ მარშრუტს, რომელიც აერთიანებს რამდენიმე
        შეკვეთას ერთ მიწოდების ციკლში.
      </p>

      <p className="mt-3 text-[12.5px] leading-snug text-white/65">
        პროგნოზირებადობა და ოპერაციული ეფექტიანობა ერთად — კურიერისთვის
        ცხადია, რას იღებს, გამყიდველისთვის და მომხმარებლისთვის —
        როდის მიდის შეკვეთა.
      </p>

      <p className="mt-5 font-mono text-[10px] uppercase tracking-eyebrow text-white/40">
        ნაშრომი, გვ. 34
      </p>
    </div>
  );
}
