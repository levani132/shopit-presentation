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
    id: "researchMethodology",
    label: "კვლევის მეთოდოლოგია · გამყიდველები & კურიერები",
    position: [96, 2.5, 0],
    // Top-right — alternates back from localCompetitors' BR corner so the
    // chord between them sweeps diagonally across both viewports.
    linePoint: [101.5, 5.5, 0],
    transition: { durationSec: 2.6 },
  },
  {
    id: "sellerFindings",
    label: "კვლევის შედეგები · გამყიდველები",
    position: [112, -3.5, 0],
    // Bottom-right — continues the diagonal alternation from
    // researchMethodology's TR corner.
    linePoint: [117.5, -6.5, 0],
    transition: { durationSec: 2.6 },
  },
  {
    id: "solution",
    label: "გადაწყვეტა · ShopIt-ის სამი ფენა",
    position: [128, 2.5, 0],
    // Top-right — alternates back from sellerFindings' BR corner so the
    // chord between them sweeps diagonally across both viewports.
    linePoint: [133.5, 5.5, 0],
    transition: { durationSec: 2.6 },
  },
  {
    id: "paymentsRoadmap",
    label: "გადახდის ინფრასტრუქტურა · ფაზობრივი მოდელი",
    position: [144, -3.5, 0],
    // Bottom-right — continues the diagonal alternation from solution's
    // TR corner.
    linePoint: [149.5, -6.5, 0],
    transition: { durationSec: 2.6 },
  },
  {
    id: "logistics",
    label: "მიწოდება · კურიერების მარკეტპლეისი",
    position: [160, 2.5, 0],
    // Top-right — alternates back from paymentsRoadmap's BR corner.
    linePoint: [165.5, 5.5, 0],
    transition: { durationSec: 2.6 },
  },
  {
    id: "pricing",
    label: "ფასწარმოქმნა · ოთხი დონე, ერთი მონეტიზაცია",
    position: [176, -3.5, 0],
    // Bottom-right — continues the diagonal alternation from logistics'
    // TR corner. Card centres at (176, -3.5); the line sweeps from the
    // upper-left of this viewport down to the BR corner.
    linePoint: [181.5, -6.5, 0],
    transition: { durationSec: 2.6 },
  },
  {
    id: "growth",
    label: "ზრდის ფაზები · MVP → Expansion → Scale",
    position: [192, 2.5, 0],
    // Top-right — alternates back from pricing's BR corner.
    linePoint: [197.5, 5.5, 0],
    transition: { durationSec: 2.6 },
  },
  {
    id: "unitEconomics",
    label: "ერთეულის ეკონომიკა · CAC · LTV · Break-even",
    position: [208, -3.5, 0],
    // Bottom-right — continues the diagonal alternation from growth's
    // TR corner.
    linePoint: [213.5, -6.5, 0],
    transition: { durationSec: 2.6 },
  },
  {
    id: "marketing",
    label: "მარკეტინგი · B2B + B2B2C",
    position: [224, 2.5, 0],
    // Top-right — alternates back from unitEconomics' BR corner.
    linePoint: [229.5, 5.5, 0],
    transition: { durationSec: 2.6 },
  },
  {
    id: "team",
    label: "გუნდი · სამი თანადამფუძნებელი",
    position: [240, -3.5, 0],
    // Bottom-right — continues the diagonal alternation from marketing's
    // TR corner.
    linePoint: [245.5, -6.5, 0],
    transition: { durationSec: 2.6 },
  },
  {
    id: "conclusions",
    label: "დასკვნა · მადლობა · კითხვები?",
    position: [256, 2.5, 0],
    // Top-right — alternates back from team's BR corner. Final slide of
    // the deck — closes on the thank-you / Q&A screen.
    linePoint: [261.5, 5.5, 0],
    transition: { durationSec: 2.6 },
  },
];
