import { useEffect } from "react";
import { useFullscreen } from "@/lib/useFullscreen";
import { useSlideNavigation } from "./SlideNavigationContext";

/**
 * Wires standard presentation keyboard shortcuts to the navigation context.
 * Lives as a hook (not a component) so it can be installed once at the
 * presentation root without rendering any UI.
 *
 * Bindings
 *   →, Space, PageDown  → next
 *   ←, PageUp           → previous
 *   Home                → first slide
 *   End                 → last slide
 *   F                   → toggle fullscreen (present mode)
 */
export function useKeyboardShortcuts(): void {
  const { goNext, goPrev, goTo, slides } = useSlideNavigation();
  const { toggle: toggleFullscreen } = useFullscreen();

  useEffect(() => {
    const lastIndex = slides.length - 1;

    function onKeyDown(event: KeyboardEvent) {
      // Ignore when the user is typing in an input — irrelevant here today,
      // but cheap insurance against future regressions.
      const target = event.target as HTMLElement | null;
      if (target?.matches("input, textarea, [contenteditable=true]")) return;

      // Skip when a modifier is held so we don't hijack browser shortcuts
      // like Cmd/Ctrl+F (find).
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      switch (event.key) {
        case "ArrowRight":
        case "PageDown":
        case " ":
          event.preventDefault();
          goNext();
          break;
        case "ArrowLeft":
        case "PageUp":
          event.preventDefault();
          goPrev();
          break;
        case "Home":
          event.preventDefault();
          goTo(0);
          break;
        case "End":
          event.preventDefault();
          goTo(lastIndex);
          break;
        case "f":
        case "F":
          event.preventDefault();
          toggleFullscreen();
          break;
        default:
          break;
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goNext, goPrev, goTo, slides.length, toggleFullscreen]);
}
