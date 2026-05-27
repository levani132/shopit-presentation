import { useSlideSteps } from "@/navigation/SlideNavigationContext";
import { SlideCard } from "@/ui/SlideCard";
import { SlideHeading } from "@/ui/SlideHeading";

/**
 * Pricing & ARPU slide (deck slide 11).
 *
 * The thesis (pp. 40, Q17 from Appendix C) lands on a four-tier model:
 * a free tier with a 10% commission, two paid subscription tiers
 * (99 ₾ / 5% and 199 ₾ / 2%), and a managed tier (499 ₾ + 2% with a
 * personal manager). Survey distribution: 50 / 20 / 20 / 10 %. The
 * weighted ARPU lands at ~260 ₾/month (Table 8).
 *
 * Visual model
 *
 *   Four pricing cards in a row. The cards reveal one-by-one through
 *   sub-steps so the audience reads each tier on its own before the row
 *   is whole. After all four cards are in, a fifth step pulls focus down
 *   to the weighted ARPU strip — that's the slide's takeaway and what
 *   feeds slide 13 (unit economics).
 *
 *   Steps:
 *     0 — Free only
 *     1 — Free + Pro
 *     2 — Free + Pro + Business
 *     3 — All four tiers
 *     4 — ARPU strip emphasised, secondary tiers slightly dimmed
 *
 *   The "Business" (199 ₾) tier is highlighted as the financial sweet
 *   spot because Table 8 shows it carries the highest per-seller ARPU
 *   (~511 ₾). The card gets a gold rule on top (mirrors SlideCard's
 *   chrome) and slightly stronger ring opacity. Free is the volume
 *   anchor; Managed is the high-touch anchor.
 *
 *   ARPU strip is a single horizontal row: per-tier ARPU as small
 *   numbers, a horizontal rule, then the weighted total at the right.
 *   This mirrors the table layout in the thesis (p. 53) so the
 *   committee can match the slide to the source on cross-examination.
 */

interface Tier {
  /** Two-digit ordinal shown above the tier label. */
  ordinal: string;
  /** Tier name (English brand label — Free / Pro / Business / Managed). */
  name: string;
  /** Short Georgian tagline shown under the name. */
  tagline: string;
  /** Monthly price label (e.g. "0 ₾", "99 ₾"). */
  price: string;
  /** Commission line (e.g. "10% საკომისიო"). */
  commission: string;
  /** Per-tier ARPU label (e.g. "ARPU ~130 ₾"). */
  arpu: string;
  /** Per-tier weight in the survey (e.g. "50%"). */
  weight: string;
  /** Three short bullets describing what's included at this tier. */
  features: ReadonlyArray<string>;
  /** True for the recommended / highest-ARPU tier — gets gold rule. */
  highlight?: boolean;
}

const TIERS: ReadonlyArray<Tier> = [
  {
    ordinal: "01",
    name: "Free",
    tagline: "უფასო შესვლა · შესვლის ბარიერი ნულზე",
    price: "0 ₾",
    commission: "10% საკომისიო",
    arpu: "ARPU ~130 ₾",
    weight: "50% შერჩევაში",
    features: [
      "მაღაზიის შექმნა და subdomain-ი",
      "გადახდისა და მიწოდების ბაზისური ინტეგრაცია",
      "ინსტრუქციები და მხარდამჭერი რესურსები",
    ],
  },
  {
    ordinal: "02",
    name: "Pro",
    tagline: "გადასვლის პაკეტი მცირე ბრენდისთვის",
    price: "99 ₾/თვე",
    commission: "5% საკომისიო",
    arpu: "ARPU ~203 ₾",
    weight: "20% შერჩევაში",
    features: [
      "შემცირებული საკომისიო · ნაკლები ცვლადი ხარჯი",
      "გაუმჯობესებული ანალიტიკა და კატალოგის მართვა",
      "ჩართვის სტრუქტურირებული მხარდაჭერა",
    ],
  },
  {
    ordinal: "03",
    name: "Business",
    tagline: "ფინანსურად ყველაზე მომგებიანი პაკეტი",
    price: "199 ₾/თვე",
    commission: "2% საკომისიო",
    arpu: "ARPU ~511 ₾",
    weight: "20% შერჩევაში",
    features: [
      "მაღალი მოცულობის გამყიდველზე გათვლილი",
      "პერსონალური დომენი და სრული მარკეტინგული ხელსაწყოები",
      "ჩაშენებული SEO და Social Media Auto-Post",
    ],
    highlight: true,
  },
  {
    ordinal: "04",
    name: "Managed",
    tagline: "სრულ მხარდაჭერაზე გათვლილი პაკეტი",
    price: "499 ₾/თვე",
    commission: "2% + პერსონალური მენეჯერი",
    arpu: "ARPU ~515 ₾",
    weight: "10% შერჩევაში",
    features: [
      "მენეჯერი ჩართულია მარკეტინგსა და გაყიდვებში",
      "გამყიდველის სრულად მხარდაჭერილი ჩართვის სცენარი",
      "თემატური ანგარიშგება და კონსულტაცია",
    ],
  },
];

/** Weighted-average ARPU from Table 8 (p. 53 of the thesis). */
const WEIGHTED_ARPU = "~260 ₾";

export function PricingSlide() {
  // 5 sub-steps — four tier reveals + an ARPU emphasis step.
  const step = useSlideSteps(TIERS.length + 1);
  const arpuEmphasis = step >= TIERS.length;

  return (
    <SlideCard eyebrow="ფასწარმოქმნა · 11" size="lg">
      <SlideHeading level={2}>ოთხი დონე, ერთი მონეტიზაცია</SlideHeading>

      <p className="mt-4 max-w-4xl text-[18px] leading-snug text-white/70">
        მრავალდონიანი მოდელი —{" "}
        <span className="text-white/90">
          უფასო შესვლა + სამი ფასიანი პაკეტი
        </span>
        .{" "}
        <span className="text-white/45">
          პაკეტების შერჩევითი წილი ეფუძნება პილოტურ კვლევას (N=10, Q17,
          ნაშრომი გვ. 40).
        </span>
      </p>

      <div className="mt-8 grid grid-cols-4 gap-4">
        {TIERS.map((tier, idx) => (
          <TierCard
            key={tier.ordinal}
            tier={tier}
            revealed={step >= idx}
            arpuFocus={arpuEmphasis}
          />
        ))}
      </div>

      {/* ARPU strip — appears (or gets emphasised) on the final step. */}
      <ArpuStrip emphasised={arpuEmphasis} />
    </SlideCard>
  );
}

/* ---------- Tier card ---------- */

interface TierCardProps {
  tier: Tier;
  revealed: boolean;
  arpuFocus: boolean;
}

function TierCard({ tier, revealed, arpuFocus }: TierCardProps) {
  // When the ARPU strip pulls focus on the final step, secondary tiers
  // fade just a touch so the eye glides to the bottom of the slide.
  const dim = arpuFocus && !tier.highlight ? 0.55 : 1;

  return (
    <div
      className={[
        "relative rounded-sm px-5 py-5 ring-1 transition-all duration-500",
        tier.highlight
          ? "ring-nebula-gold/70 bg-nebula-ink/95"
          : "ring-nebula-rule bg-nebula-ink/70",
      ].join(" ")}
      style={{
        opacity: revealed ? dim : 0,
        transform: revealed ? "translateY(0)" : "translateY(18px)",
        transition:
          "opacity 600ms cubic-bezier(0.22, 1, 0.36, 1), transform 600ms cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      {/* Gold rule for the highlighted tier — same chrome cue as SlideCard. */}
      {tier.highlight ? (
        <span
          aria-hidden
          className="absolute left-0 top-0 h-[3px] w-16 bg-nebula-gold"
        />
      ) : null}

      <div className="flex items-baseline justify-between">
        <p className="font-mono text-[12px] uppercase tracking-eyebrow text-nebula-gold">
          {tier.ordinal}
        </p>
        <p className="font-mono text-[10px] uppercase tracking-eyebrow text-white/35">
          {tier.weight}
        </p>
      </div>

      <p className="mt-3 font-serif text-[34px] font-semibold leading-none tracking-tight text-white">
        {tier.name}
      </p>
      <p className="mt-2 text-[13px] leading-snug text-white/55">
        {tier.tagline}
      </p>

      <div className="mt-4 border-t border-nebula-rule pt-3">
        <p className="font-mono text-[11px] uppercase tracking-eyebrow text-white/45">
          ფასი
        </p>
        <p className="mt-1 text-[24px] font-semibold leading-tight text-white">
          {tier.price}
        </p>
        <p className="mt-1 text-[12px] text-white/55">{tier.commission}</p>
      </div>

      <ul className="mt-4 flex flex-col gap-2">
        {tier.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2">
            <span
              aria-hidden
              className="mt-[8px] block h-[2px] w-3 shrink-0 bg-nebula-gold/70"
            />
            <p className="text-[12px] leading-snug text-white/80">{feature}</p>
          </li>
        ))}
      </ul>

      <p
        className="mt-4 font-mono text-[11px] uppercase tracking-eyebrow text-white/55"
        style={{
          color: tier.highlight ? "#f5c518" : undefined,
        }}
      >
        {tier.arpu}
      </p>
    </div>
  );
}

/* ---------- Weighted-average ARPU strip ---------- */

interface ArpuStripProps {
  emphasised: boolean;
}

function ArpuStrip({ emphasised }: ArpuStripProps) {
  // The strip appears at the bottom regardless of step (as a quiet rule),
  // and amplifies when the final next-press lands. This avoids any layout
  // shift between steps — only colour and weight change.
  return (
    <div
      className="mt-7 flex items-center gap-6 border-t border-nebula-rule pt-5"
      style={{
        opacity: emphasised ? 1 : 0.45,
        transition: "opacity 600ms ease",
      }}
    >
      <p className="font-mono text-[12px] uppercase tracking-eyebrow text-white/55">
        შეწონილი საშუალო ARPU
      </p>
      <span aria-hidden className="h-px flex-1 bg-nebula-rule" />
      <p
        className="font-serif text-[44px] font-semibold leading-none tracking-tight"
        style={{
          color: emphasised ? "#f5c518" : "rgb(255 255 255 / 0.7)",
          transition: "color 600ms ease",
        }}
      >
        {WEIGHTED_ARPU}
        <span className="ml-2 text-[14px] font-mono uppercase tracking-eyebrow text-white/45">
          /თვე
        </span>
      </p>
    </div>
  );
}
