import { useSlideSteps } from "@/navigation/SlideNavigationContext";
import { SlideCard } from "@/ui/SlideCard";
import { SlideHeading } from "@/ui/SlideHeading";

/**
 * Marketing strategy slide (deck slide 14).
 *
 * Reflects the two-pronged plan from §"მარკეტინგული გეგმა" (pp. 45–49):
 *
 *   B2B acquisition (seller side) — low-budget, high-conversion channels
 *     1. Founder-led direct sales (Eliava bazaar, Lilo bazaar, FB groups)
 *     2. Targeted outbound on FB / IG to active sellers
 *     3. Referral program (discount or temporarily reduced commission)
 *     4. Organic content marketing (Georgian blog, video, case studies)
 *   B2B2C support (seller's own customers)
 *     1. Social-media auto-post — paid feature; network effect
 *     2. Built-in SEO optimisation
 *     3. Managed service (499 ₾ tier — 60% wanted personal help)
 *     4. Tutorials and educational resources — free for all tiers
 *
 *   The slide ends with the phased SMART KPIs (Table 3, p. 50):
 *     MVP   (1–6m)  · 30 active sellers   · CAC < 250 ₾
 *     Growth (7–12) · 100+ sellers        · MRR 30% MoM
 *     Scale (13–24) · 500+ sellers        · LTV:CAC > 5:1
 *
 * Visual model
 *
 *   Two side-by-side columns, each headed by a track label and a small
 *   eyebrow ordinal. Inside each column, tactics appear as numbered rows
 *   with a 2-line description. A KPI strip across the bottom shows the
 *   phased targets — appears on the final sub-step as the takeaway.
 *
 *   Steps:
 *     0 — B2B column populated, B2B2C column empty
 *     1 — B2B2C column populated
 *     2 — KPI strip emphasised
 */

interface Tactic {
  /** Tactic ordinal within the column (01..04). */
  ordinal: string;
  /** Short tactic title (Georgian). */
  title: string;
  /** One-line "why it works" caption. */
  why: string;
}

const B2B_TACTICS: ReadonlyArray<Tactic> = [
  {
    ordinal: "01",
    title: "დამფუძნებლის პირდაპირი გაყიდვები",
    why: "ფიზიკური ბაზრობები · Facebook სავაჭრო ჯგუფები · ნდობის სწრაფი ფორმირება",
  },
  {
    ordinal: "02",
    title: "მიზნობრივი კომუნიკაცია · FB & Instagram",
    why: "ინდივიდუალური მიწერა იმ გამყიდველებთან, რომლებიც უკვე აქტიურობენ ციფრულ არხებში",
  },
  {
    ordinal: "03",
    title: "Referral პროგრამა",
    why: "მცირე ბიზნესთა შორის უკვე ჩამოყალიბებული ურთიერთობების ბერკეტი — ფასდაკლება მომყვან გამყიდველს",
  },
  {
    ordinal: "04",
    title: "ორგანული კონტენტ-მარკეტინგი",
    why: "ქართულენოვანი ბლოგი, ვიდეო, ქეის-სტადია — SEO + ბრენდის ნდობა",
  },
];

const B2B2C_TACTICS: ReadonlyArray<Tactic> = [
  {
    ordinal: "01",
    title: "Social Media Auto-Post",
    why: "ShopIt-ის ერთიანი სოციალური აუდიტორია — ქსელური ეფექტი ეკოსისტემისთვის",
  },
  {
    ordinal: "02",
    title: "ჩაშენებული SEO",
    why: "სტრუქტურირებული მონაცემები, meta-tags, სიჩქარის ოპტიმიზაცია — ყველა მაღაზიისთვის ნაგულისხმევად",
  },
  {
    ordinal: "03",
    title: "მართული მომსახურება · 499 ₾",
    why: "პერსონალური მენეჯერი მარკეტინგსა და გაყიდვებში — კვლევაში 60%-მა ითხოვა",
  },
  {
    ordinal: "04",
    title: "ინსტრუქციები და რესურსები",
    why: "ქართულენოვანი მასალები ყველა პაკეტისთვის — ჩართვის ბარიერის შემცირება",
  },
];

interface KpiRow {
  /** Phase label. */
  phase: string;
  /** Calendar range. */
  timing: string;
  /** 2–3 short KPI bullets. */
  targets: ReadonlyArray<string>;
}

const KPIS: ReadonlyArray<KpiRow> = [
  {
    phase: "MVP",
    timing: "1–6 თვე",
    targets: [
      "30 აქტიური გამყიდველი",
      "CAC < 250 ₾",
      "Activation > 70%",
    ],
  },
  {
    phase: "Growth",
    timing: "7–12 თვე",
    targets: [
      "100+ აქტიური გამყიდველი",
      "MRR ზრდა 30% MoM",
      "ფასიანი > 25%",
    ],
  },
  {
    phase: "Scale",
    timing: "13–24 თვე",
    targets: [
      "500+ აქტიური გამყიდველი",
      "LTV : CAC > 5 : 1",
      "Referral > 15%",
    ],
  },
];

export function MarketingSlide() {
  // 3 steps — B2B column, B2B2C column, KPI emphasis.
  const step = useSlideSteps(3);
  const b2b2cVisible = step >= 1;
  const kpisVisible = step >= 2;

  return (
    <SlideCard eyebrow="მარკეტინგი · 14" size="lg">
      <SlideHeading level={2}>როგორ ვიპოვით პირველ 50 გამყიდველს</SlideHeading>

      <p className="mt-4 max-w-4xl text-[18px] leading-snug text-white/70">
        ორი პარალელური მიმართულება —{" "}
        <span className="text-white/90">
          B2B acquisition · B2B2C support
        </span>
        .{" "}
        <span className="text-white/45">
          ფასიანი რეკლამა საწყის ეტაპზე პრიორიტეტი არ არის — ფოკუსი
          პერსონალურ კომუნიკაციასა და ეკოსისტემურ ბერკეტებზეა.
        </span>
      </p>

      <div className="relative mt-7 grid grid-cols-2 gap-x-10">
        {/* Vertical rule between the two tracks. */}
        <span
          aria-hidden
          className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-nebula-rule"
        />

        <TrackColumn
          ordinal="01"
          label="B2B · გამყიდველთა მოზიდვა"
          tactics={B2B_TACTICS}
          visible
        />

        <TrackColumn
          ordinal="02"
          label="B2B2C · გამყიდველის მხარდაჭერა"
          tactics={B2B2C_TACTICS}
          visible={b2b2cVisible}
        />
      </div>

      <KpiStrip visible={kpisVisible} />
    </SlideCard>
  );
}

/* ---------- Track column ---------- */

interface TrackColumnProps {
  ordinal: string;
  label: string;
  tactics: ReadonlyArray<Tactic>;
  visible: boolean;
}

function TrackColumn({ ordinal, label, tactics, visible }: TrackColumnProps) {
  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(18px)",
        transition:
          "opacity 700ms cubic-bezier(0.22, 1, 0.36, 1), transform 700ms cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      <div className="flex items-baseline gap-3">
        <p className="font-mono text-[14px] uppercase tracking-eyebrow text-nebula-gold">
          {ordinal}
        </p>
        <p className="font-mono text-[13px] uppercase tracking-eyebrow text-white/85">
          {label}
        </p>
      </div>

      <ul className="mt-4 flex flex-col gap-3">
        {tactics.map((t, idx) => (
          <li
            key={t.ordinal}
            className="flex items-start gap-3"
            style={{
              opacity: 0,
              animation: visible
                ? `fadeInUp 500ms cubic-bezier(0.22, 1, 0.36, 1) both`
                : undefined,
              animationDelay: visible ? `${idx * 110 + 80}ms` : undefined,
            }}
          >
            <span
              aria-hidden
              className="mt-[5px] block h-[2px] w-4 shrink-0 bg-nebula-gold/70"
            />
            <div className="flex-1">
              <div className="flex items-baseline gap-2">
                <p className="font-mono text-[11px] uppercase tracking-eyebrow text-white/45">
                  {t.ordinal}
                </p>
                <p className="text-[16px] font-medium leading-snug text-white">
                  {t.title}
                </p>
              </div>
              <p className="mt-1 text-[13px] leading-snug text-white/60">
                {t.why}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- KPI strip ---------- */

interface KpiStripProps {
  visible: boolean;
}

function KpiStrip({ visible }: KpiStripProps) {
  return (
    <div
      className="mt-7 grid grid-cols-3 gap-3 border-t border-nebula-rule pt-5"
      style={{
        opacity: visible ? 1 : 0.25,
        transition: "opacity 700ms ease",
      }}
    >
      {KPIS.map((kpi, idx) => (
        <div
          key={kpi.phase}
          className={[
            "rounded-sm px-4 py-3 ring-1",
            idx === 2 ? "ring-nebula-gold/50" : "ring-nebula-rule",
          ].join(" ")}
        >
          <div className="flex items-baseline justify-between">
            <p className="font-mono text-[12px] uppercase tracking-eyebrow text-nebula-gold">
              {kpi.phase}
            </p>
            <p className="font-mono text-[10px] uppercase tracking-eyebrow text-white/35">
              {kpi.timing}
            </p>
          </div>
          <ul className="mt-2 flex flex-col gap-1">
            {kpi.targets.map((t) => (
              <li
                key={t}
                className="text-[13px] leading-snug text-white/85"
              >
                {t}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
