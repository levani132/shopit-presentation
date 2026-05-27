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
    georgian: "სრული მისამართებადი ბაზარი",
    value: "200,000+",
    caption: "რეგისტრირებული ეკონომიკური სუბიექტები",
    detail: "საქსტატი — ბიზნეს რეგისტრი",
  },
  {
    code: "SAM",
    expansion: "Serviceable Addressable Market",
    georgian: "ხელმისაწვდომი მისამართებადი ბაზარი",
    value: "~60,000",
    caption: "საცალო ვაჭრობისა და პროდუქციის რეალიზაციის სეგმენტი",
    detail: "TAM-ის ≈30%",
  },
  {
    code: "SOM",
    expansion: "Serviceable Obtainable Market",
    georgian: "რეალურად ათვისებადი ბაზრის წილი",
    value: "~600",
    caption: "აქტიური გამყიდველი ShopIt-ზე",
    detail: "SAM-ის 1% · გრძელვადიანი მიზანი",
  },
];

export function MarketOpportunitySlide() {
  return (
    <SlideCard eyebrow="ბაზრის შესაძლებლობა · 03" size="lg">
      <SlideHeading level={2}>სამიზნე ბაზრის შეფასება</SlideHeading>

      <p className="mt-5 max-w-3xl text-[20px] leading-snug text-white/70">
        ქართული ბაზრის სამიზნე სეგმენტის Top-down ანალიზი.{" "}
        <span className="text-white/45">
          Bottom-up მიდგომას პრეზენტაციის მომდევნო ნაწილში განვიხილავთ.
        </span>
      </p>

      <div className="mt-10 grid grid-cols-[1.1fr_1fr] gap-12">
        {/* Left column: the funnel itself. */}
        <div className="relative">
          {/* Connecting rail through the three nodes. */}
          <span
            aria-hidden
            className="absolute left-[7px] top-5 h-[calc(100%-2.5rem)] w-[2px] origin-top animate-scale-y-in bg-nebula-gold/35"
            style={{ animationDelay: "650ms" }}
          />

          <ul className="flex flex-col gap-7">
            {tiers.map((tier, idx) => (
              <li
                key={tier.code}
                className="relative flex items-start gap-6 opacity-0 animate-fade-in-up"
                style={{ animationDelay: `${260 + idx * 220}ms` }}
              >
                {/* Node on the rail. */}
                <span
                  aria-hidden
                  className={`relative z-10 mt-[10px] block h-4 w-4 shrink-0 rounded-full ${
                    tier.code === "SOM"
                      ? "bg-nebula-gold ring-[5px] ring-nebula-gold/20"
                      : "bg-nebula-gold/55"
                  }`}
                />

                <div className="flex-1">
                  <div className="flex items-baseline gap-3">
                    <p className="font-mono text-[18px] uppercase tracking-eyebrow text-nebula-gold">
                      {tier.code}
                    </p>
                    <p className="text-[14px] text-white/40">
                      {tier.expansion}
                    </p>
                  </div>
                  <p className="text-[13px] italic text-white/50">
                    {tier.georgian}
                  </p>
                  <p
                    className={`mt-2 ${
                      tier.code === "SOM"
                        ? "text-[36px] font-semibold text-white"
                        : "text-[30px] font-medium text-white/90"
                    } leading-none`}
                  >
                    {tier.value}
                  </p>
                  <p className="mt-2 text-[18px] leading-snug text-white/80">
                    {tier.caption}
                  </p>
                  <p className="mt-1 text-[14px] text-white/45">
                    {tier.detail}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Right column: the focal number. */}
        <div
          className="flex flex-col justify-center border-l border-nebula-rule pl-10 opacity-0 animate-fade-in-up"
          style={{ animationDelay: "1150ms" }}
        >
          <p className="font-mono text-[14px] uppercase tracking-eyebrow text-nebula-gold">
            გრძელვადიანი მიზანი
          </p>
          <p className="mt-3 font-serif text-[160px] font-semibold leading-[0.9] tracking-tight text-white">
            600
          </p>
          <p className="mt-3 text-[22px] font-medium leading-snug text-white">
            აქტიური გამყიდველი
          </p>
          <p className="mt-2 text-[16px] leading-relaxed text-white/60">
            ~₾156,000 პლატფორმის თვიური შემოსავალი
            <br />
            <span className="text-white/45">
              (260 ₾ შეწონილი ARPU × 600 გამყიდველი)
            </span>
          </p>

          <div className="mt-6 flex items-start gap-3 border-t border-nebula-rule pt-4">
            <span
              aria-hidden
              className="mt-[7px] block h-[2px] w-6 shrink-0 bg-nebula-gold"
            />
            <p className="text-[14px] leading-relaxed text-white/55">
              1%-იანი წილი საცალო სეგმენტში — საკმარისად კონსერვატიული ნიშნულია მისაღწევად,
              თუმცა საკმარისად მაღალია ბიზნესის მდგრადობის უზრუნველსაყოფად.
            </p>
          </div>
        </div>
      </div>
    </SlideCard>
  );
}
