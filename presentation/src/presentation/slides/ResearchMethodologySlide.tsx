import { SlideCard } from "@/ui/SlideCard";
import { SlideHeading } from "@/ui/SlideHeading";

/**
 * Research methodology slide. Establishes the empirical grounding of the
 * thesis — the slide a defense committee scrutinises most closely.
 *
 *   Two parallel tracks, both administered as semi-structured online
 *   questionnaires via Google Forms in April 2026:
 *
 *     Sellers   · N = 12 · purposive sample, 58% solo businesses,
 *                          50% with 3+ years operating experience,
 *                          across 9 product categories.
 *     Couriers  · N = 10 · purposive sample, 60% corporate distribution,
 *                          40% platform-affiliated (Glovo · Wolt · Bolt).
 *
 *   Analysis: descriptive frequency counts + thematic identification on
 *   open-ended answers (thesis pp. 34-39).
 *
 * Visual approach (per the brief): two columns, big Fraunces numbers as
 * the focal points, a small dot grid below each so the sample size reads
 * concretely, and a single footnote rule with the limitations needed to
 * pre-empt committee questions.
 *
 * The brief calls these "interviews" but the thesis itself describes them
 * as questionnaires (გამოკითხვა) — the slide stays faithful to the thesis
 * so the spoken talk matches the written document on cross-examination.
 *
 * No sub-step reveal here — the slide is short enough to land in one beat;
 * a soft fade-in entry carries it.
 */

interface Track {
  /** Section eyebrow above the big number. */
  label: string;
  /** Big focal number (Fraunces). */
  count: number;
  /** Short Latin-mono label below the number. */
  englishLabel: string;
  /** Bullet rows describing sample / topics / method. */
  rows: ReadonlyArray<{ heading: string; body: string }>;
}

const SELLERS: Track = {
  label: "გამყიდველები",
  count: 12,
  englishLabel: "Sellers",
  rows: [
    {
      heading: "ნიმუშის პროფილი",
      body: "58% — ინდივიდუალური ბიზნესი · 50% — 3+ წლის გამოცდილება",
    },
    {
      heading: "კატეგორიები",
      body: "კოსმეტიკა · ხელნაკეთი ნივთები · ტანსაცმელი · ფარმაცია · სახლის ნივთები · სალაშქრო აღჭურვილობა · ავტონაწილები · სასურსათო დანამატები",
    },
    {
      heading: "მთავარი თემები",
      body: "არსებული გაყიდვის არხები · შეკვეთის შესრულება · გადახდები · მაღაზიის გვერდი · არსებული ხარვეზები",
    },
  ],
};

const COURIERS: Track = {
  label: "კურიერები",
  count: 10,
  englishLabel: "Couriers",
  rows: [
    {
      heading: "ნიმუშის შემადგენლობა",
      body: "60% — კორპორატიული დისტრიბუცია · 40% — პლატფორმის კურიერი (Glovo · Wolt · Bolt)",
    },
    {
      heading: "მთავარი თემები",
      body: "შეკვეთის მოცულობა · ფასწარმოქმნა · უმოქმედო დროის წილი · მარკეტპლეისზე გადასვლის სურვილი",
    },
    {
      heading: "გეოგრაფიული მოცვა",
      body: "თბილისი — ძირითადი ფოკუსი · პლატფორმის კურიერებში სხვა ქალაქების მცირე წილი",
    },
  ],
};

export function ResearchMethodologySlide() {
  return (
    <SlideCard eyebrow="კვლევის მეთოდოლოგია · 06" size="lg">
      <SlideHeading level={2}>ვისგან მოვისმინეთ — და როგორ</SlideHeading>

      <p className="mt-4 max-w-4xl text-[17px] leading-snug text-white/70">
        ორი პარალელური მიმართულება —{" "}
        <span className="text-white/90">
          ნახევრად სტრუქტურირებული გამოკითხვა Google Forms-ის საშუალებით
        </span>
        , აპრილი 2026.{" "}
        <span className="text-white/45">
          მიზნობრივი შერჩევა · ანალიზი: სიხშირული აღწერა და ღია პასუხების
          თემატური იდენტიფიკაცია.
        </span>
      </p>

      {/* Two parallel research tracks side-by-side. A 1px vertical rule sits
          on the column gap so the two halves read as a comparison, not as
          two unrelated blocks. */}
      <div className="relative mt-8 grid grid-cols-2 gap-x-12">
        <span
          aria-hidden
          className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-nebula-rule"
        />
        <TrackColumn track={SELLERS} delayMs={260} />
        <TrackColumn track={COURIERS} delayMs={520} />
      </div>

      {/* Limitations footnote — a single short line so the committee sees
          the sample's qualitative-validation framing acknowledged upfront,
          without deflating the slide. */}
      <div
        className="mt-8 flex items-start gap-3 border-t border-nebula-rule pt-4 opacity-0 animate-fade-in-up"
        style={{ animationDelay: "900ms" }}
      >
        <span
          aria-hidden
          className="mt-[7px] block h-[2px] w-6 shrink-0 bg-nebula-gold"
        />
        <p className="text-[14px] leading-relaxed text-white/55">
          მცირე ნიმუში — ხარისხობრივი ვალიდაცია, არა სტატისტიკური განზოგადება.{" "}
          ღია პასუხების ანალიზი ემსახურება ბიზნეს-ჰიპოთეზების შემოწმებას
          (ნაშრომი, გვ. 37–38, 57).
        </p>
      </div>
    </SlideCard>
  );
}

/* ---------- Track column (sellers or couriers) ---------- */

interface TrackColumnProps {
  track: Track;
  /** Stagger delay so the two columns enter in sequence, not simultaneously. */
  delayMs: number;
}

function TrackColumn({ track, delayMs }: TrackColumnProps) {
  return (
    <div
      className="opacity-0 animate-fade-in-up"
      style={{ animationDelay: `${delayMs}ms` }}
    >
      <div className="flex items-baseline justify-between">
        <p className="font-mono text-[14px] uppercase tracking-eyebrow text-nebula-gold">
          {track.label}
        </p>
        <p className="font-mono text-[11px] uppercase tracking-eyebrow text-white/35">
          {track.englishLabel}
        </p>
      </div>

      {/* Big Fraunces number — the focal point of each column. Sized so
          the two columns + the rest of the layout fit within ~78vh. */}
      <div className="mt-3 flex items-baseline gap-4">
        <p className="font-serif text-[96px] font-semibold leading-[0.9] tracking-tight text-white">
          {track.count}
        </p>
        <p className="text-[13px] text-white/45">რესპონდენტი</p>
      </div>

      {/* Dot grid — one gold dot per respondent. A single horizontal row
          keeps the row visually thin and reads as a counter rather than a
          population block. */}
      <RespondentDots count={track.count} />

      <ul className="mt-6 flex flex-col gap-3">
        {track.rows.map((row) => (
          <li key={row.heading} className="flex items-start gap-3">
            <span
              aria-hidden
              className="mt-[10px] block h-[2px] w-4 shrink-0 bg-nebula-gold/70"
            />
            <div className="flex-1">
              <p className="font-mono text-[11px] uppercase tracking-eyebrow text-white/55">
                {row.heading}
              </p>
              <p className="mt-1 text-[14px] leading-snug text-white/85">
                {row.body}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- Respondent dot grid ---------- */

interface RespondentDotsProps {
  count: number;
}

function RespondentDots({ count }: RespondentDotsProps) {
  // Render dots in a single row. Each dot is a small filled circle in
  // muted gold — the row reads as a tally, not a chart.
  return (
    <div className="mt-4 flex items-center gap-[5px]">
      {Array.from({ length: count }, (_, idx) => (
        <span
          key={idx}
          aria-hidden
          className="block h-[8px] w-[8px] rounded-full bg-nebula-gold/70"
          style={{
            animation: `fadeInUp 500ms cubic-bezier(0.22, 1, 0.36, 1) both`,
            animationDelay: `${600 + idx * 50}ms`,
          }}
        />
      ))}
    </div>
  );
}
