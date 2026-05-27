import { useSlideSteps } from "@/navigation/SlideNavigationContext";
import { SlideCard } from "@/ui/SlideCard";
import { SlideHeading } from "@/ui/SlideHeading";

/**
 * Unit economics slide (deck slide 13).
 *
 * The thesis derives a defensible CAC / LTV / payback story in §
 * "Customer Acquisition Cost" through "Break-even ანალიზი" (pp. 52–55).
 * Headline numbers, all in ₾:
 *
 *   CAC          MVP (founder-led)        150
 *                Growth (Sales team)      225
 *   ARPU         weighted, p. 53          ~260 / month
 *   Gross margin assumption               75%
 *   Retention    conservative assumption  12 months
 *   LTV          260 × 12 × 0.75          2,340
 *   LTV : CAC    MVP                      15.6 : 1
 *                Growth                   10.4 : 1
 *   Payback      MVP                      ~1 month
 *                Growth                   ~1.2 months
 *   Break-even   MVP, fixed 420 ₾/mo      ~2 sellers
 *                Growth, fixed 7,920 ₾    ~31 sellers
 *
 * Visual model
 *
 *   Three vertical bands. Left band = the cost side (CAC formula visible
 *   on hover-level detail). Middle band = revenue side (ARPU → LTV
 *   build-up). Right band = the resulting ratios + break-even.
 *
 *   Sub-step reveals:
 *
 *     0 — left band (cost): CAC numbers and the small formula caption
 *     1 — middle band (revenue): ARPU + LTV build-up
 *     2 — right band (verdict): LTV:CAC ratios + payback + break-even
 *     3 — emphasis sweep — the verdict ratios pop, the rest dims
 *
 *   The slide stays static-layout throughout so the committee can
 *   re-read any column. Only opacity + dim states change per step.
 */

interface CostRow {
  /** Stage label (MVP vs Growth). */
  stage: string;
  /** The headline number (₾). */
  cac: string;
  /** Brief caption explaining the derivation. */
  caption: string;
}

const COST_ROWS: ReadonlyArray<CostRow> = [
  {
    stage: "MVP · დამფუძნებლის ჩართულობა",
    cac: "150 ₾ / გამყიდველი",
    caption:
      "ერთი გამყიდველის ჩართვა მოითხოვს ~5 სთ Sales Lead-ის დროს (ვიზიტი, demo, ჩართვა). 30 ₾/სთ opportunity cost-ის გათვალისწინებით: 5 × 30 = 150 ₾.",
  },
  {
    stage: "Growth · Sales team",
    cac: "225 ₾ / გამყიდველი",
    caption:
      "Sales Lead-ის ხელფასი 2,500 ₾ + ბონუსი 100 ₾ თითო მოზიდულზე, ვარაუდით 20 მოზიდვა თვეში: (2,500 + 20 × 100) / 20 = 225 ₾.",
  },
];

interface RevenueRow {
  /** Short row label. */
  label: string;
  /** Value displayed (₾). */
  value: string;
  /** Caption / assumption. */
  caption: string;
}

const REVENUE_ROWS: ReadonlyArray<RevenueRow> = [
  {
    label: "ARPU",
    value: "~260 ₾/თვე",
    caption:
      "Average Revenue Per User — საშუალო თვიური შემოსავალი ერთ გამყიდველზე. შეწონილი მაჩვენებელი (N=10, Q17, ცხრილი 8).",
  },
  {
    label: "Retention",
    value: "12 თვე",
    caption:
      "გამყიდველის საშუალო შენარჩუნების პერიოდი — კონსერვატიული დაშვება B2B SaaS-ისთვის.",
  },
  {
    label: "Gross margin",
    value: "75%",
    caption:
      "მთლიანი მარჟა — შემოსავლის ის ნაწილი, რომელიც რჩება გადახდის პროცესინგისა და ცვლადი ხარჯების შემდეგ.",
  },
  {
    label: "LTV",
    value: "2,340 ₾",
    caption:
      "Lifetime Value — ერთი გამყიდველის სრული ღირებულება პლატფორმისთვის: ARPU × Retention × Gross margin = 260 × 12 × 0.75.",
  },
];

interface VerdictRow {
  /** Big section heading. */
  heading: string;
  /** The hero number (Fraunces). */
  primary: string;
  /** Secondary small caption. */
  caption: string;
}

const VERDICT_RATIOS: ReadonlyArray<VerdictRow> = [
  {
    heading: "LTV : CAC · MVP",
    primary: "15.6 : 1",
    caption: "ბენჩმარკი ჯანმრთელი SaaS-ისთვის — 3:1",
  },
  {
    heading: "LTV : CAC · Growth",
    primary: "10.4 : 1",
    caption: "ფასიანი Sales-გუნდის შემოღების შემდეგაც > 3:1",
  },
];

const VERDICT_OPS: ReadonlyArray<VerdictRow> = [
  {
    heading: "Payback period",
    primary: "~1 თვე",
    caption: "subscription-ის სწრაფი დაგროვება",
  },
  {
    heading: "Break-even · MVP",
    primary: "~2 გამყიდველი",
    caption: "ფიქს ხარჯი 420 ₾/თვე (გვ. 51)",
  },
  {
    heading: "Break-even · Growth",
    primary: "~31 გამყიდველი",
    caption: "ფიქს ხარჯი 7,920 ₾/თვე — გუნდის ანაზღაურების შემდეგ",
  },
];

export function UnitEconomicsSlide() {
  // 4 steps — three columns reveal + one verdict-emphasis pass.
  const step = useSlideSteps(4);

  const costVisible = step >= 0;
  const revenueVisible = step >= 1;
  const verdictVisible = step >= 2;
  const verdictFocus = step >= 3;

  return (
    <SlideCard eyebrow="ერთეულის ეკონომიკა · 13" size="lg">
      <SlideHeading level={2}>რამდენი ჯდება, რამდენი ბრუნდება</SlideHeading>

      <p className="mt-4 max-w-4xl text-[18px] leading-snug text-white/70">
        bottom-up unit economics —{" "}
        <span className="text-white/90">
          CAC, ARPU, LTV, payback და break-even
        </span>
        .{" "}
        <span className="text-white/45">
          ყველა მაჩვენებელი ეფუძნება პილოტური კვლევის შედეგებსა და კონსერვატიულ
          დაშვებებს (ნაშრომი გვ. 52–55).
        </span>
      </p>

      <div className="mt-8 grid grid-cols-[1fr_1px_1.1fr_1px_1.2fr] gap-x-6">
        {/* Column 1 — cost side */}
        <Column
          title="01 · ხარჯი"
          subtitle="Customer Acquisition Cost"
          definition="CAC — ერთი ახალი გამყიდველის მოზიდვის და პლატფორმაზე ჩართვის ხარჯი."
          visible={costVisible}
          dimmed={verdictFocus}
        >
          {COST_ROWS.map((row) => (
            <div key={row.stage} className="mt-5 first:mt-0">
              <p className="font-mono text-[11px] uppercase tracking-eyebrow text-white/55">
                {row.stage}
              </p>
              <p className="mt-1 font-serif text-[44px] font-semibold leading-none tracking-tight text-white">
                {row.cac}
              </p>
              <p className="mt-2 text-[12px] leading-snug text-white/55">
                {row.caption}
              </p>
            </div>
          ))}
        </Column>

        <Divider />

        {/* Column 2 — revenue side */}
        <Column
          title="02 · ღირებულება"
          subtitle="Revenue per seller"
          definition="LTV — ერთი გამყიდველის სრული ფინანსური ღირებულება მთელი თანამშრომლობის პერიოდში."
          visible={revenueVisible}
          dimmed={verdictFocus}
        >
          {REVENUE_ROWS.map((row, idx) => (
            <div
              key={row.label}
              className={[
                "flex items-baseline justify-between gap-3 border-b border-nebula-rule pb-2",
                idx > 0 ? "mt-3" : "mt-0",
                row.label === "LTV" ? "border-b-0 pt-2" : "",
              ].join(" ")}
            >
              <div>
                <p className="font-mono text-[11px] uppercase tracking-eyebrow text-white/55">
                  {row.label}
                </p>
                <p className="mt-1 text-[11px] leading-snug text-white/45">
                  {row.caption}
                </p>
              </div>
              <p
                className={[
                  "shrink-0 font-serif font-semibold leading-none tracking-tight text-white",
                  row.label === "LTV"
                    ? "text-[40px]"
                    : "text-[22px] text-white/85",
                ].join(" ")}
                style={{
                  color: row.label === "LTV" ? "#f5c518" : undefined,
                }}
              >
                {row.value}
              </p>
            </div>
          ))}
        </Column>

        <Divider />

        {/* Column 3 — verdict */}
        <Column
          title="03 · ვერდიქტი"
          subtitle="Health & break-even"
          definition="LTV : CAC — რამდენჯერ აღემატება ერთი გამყიდველის ღირებულება მის მოზიდვაში დახარჯულ თანხას."
          visible={verdictVisible}
          dimmed={false}
          highlight={verdictFocus}
        >
          {VERDICT_RATIOS.map((row, idx) => (
            <div key={row.heading} className={idx > 0 ? "mt-3" : "mt-0"}>
              <p className="font-mono text-[11px] uppercase tracking-eyebrow text-white/55">
                {row.heading}
              </p>
              <p
                className="mt-1 font-serif text-[34px] font-semibold leading-none tracking-tight"
                style={{
                  color: verdictFocus ? "#f5c518" : "#ffffff",
                  transition: "color 600ms ease",
                }}
              >
                {row.primary}
              </p>
              <p className="mt-1 text-[11px] leading-snug text-white/45">
                {row.caption}
              </p>
            </div>
          ))}

          <div className="mt-4 border-t border-nebula-rule pt-3">
            {VERDICT_OPS.map((row, idx) => (
              <div key={row.heading} className={idx > 0 ? "mt-2" : "mt-0"}>
                <div className="flex items-baseline justify-between gap-3">
                  <p className="font-mono text-[11px] uppercase tracking-eyebrow text-white/55">
                    {row.heading}
                  </p>
                  <p className="font-serif text-[20px] font-semibold leading-none tracking-tight text-white">
                    {row.primary}
                  </p>
                </div>
                <p className="mt-1 text-[11px] leading-snug text-white/45">
                  {row.caption}
                </p>
              </div>
            ))}
          </div>
        </Column>
      </div>
    </SlideCard>
  );
}

/* ---------- Column wrapper ---------- */

interface ColumnProps {
  title: string;
  subtitle: string;
  /** Short Georgian glossary line — appears under the English subtitle so the
      committee sees the acronym's meaning before reading the numbers. */
  definition: string;
  visible: boolean;
  /** When the verdict pops on the final step, columns 1 & 2 dim slightly. */
  dimmed: boolean;
  /** Only the verdict column highlights gold on the final step. */
  highlight?: boolean;
  children: React.ReactNode;
}

function Column({
  title,
  subtitle,
  definition,
  visible,
  dimmed,
  highlight,
  children,
}: ColumnProps) {
  return (
    <section
      className={[
        "rounded-sm px-4 py-4 ring-1 transition-all duration-500",
        highlight
          ? "ring-nebula-gold/60 bg-nebula-ink/95"
          : "ring-nebula-rule bg-nebula-ink/70",
      ].join(" ")}
      style={{
        opacity: visible ? (dimmed ? 0.55 : 1) : 0,
        transform: visible ? "translateY(0)" : "translateY(14px)",
        transition:
          "opacity 600ms cubic-bezier(0.22, 1, 0.36, 1), transform 600ms cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      <div className="flex items-baseline justify-between">
        <p className="font-mono text-[12px] uppercase tracking-eyebrow text-nebula-gold">
          {title}
        </p>
        <p className="font-mono text-[10px] uppercase tracking-eyebrow text-white/35">
          {subtitle}
        </p>
      </div>
      <p className="mt-2 border-b border-nebula-rule pb-3 text-[12px] leading-snug text-white/55">
        {definition}
      </p>
      <div className="mt-4">{children}</div>
    </section>
  );
}

/* ---------- Thin vertical divider between columns ---------- */

function Divider() {
  return <span aria-hidden className="h-full w-px bg-nebula-rule" />;
}
