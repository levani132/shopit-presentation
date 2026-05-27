import { SlideCard } from "@/ui/SlideCard";
import { SlideHeading } from "@/ui/SlideHeading";

/**
 * Team slide (deck slide 15).
 *
 * Mirrors §"ShopIt-ის გუნდი და მენეჯმენტი" (pp. 43–44, Table 1). The
 * platform is built and launched by three co-founders covering the three
 * operational pillars:
 *
 *   Sales Lead      — ანი ბეროშვილი         seller acquisition · B2B
 *   Logistics Lead  — ვასილი რაჭველიშვილი   courier ops · delivery SLA
 *   Tech Lead / CEO — ლევან ბეროშვილი (author) — platform · strategy · finance
 *
 * The thesis explicitly notes the team works flat (lean-startup, sweat
 * equity) until validation, then expands. This slide is intentionally
 * quieter than the rest — no sub-step reveals, just a soft fade entry,
 * because the team story is read once and absorbed.
 *
 * Visual model
 *
 *   Three role cards in a row. Each card has:
 *     - role eyebrow (Sales Lead / Logistics Lead / Tech Lead · CEO)
 *     - co-founder name (Fraunces serif, large)
 *     - 2-line responsibility description (matches the thesis Table 1)
 *
 *   Below the cards, a single line on the operating model (flat structure,
 *   lean-startup, sweat-equity) — quietly anchors the choice for the
 *   committee. A second band lists planned hires post-validation as a
 *   small horizontal flow with mono labels.
 */

interface CoFounder {
  /** Role eyebrow (English brand-style label). */
  role: string;
  /** Calling-card name (Fraunces). */
  name: string;
  /** Two-line responsibility list (matches Table 1, p. 43). */
  responsibilities: ReadonlyArray<string>;
  /** True for the author / CEO — gets the gold rule. */
  isAuthor?: boolean;
}

const COFOUNDERS: ReadonlyArray<CoFounder> = [
  {
    role: "Sales Lead",
    name: "ანი ბეროშვილი",
    responsibilities: [
      "გამყიდველების მოზიდვა · onboarding · retention",
      "B2B კომუნიკაცია · მცირე ბიზნესთან პირდაპირი კავშირი",
    ],
  },
  {
    role: "Logistics Lead",
    name: "ვასილი რაჭველიშვილი",
    responsibilities: [
      "კურიერების მენეჯმენტი · მიწოდების ოპერაცია",
      "ლოგისტიკური SLA · მარშრუტიზაცია",
    ],
  },
  {
    role: "Tech Lead · CEO",
    name: "ლევან ბეროშვილი",
    responsibilities: [
      "პლატფორმის განვითარება · ზოგადი სტრატეგია",
      "ფინანსები · ნაშრომის ავტორი",
    ],
    isAuthor: true,
  },
];

interface FuturePlan {
  /** When the role is added. */
  timing: string;
  /** Short Georgian label for the function. */
  label: string;
}

const FUTURE_PLAN: ReadonlyArray<FuturePlan> = [
  { timing: "6+ თვე", label: "Sales Managers · 1–2 ცალი" },
  { timing: "6+ თვე", label: "სრული განაკვეთის კურიერები · 2–3 ცალი" },
  { timing: "9+ თვე", label: "Frontend / Product Engineer" },
  { timing: "by need", label: "Outsourced — ბუღალტერი · იურისტი" },
];

export function TeamSlide() {
  return (
    <SlideCard eyebrow="გუნდი · 15" size="lg">
      <SlideHeading level={2}>ვინ ქმნის შოპითს</SlideHeading>

      <p className="mt-4 max-w-4xl text-[18px] leading-snug text-white/70">
        სამი თანადამფუძნებელი, სამი ოპერაციული მიმართულება —{" "}
        <span className="text-white/90">
          გაყიდვები · ლოგისტიკა · პროდუქტი
        </span>
        .{" "}
        <span className="text-white/45">
          ბრტყელი (flat) სტრუქტურა · lean-startup · sweat-equity ვალიდაციის
          პერიოდში.
        </span>
      </p>

      <div className="mt-8 grid grid-cols-3 gap-4">
        {COFOUNDERS.map((person, idx) => (
          <CoFounderCard
            key={person.name}
            person={person}
            stagger={idx * 140}
          />
        ))}
      </div>

      {/* Operating model footnote */}
      <div
        className="mt-7 flex items-start gap-3 border-t border-nebula-rule pt-4 opacity-0 animate-fade-in-up"
        style={{ animationDelay: "560ms" }}
      >
        <span
          aria-hidden
          className="mt-[7px] block h-[2px] w-6 shrink-0 bg-nebula-gold"
        />
        <p className="text-[14px] leading-relaxed text-white/65">
          საწყის ეტაპზე — ბრტყელი სტრუქტურა; სტრატეგიული გადაწყვეტილებები სამივე
          თანადამფუძნებლის თანხმობით, ოპერაციული — შესაბამისი domain-ის ლიდის
          მიერ.{" "}
          <span className="text-white/40">
            CTO / COO / CFO / HR — MVP და ადრეული Growth ეტაპებზე
            გათვალისწინებული არ არის.
          </span>
        </p>
      </div>

      {/* Future hires strip */}
      <div
        className="mt-5 opacity-0 animate-fade-in-up"
        style={{ animationDelay: "760ms" }}
      >
        <p className="font-mono text-[11px] uppercase tracking-eyebrow text-white/55">
          გუნდის გაფართოების გეგმა · ვალიდაციის შემდეგ
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
          {FUTURE_PLAN.map((plan, idx) => (
            <div key={plan.label} className="flex items-center gap-3">
              <span
                aria-hidden
                className="block h-1 w-1 rounded-full bg-nebula-gold/70"
              />
              <div>
                <p className="font-mono text-[10px] uppercase tracking-eyebrow text-white/40">
                  {plan.timing}
                </p>
                <p className="text-[13px] leading-snug text-white/85">
                  {plan.label}
                </p>
              </div>
              {idx < FUTURE_PLAN.length - 1 ? (
                <span
                  aria-hidden
                  className="ml-2 h-px w-4 shrink-0 bg-nebula-rule"
                />
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </SlideCard>
  );
}

/* ---------- Co-founder card ---------- */

interface CoFounderCardProps {
  person: CoFounder;
  stagger: number;
}

function CoFounderCard({ person, stagger }: CoFounderCardProps) {
  return (
    <div
      className={[
        "relative rounded-sm px-5 py-5 ring-1 opacity-0 animate-fade-in-up",
        person.isAuthor
          ? "ring-nebula-gold/60 bg-nebula-ink/95"
          : "ring-nebula-rule bg-nebula-ink/70",
      ].join(" ")}
      style={{ animationDelay: `${stagger}ms` }}
    >
      {person.isAuthor ? (
        <span
          aria-hidden
          className="absolute left-0 top-0 h-[3px] w-16 bg-nebula-gold"
        />
      ) : null}

      <p
        className={[
          "font-mono text-[12px] uppercase tracking-eyebrow",
          person.isAuthor ? "text-nebula-gold" : "text-white/55",
        ].join(" ")}
      >
        {person.role}
      </p>

      <p className="mt-3 font-serif text-[32px] font-semibold leading-tight tracking-tight text-white">
        {person.name}
      </p>

      {person.isAuthor ? (
        <p className="mt-1 font-mono text-[10px] uppercase tracking-eyebrow text-white/40">
          ნაშრომის ავტორი
        </p>
      ) : null}

      <ul className="mt-4 flex flex-col gap-2 border-t border-nebula-rule pt-3">
        {person.responsibilities.map((row) => (
          <li key={row} className="flex items-start gap-2">
            <span
              aria-hidden
              className="mt-[7px] block h-[2px] w-3 shrink-0 bg-nebula-gold/70"
            />
            <p className="text-[13px] leading-snug text-white/80">{row}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
