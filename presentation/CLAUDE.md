# Project context for future Claude sessions

This file is the **architecture / conventions** handoff. Read it before doing anything in this repo. For the **slide-by-slide build roadmap** — what content goes on each slide, which slides are still TODO, how to claim one for parallel work — read the sister document `PLAN.md` in this directory.

The user is **Levan Beroshvili** (Free University of Tbilisi, MBA22). The deliverable is an interactive presentation of his **ShopIt** MBA thesis (a digital commerce platform / business plan, written in Georgian). The source thesis PDF sits in the parent folder: `../ბეროშვილი_ლევან_MBA22_სამაგისტრო_ShopIt.pdf`.

> **If you only have time to read one of these two files, read `PLAN.md` — it tells you what to build next.**

## Big-picture goal

A space-themed React webpage that acts like slides, but the "viewpoint" pans through a giant 2D-feeling canvas of stars. Slides are connected by a thin curly white line with a small arrow that follows the line. When the user advances, the camera pans to the next slide and the arrow rides forward along the line. Eventually each slide will have its own in-slide animations and the arrow will also progress within a slide; for now we only do slide-to-slide.

After the website is finished, the user also wants a static .pptx that visually matches but without animations. Not started yet.

## Tech stack (locked in by user)

- React 18 + TypeScript (strict), Vite
- React Three Fiber + @react-three/drei (the 3D layer)
- GSAP (drives camera progress along the curve)
- Tailwind CSS (styling)
- Slides: hybrid model — **data config** for position/transition, **React component** for content body

Install/run:
```bash
cd presentation
npm install
npm run dev          # http://localhost:5173
npm run build        # tsc + vite build
npm run typecheck
```

## Architecture (read before editing)

```
src/
├── main.tsx · App.tsx · index.css · vite-env.d.ts
├── lib/math.ts                          clamp, lerp
├── lib/useFullscreen.ts                 Fullscreen API hook + state
├── ui/                                  shared editorial primitives
│   SlideCard · SlideHeading · BulletList · Pill · FreeUniMark
├── presentation/
│   Presentation.tsx                     orchestrator (provider + view split)
│   types.ts · resolveSlides.ts          SlideConfig + default resolution
│   slides.config.ts                     ordered data — source of truth
│   slides/{TitleSlide,MarketSlide,ArchitectureSlide,index}.tsx
├── scene/                               R3F primitives
│   SpaceScene · Starfield · JourneyPath · PathArrow · CameraRig · SlideStage
├── camera/
│   buildJourneyCurve.ts                 builds TWO curves (see below)
│   useCameraJourney.ts                  GSAP-driven progress (0..N-1)
└── navigation/
    SlideNavigationContext · useKeyboardShortcuts · NavigationOverlay
```

### Coordinate system & the two-curve model — important

The scene LOOKS 2D but is rendered with a 3D R3F camera. Slides live on the `z = 0` plane; the camera floats at `z = 8` and looks **straight down**. With the default 50° FOV that means each slide's visible viewport at `z = 0` spans roughly:

- horizontal: ~13 world units (e.g., −6.5 → +6.5 around the slide's `position`)
- vertical: ~7.5 world units (e.g., −3.7 → +3.7)

There are **two curves**, both indexed by the same continuous `progress` value in `[0, N-1]`:

1. **`cameraCurve`** — Catmull-Rom through each slide's `position`. The camera follows it (x, y) so slide content centers on screen at every stop. Built by `buildJourneyCurves` in `src/camera/buildJourneyCurve.ts`. Consumed by `CameraRig`.
2. **`lineCurve`** — Catmull-Rom through each slide's `linePoint`. This is the **visible white line** that the arrow rides on. Built by the same function. Consumed by `JourneyPath` (tube geometry) + `PathArrow`.

`linePoint` is currently optional in `SlideConfig` and defaults to `position`. We set it explicitly per slide so the arrow ends up in a screen corner rather than on top of the slide card. Each slide also has `lookAt`, `cameraOffset` (default `[0,0,8]`), and `transition`.

### Why split the curves

If the camera followed the line through corners, the slide HTML (anchored to `position`) wouldn't center on screen at each stop. Splitting lets the slide cards always read centered while the line can wander into corners and off-screen.

### Slide rendering

`SlideStage` uses **drei `<Html>` WITHOUT `transform` mode**. That means slide content is projected to screen as fixed-pixel-size HTML overlay, not as a CSS3D 3D plane. As the camera pans, the HTML moves across the screen but stays crisp. There is an opacity fade-out as `progress` moves away from this slide's index, so only adjacent slides are legible.

### Navigation state

`SlideNavigationProvider` owns `currentIndex` + `isTransitioning`. Setting `currentIndex` triggers `useCameraJourney` to start a GSAP tween on `progressRef.current.value` from the current value to the new index. The hook also flips `isTransitioning` so the overlay disables buttons during animation. Keyboard: `→/Space/PageDown` = next, `←/PageUp` = prev, `Home/End` = first/last, `F` = toggle fullscreen.

### Fullscreen / present mode

`src/lib/useFullscreen.ts` is a tiny hook wrapping the HTML5 Fullscreen API on `document.documentElement`. Returns `{ isFullscreen, toggle }` and listens to `fullscreenchange` so the icon stays in sync if the user hits Esc or F11. `NavigationOverlay` renders a fullscreen toggle button at the end of the strip (after a thin vertical divider), with an inline-SVG corner-brackets icon that flips between expand and contract states. `useKeyboardShortcuts` also binds `F` to the toggle, ignoring it when modifier keys are held so Cmd/Ctrl+F still works for browser find.

## Visual language (the user calls out specifically)

The user pushed back hard against the original "AI-website starter pack" look (glass morphism + purple-cyan gradient + Space Grotesk + pill chips). The current direction is editorial-thesis:

- **Background:** deep nebula gradient — `#02020a` → `#0a0d1f`, very subtle warm tint up-right
- **Accent color:** Free University gold `#f5c518` (`nebula.gold`). RESERVED FOR FREE UNI BRANDING ONLY — the user explicitly said the arrow/line should NOT be yellow. Yellow is for the eyebrow rules under titles, the FreeUniMark vertical bar, and the active nav indicator.
- **Line + arrow:** WHITE (`#ffffff`). Line is a very thin tube (`radius: 0.018`). Arrow is a small flat triangle (`ShapeGeometry`, length `0.28`, halfWidth `0.14`).
- **Typography:** IBM Plex Sans Georgian for body/headings (supports both Latin and Georgian glyphs), **Fraunces** (variable serif) for the title-slide hero, IBM Plex Mono for eyebrows / labels / counters.
- **Slide card:** dark panel (`bg-nebula-ink/85`) with thin `ring-nebula-rule`, NO glass blur, slight backdrop-blur OK. A short gold rule at the top-left (`rule-grow` animation) is the only flourish. Eyebrow text uses `font-mono text-[11px] uppercase tracking-eyebrow text-nebula-gold`.
- **Card size:** `lg = w-[min(1400px,87vw)] min-h-[74vh] px-16 py-14` — roughly 3/4 of the viewport each dimension, with breathing room. `md` is the smaller fallback at `w-[min(1100px,80vw)] min-h-[68vh] px-14 py-12`. Bumped up from 2/3 at the user's request; they may want to push further (4/5) later.
- **Bullets:** thin gold horizontal rule before each item (`BulletList`), not filled dots.
- **Pills:** NOT used as rounded chips anymore. The `Pill` component still exists as a small mono label with a gold square marker; use sparingly.
- **Nav strip:** slim editorial bar pinned bottom-center. Active dot is `h-[3px] w-10` gold with a yellow glow shadow; inactive dots are `h-[2px] w-3` dim white.

## Slide content — see `PLAN.md` for the full roadmap

`PLAN.md` lists all 17 slides, their status, and a content brief for each pending one. Built so far (5 of 17):

| idx | id | status | summary |
|---|---|---|---|
| 0 | `title` | DONE | ShopIt wordmark, serif hero, author chrome |
| 1 | `problem` | DONE | 3-step reveal: 7 pains → split infra/diff → tagline |
| 2 | `demo` | DONE | full-bleed product video + outro |
| 3 | `marketOpportunity` | DONE | TAM/SAM/SOM funnel, 600-seller focal |
| 4 | `foreignBenchmarks` | DONE | 5-step camera-zoom into mini Shopify/Wix/Woo slides + matrix |
| 5–16 | various | PENDING | see PLAN.md |

The registry mapping `slide.id → ComponentType` is in `src/presentation/slides/index.ts`. Adding a slide = create component file → register → add config entry. PLAN.md §2 spells out the procedure.

Current slide positions in `slides.config.ts`:

| idx | id | position | linePoint | corner |
|---|---|---|---|---|
| 0 | title | (0, 0, 0) | (-5.5, 3, 0) | TL |
| 1 | problem | (16, -3.5, 0) | (21.5, -6.5, 0) | BR |
| 2 | demo | (32, 2.5, 0) | (37.5, 5.5, 0) | TR |
| 3 | marketOpportunity | (48, -3.5, 0) | (53.5, -6.5, 0) | BR |
| 4 | foreignBenchmarks | (64, 2.5, 0) | (69.5, 5.5, 0) | TR |

When adding a new slide, continue the diagonal alternation: y flips `-3.5` (BR linePoint) and `+2.5` (TR linePoint); x advances by **+16** each slide.

## Sub-step navigation (added since the original handoff)

`SlideNavigationContext` was extended with a `(slideIndex, step)` model. Slides with reveal animations call `useSlideSteps(n)` from inside their body to declare a step count. `Next` increments the step until it's exhausted, then advances the slide; `Prev` symmetrically. Inactive slides see `step === 0`. See `src/navigation/SlideNavigationContext.tsx` and PLAN.md §3.2.

**R3F context bridge**: drei `<Html>` creates a fresh React root that doesn't inherit context. `SlideNavigationContext` is re-provided in two places — inside the Canvas in `Presentation.tsx`, and inside the Html portal in `SlideStage.tsx`. Don't undo either bridge or `useSlideSteps` will throw.

## Slide 4 zoom pattern (reference)

`ForeignBenchmarksSlide.tsx` implements an "iOS-icon-to-app" zoom: the entire world (chrome + content + 3 tiles) is one element with `translate(dx%, dy%) scale(4)` applied, where `dx, dy` are computed so the focused tile's centre lands at the viewport centre after scaling. Mini tiles render the full company slide content at native size and shrink it with `transform: scale(0.25)`; world.scale × mini.shrink = 1, so when zoomed the content reads at native size. **No chrome can live outside the scaling element** — that's why this slide does NOT use `SlideCard`; it renders its own card chrome inside the scaling article. Re-read this pattern before attempting any other zoom-style slide. PLAN.md §3.4 has the gory details.

## Previously open issue — RESOLVED

> "I think line should cover most of the page, it shouldn't be just small corner"

**Resolution (chosen by user: "Vary linePoint corners" approach):** linePoints now alternate across corners in a TL → BR → TR pattern instead of all sitting in the top-left. Catmull-Rom segments between them sweep diagonally across each slide's viewport, so when stopped at any slide the visible line traces a long chord across most of the screen rather than clipping the top edge.

Per-slide viewport bounds (x ± 6.5, y ± 3.7 around `position`):

- title `x ∈ [-6.5, 6.5], y ∈ [-3.7, 3.7]` → linePoint `(-5.5, 3, 0)` sits just inside TL
- market `x ∈ [9.5, 22.5], y ∈ [-7.2, 0.2]` → linePoint `(21.5, -6.5, 0)` sits just inside BR
- architecture `x ∈ [25.5, 38.5], y ∈ [-1.2, 6.2]` → linePoint `(37.5, 5.5, 0)` sits just inside TR

The TL→BR chord sweeps slide 0 diagonally; the same chord enters slide 1 from the upper-left and lands at the BR corner (slide 1 gets the most line because it sees both the incoming TL→BR and a short outgoing segment); the BR→TR chord sweeps slide 2 diagonally from the bottom-left area up to the top-right corner.

Approaches considered but not taken (keep in mind if the user wants more later):

1. **Intermediate control points** between slides so the curve can bow further within each viewport.
2. **Two-point-per-slide (entry + exit)** — proper long-term model. Each slide owns a segment from `lineEntry` to `lineExit`. Best foundation for in-slide arrow progression (which the user mentioned wanting eventually). Touches `SlideConfig`, `slides.config`, and `buildJourneyCurve.ts`.

If the user complains the line is still too short on any slide, jump to option 2.

## User preferences I've learned

- **Always ask via `AskUserQuestion` before doing real work** — they expect clarifying questions for anything non-trivial. They explicitly chose the architecture upfront via multiple-choice.
- **No emojis** anywhere unless requested.
- **Code style:** strict TS, high decomposition, single-responsibility files, "no AI-website starter pack" visuals.
- **Comments:** terse and explain *why*, not *what*. Currently the code is heavily commented because the user said they want "highly understandable and human readable code, high level of decomposition".
- **Don't dump task lists at the user**: TaskCreate/TaskUpdate is fine (it renders nicely in the UI), but in chat replies be concise.
- **When something fails with permission errors in this sandbox** (rm, file ops on the macOS mount), CALL `mcp__cowork__allow_cowork_file_delete` instead of telling the user to do it manually. I missed this once and they (rightly) called it out.
- **The sandbox cannot run `npm run dev`** reliably — vite's native binary may be macOS-only after the user runs `npm install` on their Mac. Use the `/tmp/verify` Linux copy for `tsc --noEmit` + `vite build` verification, and trust the user to run dev themselves.

## Conversation history (compressed)

1. **Scaffold**: Vite + R3F + GSAP + Tailwind. Original look was "too AI" (purple-cyan glass cards) — pivoted to editorial-thesis (deep nebula bg, Free Uni gold accent only, white thin line, no glass morphism, IBM Plex Sans Georgian + Fraunces).
2. **Visual locking**: 2D-feeling camera (looks straight down), thin white arrow on white tube line, slides ~3/4 viewport, ShopItMark + FreeUniMark.
3. **Path corner-clipping**: resolved by alternating linePoints across corners (TL→BR→TR→BR).
4. **Sub-step navigation**: extended `SlideNavigationContext` with a `(slideIndex, step)` model and `useSlideSteps(n)` hook. Required bridging the nav context through the R3F Canvas and inside drei's Html portal.
5. **Slides 0–4 built**: Title, Problem (3-step split), Demo (full-bleed video), Market Opportunity (TAM/SAM/SOM funnel), Foreign Benchmarks (iOS-icon-to-app zoom into mini company slides + comparison matrix). Several rebuilds of slide 4 along the way before the "one-world transform" pattern landed.
6. **Plan handoff**: `PLAN.md` written so parallel AI sessions can pick up slides 5–16 individually.

## When you pick this up

1. **Read `PLAN.md` first.** Pick one PENDING slide, claim it, ask Levan clarifying questions via `AskUserQuestion`, build it, verify, commit, mark DONE.
2. Numbers / claims that aren't in the slide brief must come from the thesis PDF (`../ბეროშვილი_ლევან_MBA22_სამაგისტრო_ShopIt.pdf`) or be asked of Levan directly. Don't fabricate.
3. The static `.pptx` mirror of the deck has not been started. Build it only after web is stable.
4. Always ask via `AskUserQuestion` before doing real work — Levan expects clarifying questions for anything non-trivial.
5. Run `npx tsc --noEmit` after any change (local `node_modules/.bin/tsc` works in this sandbox).
6. Hard "no"s: no yellow line/arrow, no glass morphism, no rounded pill chips, no emojis, no second-person Georgian ("თქვენ"/"შენ").
