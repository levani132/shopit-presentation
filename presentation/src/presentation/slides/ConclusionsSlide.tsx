import { useSlideSteps } from "@/navigation/SlideNavigationContext";
import { SlideCard } from "@/ui/SlideCard";
import { SlideHeading } from "@/ui/SlideHeading";
import { ShopItMark } from "@/ui/ShopItMark";

/**
 * Conclusions, limitations & thank-you slide (deck slide 16).
 *
 * Closes the talk with three reading blocks (contribution / limitations /
 * next steps), then on the final next-press swaps the card content with a
 * centred "მადლობა · კითხვები?" moment + ShopIt mark + minimal author /
 * supervisor chrome so the room has something dignified to look at during
 * Q&A.
 *
 * Visual model
 *
 *   Steps:
 *     0 — three columns visible: contribution / limitations / next steps
 *     1 — limitations column emphasised (gold rule pulses on)
 *     2 — next steps column emphasised
 *     3 — TRANSITION: card body swaps to the closing screen
 *
 *   The thank-you screen replaces the body of the slide entirely so it
 *   reads as a separate "page" without forcing the slide registry to host
 *   a second component. The eyebrow on the SlideCard is hidden on the
 *   closing step so the screen breathes.
 */

interface Block {
  /** Two-digit ordinal. */
  ordinal: string;
  /** Section eyebrow. */
  eyebrow: string;
  /** Block heading (Georgian). */
  heading: string;
  /** 3 short bullet lines. */
  bullets: ReadonlyArray<string>;
}

const BLOCKS: ReadonlyArray<Block> = [
  {
    ordinal: "01",
    eyebrow: "წვლილი",
    heading: "რას ამატებს ShopIt",
    bullets: [
      "ლოკალურ საჭიროებებზე მორგებული კომერციული ინფრასტრუქტურა — ენა, გადახდები და ლოგისტიკა ერთ გარემოში",
      "ემპირიული საფუძველი — 12 გამყიდველისა და 10 კურიერის პილოტური გამოკითხვა",
      "ფაზობრივი ზრდის მოდელი, რომელიც ქართულ მცირე და საშუალო ბიზნესის რეალობას ეყრდნობა",
    ],
  },
  {
    ordinal: "02",
    eyebrow: "შეზღუდვები",
    heading: "რა ზღუდავს დასკვნებს",
    bullets: [
      "ნიმუში მცირეა და მიზნობრივად არის შერჩეული; შედეგები სტატისტიკურ განზოგადებას არ გულისხმობს",
      "კვლევა ერთჯერად დროით ჭრილს ასახავს; რეალური ბაზრის ვალიდაცია ჯერ არ ჩატარებულა",
      "გადახდის ინფრასტრუქტურის გაფართოება დამოკიდებულია ბანკებთან და გადახდის პროვაიდერებთან პარტნიორობაზე",
    ],
  },
  {
    ordinal: "03",
    eyebrow: "შემდეგი ნაბიჯები",
    heading: "როგორ გრძელდება ვალიდაცია",
    bullets: [
      "MVP-ის გაშვება შერჩეულ პილოტურ გამყიდველებთან და ოპერაციული პროცესების შემოწმება",
      "ფასწარმოქმნის რეალური ვალიდაცია — პაკეტებზე გადასვლის, ARPU-ისა და retention-ის გაზომვა",
      "კვლევის გაფართოება უფრო მრავალფეროვან სეგმენტებზე და მიწოდების მოდელის პრაქტიკული ტესტირება",
    ],
  },
];

export function ConclusionsSlide() {
  // 4 steps: 3 column-emphasis passes + the closing "thank you" screen.
  const step = useSlideSteps(BLOCKS.length + 1);
  const limitationsFocus = step >= 1;
  const nextStepsFocus = step >= 2;
  const closingScreen = step >= BLOCKS.length;

  return (
    <SlideCard
      // Hide the eyebrow on the closing screen so the thank-you reads as
      // its own page.
      eyebrow={closingScreen ? undefined : "დასკვნა · 16"}
      size="lg"
    >
      {closingScreen ? (
        <ClosingScreen />
      ) : (
        <>
          <SlideHeading level={2}>
            რას ამატებს ShopIt — და რა რჩება შესამოწმებელი
          </SlideHeading>

          <p className="mt-4 max-w-4xl text-[18px] leading-snug text-white/70">
            სამი ბლოკი —{" "}
            <span className="text-white/90">
              წვლილი · შეზღუდვები · შემდეგი ნაბიჯები
            </span>
            .{" "}
            <span className="text-white/45">
              დასკვნები იკითხება პილოტური კვლევის, ფინანსური დაშვებებისა და
              შემდგომი ვალიდაციის საჭიროების კონტექსტში.
            </span>
          </p>

          <div className="mt-8 grid grid-cols-3 gap-4">
            {BLOCKS.map((block, idx) => (
              <BlockCard
                key={block.ordinal}
                block={block}
                highlight={
                  (idx === 1 && limitationsFocus && !nextStepsFocus) ||
                  (idx === 2 && nextStepsFocus)
                }
                dimmed={
                  (idx !== 1 && limitationsFocus && !nextStepsFocus) ||
                  (idx !== 2 && nextStepsFocus)
                }
              />
            ))}
          </div>
        </>
      )}
    </SlideCard>
  );
}

/* ---------- Reading block ---------- */

interface BlockCardProps {
  block: Block;
  highlight: boolean;
  dimmed: boolean;
}

function BlockCard({ block, highlight, dimmed }: BlockCardProps) {
  return (
    <section
      className={[
        "relative rounded-sm px-5 py-5 ring-1 transition-all duration-500",
        highlight
          ? "ring-nebula-gold/60 bg-nebula-ink/95"
          : "ring-nebula-rule bg-nebula-ink/70",
      ].join(" ")}
      style={{
        opacity: dimmed ? 0.55 : 1,
        transition: "opacity 600ms ease",
      }}
    >
      {highlight ? (
        <span
          aria-hidden
          className="absolute left-0 top-0 h-[3px] w-16 bg-nebula-gold"
        />
      ) : null}

      <div className="flex items-baseline justify-between">
        <p className="font-mono text-[12px] uppercase tracking-eyebrow text-nebula-gold">
          {block.ordinal}
        </p>
        <p className="font-mono text-[11px] uppercase tracking-eyebrow text-white/55">
          {block.eyebrow}
        </p>
      </div>

      <p className="mt-3 text-[22px] font-semibold leading-tight text-white">
        {block.heading}
      </p>

      <ul className="mt-4 flex flex-col gap-3 border-t border-nebula-rule pt-3">
        {block.bullets.map((b) => (
          <li key={b} className="flex items-start gap-2">
            <span
              aria-hidden
              className="mt-[8px] block h-[2px] w-3 shrink-0 bg-nebula-gold/70"
            />
            <p className="text-[13px] leading-snug text-white/85">{b}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ---------- Closing "thank you · questions?" screen ---------- */

function ClosingScreen() {
  // Centered, dignified. ShopIt mark at the top so the closing screen
  // visibly belongs to the deck. Author + supervisor + year sit at the
  // bottom as a thesis-cover-style chrome row.
  return (
    <div className="flex min-h-[68vh] flex-col items-center justify-center text-center">
      <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: "80ms" }}>
        <ShopItMark size={96} />
      </div>

      <p
        className="mt-10 font-serif text-[120px] font-semibold leading-none tracking-tight opacity-0 animate-fade-in-up"
        style={{
          color: "#f5c518",
          animationDelay: "240ms",
        }}
      >
        მადლობა
      </p>

      <div className="mt-5 flex items-center gap-5 opacity-0 animate-fade-in-up" style={{ animationDelay: "480ms" }}>
        <span aria-hidden className="block h-px w-14 bg-nebula-gold/70" />
        <p className="font-serif text-[44px] font-semibold leading-none tracking-tight text-white/90">
          კითხვები?
        </p>
        <span aria-hidden className="block h-px w-14 bg-nebula-gold/70" />
      </div>

      <p
        className="mt-8 max-w-2xl text-[16px] leading-snug text-white/55 opacity-0 animate-fade-in-up"
        style={{ animationDelay: "700ms" }}
      >
        ShopIt — ქართული ციფრული მაღაზიის ნაკრები მცირე ბიზნესისთვის.
        სოციალური კომერციის სიმარტივე, მარკეტპლეისის ღირებულება და
        ადგილობრივი მხარდაჭერა — ერთ პლატფორმაზე.
      </p>

      {/* Bottom chrome row: author / supervisor / year / city. Mirrors the
          title slide layout so the talk visibly closes where it opened. */}
      <div
        className="mt-12 grid grid-cols-4 gap-x-12 gap-y-3 border-t border-nebula-rule pt-6 opacity-0 animate-fade-in-up"
        style={{ animationDelay: "920ms" }}
      >
        <Field label="ავტორი" value="ლევან ბეროშვილი" />
        <Field label="ხელმძღვანელი" value="დავით მარკოზაშვილი" />
        <Field label="წელი" value="2026" />
        <Field label="ქალაქი" value="თბილისი" />
      </div>
    </div>
  );
}

interface FieldProps {
  label: string;
  value: string;
}

function Field({ label, value }: FieldProps) {
  return (
    <div className="text-left">
      <p className="font-mono text-[11px] uppercase tracking-eyebrow text-white/45">
        {label}
      </p>
      <p className="mt-1 text-[15px] font-medium text-white/85">{value}</p>
    </div>
  );
}
