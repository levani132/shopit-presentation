import { useCallback, useEffect, useState } from "react";

/**
 * Toggles the document into the browser's fullscreen mode and tracks state.
 *
 * Lives as a tiny hook (rather than dropping the API calls inline) so any
 * component that needs a "present" affordance can grab the same `isFullscreen`
 * flag and switch its icon/label without duplicating event-listener wiring.
 *
 * Notes
 *   - Targets `document.documentElement` so the whole app — canvas + overlay —
 *     goes fullscreen, not just the slide card.
 *   - `requestFullscreen` rejects if not called from a user gesture; we
 *     swallow the rejection because the only sensible response is "do
 *     nothing" (the user will click again).
 *   - We don't read prefixed properties: modern Chrome/Safari/Firefox all
 *     ship the unprefixed API.
 */
export function useFullscreen(): {
  isFullscreen: boolean;
  toggle: () => void;
} {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(
    () => typeof document !== "undefined" && document.fullscreenElement != null,
  );

  useEffect(() => {
    function onChange() {
      setIsFullscreen(document.fullscreenElement != null);
    }
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const toggle = useCallback(() => {
    if (document.fullscreenElement) {
      void document.exitFullscreen().catch(() => {});
    } else {
      void document.documentElement.requestFullscreen().catch(() => {});
    }
  }, []);

  return { isFullscreen, toggle };
}
