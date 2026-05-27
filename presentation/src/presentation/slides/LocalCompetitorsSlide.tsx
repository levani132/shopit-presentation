import { useSlideSteps } from "@/navigation/SlideNavigationContext";

/**
 * Local competitors slide — "3D corridor flythrough" effect.
 *
 * Mental model. The slide is ONE world (the dark card chrome + 3 tier
 * mini-slides). At step 0 the world looks like a flat 2D overview: the
 * outer chrome (eyebrow, heading, standfirst) reads at native size and
 * the three tier cards sit in a flat horizontal row below it.
 *
 * On every subsequent step the world re-arranges:
 *
 *   • Step 1 — the social-shopping card "comes forward" to fill the
 *     visible area at full readable size; the marketplaces and
 *     international cards recede along a back-right diagonal via real
 *     CSS perspective (translate3d with negative Z).
 *   • Step 2 — the camera advances down the corridor: the social card
 *     flies past us to the left (translateX off-screen + fades out);
 *     the marketplaces card slots into the focus position; the
 *     international card moves up the queue.
 *   • Step 3 — the camera advances once more; only the international
 *     card remains, at focus.
 *   • Step 4 — the corridor fades out and the comparison matrix +
 *     ShopIt finale fades in (same pattern as slide 4).
 *
 * Why CSS perspective rather than just scale: the user explicitly asked
 * for a 3D-feeling flythrough where queued cards live in the depth axis,
 * not just in 2D. Putting the cards inside a `perspective: 1200px`
 * container and giving each card `translate3d(x, y, z)` produces the
 * vanishing-point effect when the queue cards are pushed to z = -1500
 * and z = -3500: their on-screen size and offset are computed by the
 * browser as `1 / (1 + |z| / perspective)`, so a card at z = -3500 ends
 * up at ~25% of its native footprint and visually anchored toward the
 * right edge — exactly the "really very back" tail the user described.
 *
 * Following slide 4 (`ForeignBenchmarksSlide`), this slide does NOT use
 * `SlideCard`. All visible chrome lives inside `<article>` so the world
 * is one cohesive element and transitions don't reveal anything behind
 * the chrome.
 */

/* ============================================================ */
/* Tier content                                                 */
/* ============================================================ */

type TierId = "social" | "marketplaces" | "international";

interface TierExample {
  name: string;
  /** Optional logo path under /logos. If absent, name renders as text chip. */
  logo?: string;
  logoAspect?: number;
}

interface Tier {
  id: TierId;
  /** Ordinal label in Georgian (e.g. "ფენა 01"). */
  ordinal: string;
  /** Short uppercase mono label for the eyebrow line. */
  eyebrow: string;
  /** Headline tier name. */
  name: string;
  /** One-line description that reads beneath the name. */
  tagline: string;
  /** Accent colour used for the eyebrow + heading rule on this tier. */
  accent: string;
  /** Real-world examples (logos or short names). */
  examples: ReadonlyArray<TierExample>;
  /** What this tier is good at — short bullet phrases. */
  strengths: ReadonlyArray<string>;
  /** Where this tier fails the Georgian seller — short bullet phrases. */
  gaps: ReadonlyArray<string>;
}

// All tier strength/gap bullets below are either lifted verbatim from the
// thesis or paraphrased from a specific cited page. Page numbers refer to
// `../ბეროშვილი_ლევან_MBA22_სამაგისტრო_ShopIt.pdf`. Numeric claims that
// are not in the thesis (e.g., a marketplace commission percentage) have
// been removed — do not reintroduce without a sourced citation.
const TIERS: ReadonlyArray<Tier> = [
  {
    id: "social",
    ordinal: "ფენა 01",
    eyebrow: "სოციალური სავაჭრო გვერდები",
    name: "Instagram · Facebook",
    // Thesis p.7: "ბევრი მცირე ბიზნესი სოციალური მედიის გვერდებს ძირითად
    // გაყიდვების არხად იყენებს".
    tagline:
      "ბევრი ქართული მცირე ბიზნესი დღეს სოციალური მედიის გვერდებს ძირითად გაყიდვების არხად იყენებს — შეტყობინებებში, გვერდის გარეშე.",
    accent: "#E0507A",
    examples: [
      { name: "Instagram", logo: "/logos/instagram.svg", logoAspect: 1 },
      { name: "Facebook", logo: "/logos/facebook.svg", logoAspect: 1 },
      { name: "TikTok", logo: "/logos/tiktok.svg", logoAspect: 2179 / 2500 },
    ],
    strengths: [
      // Thesis p.8 verbatim: "დიდ აუდიტორიაზე წვდომა".
      "დიდ აუდიტორიაზე წვდომა",
      // Thesis p.8 verbatim: "პროდუქციის მარტივი პრომოუშენი".
      "პროდუქციის მარტივი პრომოუშენი",
      // Synthesis of thesis pp.7-8 framing.
      "კონტენტი და გაყიდვა ერთ პლატფორმაზე",
    ],
    gaps: [
      // Thesis p.8 verbatim list.
      "სტრუქტურირებული კომერციული ფუნქციები არ არსებობს — პროდუქტის მართვა, შეკვეთების თვალყურის დევნება, ავტომატიზებული ლოგისტიკა",
      // Thesis p.7-8 table verbatim.
      "შეკვეთების მართვა ხელით — კომუნიკაცია შეტყობინებებით",
      // Thesis p.7-8 table verbatim.
      "მიწოდება გამყიდველსა და მყიდველს შორის ხელით თანხმდება",
      // Thesis p.7 table: "ბრენდის მფლობელობა · პლატფორმის გარემო".
      "ბრენდის მფლობელობა — პლატფორმის გარემოშია, არა გამყიდველის საკუთრებაში",
    ],
  },
  {
    id: "marketplaces",
    ordinal: "ფენა 02",
    eyebrow: "ჰორიზონტალური მარკეტპლეისები",
    name: "MyMarket · Extra.ge · Veli.store",
    // Thesis p.10 framing: customers buy from the platform, not from
    // individual sellers.
    tagline:
      "ცენტრალიზებული ციფრული პლატფორმები — ტრაფიკი არსებობს, თუმცა მომხმარებელი მარკეტპლეისთან ურთიერთობს, არა გამყიდველთან.",
    accent: "#5BA8FF",
    examples: [
      { name: "MyMarket", logo: "/logos/mymarket.svg", logoAspect: 150 / 40 },
      { name: "Extra.ge", logo: "/logos/extra.svg", logoAspect: 108 / 38 },
      { name: "Veli.store", logo: "/logos/veli.svg", logoAspect: 133 / 34 },
    ],
    strengths: [
      // Thesis p.10 verbatim: "ძლიერი მომხმარებლური ტრეფიკი".
      "ძლიერი მომხმარებლური ტრეფიკი",
      // Thesis p.10 verbatim: "პროდუქციის მრავალფეროვნება".
      "პროდუქციის მრავალფეროვნება",
      // Thesis p.9-11 framing: centralized shopping experience.
      "ცენტრალიზებული შოპინგ გამოცდილება მომხმარებლისთვის",
    ],
    gaps: [
      // Thesis p.8 verbatim: "შეზღუდული ბრენდინგი მარკეტპლეისის შიგნით".
      "შეზღუდული ბრენდინგი — მაღაზია მარკეტპლეისის გარემოშია",
      // Thesis p.10: customer relationship belongs to the platform; no
      // CRM/email/remarketing access for the seller.
      "მომხმარებლის მონაცემი გამყიდველთან არ რჩება — განმეორებითი გაყიდვა შეზღუდულია",
      // Thesis p.10 + p.11: "მაღაზიის შეზღუდული მორგება" / "ცენტრალიზებული კატალოგი".
      "მაღაზიის შეზღუდული მორგება — ცენტრალიზებული კატალოგი",
      // Thesis p.9: "ერთჯერად ან მოკლევადიან ტრანზაქციებს ემსახურება".
      "მოდელი ერთჯერად ან მოკლევადიან ტრანზაქციებზე ფოკუსირდება",
    ],
  },
  {
    id: "international",
    ordinal: "ფენა 03",
    eyebrow: "საერთაშორისო პლატფორმები",
    name: "Shopify · Wix · WooCommerce",
    // Thesis p.27 verbatim framing: strong infrastructure, weak
    // market-specific localization.
    tagline:
      "გლობალური პლატფორმები — ძლიერი ინფრასტრუქტურა, თუმცა კონკრეტული ბაზრებისთვის საჭირო ლოკალიზაცია ხშირად აკლიათ.",
    accent: "#B27CFF",
    examples: [
      { name: "Shopify", logo: "/logos/shopify.svg", logoAspect: 500 / 142.8 },
      { name: "Wix", logo: "/logos/wix.svg", logoAspect: 75 / 30 },
      {
        name: "WooCommerce",
        logo: "/logos/woocommerce.svg",
        logoAspect: 95 / 26,
      },
    ],
    strengths: [
      // Shopify p.16: "მაღაზიის სწრაფად გაშვების შესაძლებლობა" + "ყველაფერი
      // ერთში ინფრასტრუქტურა". Wix p.19-20: similar.
      "მაღაზიის სწრაფი გაშვება და ერთიანი ინფრასტრუქტურა",
      // Thesis pp.13, 20, 22: all three list large theme + app ecosystems.
      "შაბლონებისა და აპლიკაციების ფართო ეკოსისტემა",
      // Shopify p.16 strengths; WooCommerce p.24 "მაღალი პერსონალიზაცია".
      "მაღალი მასშტაბირებადობა და დიზაინის მოქნილობა",
    ],
    gaps: [
      // Thesis p.27 near-verbatim: TBC Pay / BoG not built in by default,
      // require third-party or custom development.
      "ლოკალური გადახდის პროვაიდერები (TBC Pay, BoG) — სტანდარტულად ჩაშენებული არ არის, საჭიროა მესამე მხარის გადაწყვეტა",
      // Thesis p.27 verbatim: local logistics (courier, warehouse) not in
      // standard configuration.
      "ადგილობრივი ლოგისტიკური ინტეგრაცია (კურიერი, საწყობი) — სტანდარტულ კონფიგურაციაში არ არის",
      // Thesis p.27 verbatim: full Georgian language support often
      // requires manual translation.
      "ქართული ენის სრული მხარდაჭერა — ხშირად ხელით თარგმნა",
      // Thesis p.27: real cost = subscription + themes + apps + (sometimes)
      // developer involvement; not just the headline subscription.
      "რეალური ხარჯი — სააბონენტოს გარდა თემები, აპლიკაციები, დეველოპერი",
    ],
  },
];

/* ============================================================ */
/* Matrix rows for the finale                                   */
/* ============================================================ */

interface MatrixRow {
  label: string;
  social: string;
  marketplaces: string;
  international: string;
  shopit: string;
}

const MATRIX_ROWS: ReadonlyArray<MatrixRow> = [
  {
    label: "შესვლის ბარიერი",
    social: "ნულოვანი",
    marketplaces: "მოდერაცია",
    international: "სააბონენტო",
    shopit: "უფასო · საკომისიო",
  },
  {
    label: "გადახდის ინტეგრაცია",
    social: "—",
    marketplaces: "ჩაშენებული",
    international: "მესამე მხარით",
    shopit: "Keepz · TBC · BoG",
  },
  {
    // Thesis p.9 (MyMarket): "ლოგისტიკა ჩვეულებრივ დამოუკიდებლად
    // წესრიგდება". Thesis p.11 (Veli): "პლატფორმის მიერ მართული
    // მიწოდების სისტემა". So the tier is split, not uniformly "internal".
    label: "ქართული კურიერი",
    social: "—",
    marketplaces: "ნაწილობრივ",
    international: "—",
    shopit: "კურიერების მარკეტპლეისი",
  },
  {
    label: "ბრენდის იდენტობა",
    social: "ნაწილობრივ",
    marketplaces: "—",
    international: "სრული",
    shopit: "სრული",
  },
  {
    label: "მომხმარებლის მონაცემი",
    social: "—",
    marketplaces: "—",
    international: "გამყიდველთან",
    shopit: "გამყიდველთან",
  },
];

/* ============================================================ */
/* Step → per-card transform                                    */
/* ============================================================ */

/**
 * Returns the CSS transform + opacity for tier `cardIdx` at navigation
 * step `step`.
 *
 * The numbers were tuned by hand to balance two competing constraints:
 *
 *   (a) at step 0 all three cards must fit horizontally inside the world
 *       (1400 px on a wide screen) with breathing room;
 *   (b) at steps 1–3 the focused card must read at full size, AND the
 *       queue cards must clearly peek "back-right" rather than landing
 *       on top of the focused card.
 *
 * Constraint (b) is what drives the negative z values: a queue card at
 * z = -1500 inside a `perspective: 1200px` container renders at ~44%
 * scale and its world-x is multiplied by the same factor on screen, so
 * an x of 1800 lands ~800 px right of centre — clear of the focused
 * card's right edge.
 */
type CardState = {
  transform: string;
  opacity: number;
};

const CARD_NATIVE_WIDTH = 1080;
const CARD_NATIVE_HEIGHT = 560;

/** Position the focused card slightly left of centre to leave a "queue lane" on the right. */
const FOCUS_X = -180;

function getCardState(cardIdx: number, step: number): CardState {
  // Step 0 — flat 2D row, no perspective.
  if (step === 0) {
    const x = (cardIdx - 1) * 460;
    return {
      transform: `translate3d(${x}px, 60px, 0px) scale(0.34)`,
      opacity: 1,
    };
  }

  // Steps 1–3 — corridor mode. The focused index advances with the step.
  const focusIdx = step - 1;
  const relIdx = cardIdx - focusIdx;

  // Past us — flew off to the left, fade out.
  if (relIdx < 0) {
    const xOffset = -1700 - Math.abs(relIdx) * 200;
    return {
      transform: `translate3d(${xOffset}px, 0px, 400px) scale(1)`,
      opacity: 0,
    };
  }

  // The focused tier — full readable, slightly left of centre.
  if (relIdx === 0) {
    return {
      transform: `translate3d(${FOCUS_X}px, 0px, 0px) scale(1)`,
      opacity: 1,
    };
  }

  // The next-up queue card — back-right, mid depth.
  if (relIdx === 1) {
    return {
      transform: `translate3d(1700px, -40px, -1500px) scale(1)`,
      opacity: 1,
    };
  }

  // The further queue card — far back-right, very small.
  return {
    transform: `translate3d(2100px, 120px, -3600px) scale(1)`,
    opacity: 1,
  };
}

/** Outer chrome (eyebrow + heading + standfirst) is only readable at step 0. */
function getChromeState(step: number): CardState {
  if (step === 0) {
    return { transform: "translate3d(0,0,0) scale(1)", opacity: 1 };
  }
  // Push the chrome back along the z axis as the camera enters the corridor,
  // so it visibly recedes rather than just fading.
  return { transform: "translate3d(0, -40px, -900px) scale(1)", opacity: 0 };
}

/* ============================================================ */
/* Slide                                                        */
/* ============================================================ */

export function LocalCompetitorsSlide() {
  // 5 steps: 0 overview, 1–3 focus tier, 4 matrix finale.
  const step = useSlideSteps(5);
  const matrixMode = step === 4;
  const chrome = getChromeState(step);

  return (
    <div
      className="relative"
      style={{ width: "min(1400px, 84vw)", minHeight: "78vh" }}
    >
      {/* THE WORLD — perspective wrapper. Cards inside are positioned in
          true 3D using translate3d with translateZ. */}
      <article
        className="relative overflow-hidden rounded-sm bg-nebula-ink/85 ring-1 ring-nebula-rule backdrop-blur-[6px]"
        style={{
          minHeight: "78vh",
          padding: "56px 64px",
          perspective: "1200px",
          perspectiveOrigin: "50% 45%",
          transformStyle: "preserve-3d",
          opacity: matrixMode ? 0 : 1,
          transition: "opacity 600ms cubic-bezier(0.4, 0, 0.2, 1)",
          pointerEvents: matrixMode ? "none" : "auto",
        }}
      >
        {/* Yellow rule */}
        <span
          aria-hidden
          className="absolute left-0 top-0 h-[3px] w-24 bg-nebula-gold"
        />

        {/* Outer chrome — readable at step 0, recedes at step 1+. */}
        <div
          style={{
            transform: chrome.transform,
            opacity: chrome.opacity,
            transformOrigin: "50% 50%",
            transformStyle: "preserve-3d",
            transition:
              "transform 900ms cubic-bezier(0.32, 0.72, 0, 1), opacity 600ms cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <p className="font-mono text-[18px] uppercase tracking-eyebrow text-nebula-gold">
            ლოკალური კონკურენტული ლანდშაფტი · 05
          </p>
          <h1 className="mt-4 max-w-[82%] font-sans text-[44px] font-semibold leading-[1.1] tracking-tight text-white">
            ვინ ჰქმნის სავაჭრო გვერდს დღეს — და რა ხარვეზებით
          </h1>
          <p className="mt-5 max-w-[78%] text-[20px] leading-snug text-white/70">
            ქართულ ბაზარზე გამყიდველი დღეს სამი მარშრუტიდან ირჩევს — სოციალური
            ქსელი, ლოკალური მარკეტპლეისი ან საერთაშორისო SaaS. სამივეს
            სტრუქტურული ხარვეზი აქვს.
          </p>
        </div>

        {/* 3D stage — perspective is on the article above, so this layer
            simply holds the absolutely-positioned tier cards. */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            transformStyle: "preserve-3d",
          }}
        >
          {TIERS.map((tier, idx) => {
            const state = getCardState(idx, step);
            return (
              <TierCard
                key={tier.id}
                tier={tier}
                index={idx}
                state={state}
                focused={step >= 1 && step <= 3 && step - 1 === idx}
              />
            );
          })}
        </div>
      </article>

      {/* Matrix finale — sibling, fades in when the corridor fades out. */}
      <MatrixPanel visible={matrixMode} />
    </div>
  );
}

/* ============================================================ */
/* Tier card                                                    */
/* ============================================================ */

/**
 * A single tier card. Each card always renders its FULL content at the
 * same native size (CARD_NATIVE_WIDTH × CARD_NATIVE_HEIGHT). The card's
 * 3D transform (per-step) decides whether it reads as the focused
 * full-size foreground card or as a small queue card receding into the
 * background.
 */
function TierCard({
  tier,
  index,
  state,
  focused,
}: {
  tier: Tier;
  index: number;
  state: CardState;
  focused: boolean;
}) {
  return (
    <div
      className="absolute left-1/2 top-1/2"
      style={{
        width: `${CARD_NATIVE_WIDTH}px`,
        height: `${CARD_NATIVE_HEIGHT}px`,
        marginLeft: `${-CARD_NATIVE_WIDTH / 2}px`,
        marginTop: `${-CARD_NATIVE_HEIGHT / 2}px`,
        transform: state.transform,
        opacity: state.opacity,
        transformOrigin: "50% 50%",
        transformStyle: "preserve-3d",
        // Ease-out-back-like curve so the focused card "lands" with a
        // slight settle, while receding cards glide smoothly.
        transition:
          "transform 1100ms cubic-bezier(0.32, 0.72, 0, 1), opacity 800ms cubic-bezier(0.4, 0, 0.2, 1)",
        pointerEvents: focused ? "auto" : "none",
        // Hint the browser to keep card content sharp even when it's
        // scaled down by perspective — without this, Chrome may rasterise
        // the queue cards at small size and blur them when they're
        // promoted back to the foreground.
        willChange: "transform, opacity",
      }}
    >
      <TierCardContent tier={tier} index={index} />
    </div>
  );
}

/**
 * The full-readable contents of a tier card. Sized for native dimensions
 * — when the card is focused (scale 1) it reads as a polished slide;
 * when receding via perspective it shrinks proportionally and remains
 * legible enough to read the tier name.
 */
function TierCardContent({ tier, index }: { tier: Tier; index: number }) {
  return (
    <div
      className="relative h-full w-full overflow-hidden rounded-sm bg-nebula-deep ring-2 ring-white/10"
      style={{
        padding: "36px 44px",
      }}
    >
      {/* Accent rule + ordinal */}
      <div className="flex items-center gap-4">
        <span
          aria-hidden
          className="h-[3px] w-14"
          style={{ background: tier.accent }}
        />
        <p
          className="font-mono text-[13px] uppercase tracking-eyebrow"
          style={{ color: tier.accent }}
        >
          {tier.ordinal} · {tier.eyebrow}
        </p>
      </div>

      {/* Name */}
      <h2 className="mt-4 font-sans text-[34px] font-semibold leading-[1.1] tracking-tight text-white">
        {tier.name}
      </h2>

      {/* Tagline */}
      <p className="mt-3 max-w-[88%] text-[17px] leading-snug text-white/65">
        {tier.tagline}
      </p>

      {/* Examples row */}
      <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
        {tier.examples.map((example) =>
          example.logo ? (
            <img
              key={example.name}
              src={example.logo}
              alt={example.name}
              style={{
                display: "block",
                height: "28px",
                width: `${28 * (example.logoAspect ?? 3)}px`,
                opacity: 0.85,
              }}
            />
          ) : (
            <span
              key={example.name}
              className="font-mono text-[14px] uppercase tracking-eyebrow text-white/75"
              style={{
                paddingBottom: "2px",
                borderBottom: `1px solid ${tier.accent}66`,
              }}
            >
              {example.name}
            </span>
          ),
        )}
      </div>

      {/* Strengths + Gaps two-column */}
      <div className="mt-7 grid grid-cols-2 gap-x-10">
        <div>
          <p
            className="font-mono text-[12px] uppercase tracking-eyebrow"
            style={{ color: tier.accent }}
          >
            ძლიერი მხარეები
          </p>
          <ul className="mt-3 space-y-2.5">
            {tier.strengths.map((item) => (
              <li
                key={item}
                className="flex gap-3 text-[15px] leading-snug text-white/85"
              >
                <span
                  aria-hidden
                  className="mt-2 h-px w-3 shrink-0"
                  style={{ background: tier.accent }}
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-mono text-[12px] uppercase tracking-eyebrow text-white/55">
            სტრუქტურული ხარვეზი
          </p>
          <ul className="mt-3 space-y-2.5">
            {tier.gaps.map((item) => (
              <li
                key={item}
                className="flex gap-3 text-[15px] leading-snug text-white/70"
              >
                <span
                  aria-hidden
                  className="mt-2 h-px w-3 shrink-0 bg-white/30"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Tiny counter pinned bottom-right — visible at any zoom level. */}
      <span
        aria-hidden
        className="absolute bottom-5 right-6 font-mono text-[11px] uppercase tracking-eyebrow text-white/30"
      >
        {String(index + 1).padStart(2, "0")} / 03
      </span>
    </div>
  );
}

/* ============================================================ */
/* Matrix finale                                                */
/* ============================================================ */

function MatrixPanel({ visible }: { visible: boolean }) {
  return (
    <article
      className="absolute inset-0 rounded-sm bg-nebula-ink/85 ring-1 ring-nebula-rule backdrop-blur-[6px]"
      style={{
        padding: "56px 64px",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(30px)",
        transition:
          "opacity 600ms cubic-bezier(0.4, 0, 0.2, 1) 200ms, transform 700ms cubic-bezier(0.22, 1, 0.36, 1) 200ms",
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      <span
        aria-hidden
        className="absolute left-0 top-0 h-[3px] w-24 bg-nebula-gold"
      />

      <p className="font-mono text-[16px] uppercase tracking-eyebrow text-nebula-gold">
        ლოკალური კონკურენტული ლანდშაფტი · შედარების მატრიცა
      </p>
      <h1 className="mt-4 font-sans text-[42px] font-semibold leading-[1.1] tracking-tight text-white">
        სად ჩერდება თითოეული — და სად მთავრდება ShopIt-ის წინაშე ხარვეზი
      </h1>

      <table className="mt-10 w-full border-collapse text-[15px]">
        <thead>
          <tr className="border-b border-nebula-rule">
            <th className="py-4 pr-4 text-left font-mono text-[12px] uppercase tracking-eyebrow text-white/45">
              შედარების განზომილება
            </th>
            <th className="py-4 pr-4 text-left font-mono text-[12px] uppercase tracking-eyebrow text-white/55">
              სოციალური
            </th>
            <th className="py-4 pr-4 text-left font-mono text-[12px] uppercase tracking-eyebrow text-white/55">
              მარკეტპლეისები
            </th>
            <th className="py-4 pr-4 text-left font-mono text-[12px] uppercase tracking-eyebrow text-white/55">
              საერთაშორისო
            </th>
            <th className="py-4 pr-4 text-left font-serif text-[22px] font-semibold text-nebula-gold">
              ShopIt
            </th>
          </tr>
        </thead>
        <tbody>
          {MATRIX_ROWS.map((row, idx) => (
            <tr
              key={row.label}
              className="border-b border-nebula-rule/60"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(8px)",
                transition: `opacity 450ms ease ${
                  300 + idx * 80
                }ms, transform 450ms ease ${300 + idx * 80}ms`,
              }}
            >
              <td className="py-4 pr-4 text-[15px] text-white/65">{row.label}</td>
              <td className="py-4 pr-4 text-[16px] text-white/80">
                {row.social}
              </td>
              <td className="py-4 pr-4 text-[16px] text-white/80">
                {row.marketplaces}
              </td>
              <td className="py-4 pr-4 text-[16px] text-white/80">
                {row.international}
              </td>
              <td className="py-4 pr-4 text-[16px] font-medium text-white">
                {row.shopit}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p
        className="mt-10 max-w-[88%] text-[17px] leading-snug text-white/65"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(10px)",
          transition:
            "opacity 600ms ease 900ms, transform 600ms ease 900ms",
        }}
      >
        ShopIt არ უპირისპირდება არცერთ ფენას — ის ავსებს ხარვეზებს: სოციალური
        ქსელის სიმარტივეს ანიჭებს გადახდის რელსს და კურიერს; მარკეტპლეისის
        ტრაფიკის ნაცვლად — გამყიდველს ანდობს ბრენდს და მონაცემს; საერთაშორისო
        პლატფორმის სიფაქიზის ნაცვლად — ლოკალურ ინტეგრაციას.
      </p>
    </article>
  );
}
