import { useSlideSteps } from "@/navigation/SlideNavigationContext";

/**
 * Foreign benchmarks slide — "zoom into the tile" with crisp scaling.
 *
 * Everything is authored against a fixed 1400×800 native canvas. An outer
 * wrapper scales that canvas uniformly to fit the viewport.
 *
 * IMPORTANT architectural choice: nothing is ever upscaled. Instead of
 * scaling the *world* up by 4× when zooming in (which would upscale the
 * tile's texture and produce blurry text), each tile is rendered at its
 * full native 1400×800 size and animated from scale(0.25) to scale(1).
 * Every intermediate scale is ≤ 1, so the compositor only ever
 * downscales the texture — keeping text and SVGs crisp throughout the
 * animation.
 *
 *   • Overview (step 0): each tile is positioned at its grid slot and
 *     transformed by `translate(gx, gy) scale(0.25)`. Side tiles add a
 *     `rotateY(±10°)` for a subtle card-fan 3D feel. Only the company
 *     logo is visible inside; eyebrow, tagline and details are hidden.
 *
 *   • Focused (step 1–3): the focused tile transitions to
 *     `translate(0, 0) scale(1) rotateY(0)` so it fills the canvas at
 *     native size. The other two fade out. Inside the focused tile,
 *     the logo animates from centred to its top-left slide position
 *     and the supporting copy fades in.
 *
 *   • Matrix (step 4): every tile and the heading text fade out; the
 *     comparison matrix panel fades in over the canvas.
 *
 * Border colours: both the chunky "frame" border in overview and the
 * thin 1 px slide chrome visible when zoomed use the company's accent
 * colour. The frame is 8 px native (≈2 px in mini view) and fades out
 * as the tile grows so the focused slide isn't ringed in 8 px.
 */

type CompanyId = "shopify" | "wix" | "woo";

interface Company {
  id: CompanyId;
  name: string;
  logo: string;
  logoAspect: number;
  tagline: string;
  accent: string;
  details: ReadonlyArray<{ label: string; value: string }>;
}

const COMPANIES: ReadonlyArray<Company> = [
  {
    id: "shopify",
    name: "Shopify",
    logo: "/logos/shopify.svg",
    logoAspect: 500 / 142.8,
    tagline: "ციფრული კომერციის ლიდერი",
    accent: "#95BF47",
    details: [
      {
        label: "მოდელი",
        value:
          "სრულად მართული SaaS — კომერციაზე ორიენტირებული, „ყველაფერი ერთში“ ინფრასტრუქტურით.",
      },
      {
        label: "სამიზნე აუდიტორია",
        value:
          "მცირე გამყიდველებიდან მსხვილ კომპანიებამდე; უმდიდრესი აპლიკაციების ეკოსისტემა.",
      },
      {
        label: "ძლიერი მხარე",
        value:
          "სწრაფი გაშვება, საიმედო ჰოსტინგი, შეკვეთებისა და გადახდის ერთიანი გარემო.",
      },
      {
        label: "ქართული ბაზრის ხარვეზი",
        value:
          "სააბონენტო ხარჯი; ლოკალური გადახდები და კურიერი — მხოლოდ მესამე მხარის აპლიკაციით.",
      },
    ],
  },
  {
    id: "wix",
    name: "Wix",
    logo: "/logos/wix.svg",
    logoAspect: 75 / 30,
    tagline: "ვებსაიტის ამწყობი — დიზაინიდან კომერციამდე",
    accent: "#FAAD4D",
    details: [
      {
        label: "მოდელი",
        value:
          "Cloud ვებსაიტის ამწყობი drag-and-drop რედაქტორით; კომერციული მოდული მოგვიანებით დაემატა.",
      },
      {
        label: "სამიზნე აუდიტორია",
        value:
          "მცირე ბიზნესი, ფრილანსერი, თვითდასაქმებული — ძირითადად დიზაინზე ფოკუსირებული.",
      },
      {
        label: "ძლიერი მხარე",
        value:
          "შაბლონების მდიდარი ბიბლიოთეკა, მარტივი onboarding, ჩაშენებული SEO.",
      },
      {
        label: "ქართული ბაზრის ხარვეზი",
        value:
          "კომერციული ფუნქციონალი ნაკლებად სპეციალიზებული; ლოკალური ინტეგრაცია ცალკეული.",
      },
    ],
  },
  {
    id: "woo",
    name: "WooCommerce",
    logo: "/logos/woocommerce.svg",
    logoAspect: 95 / 26,
    tagline: "WordPress-ის ღია კოდის პლაგინი",
    accent: "#873EFF",
    details: [
      {
        label: "მოდელი",
        value:
          "Self-hosted, ღია კოდის WordPress პლაგინი. ბირთვი უფასოა; შემოსავალი — გაფართოებებზე.",
      },
      {
        label: "სამიზნე აუდიტორია",
        value:
          "დეველოპერი ან ტექნიკურად მომზადებული ბიზნესი, რომელსაც სრული კონტროლი სჭირდება.",
      },
      {
        label: "ძლიერი მხარე",
        value:
          "მაქსიმალური მოქნილობა, WordPress-ის უზარმაზარი ეკოსისტემა — ათასობით პლაგინი.",
      },
      {
        label: "ქართული ბაზრის ხარვეზი",
        value:
          "მფლობელი ვალდებულია მართოს ჰოსტინგი, უსაფრთხოება, განახლებები.",
      },
    ],
  },
];

interface MatrixRow {
  label: string;
  shopify: string;
  wix: string;
  woo: string;
  shopit: string;
}

const MATRIX_ROWS: ReadonlyArray<MatrixRow> = [
  {
    label: "პლატფორმის ტიპი",
    shopify: "SaaS",
    wix: "Site builder",
    woo: "Open source",
    shopit: "ლოკალური SaaS",
  },
  {
    label: "ქართული ენა",
    shopify: "შეზღუდული",
    wix: "შეზღუდული",
    woo: "პლაგინით",
    shopit: "ჩაშენებული",
  },
  {
    label: "ლოკალური გადახდები",
    shopify: "—",
    wix: "—",
    woo: "ინდივიდუალური",
    shopit: "Keepz, ბანკები",
  },
  {
    label: "ლოკალური მიწოდება",
    shopify: "—",
    wix: "—",
    woo: "ინდივიდუალური",
    shopit: "კურიერების მარკეტპლეისი",
  },
  {
    label: "შესვლის ბარიერი",
    shopify: "სააბონენტო",
    wix: "სააბონენტო",
    woo: "ტექნიკური ცოდნა",
    shopit: "უფასო + საკომისიო",
  },
];

/* ============================================================ */
/* Geometry                                                     */
/* ============================================================ */

const ZOOM = 4;
const WORLD_W = 1400;
const WORLD_H = 800;
const TILE_W = WORLD_W / ZOOM; // 350 — visible mini-tile width (after 1/ZOOM)
const TILE_H = WORLD_H / ZOOM; // 200
const PAD_X = 64;
const PAD_Y = 56;
const MINI_SCALE = 1 / ZOOM; // 0.25

// Where the tile row sits when in mini mode (top-left corner in native
// canvas coords). Target: tile *centre* at ~58% of world height — past
// the visual middle (which would clash with the heading copy above) but
// well clear of the bottom edge. Earlier values: 80% (hugged the bottom),
// 70% (still felt bottom-weighted).
const TILE_ROW_TOP = Math.round(WORLD_H * 0.58 - TILE_H / 2); // = 364

const TILE_GRID_POS: ReadonlyArray<[number, number]> = [
  [PAD_X, TILE_ROW_TOP],
  [(WORLD_W - TILE_W) / 2, TILE_ROW_TOP],
  [WORLD_W - PAD_X - TILE_W, TILE_ROW_TOP],
];

const TILE_TILT_DEG = [10, 0, -10] as const;
const TILE_TY = [4, -14, 4] as const;
const TILE_TZ = [-20, 40, -20] as const;

/* ============================================================ */
/* Slide                                                        */
/* ============================================================ */

export function ForeignBenchmarksSlide() {
  const step = useSlideSteps(5);
  const focusedTile = step >= 1 && step <= 3 ? step - 1 : -1;
  const matrixMode = step === 4;
  const overview = focusedTile === -1 && !matrixMode;

  // Native canvas stays at WORLD_W × WORLD_H. The wrapper scales it
  // uniformly to fit min(WORLD_W, 84vw) so internal positions are
  // viewport-independent. This wrapper only ever downscales.
  const canvasScale = `calc(min(${WORLD_W}px, 84vw) / ${WORLD_W}px)`;

  return (
    <div
      style={{
        position: "relative",
        width: `min(${WORLD_W}px, 84vw)`,
        aspectRatio: `${WORLD_W} / ${WORLD_H}`,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: `${WORLD_W}px`,
          height: `${WORLD_H}px`,
          transform: `scale(${canvasScale})`,
          transformOrigin: "0 0",
        }}
      >
        {/* Card chrome — bg + ring. Lives on the canvas itself so the
            world has a consistent dark surface; the focused tile or the
            matrix panel covers it when those are active. */}
        <div className="absolute inset-0 rounded-sm bg-nebula-ink/85 ring-1 ring-nebula-rule" />

        {/* Heading copy + yellow rule — fades out when we leave overview
            so the zoomed-in slide reads as the only thing on screen. */}
        <WorldHeading visible={overview} />

        {/* 3D perspective context for the tile row */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            perspective: "2400px",
            perspectiveOrigin: "center 70%",
          }}
        >
          {COMPANIES.map((company, idx) => (
            <Tile
              key={company.id}
              company={company}
              idx={idx}
              isFocused={focusedTile === idx}
              anyFocused={focusedTile !== -1}
              matrixMode={matrixMode}
            />
          ))}
        </div>

        <MatrixPanel visible={matrixMode} />
      </div>
    </div>
  );
}

/* ============================================================ */
/* World heading (eyebrow + headline + standfirst)              */
/* ============================================================ */

function WorldHeading({ visible }: { visible: boolean }) {
  return (
    <div
      aria-hidden={!visible}
      style={{
        position: "absolute",
        inset: 0,
        opacity: visible ? 1 : 0,
        transition: "opacity 500ms ease",
        pointerEvents: visible ? "auto" : "none",
        willChange: "opacity",
      }}
    >
      <span
        aria-hidden
        className="absolute left-0 top-0 h-[3px] w-24 bg-nebula-gold"
      />
      <div className="relative" style={{ padding: `${PAD_Y}px ${PAD_X}px` }}>
        <p className="font-mono text-[18px] uppercase tracking-eyebrow text-nebula-gold">
          გლობალური ეტალონები · 04
        </p>
        <h1 className="mt-4 max-w-[80%] font-sans text-[44px] font-semibold leading-[1.1] tracking-tight text-white">
          გლობალური პლატფორმები — სად ვდგავართ
        </h1>
        <p className="mt-5 max-w-[78%] text-[20px] leading-snug text-white/70">
          სამი მთავარი მოთამაშე გლობალურ ციფრულ კომერციაში — ძლიერია გლობალურად,
          თუმცა ქართულ ბაზარზე ლოკალური ინტეგრაცია (ენა, გადახდები, კურიერი) —
          დღემდე ხარვეზია.
        </p>
      </div>
    </div>
  );
}

/* ============================================================ */
/* Tile                                                         */
/* ============================================================ */

function Tile({
  company,
  idx,
  isFocused,
  anyFocused,
  matrixMode,
}: {
  company: Company;
  idx: number;
  isFocused: boolean;
  anyFocused: boolean;
  matrixMode: boolean;
}) {
  const [gx, gy] = TILE_GRID_POS[idx]!;
  const tilt = TILE_TILT_DEG[idx]!;
  const ty = TILE_TY[idx]!;
  const tz = TILE_TZ[idx]!;
  const fadeOut = matrixMode || (anyFocused && !isFocused);

  const tweener = "transform 1100ms cubic-bezier(0.32, 0.72, 0, 1)";

  return (
    // Outer: native-size positioning wrapper. Animates from grid offset
    // to (0,0). Position only — no scale here, so it can't blur.
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        opacity: fadeOut ? 0 : 1,
        transform: isFocused
          ? "translate3d(0, 0, 0)"
          : `translate3d(${gx}px, ${gy}px, 0)`,
        transition: `${tweener}, opacity 500ms ease`,
        zIndex: isFocused ? 10 : 1,
        willChange: "transform, opacity",
      }}
    >
      {/* Scaler: 1/ZOOM in overview, 1 when focused. Because we only
          ever scale BETWEEN 0.25 and 1 (never above 1), the tile's
          texture is always rasterized at its native 1400×800 size and
          composited downward — no upscaling blur. */}
      <div
        style={{
          transform: isFocused ? "scale(1)" : `scale(${MINI_SCALE})`,
          transformOrigin: "0 0",
          transition: tweener,
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
      >
        {/* 3D rotator — tilts the tile inward in overview, flattens
            when focused. */}
        <div
          style={{
            width: `${WORLD_W}px`,
            height: `${WORLD_H}px`,
            transform: isFocused
              ? "rotateY(0deg) translate3d(0, 0, 0)"
              : `rotateY(${tilt}deg) translate3d(0, ${ty}px, ${tz}px)`,
            transformOrigin: "50% 50%",
            transformStyle: "preserve-3d",
            transition: tweener,
            willChange: "transform",
          }}
        >
          {/* Tile chrome — drop shadow + glow. Lives on the natively-
              sized tile so the shadows are large in native units; at
              mini scale (0.25) they read at ~25%, which matches the
              old visual treatment. Fades out when focused. */}
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              overflow: "hidden",
              borderRadius: "2px",
              boxShadow: isFocused
                ? "none"
                : `0 0 240px ${company.accent}66, 0 80px 200px rgba(0,0,0,0.55), 0 24px 64px rgba(0,0,0,0.65)`,
              transition: "box-shadow 600ms ease",
            }}
          >
            <CompanySlideContent
              company={company}
              isFocused={isFocused}
            />

            {/* Thick accent frame (8 px native ≈ 2 px in mini view) +
                inner glow. Fades out as the tile grows so the focused
                slide is bordered by the inner 1 px accent edge, not by
                this 8 px frame. */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                border: `8px solid ${company.accent}`,
                borderRadius: "2px",
                boxShadow: `inset 0 0 120px ${company.accent}33`,
                opacity: isFocused ? 0 : 1,
                transition: "opacity 600ms ease",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================ */
/* Company slide content (rendered at native 1400×800)          */
/* ============================================================ */

function CompanySlideContent({
  company,
  isFocused,
}: {
  company: Company;
  isFocused: boolean;
}) {
  // Unfocused logo: large, centred — sized to fit ~50% of world width
  // or ~45% of world height, whichever clamps first, so all three logos
  // read at comparable visual weight.
  const maxUnfocusedW = WORLD_W * 0.5;
  const maxUnfocusedH = WORLD_H * 0.45;
  const unfocusedH = Math.min(
    maxUnfocusedH,
    maxUnfocusedW / company.logoAspect,
  );
  const unfocusedW = unfocusedH * company.logoAspect;

  // Focused logo: 76 px tall in the standard logo+tagline row.
  const focusedH = 76;
  const focusedW = focusedH * company.logoAspect;

  const LOGO_ROW_TOP = 178;
  const DETAILS_TOP = 380;

  const logoH = isFocused ? focusedH : unfocusedH;
  const logoW = isFocused ? focusedW : unfocusedW;
  const logoTop = isFocused ? LOGO_ROW_TOP : (WORLD_H - unfocusedH) / 2;
  const logoLeft = isFocused ? PAD_X : (WORLD_W - unfocusedW) / 2;

  // Asymmetric fade: wait for the zoom to be well underway before
  // revealing the slide copy; drop it instantly on un-focus so it
  // doesn't ghost through the shrinking tile.
  const fadeIn = isFocused
    ? "opacity 450ms ease 550ms"
    : "opacity 250ms ease";

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        backgroundColor: "#0a0d1f", // nebula-ink
        // 1 px native accent border = the focused slide chrome.
        border: `1px solid ${company.accent}`,
      }}
    >
      {/* Yellow rule */}
      <span
        aria-hidden
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          height: "3px",
          width: "96px",
          background: "#f5c518",
          opacity: isFocused ? 1 : 0,
          transition: fadeIn,
        }}
      />

      {/* Eyebrow */}
      <p
        className="font-mono uppercase tracking-eyebrow"
        style={{
          position: "absolute",
          left: PAD_X,
          top: PAD_Y,
          fontSize: "18px",
          color: "#f5c518",
          opacity: isFocused ? 1 : 0,
          transition: fadeIn,
        }}
      >
        გლობალური ეტალონები · {company.name}
      </p>

      {/* Logo — animates between centred (mini) and top-left (focused).
          SVG so it stays vector-crisp at any size. */}
      <img
        src={company.logo}
        alt={company.name}
        style={{
          position: "absolute",
          top: `${logoTop}px`,
          left: `${logoLeft}px`,
          height: `${logoH}px`,
          width: `${logoW}px`,
          display: "block",
          transition:
            "top 900ms cubic-bezier(0.22, 1, 0.36, 1), left 900ms cubic-bezier(0.22, 1, 0.36, 1), height 900ms cubic-bezier(0.22, 1, 0.36, 1), width 900ms cubic-bezier(0.22, 1, 0.36, 1), filter 700ms ease",
          filter: isFocused
            ? "none"
            : `drop-shadow(0 0 60px ${company.accent}cc) drop-shadow(0 8px 20px rgba(0,0,0,0.4))`,
        }}
      />

      {/* Tagline + divider */}
      <div
        style={{
          position: "absolute",
          top: `${LOGO_ROW_TOP}px`,
          left: `${PAD_X + focusedW + 40}px`,
          display: "flex",
          alignItems: "center",
          gap: "40px",
          height: `${focusedH}px`,
          opacity: isFocused ? 1 : 0,
          transition: fadeIn,
        }}
      >
        <span
          style={{
            display: "block",
            width: "1px",
            height: "64px",
            background: "rgba(255, 255, 255, 0.2)",
          }}
        />
        <p
          className="font-semibold leading-tight"
          style={{
            fontSize: "26px",
            color: company.accent,
            maxWidth: "780px",
          }}
        >
          {company.tagline}
        </p>
      </div>

      {/* Four-up details grid */}
      <div
        style={{
          position: "absolute",
          left: PAD_X,
          right: PAD_X,
          top: `${DETAILS_TOP}px`,
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          columnGap: "64px",
          rowGap: "40px",
          opacity: isFocused ? 1 : 0,
          transition: fadeIn,
        }}
      >
        {company.details.map((detail) => (
          <div key={detail.label}>
            <p
              className="font-mono uppercase tracking-eyebrow"
              style={{ fontSize: "13px", color: company.accent }}
            >
              {detail.label}
            </p>
            <p
              style={{
                marginTop: "12px",
                fontSize: "19px",
                lineHeight: 1.4,
                color: "rgba(255, 255, 255, 0.85)",
              }}
            >
              {detail.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================ */
/* Matrix                                                       */
/* ============================================================ */

function MatrixPanel({ visible }: { visible: boolean }) {
  return (
    <article
      className="absolute inset-0 rounded-sm bg-nebula-ink/85 ring-1 ring-nebula-rule"
      style={{
        padding: `${PAD_Y}px ${PAD_X}px`,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(30px)",
        transition:
          "opacity 600ms cubic-bezier(0.4, 0, 0.2, 1) 200ms, transform 700ms cubic-bezier(0.22, 1, 0.36, 1) 200ms",
        pointerEvents: visible ? "auto" : "none",
        zIndex: 20,
      }}
    >
      <span
        aria-hidden
        className="absolute left-0 top-0 h-[3px] w-24 bg-nebula-gold"
      />

      <p className="font-mono text-[16px] uppercase tracking-eyebrow text-nebula-gold">
        გლობალური ეტალონები · შედარების მატრიცა
      </p>
      <h1 className="mt-4 font-sans text-[42px] font-semibold leading-[1.1] tracking-tight text-white">
        რას ემატება ShopIt
      </h1>

      <table className="mt-10 w-full border-collapse text-[15px]">
        <thead>
          <tr className="border-b border-nebula-rule">
            <th className="py-4 pr-4 text-left font-mono text-[12px] uppercase tracking-eyebrow text-white/45">
              შედარების განზომილება
            </th>
            {COMPANIES.map((company) => (
              <th key={company.id} className="py-4 pr-4 text-left">
                <img
                  src={company.logo}
                  alt={company.name}
                  style={{
                    display: "block",
                    height: "24px",
                    width: `${24 * company.logoAspect}px`,
                  }}
                />
              </th>
            ))}
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
              <td className="py-4 pr-4 text-[15px] text-white/65">
                {row.label}
              </td>
              <td className="py-4 pr-4 text-[16px] text-white/80">
                {row.shopify}
              </td>
              <td className="py-4 pr-4 text-[16px] text-white/80">
                {row.wix}
              </td>
              <td className="py-4 pr-4 text-[16px] text-white/80">
                {row.woo}
              </td>
              <td className="py-4 pr-4 text-[16px] font-medium text-white">
                {row.shopit}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </article>
  );
}
