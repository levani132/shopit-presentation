import type { ReactNode } from "react";
import { useFullscreen } from "@/lib/useFullscreen";
import { useSlideNavigation } from "./SlideNavigationContext";

/**
 * Editorial navigation strip: monospaced counter, thin gold rule, prev/next,
 * plus a fullscreen toggle that turns the page into an actual presentation.
 * Anchored bottom center, kept narrow so it never competes with slides.
 */
export function NavigationOverlay() {
  const {
    slides,
    currentIndex,
    currentStep,
    currentStepCount,
    goTo,
    goNext,
    goPrev,
    isTransitioning,
  } = useSlideNavigation();
  const { isFullscreen, toggle: toggleFullscreen } = useFullscreen();

  const total = slides.length;
  const atStart = currentIndex === 0 && currentStep === 0;
  const atEnd =
    currentIndex === total - 1 && currentStep === currentStepCount - 1;
  const hasSubSteps = currentStepCount > 1;

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 flex justify-center p-6">
      <div className="pointer-events-auto flex items-center gap-5 bg-nebula-ink/85 px-5 py-2.5 ring-1 ring-nebula-rule backdrop-blur-[6px]">
        <NavButton
          label="Previous slide"
          onClick={goPrev}
          disabled={atStart || isTransitioning}
        >
          ←
        </NavButton>

        <div className="flex items-center gap-2.5">
          {slides.map((slide, idx) => (
            <Dot
              key={slide.id}
              label={slide.label}
              active={idx === currentIndex}
              onClick={() => goTo(idx)}
              disabled={isTransitioning && idx !== currentIndex}
            />
          ))}
        </div>

        <span className="font-mono text-[11px] tracking-eyebrow tabular-nums text-white/70">
          {String(currentIndex + 1).padStart(2, "0")}
          <span className="px-1 text-white/35">/</span>
          {String(total).padStart(2, "0")}
          {hasSubSteps ? (
            <>
              <span className="px-2 text-white/35">·</span>
              <span className="text-nebula-gold">
                {currentStep + 1}
              </span>
              <span className="px-1 text-white/35">/</span>
              {currentStepCount}
            </>
          ) : null}
        </span>

        <NavButton
          label="Next slide"
          onClick={goNext}
          disabled={atEnd || isTransitioning}
        >
          →
        </NavButton>

        {/* Thin divider keeps the present-mode affordance visually distinct
            from the slide-stepping controls. */}
        <span aria-hidden className="h-4 w-px bg-white/15" />

        <NavButton label="Open speaker notes" onClick={openNotesWindow}>
          <NotesIcon />
        </NavButton>

        <NavButton
          label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          onClick={toggleFullscreen}
        >
          <FullscreenIcon expanded={isFullscreen} />
        </NavButton>
      </div>
    </div>
  );
}

/**
 * Opens the speaker-notes window in a second browser window. The user then
 * drags the audience-facing presentation to the projector and keeps this
 * window on the laptop. Same-origin so BroadcastChannel sync just works.
 */
function openNotesWindow() {
  const url = new URL(window.location.href);
  url.searchParams.set("mode", "notes");
  // Reasonable starting size for a laptop screen — user can resize freely.
  window.open(
    url.toString(),
    "shopit-presenter-notes",
    "width=1200,height=800,noopener=false",
  );
}

/** Thin lined "document with lines" glyph for the notes affordance. */
function NotesIcon() {
  return (
    <svg
      viewBox="0 0 14 14"
      width="13"
      height="13"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M3 1.5h6.5L11.5 3.5V12a0.5 0.5 0 0 1-0.5 0.5H3a0.5 0.5 0 0 1-0.5-0.5V2A0.5 0.5 0 0 1 3 1.5z" />
      <path d="M5 5h4 M5 7.5h4 M5 10h2.5" />
    </svg>
  );
}

interface NavButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: ReactNode;
}

function NavButton({ label, onClick, disabled, children }: NavButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center justify-center font-mono text-[14px] leading-none text-white/85 transition-colors hover:text-nebula-gold disabled:cursor-not-allowed disabled:text-white/20 disabled:hover:text-white/20"
    >
      {children}
    </button>
  );
}

/**
 * Four-corner-brackets glyph. When `expanded` is true the brackets point
 * inward (we're in fullscreen, click to collapse); otherwise they point
 * outward (we're windowed, click to expand). Drawn as an inline SVG so it
 * inherits `currentColor` from the button and stays crisp at any DPI.
 */
function FullscreenIcon({ expanded }: { expanded: boolean }) {
  const d = expanded
    ? // Brackets pointing inward.
      "M1 5H5V1 M13 5H9V1 M1 9H5V13 M13 9H9V13"
    : // Brackets pointing outward.
      "M5 1H1V5 M9 1H13V5 M5 13H1V9 M9 13H13V9";
  return (
    <svg
      viewBox="0 0 14 14"
      width="13"
      height="13"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="square"
      aria-hidden
    >
      <path d={d} />
    </svg>
  );
}

interface DotProps {
  label: string;
  active: boolean;
  onClick: () => void;
  disabled?: boolean;
}

function Dot({ label, active, onClick, disabled }: DotProps) {
  return (
    <button
      type="button"
      aria-label={`Go to slide: ${label}`}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className={`block transition-all disabled:cursor-not-allowed ${
        active
          ? "h-[3px] w-10 bg-nebula-gold shadow-[0_0_8px_rgba(245,197,24,0.75)]"
          : "h-[2px] w-3 bg-white/40 hover:bg-white/80"
      }`}
    />
  );
}
