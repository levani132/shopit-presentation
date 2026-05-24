# ShopIt Presentation

Interactive space-themed presentation for Levan Beroshvili's MBA magister's project (Free University of Tbilisi, 2026). Built with React + TypeScript + React Three Fiber + GSAP + Tailwind.

## Run locally

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

## Build

```bash
npm run build       # type-checks then bundles to dist/
npm run preview     # serves the production build
npm run typecheck   # tsc --noEmit only
```

## Controls

- `→` / `Space` / `PageDown` — next slide
- `←` / `PageUp` — previous slide
- `Home` / `End` — jump to first / last slide

## Architecture

```
src/
├── main.tsx                         Entry — mounts React root
├── App.tsx                          Composition root
├── index.css                        Tailwind directives + globals
│
├── presentation/                    The presentation feature
│   ├── Presentation.tsx             Composes scene + navigation + overlays
│   ├── types.ts                     Slide config types
│   ├── slides.config.ts             Ordered slide configs (data — easy to edit/reorder)
│   └── slides/                      Per-slide content components
│       ├── TitleSlide.tsx
│       ├── MarketSlide.tsx
│       ├── ArchitectureSlide.tsx
│       └── index.ts                 Registry: slide id → React component
│
├── scene/                           3D primitives
│   ├── SpaceScene.tsx               R3F Canvas + lights + fog
│   ├── Starfield.tsx                Background stars (drei) + parallax dust
│   ├── JourneyPath.tsx              Glowing tube along the journey curve
│   ├── PathArrow.tsx                Arrow head that travels along the curve
│   ├── SlideStage.tsx               drei <Html> wrapper that places a slide in 3D
│   └── CameraRig.tsx                Camera follows curve based on progress
│
├── camera/
│   ├── buildJourneyCurve.ts         CatmullRomCurve3 from slide positions
│   └── useCameraJourney.ts          GSAP-driven progress animation hook
│
├── navigation/
│   ├── SlideNavigationContext.tsx   Provider exposing current index + actions
│   ├── useKeyboardShortcuts.ts      Arrow keys / space / home / end
│   └── NavigationOverlay.tsx        Prev/next, dots, slide N/M, progress bar
│
├── ui/                              Reusable presentation primitives
│   ├── SlideCard.tsx                Glass card frame
│   ├── SlideHeading.tsx
│   ├── BulletList.tsx
│   └── Pill.tsx
│
└── lib/
    └── math.ts                      Tiny helpers (clamp, lerp)
```

### How a slide is defined

A slide is **data + component**: position/transition lives in `slides.config.ts`, the body lives in `slides/`. Adding a slide:

1. Create `slides/MyNewSlide.tsx`.
2. Register it in `slides/index.ts`.
3. Add a config entry in `slides.config.ts` with an `id`, `position`, and `cameraTarget`.

The curve, navigation, and overlays adapt automatically.
