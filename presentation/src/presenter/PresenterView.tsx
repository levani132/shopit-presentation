import { useEffect, useMemo, useState } from "react";
import { slideNotesByIndex, type SlideNotes } from "@/data/parseSpeechMd";
import { slidesConfig } from "@/presentation/slides.config";
import { PresenterClock } from "./PresenterClock";
import { useNotesSync } from "./useNotesSync";

/**
 * Speaker-notes view. Runs in the second browser window the user opens
 * with `?mode=notes` and drags onto the laptop screen.
 *
 * Layout
 *
 *   Header strip — slide counter, sub-step indicator, timer.
 *   Main body  — current slide notes (large readable text, scrollable).
 *   Right rail — next slide preview + reset / nav controls.
 *
 * Keyboard
 *
 *   Same shortcuts as the main window — ← / → / PageUp / PageDown / Home /
 *   End / Space. Sent via BroadcastChannel; main window executes them and
 *   broadcasts the new state back. Either window's keyboard works.
 */
export function PresenterView() {
  const [state, controls] = useNotesSync();

  // Font-size adjuster (persisted) — speaker may need bigger/smaller text
  // depending on the laptop screen they're using.
  const [fontStep, setFontStep] = useState<number>(() => {
    try {
      const raw = localStorage.getItem("shopit-presenter-fontStep");
      const parsed = raw == null ? 0 : Number.parseInt(raw, 10);
      return Number.isFinite(parsed) ? parsed : 0;
    } catch {
      return 0;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem("shopit-presenter-fontStep", String(fontStep));
    } catch {
      /* ignore */
    }
  }, [fontStep]);

  // Listen to the presenter window's own keyboard. We treat it as a
  // remote and forward nav commands; the main window mirrors back.
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      // Don't fight browser shortcuts.
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      switch (event.key) {
        case "ArrowRight":
        case "PageDown":
        case " ":
          event.preventDefault();
          controls.goNext();
          break;
        case "ArrowLeft":
        case "PageUp":
          event.preventDefault();
          controls.goPrev();
          break;
        case "Home":
          event.preventDefault();
          controls.goFirst();
          break;
        case "End":
          event.preventDefault();
          controls.goLast();
          break;
        case "+":
        case "=":
          event.preventDefault();
          setFontStep((step) => Math.min(step + 1, 6));
          break;
        case "-":
        case "_":
          event.preventDefault();
          setFontStep((step) => Math.max(step - 1, -3));
          break;
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [controls]);

  // Map the live index to the parsed notes. Falls back to a "waiting"
  // placeholder before the first state message arrives.
  const currentNotes: SlideNotes | null =
    state.currentIndex >= 0
      ? (slideNotesByIndex[state.currentIndex] ?? null)
      : null;
  const nextNotes: SlideNotes | null =
    state.currentIndex >= 0 && state.currentIndex + 1 < state.totalSlides
      ? (slideNotesByIndex[state.currentIndex + 1] ?? null)
      : null;

  // Slide label from the deck config — useful when a slide has no notes.
  const slideLabel = useMemo(() => {
    if (state.currentIndex < 0) return "—";
    const cfg = slidesConfig[state.currentIndex];
    return cfg?.label ?? "—";
  }, [state.currentIndex]);

  // Body font-size scales with fontStep. Range tuned for ~16" laptop:
  // baseline 24px is comfortable for 1 m reading distance.
  const bodyFontSize = 22 + fontStep * 3;
  const bodyLineHeight = 1.6;

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-nebula-deep text-white">
      {/* ===== Header strip ===== */}
      <header className="flex shrink-0 items-start justify-between gap-10 border-b border-nebula-rule px-10 pb-6 pt-7">
        <div className="flex flex-col">
          <p className="font-mono text-[11px] uppercase tracking-eyebrow text-nebula-gold">
            სლაიდი {state.currentIndex >= 0 ? state.currentIndex : "—"} /{" "}
            {state.totalSlides > 0 ? state.totalSlides - 1 : "—"}
          </p>
          <h1 className="mt-2 font-sans text-[28px] font-semibold leading-tight tracking-tight">
            {currentNotes?.title ?? slideLabel}
          </h1>
          {currentNotes?.duration ? (
            <p className="mt-2 text-[14px] text-white/55">
              {currentNotes.duration}
            </p>
          ) : null}
        </div>

        <PresenterClock startedAt={state.timerStartedAt} />
      </header>

      {/* ===== Body: notes on the left, controls on the right ===== */}
      <div className="grid min-h-0 flex-1 grid-cols-[1fr_320px]">
        <main className="min-h-0 overflow-y-auto px-10 py-8">
          {/* Sub-step indicator */}
          {state.currentStepCount > 1 ? (
            <div className="mb-6 flex items-center gap-3">
              <p className="font-mono text-[11px] uppercase tracking-eyebrow text-white/45">
                სლაიდის ბილიკი
              </p>
              <div className="flex items-center gap-1.5">
                {Array.from({ length: state.currentStepCount }, (_, idx) => (
                  <span
                    key={idx}
                    aria-hidden
                    className="block h-[3px] rounded-full transition-all"
                    style={{
                      width: idx === state.currentStep ? "28px" : "14px",
                      backgroundColor:
                        idx <= state.currentStep
                          ? "#f5c518"
                          : "rgba(255,255,255,0.18)",
                    }}
                  />
                ))}
                <span className="ml-2 font-mono text-[11px] uppercase tracking-eyebrow text-white/55">
                  {state.currentStep + 1} / {state.currentStepCount}
                </span>
              </div>
            </div>
          ) : null}

          {/* Notes body */}
          {currentNotes ? (
            <article className="max-w-3xl">
              {currentNotes.paragraphs.length === 0 ? (
                <p className="text-white/45 italic">
                  ამ სლაიდისთვის ნოუთები არ მოიძებნა v2.md-ში.
                </p>
              ) : (
                currentNotes.paragraphs.map((para, idx) => (
                  <p
                    key={idx}
                    className="mb-5 text-white"
                    style={{
                      fontSize: `${bodyFontSize}px`,
                      lineHeight: bodyLineHeight,
                      // Reading column — IBM Plex Sans Georgian (already
                      // loaded in index.css). Slight letter-spacing helps
                      // peripheral glance reading.
                      letterSpacing: "0.005em",
                    }}
                  >
                    {para}
                  </p>
                ))
              )}
            </article>
          ) : (
            <p className="text-[20px] text-white/55">
              {state.currentIndex < 0
                ? "ველოდები მთავარ ფანჯრიდან მონაცემს — ფანჯარა გახსნილია? გვერდი მზადაა."
                : "ნოუთები ამ სლაიდისთვის v2.md-ში არ არის."}
            </p>
          )}
        </main>

        {/* ===== Right rail ===== */}
        <aside className="flex min-h-0 flex-col gap-6 border-l border-nebula-rule px-7 py-8">
          {/* Next slide preview */}
          <section>
            <p className="font-mono text-[11px] uppercase tracking-eyebrow text-white/45">
              შემდეგ მოდის
            </p>
            {nextNotes ? (
              <>
                <p className="mt-2 font-sans text-[17px] font-semibold leading-snug">
                  {nextNotes.title}
                </p>
                {nextNotes.duration ? (
                  <p className="mt-1 text-[12px] text-white/45">
                    {nextNotes.duration}
                  </p>
                ) : null}
                {nextNotes.paragraphs[0] ? (
                  <p className="mt-3 text-[13px] leading-snug text-white/60 line-clamp-4">
                    {nextNotes.paragraphs[0]}
                  </p>
                ) : null}
              </>
            ) : (
              <p className="mt-2 text-[14px] text-white/45">
                ბოლო სლაიდია.
              </p>
            )}
          </section>

          {/* Status indicators */}
          <section className="border-t border-nebula-rule pt-5">
            <p className="font-mono text-[11px] uppercase tracking-eyebrow text-white/45">
              მთავარი ფანჯრის სტატუსი
            </p>
            <ul className="mt-3 flex flex-col gap-2 text-[13px]">
              <li className="flex items-center gap-2">
                <span
                  aria-hidden
                  className="block h-2 w-2 rounded-full"
                  style={{
                    backgroundColor:
                      state.currentIndex >= 0 ? "#7ed28a" : "#cccccc44",
                  }}
                />
                <span className="text-white/80">
                  {state.currentIndex >= 0 ? "მიერთებული" : "ელოდება"}
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span
                  aria-hidden
                  className="block h-2 w-2 rounded-full"
                  style={{
                    backgroundColor: state.isFullscreen ? "#f5c518" : "#cccccc44",
                  }}
                />
                <span className="text-white/80">
                  {state.isFullscreen ? "ფულსკრინი ჩართულია" : "ფულსკრინი არა"}
                </span>
              </li>
            </ul>
          </section>

          {/* Controls */}
          <section className="border-t border-nebula-rule pt-5">
            <p className="font-mono text-[11px] uppercase tracking-eyebrow text-white/45">
              ნავიგაცია
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Button onClick={controls.goPrev}>← წინა</Button>
              <Button onClick={controls.goNext}>შემდეგი →</Button>
              <Button onClick={controls.goFirst}>დასაწყისი</Button>
              <Button onClick={controls.goLast}>ბოლო</Button>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              <Button onClick={() => setFontStep((s) => Math.max(s - 1, -3))}>
                A−
              </Button>
              <Button
                onClick={() => setFontStep(0)}
                title="font-size-ის გადატვირთვა"
              >
                A
              </Button>
              <Button onClick={() => setFontStep((s) => Math.min(s + 1, 6))}>
                A+
              </Button>
            </div>
            <button
              type="button"
              onClick={controls.resetTimer}
              className="mt-4 w-full rounded-sm border border-nebula-rule px-3 py-2 font-mono text-[11px] uppercase tracking-eyebrow text-white/65 transition hover:border-nebula-gold/70 hover:text-white"
            >
              ტაიმერის გადატვირთვა
            </button>
          </section>
        </aside>
      </div>
    </div>
  );
}

/** Small flat button matching the editorial-thesis look. */
function Button({
  onClick,
  title,
  children,
}: {
  onClick: () => void;
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className="rounded-sm border border-nebula-rule bg-nebula-ink/70 px-3 py-2 font-mono text-[12px] uppercase tracking-eyebrow text-white/80 transition hover:border-nebula-gold/70 hover:text-white"
    >
      {children}
    </button>
  );
}
