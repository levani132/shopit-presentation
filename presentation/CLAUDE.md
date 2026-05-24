# Project context for future Claude sessions

This file is the handoff document. Read it before doing anything in this repo. The user is **Levan Beroshvili** (Free University of Tbilisi, MBA22). The deliverable is an interactive presentation of his **ShopIt** MBA thesis (a digital commerce platform / business plan, written in Georgian). The source thesis PDF sits in the parent folder: `../ბეროშვილი_ლევან_MBA22_სამაგისტრო_ShopIt.pdf`.

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

## Slide content (sample, Georgian, ShopIt-themed)

Three sample slides exist as placeholders. We will eventually port real content from the thesis PDF.

1. **TitleSlide** (`id: "title"`) — FreeUniMark in corner, big serif "ShopIt", subtitle "ციფრული კომერციის პლატფორმა — ბიზნეს გეგმა", author/supervisor/year/city grid.
2. **MarketSlide** (`id: "market"`) — competitive landscape: Instagram/Facebook shops, MyMarket/Extra/Veli, Shopify/Wix/WooCommerce.
3. **ArchitectureSlide** (`id: "architecture"`) — three numbered components: მაღაზიის შემქმნელი / კურიერების მარკეტპლეისი / დამატებითი მოდულები. Staggered fade-in animation is the in-slide animation demo.

Registry mapping `slide.id → ComponentType` is in `src/presentation/slides/index.ts`. Adding a slide = create component file → register → add config entry.

Current slide positions:

| id | position | linePoint | corner |
|----|----------|-----------|--------|
| title | (0, 0, 0) | (-5.5, 3, 0) | TL |
| market | (16, -3.5, 0) | (21.5, -6.5, 0) | BR |
| architecture | (32, 2.5, 0) | (37.5, 5.5, 0) | TR |

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

1. User requested the app. I scaffolded Vite + R3F + GSAP + Tailwind with the original 3D camera flying through stars. First render had a giant cyan blob (arrow at wrong scale), a thin line clipping the corner, and "too AI" purple-cyan glass cards.
2. User asked to: pivot to a 2D-feeling layout (camera looks straight down), make path white + thin arrow, make slides ~2/3 viewport, drop the AI-website aesthetic, use Free Uni yellow only where it makes sense, add a Free Uni-style wordmark. I did all of that — current state above.
3. User reported the line only shows in a small corner. **(THIS IS THE CURRENT OPEN ITEM.)** Then asked me to write this handoff.

## When you pick this up

1. The corner-clipping line issue is resolved (see section above). If the user wants more — e.g., the line wandering even further across the viewport, or in-slide arrow progression — escalate to the two-point-per-slide model.
2. Real ShopIt thesis content still needs porting in from `../ბეროშვილი_ლევან_MBA22_სამაგისტრო_ShopIt.pdf`. Only three sample slides exist.
3. The static `.pptx` mirror of the deck has not been started.
4. Always ask via `AskUserQuestion` before doing real work; the user wants clarifying questions for anything non-trivial.
5. Run `tsc --noEmit` after any config/curve change (local `node_modules/.bin/tsc` works in this sandbox — confirmed).
6. Don't make the line yellow. Don't bring back glass morphism. Don't reintroduce pills as visual chips.
