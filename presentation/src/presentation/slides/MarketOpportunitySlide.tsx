import { SlideCard } from "@/ui/SlideCard";
import { SlideHeading } from "@/ui/SlideHeading";

/**
 * Market opportunity slide. Top-down funnel (TAM → SAM → SOM) culminating
 * in the focal number 600 — the long-term active-seller target.
 *
 *   TAM ~200,000+   რეგისტრირებული ეკონომიკური სუბიექტი (Geostat)
 *   SAM ~60,000     საცალო / პროდუქტის გაყიდვის სეგმენტი (≈30%)
 *   SOM ~600        აქტიური გამყიდველი ShopIt-ზე (1% SAM-დან)
 *
 * 600 / 60,000 = 1% — the earlier draft said 5%; the correction lives both
 * in the SOM caption and in the right-hand annotation.
 *
 * Each tier carries the full English expansion of the acronym inside the
 * label block so a thesis committee reading the slide doesn't need outside
 * context. The right column spotlights "600" at 220px so it carries the
 * slide visually even from across a hall.
 */

interface Tier {
  code: "TAM" | "SAM" | "SOM";
  expansion: string;
  georgian: string;
  value: string;
  caption: string;
  detail: string;
}

const tiers: ReadonlyArray<Tier> = [
  {
    code: "TAM",
    expansion: "Total Addressable Market",
    georgian: "სრული პოტენციური ბაზარი",
    value: "200,000+",
    caption: "რეგისტრირებული ეკონომიკური სუბიექტი",
    detail: "Geostat — ბიზნეს რეგისტრი",
  },
  {
    code: "SAM",
    expansion: "Serviceable Addressable Market",
    georgian: "ხელმისაწვდომი ბაზრის ნაწილი",
    value: "~60,000",
    caption: "საცალო / პროდუქტის გაყიდვის სეგმენტი",
    detail: "≈30% TAM-დან",
  },
  {
    code: "SOM",
    expansion: "Serviceable Obtainable Market",
    georgian: "რეალურად დასაკავებელი წილი",
    value: "~600",
    caption: "აქტიური გამყიდველი ShopIt-ზე",
    detail: "1% SAM-დან · გრძელვადიანი თარგეთი",
  },
];

export function MarketOpportunitySlide() {
  return (
    <SlideCard eyebrow="ბაზრის შესაძლებლობა · 03" size="lg">
      <SlideHeading level={2}>სად ვათავსებთ ShopIt-ს</SlideHeading>

      <p className="mt-6 max-w-4xl text-[26px] leading-snug text-white/70">
        Top-down ანალიზი ქართული ბაზრის სამიზნე სეგმენტისთვის.
        <br />
        <span className="text-white/50">
          Bottom-up მიდგომას — როგორ მივდივართ ამ რიცხვამდე — პრეზენტაციის
          მოგვიანებით ნაწილში დავუბრუნდებით.
        </span>
      </p>

      <div className="mt-14 grid grid-cols-[1.15fr_1fr] gap-16">
        {/* Left column: the funnel itself. */}
        <div className="relative">
          {/* Connecting rail through the three nodes. */}
          <span
            aria-hidden
            className="absolute left-3 top-6 h-[calc(100%-3rem)] w-[2px] origin-top animate-scale-y-in bg-nebula-gold/35"
            style={{ animationDelay: "650ms" }}
          />

          <ul className="flex flex-col gap-12">
            {tiers.map((tier, idx) => (
              <li
                key={tier.code}
                className="relative flex items-start gap-8 opacity-0 animate-fade-in-up"
                style={{ animationDelay: `${260 + idx * 220}ms` }}
              >
                {/* Node on the rail. */}
                <span
                  aria-hidden
                  className={`relative z-10 mt-3 block h-4 w-4 shrink-0 rounded-full ${
                    tier.code === "SOM"
                      ? "bg-nebula-gold ring-[6px] ring-nebula-gold/20"
                      : "bg-nebula-gold/55"
                  }`}
                />

                <div className="flex-1">
                  <div className="flex items-baseline gap-4">
                    <p className="font-mono text-[20px] uppercase tracking-eyebrow text-nebula-gold">
                      {tier.code}
                    </p>
                    <p className="text-[15px] text-white/40">
                      {tier.expansion}
                    </p>
                  </div>
                  <p className="mt-1 text-[15px] italic text-white/55">
                    {tier.georgian}
                  </p>
                  <p
                    className={`mt-3 ${
                      tier.code === "SOM"
                        ? "text-[48px] font-semibold text-white"
                        : "text-[38px] font-medium text-white/90"
                    } leading-none`}
                  >
                    {tier.value}
                  </p>
                  <p className="mt-3 text-[22px] leading-snug text-white/80">
                    {tier.caption}
                  </p>
                  <p className="mt-1 text-[18px] text-white/45">
                    {tier.detail}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Right column: the focal number. */}
        <div
          className="flex flex-col justify-center border-l border-nebula-rule pl-14 opacity-0 animate-fade-in-up"
          style={{ animationDelay: "1150ms" }}
        >
          <p className="font-mono text-[16px] uppercase tracking-eyebrow text-nebula-gold">
            გრძელვადიანი თარგეთი
          </p>
          <p className="mt-4 font-serif text-[220px] font-semibold leading-[0.9] tracking-tight text-white">
            600
          </p>
          <p className="mt-4 text-[28px] font-medium leading-snug text-white">
            აქტიური გამყიდველი
          </p>
          <p className="mt-3 text-[20px] leading-relaxed text-white/60">
            ~₾156,000 თვიური GMV ShopIt-ის წილში
            <br />
            <span className="text-white/40">
              (260 ₾ შეწონილი ARPU × 600 გამყიდველი)
            </span>
          </p>

          <div className="mt-8 flex items-start gap-4 border-t border-nebula-rule pt-6">
            <span
              aria-hidden
              className="mt-[10px] block h-[2px] w-7 shrink-0 bg-nebula-gold"
            />
            <p className="text-[18px] leading-relaxed text-white/55">
              1%-იანი წილი მცირე საცალო სეგმენტში — საკმარისად კონსერვატიული,
              რომ მიღწევადი იყოს, საკმარისად მაღალი მდგრადი ბიზნესისთვის.
            </p>
          </div>
        </div>
      </div>
    </SlideCard>
  );
}
