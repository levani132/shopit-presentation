import type { SlideConfig } from "./types";

/**
 * Ordered list of slides.
 *
 * Coordinate system: the slide plane is z = 0; the camera floats above
 * (z = 8) and looks straight down. With the default 50° FOV that means
 * each slide's visible area spans roughly:
 *
 *   horizontal: ~13 world units (e.g., -6.5 → +6.5 around `position`)
 *   vertical:   ~7.5 world units (e.g., -3.7 → +3.7 around `position`)
 *
 * Two coordinates per slide:
 *
 *   `position` — center of the slide content (drei <Html> anchors here, so
 *                the card ends up centered on screen).
 *   `linePoint` — where the visible white line passes through for this
 *                slide. The arrow stops here when the slide is active. We
 *                alternate corners (TL → BR → TR → BR) so the curve between
 *                consecutive linePoints sweeps diagonally across each
 *                slide's visible viewport instead of clipping along the
 *                top edge.
 *
 * Per-slide viewport bounds (x ± 6.5, y ± 3.7 around `position`):
 *
 *   title              x ∈ [ -6.5,   6.5]   y ∈ [-3.7,  3.7]
 *   problem            x ∈ [  9.5,  22.5]   y ∈ [-7.2,  0.2]
 *   demo               x ∈ [ 25.5,  38.5]   y ∈ [-1.2,  6.2]
 *   marketOpportunity  x ∈ [ 41.5,  54.5]   y ∈ [-7.2,  0.2]
 *
 * Each linePoint sits ~1 unit inside the chosen corner so the arrow has
 * breathing room from the screen edge.
 */
export const slidesConfig: readonly SlideConfig[] = [
  {
    id: "title",
    label: "ShopIt — შესავალი",
    position: [0, 0, 0],
    // Top-left of slide 0 — line exits diagonally toward bottom-right.
    linePoint: [-5.5, 3, 0],
  },
  {
    id: "problem",
    label: "პრობლემა · ინფრასტრუქტურა vs დიფერენციაცია",
    position: [16, -3.5, 0],
    // Bottom-right — incoming chord sweeps from upper-left of the
    // viewport down to this corner, then leaves toward slide 2's TR.
    linePoint: [21.5, -6.5, 0],
  },
  {
    id: "demo",
    label: "დემო · მაღაზია წუთებში",
    position: [32, 2.5, 0],
    // Top-right — incoming chord enters from the bottom-left area of
    // the viewport and rises diagonally to this corner.
    linePoint: [37.5, 5.5, 0],
    transition: { durationSec: 2.6 },
  },
  {
    id: "marketOpportunity",
    label: "ბაზრის შესაძლებლობა · 600 გამყიდველი",
    position: [48, -3.5, 0],
    // Bottom-right again — keeps the curve sweeping diagonally rather
    // than running along a horizontal axis.
    linePoint: [53.5, -6.5, 0],
  },
  {
    id: "foreignBenchmarks",
    label: "გლობალური ეტალონები · Shopify · Wix · Woo",
    position: [64, 2.5, 0],
    // Top-right — diagonal sweep coming up from slide 4's bottom-right.
    linePoint: [69.5, 5.5, 0],
    transition: { durationSec: 2.6 },
  },
  {
    id: "localCompetitors",
    label: "ლოკალური კონკურენტული ლანდშაფტი",
    position: [80, -3.5, 0],
    // Bottom-right — continues the diagonal alternation from slide 4's
    // TR linePoint, so the line sweeps top-right → bottom-right across
    // this slide's viewport.
    linePoint: [85.5, -6.5, 0],
    transition: { durationSec: 2.6 },
  },
  {
    id: "sellerFindings",
    label: "კვლევის შედეგები · გამყიდველები",
    position: [96, 2.5, 0],
    // Top-right — alternates back from localCompetitors' BR corner so the
    // chord between them sweeps diagonally across both viewports.
    // (Narratively this is deck slide 7; deck slide 6 — Research
    // Methodology — is still PENDING and will be inserted ahead of this
    // entry when built.)
    linePoint: [101.5, 5.5, 0],
    transition: { durationSec: 2.6 },
  },
];
