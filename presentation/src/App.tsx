import { Presentation } from "@/presentation/Presentation";
import { PresenterView } from "@/presenter/PresenterView";

/**
 * Root composition. Two modes:
 *
 *   default        — full 3D presentation (audience-facing window).
 *   ?mode=notes    — speaker-notes view (laptop / second screen). Pure
 *                    HTML, talks to the presentation window over
 *                    `BroadcastChannel`.
 *
 * The mode is selected from `window.location.search` once at mount; the
 * notes window stays in notes mode for its full lifetime. This avoids
 * needing a router for a one-off switch.
 */
export function App() {
  const isNotesMode =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("mode") === "notes";

  if (isNotesMode) {
    return <PresenterView />;
  }

  return (
    <main className="relative h-full w-full overflow-hidden">
      <Presentation />
    </main>
  );
}
