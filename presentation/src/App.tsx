import { Presentation } from "@/presentation/Presentation";

/**
 * Root composition. Kept intentionally thin — Presentation owns the actual
 * scene + state + UI composition.
 */
export function App() {
  return (
    <main className="relative h-full w-full overflow-hidden">
      <Presentation />
    </main>
  );
}
