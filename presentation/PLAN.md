# ShopIt thesis presentation — slide-by-slide build plan

> Sister document to `CLAUDE.md`. Read CLAUDE.md first for the architecture and visual language; this file is the *content* roadmap and is meant to be picked up by parallel AI sessions, one slide at a time.

The deliverable is a 20-minute thesis defense talk (+10 min Q&A) for **Levan Beroshvili / MBA22 / Free University of Tbilisi**. Topic: **ShopIt** — a Georgian digital commerce platform. The thesis PDF (Georgian, 73 pages) sits at `../ბეროშვილი_ლევან_MBA22_სამაგისტრო_ShopIt.pdf` — primary source of truth for any numbers or claims.

---

## 1. Hard rules (do not break)

1. **Language**: all slide content is in **Georgian only**. No English copy on slides except brand names (Shopify, Wix, WooCommerce, Keepz, ShopIt) and acronyms (SaaS, TAM/SAM/SOM, ARPU, CAC, LTV).
2. **Tone**: academic-first, MBA thesis defense. Pitch-style visual flourishes are OK but the *register of the prose* must be third person and impersonal. Never write "თქვენ", "შენ", or other second-person address. Phrases like "გამყიდველი იღებს" (the seller receives) instead of "თქვენ მიიღებთ" (you receive).
3. **Visual system**: editorial-thesis, defined in `CLAUDE.md` under "Visual language". Deep nebula background, Free Uni gold (`#f5c518`) used *only* as accent, white path/arrow, IBM Plex Sans Georgian + Fraunces (serif, title slide only) + IBM Plex Mono (eyebrows/labels). No glass morphism, no rounded pill chips.
4. **Sub-step reveals advance on `next`-press, not on a timer**. Use `useSlideSteps(n)` from `@/navigation/SlideNavigationContext` (see §3).
5. **No emojis anywhere** in slide content or commits.
6. **TypeScript strict**. Run `npx tsc --noEmit` after every change.

---

## 2. Quick start for a parallel AI session

A typical session goes:

1. Read `CLAUDE.md` (architecture) + this file (`PLAN.md`).
2. **Claim a slide.** Look at the status table in §6. Pick a slide marked `PENDING` (not `IN PROGRESS` and not `DONE`). Edit §6 in this file: flip that slide's status from `PENDING` to `IN PROGRESS · <short label>` where `<short label>` is something the user will recognise (e.g. `IN PROGRESS · session-A`, or the time you started, or "Claude #2"). **Save this file before doing anything else.** That single-line edit is the lock — another session opening the file will see the slide is taken.
3. **Use `AskUserQuestion` to confirm** the slide brief and any open questions before writing code. (The brief in §6 is a starting point, not gospel.)
4. Implement the slide as a new component under `src/presentation/slides/<Name>Slide.tsx`. **Do not** touch any other slide's `.tsx` file unless explicitly fixing a cross-slide bug — those belong to whoever claimed them.
5. Register it: add to `src/presentation/slides/index.ts` and add a config entry in `src/presentation/slides.config.ts` (slot in a sensible position + linePoint — see §4.1). These two files are the *only* shared edit points; keep your edits to a single appended entry in each so simultaneous sessions just append additional rows without conflict. Never reorder existing entries.
6. Run `npx tsc --noEmit` from `presentation/` until clean. Walk through the verification checklist in §8.
7. Commit with a message of the form `slide N: <one-line summary>`.
8. Flip the slide's status to `DONE` in §6 and save this file.

### 2.1 Status vocabulary

The §6 table uses three states. Only these three — anything else means a session crashed mid-edit:

- `PENDING` — not claimed, free to take.
- `IN PROGRESS · <label>` — actively being worked on. Other sessions: skip it. If a slide has been `IN PROGRESS` for an obviously stale time (the user will tell you), ask Levan before reclaiming.
- `DONE` — shipped, registered, typechecked, on disk.

### 2.2 Shared-file etiquette

`slides.config.ts` and `slides/index.ts` are the two merge hotspots. Rules:

- **Append, don't reorder.** Add your slide's entry at the end of `slidesConfig` (or in the position the user agreed to during the AskUserQuestion exchange — but if so, mention in chat that you're inserting mid-array so the user can coordinate with other sessions).
- **One entry per slide.** Never edit two slides' rows in a single commit.
- **`linePoint` math is mechanical** — see §4.1, just continue the diagonal alternation. No creative choices needed here.
- If you hit a merge conflict on these files anyway, prefer the more recent edit and re-add yours on top; do not silently drop another session's slide entry.

---

## 3. Architectural primitives every slide uses

### 3.1 `SlideCard`
`src/ui/SlideCard.tsx`. Wraps slide body content with the dark panel + gold rule chrome. Variants:
- `md` — `w-[min(1100px,76vw)] min-h-[72vh]`
- `lg` — `w-[min(1400px,84vw)] min-h-[78vh]` (default for most)
- `xl` — `w-[min(1500px,88vw)] min-h-[88vh]` (full-bleed, used by DemoSlide for the video)

`<SlideCard size="lg" eyebrow="..."><Body /></SlideCard>`. The eyebrow renders as a gold uppercase mono label above the content; omit it if your slide needs to render its own eyebrow inside a custom layout.

### 3.2 `useSlideSteps`
`src/navigation/SlideNavigationContext.tsx`. Used inside a slide body:

```ts
const step = useSlideSteps(3); // declare 3 sub-steps
// step is 0, 1, or 2. Increments only when the slide is active AND user presses Next.
```

Rules:
- Inactive slides see `step === 0` (so they show their initial state when previewed off-screen).
- The user steps through 0 → 1 → 2; next-press from the final step advances to the next slide.
- Use `step >= 1`, `step === 2`, etc. to gate reveals inside the JSX.

### 3.3 Pattern: state-driven entry animations
CSS `animation:` shorthand applied conditionally tends to fight with explicit `transform:` styles. The robust pattern is React state + `setTimeout`:

```tsx
const [entered, setEntered] = useState(false);
useEffect(() => {
  if (active) {
    const t = setTimeout(() => setEntered(true), 260);
    return () => clearTimeout(t);
  }
}, [active]);

<div style={{
  opacity: entered ? 1 : 0,
  transform: entered ? "translateX(0)" : "translateX(-40px)",
  transition: "opacity 600ms ease, transform 600ms cubic-bezier(0.22, 1, 0.36, 1)",
}}>
```

Use this when an entry animation needs to combine with later transforms (focus zooms, splits). Avoid `animate-fade-in-up` when you also need to drive a `transform` from state.

### 3.4 Pattern: zoom into a tile (slide 4 reference)
See `ForeignBenchmarksSlide.tsx`. The whole "world" (chrome + content + tiles) is one element with one transform: `translate(dx%, dy%) scale(S)` where `dx, dy` are computed to bring the focused tile's centre to the viewport centre after scaling. Origin is `50% 50%`. Mini tile content is rendered at native size and shrunk with `transform: scale(1/S)` inside a smaller wrapper, so when the world scales by `S` it cancels out and the tile content reads at native size.

**Do not put any chrome outside the scaling element.** If you wrap with `SlideCard`, the SlideCard chrome will NOT scale and the illusion breaks. Render your own chrome inside the scaling element instead (it's just `bg-nebula-ink/85 ring-1 ring-nebula-rule rounded-sm` + a gold rule span).

### 3.5 Pitfalls already fixed (do not regress)
- **R3F context bridge**: `useSlideSteps` would throw "must be used inside SlideStage" because drei `<Html>` creates a fresh React root that doesn't inherit context. Both `Presentation.tsx` and `SlideStage.tsx` now re-provide `SlideNavigationContext` across the Canvas / Html boundaries. Don't undo those bridges.
- **CSS animation overriding inline transform**: `animation: fadeInUp 700ms both` preserves `transform: translateY(0)` after the run, which silently overrides an inline `transform: translate(...)`. Prefer state-driven entry (§3.3) when both an entry and a later transform are needed.
- **Crisp video crop**: `transform: scale(1.1)` with `transformOrigin: "top left"` is the right way to hide the right-side scrollbar of a full-bleed video without bleeding the top. `object-cover` and `width: 108%` do not solve it.

---

## 4. File / config map

### 4.1 `slides.config.ts`
Each entry sets `position` (where the camera centres the slide card) and `linePoint` (where the white path passes for this slide). LinePoints alternate corners (TL → BR → TR → BR) so segments sweep diagonally across each viewport. Coordinates use the world-units system described in CLAUDE.md.

Currently configured slides:
| idx | id | position | linePoint | status |
|---|---|---|---|---|
| 0 | `title` | `(0, 0, 0)` | `(-5.5, 3, 0)` TL | DONE |
| 1 | `problem` | `(16, -3.5, 0)` | `(21.5, -6.5, 0)` BR | DONE |
| 2 | `demo` | `(32, 2.5, 0)` | `(37.5, 5.5, 0)` TR | DONE |
| 3 | `marketOpportunity` | `(48, -3.5, 0)` | `(53.5, -6.5, 0)` BR | DONE |
| 4 | `foreignBenchmarks` | `(64, 2.5, 0)` | `(69.5, 5.5, 0)` TR | DONE |

When adding a new slide, continue the diagonal pattern: alternate y between `-3.5` (with linePoint BR `(*+5.5, -6.5, 0)`) and `+2.5` (with linePoint TR `(*+5.5, +5.5, 0)`), advancing x by **+16** each time.

### 4.2 `slides/index.ts`
Single source of truth for the `slide.id → ComponentType` map. Register new slides here.

### 4.3 `public/` assets already in place
- `/icon-1024x1024.png` — ShopIt mark (used on title slide)
- `/logos/shopify.svg`, `/logos/wix.svg` (recoloured white), `/logos/woocommerce.svg`
- `/demo.mov` — 3456×1994 product demo video (used on slide 2)
- `/demo-music.mp3` — background music for demo

---

## 5. Overall narrative arc

| act | slides | beat |
|---|---|---|
| I. Setup | 0–1 | who, what, why this matters |
| II. Solution | 2 | the product, live |
| III. Market | 3–5 | how big, against whom |
| IV. Evidence | 6–7 | qualitative research, demand signal |
| V. Build | 8–10 | what ShopIt provides (product, payments, logistics) |
| VI. Business | 11–14 | pricing, growth plan, unit economics, GTM |
| VII. Close | 15–16 | team, conclusions, Q&A |

Total runtime target: ~20 minutes presenting + 10 minutes Q&A.

---

## 6. Slide-by-slide briefs

> Status on each heading is the lock. To claim a slide, edit its `**PENDING**` to `**IN PROGRESS · <your label>**` and save *before* touching any other file. Flip to `**DONE**` only after §8's checklist passes.

### Slide 0 — Title · `TitleSlide` · **DONE**
ShopIt wordmark + serif "ciფრული კომერციის პლატფორმა — ბიზნეს გეგმა" + author / supervisor / year / city chrome. Free Uni gold vertical mark.

### Slide 1 — Problem · `ProblemSlide` · **DONE**
Three-step reveal:
1. Single column of 7 pain points
2. Split into **infrastructure** (3, dimmed, left) vs **differentiation** (4, full opacity, right)
3. Tagline appears: *infrastructure ≠ differentiator*

Academic third-person Georgian throughout. Locked container size on all steps.

### Slide 2 — Demo · `DemoSlide` · **DONE**
Full-bleed product demo video (size="xl" SlideCard, transform: scale(1.1) origin top-left to crop right-side scrollbar). Eyebrow hidden during playback, re-appears in transparent outro. `demo-music.mp3` plays in the background.

### Slide 3 — Market opportunity · `MarketOpportunitySlide` · **DONE**
TAM / SAM / SOM funnel, top-down. Focal number "600" sellers at 160px. SOM at 1% of SAM (note: previously had 5%, corrected to 1%).

### Slide 4 — Foreign benchmarks · `ForeignBenchmarksSlide` · **DONE**
Five-step camera zoom into mini company slides (Shopify → Wix → Woo), then comparison matrix. The whole world (card chrome + content + tiles) is one scaling element. Each mini tile is a `transform: scale(0.25)` of a full company slide; zooming the world by 4× cancels the shrink and reveals the company's slide at native size. See §3.4.

---

### Slide 5 — Local competitors · `LocalCompetitorsSlide` · **IN PROGRESS · local-competitors-3d**

**Goal**: position ShopIt against the *Georgian* alternatives (social-only sellers + horizontal marketplaces).

**Content brief**:
- Eyebrow: `ლოკალური კონკურენტული ლანდშაფტი · 05`
- Heading: `ვინ ჰქმნის სავაჭრო გვერდს დღეს — და რა ხარვეზებით`
- Three competitor tiers, depth-arranged front-to-back:
  1. **სოციალური სავაჭრო გვერდები** — Instagram, Facebook. Largest share. Strengths: zero cost, native audience. Gaps: no checkout, no inventory, manual fulfilment, no analytics.
  2. **ჰორიზონტალური მარკეტპლეისები** — MyMarket, Extra.ge, Veli.store. Strengths: traffic, payment rails. Gaps: 10–25% commission, no brand identity, generic listing layout, vendor sees no customer data.
  3. **საერთაშორისო პლატფორმები** — Shopify, Wix, WooCommerce (call back to slide 4). Strengths: full SaaS, professional. Gaps: no Georgian payments, no Georgian couriers, monthly subscription in USD.

**Visual treatment** (suggested):
- Three horizontally-arranged cards, but tilted/staggered so the foreground tier (social) feels closer to the camera and the background tier (international) feels furthest. CSS `transform: perspective(...) translateZ(...) rotate(...)`.
- Sub-step reveal: step 0 = social only (foreground), step 1 = + marketplaces (middle), step 2 = + international (back), step 3 = ShopIt slot revealed (a callout that fits all three slots).
- Accent colour per tier (e.g., warm pink for social, blue for marketplaces, purple for international).

**Required data**: rough share of seller activity per tier — pull from thesis pp. 12–18 if cited.

---

### Slide 6 — Research methodology · `ResearchMethodologySlide` · **IN PROGRESS · research-methodology**

**Goal**: establish the empirical grounding of the thesis. This is the slide a thesis committee will examine closely.

**Content brief**:
- Eyebrow: `კვლევის მეთოდოლოგია · 06`
- Heading: `ვისგან მოვისმინეთ — და როგორ`
- Two parallel research tracks:
  1. **გამყიდველთა ინტერვიუები · N = 12** — small-to-medium Georgian sellers across categories (fashion, beauty, food, handmade, electronics). Semi-structured, 30–45 min each. Topics: current channels, fulfilment, payments, customer relationships, what's missing.
  2. **კურიერთა ინტერვიუები · N = 10** — Tbilisi-based couriers across independents and platform-affiliated. Topics: order volume, pricing per delivery, idle time, willingness to join a marketplace.
- Sampling notes: convenience + snowball; geographic concentration in Tbilisi.
- Analysis: thematic coding, frequency tagging.

**Visual treatment**:
- Two columns, each headed by a big number (`12`, `10`) in Fraunces.
- Below each: 4–5 short bullets describing sample profile, method, duration, analysis.
- A small footnote rule with limitations: sample size, geographic bias, self-reported data.
- Optional: a row of mini avatar dots representing each interviewee (12 dots + 10 dots) — purely visual.

---

### Slide 7 — Seller research findings · `SellerFindingsSlide` · **DONE**

**Goal**: turn the seller interviews into evidence that the problem is real and shaped the way ShopIt thinks.

**Content brief**:
- Eyebrow: `კვლევის შედეგები · გამყიდველები · 07`
- Heading: `რა გვითხრეს გამყიდველებმა`
- 3–4 headline findings, each with the **% of interviewees** that flagged it:
  - `83%` — სოციალურ ქსელებში მართვა მტკივნეულია (DM-ებში დაკარგვა, fulfilment ხელით)
  - `75%` — ფასიანი მარკეტპლეისები არცერთს არ აძლევს მომხმარებლის მონაცემს
  - `67%` — ლოკალური გადახდის ინტეგრაცია მონდომებულია (TBC/BoG-ის API-ები)
  - `58%` — საკუთარი მაღაზიის გვერდი — საჭიროა, მაგრამ ვის ვუთხრა გავაკეთოს?

**Visual treatment**:
- Animated bar chart or radial chart (pie). Each finding is a wedge/bar that fills in on its own sub-step.
- 4 sub-steps: each next-press reveals one more finding.
- Big % numbers in Fraunces or IBM Plex Sans semibold; short Georgian quote/description below each.
- Optionally include 1–2 verbatim quotes (anonymised) styled as small block quotes.

**Required data**: exact percentages — must come from the thesis. If unknown, ask Levan.

---

### Slide 8 — Solution overview · `SolutionSlide` · **PENDING**

**Goal**: introduce the *product* of ShopIt — what it concretely is.

**Content brief**:
- Eyebrow: `გადაწყვეტა · 08`
- Heading: `ShopIt — ერთიანი ლოკალური კომერციული ინფრასტრუქტურა`
- Three-pillar layout:
  1. **მაღაზიის ამწყობი** — no-code builder, Georgian-first templates, mobile-first, instant publish.
  2. **დეველოპერთა მარკეტპლეისი** — directory of vetted Georgian devs/designers who can extend/customise. Marketplace fee, not subscription.
  3. **ლოკალური მოდულები** — Keepz/banks payments, courier marketplace (see slide 10), Georgian SMS/email, Geo-language receipts/invoices.

**Visual treatment**:
- Three numbered cards in a row, each with a short eyebrow, a one-line claim, and 2–3 supporting bullets.
- Sub-step reveal: each press brings in the next pillar.

---

### Slide 9 — Payments roadmap · `PaymentsRoadmapSlide` · **PENDING**

**Goal**: explain the payments stack — MVP with Keepz, then banks.

**Content brief**:
- Eyebrow: `გადახდის ინფრასტრუქტურა · 09`
- Heading: `როგორ იღებს გამყიდველი თანხას`
- Horizontal roadmap with 3 phases:
  1. **MVP · Keepz** — single integration, fast launch, modest take rate. Why: Keepz already aggregates BoG + TBC + Liberty.
  2. **Phase 2 · ბანკების პირდაპირი ინტეგრაცია** — TBC, BoG. Lower per-transaction cost. Requires PCI / KYC compliance.
  3. **Phase 3 · ფინანსური სერვისები** — split payments to vendors, escrow for marketplace orders, instalments via partner banks.

**Visual treatment**:
- Timeline-style horizontal flow with three nodes; gold rule connects them. Each node fades in on next-press.
- Below the timeline: a small "current MVP" callout matching phase 1.

---

### Slide 10 — Logistics · `LogisticsSlide` · **PENDING**

**Goal**: present the courier marketplace based on courier-side research and three delivery models combined.

**Content brief**:
- Eyebrow: `მიწოდება · 10`
- Heading: `კურიერების მარკეტპლეისი — სამი მოდელის შერწყმა`
- Brief courier research finding: average idle time, price elasticity, willingness to multi-platform (from §6 N=10 interviews).
- Three merged models:
  1. **მოთხოვნაზე დაფუძნებული** (on-demand): single order, courier picks up within ~30 min.
  2. **დაჯგუფებული მარშრუტი** (route batching): multiple orders bundled into one route — lower cost per drop.
  3. **დაგეგმილი** (scheduled): seller's daily fulfilment window; the cheapest tier.
- Seller picks model per order; courier sees only the queue that matches their preference.

**Visual treatment**:
- 3 stacked rows (one per model), each with an icon-like glyph (don't use real icons — use abstract dots/lines) and 2-line description.
- Sub-step: 0 = research finding, 1–3 = each model in sequence, 4 = "all three on one platform" callout.

---

### Slide 11 — Pricing & ARPU · `PricingSlide` · **PENDING**

**Goal**: tiered pricing + Average Revenue Per User assumption.

**Content brief**:
- Eyebrow: `ფასწარმოქმნა · 11`
- Heading: `სამი დონე, ერთი მონეტიზაცია`
- Three tiers in a row:
  1. **Free** — store builder + courier marketplace, paid only via courier markup. Target: starters.
  2. **Pro · 49 ₾/თვე** — branded domain, advanced analytics, marketing tools. Target: established small sellers.
  3. **Managed · 199 ₾/თვე + setup** — agency-led store, custom theme, dedicated support. Target: serious SMBs.
- ARPU assumption: weighted average across tiers — confirm number from thesis.

**Visual treatment**:
- Three pricing cards side-by-side. Middle (Pro) highlighted as default recommendation.
- Sub-step reveal of each card; final step reveals ARPU calculation below.

---

### Slide 12 — Pilot & phased growth · `GrowthSlide` · **PENDING**

**Goal**: realistic ramp from pilot to 200 sellers.

**Content brief**:
- Eyebrow: `გაშვება და ზრდა · 12`
- Heading: `პილოტიდან ბაზრის წილამდე`
- Three phases:
  1. **პილოტი · 10 გამყიდველი · 0–3 თვე** — invite-only, hand-held onboarding, weekly check-ins, free Pro tier.
  2. **საჯარო Beta · 50 გამყიდველი · 3–9 თვე** — public sign-ups, partner with 1 bank for promo.
  3. **სტაბილური ზრდა · 150–200 გამყიდველი · 9–18 თვე** — paid acquisition + dev marketplace traction.

**Visual treatment**:
- Curve / line chart showing seller count vs months, with the three phases labelled.
- Sub-step reveals phases one at a time.

---

### Slide 13 — Unit economics · `UnitEconomicsSlide` · **PENDING**

**Goal**: defend the business model. CAC, LTV, payback, break-even.

**Content brief**:
- Eyebrow: `ერთეულის ეკონომიკა · 13`
- Heading: `რამდენი ჯდება, რამდენი ბრუნდება`
- Key metrics (numbers must come from thesis):
  - **CAC** ≈ X ₾ (founder-led acquisition phase 1, paid digital phase 2)
  - **ARPU/თვე** ≈ Y ₾ (weighted across tiers + take-rate from couriers/payments)
  - **Gross margin** ≈ Z %
  - **LTV** ≈ W ₾ (assumes K months average retention)
  - **Payback period** ≈ N months
  - **Break-even seller count** at burn ≈ M sellers

**Visual treatment**:
- Two-column: left = costs (CAC), right = revenue (LTV, ARPU). Bottom: payback + break-even highlighted.
- This slide is the most "defense exam" slide. Keep numbers prominent, sources clear.

---

### Slide 14 — Marketing · `MarketingSlide` · **PENDING**

**Goal**: GTM channels — B2B (sellers) and B2B2C (sellers → end customers).

**Content brief**:
- Eyebrow: `მარკეტინგი · 14`
- Heading: `როგორ ვიპოვით პირველ 600 გამყიდველს`
- Two tracks:
  1. **B2B — გამყიდველთა მოპოვება**: Facebook groups for Georgian small business, partnerships with banks (Keepz, TBC), referrals via dev marketplace.
  2. **B2B2C — გამყიდველის მომხმარებლის მიყვანა**: SEO templates, multi-store discovery page (`shop.ge/yourname`), shared retargeting pixel.

**Visual treatment**:
- Two columns. Each track lists 3–4 tactics with a brief "why it works" line.
- Sub-step reveal of each track.

---

### Slide 15 — Team · `TeamSlide` · **PENDING**

**Goal**: who's building this. Tiny by design.

**Content brief**:
- Eyebrow: `გუნდი · 15`
- Heading: `ვინც ააშენებს`
- Team cards:
  - **Levan Beroshvili** (founder) — MBA, [background from thesis].
  - Co-founders / advisors if applicable — confirm with Levan.
- Optional: 2–3 "advisors" or "supporters" lower-tier list.

**Visual treatment**:
- One large card for the founder, smaller cards/list for others.
- Quiet slide — no animation needed beyond entry fade.

---

### Slide 16 — Conclusions, limitations & Q&A · `ConclusionsSlide` · **PENDING**

**Goal**: close the talk. Restate thesis, summarise contribution, acknowledge limitations, open Q&A.

**Content brief**:
- Eyebrow: `დასკვნა · 16`
- Heading: `რას ემატება ShopIt — და რა რჩება გასარკვევი`
- Three blocks:
  1. **წვლილი** (contribution): a synthesised local-first commerce stack; an evidence base from 12 sellers + 10 couriers; a phased growth model that fits Georgian SMB reality.
  2. **შეზღუდვები** (limitations): convenience sample, Tbilisi bias, single-time-point study, no prototype field test yet, payments roadmap depends on bank partnerships outside Levan's control.
  3. **შემდეგი ნაბიჯები** (next steps): pilot with the 10 sellers from §6 sample, A/B price test, expand courier sample to Batumi/Kutaisi.
- Final slide moment: gold "მადლობა" then "კითხვები?" — or a quiet single sentence.

**Visual treatment**:
- 3-column layout for contribution / limitations / next steps. Final step replaces it with a centred "მადლობა" + "კითხვები?" pair.

---

## 7. Speaker notes (separate deliverable)

Not started. Plan: a sibling file `SPEAKER_NOTES.md` with one section per slide containing:
- **Talking-time budget** (roughly 1.5 minutes for slides 1–14, 1 min for 0/15/16).
- **Opening sentence** verbatim in Georgian.
- **Bullet beats** to hit during the slide.
- **Transition sentence** to the next slide.
- **Anticipated questions** (only for slides that invite them — 6, 7, 11, 13).

Build speaker notes only *after* the slide visuals are stable; the visual choices change how the spoken script lands.

---

## 8. Verification checklist before marking a slide DONE

- [ ] `npx tsc --noEmit` clean.
- [ ] Slide registered in `slides/index.ts` and `slides.config.ts`.
- [ ] `linePoint` continues the diagonal alternation (§4.1).
- [ ] All on-screen text is Georgian (except brand names / acronyms).
- [ ] Third-person academic tone — no "თქვენ" / "შენ".
- [ ] Sub-step reveals use `useSlideSteps(n)`, not auto-timers.
- [ ] `Next` from final step advances to the next slide.
- [ ] No emojis, no glass blur, no rounded pill chips.
- [ ] Numbers / claims sourced from the thesis (or flagged in a comment if not yet sourced).
- [ ] Commit message: `slide N: <one-line summary>`.
- [ ] Status flipped to `DONE` in §6.

---

## 9. Open questions for Levan (don't guess — ask)

- Exact percentages for seller research findings (slide 7).
- CAC / LTV / break-even numbers (slide 13).
- ARPU weighted across pricing tiers (slide 11).
- Co-founders / advisors on the team slide (slide 15).
- Should slide 16 end on `მადლობა` + `კითხვები?` or a single quiet sentence?
- After web presentation is stable: build a static `.pptx` mirror (not started).
