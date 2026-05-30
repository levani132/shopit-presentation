import { useEffect, useState } from "react";

interface PresenterClockProps {
  /** Wall-clock ms when the timer started, or null if not yet started. */
  startedAt: number | null;
  /** Target talk length in minutes — used to colour the elapsed display. */
  targetMinutes?: number;
}

/**
 * Mm:ss elapsed timer for the presenter view.
 *
 * Ticks once a second on a single setInterval (rather than per-component
 * state subscriptions) so the rest of the presenter view doesn't re-render
 * on each tick. The display shifts colour once elapsed > target so the
 * speaker has a peripheral cue that they're running over.
 *
 * When `startedAt` is null the clock renders a neutral "00:00 · waiting"
 * placeholder so the user knows the timer hasn't started yet — it starts
 * automatically the first time the main presentation enters fullscreen.
 */
export function PresenterClock({
  startedAt,
  targetMinutes = 18,
}: PresenterClockProps) {
  // We track only the current second tick. Display formatting derives from
  // `startedAt` + this tick value, so the component re-renders exactly once
  // per second even if React batches multiple state updates.
  const [, setTick] = useState(0);

  useEffect(() => {
    if (startedAt == null) return undefined;
    const id = window.setInterval(() => setTick((n) => n + 1), 1000);
    return () => window.clearInterval(id);
  }, [startedAt]);

  if (startedAt == null) {
    return (
      <div className="flex flex-col items-start">
        <p className="font-mono text-[11px] uppercase tracking-eyebrow text-white/45">
          ტაიმერი
        </p>
        <p className="mt-1 font-serif text-[64px] font-semibold leading-none tracking-tight text-white/55">
          00:00
        </p>
        <p className="mt-2 text-[14px] text-white/45">
          ფულსკრინზე გადასვლის შემდეგ ჩაირთვება
        </p>
      </div>
    );
  }

  const elapsedMs = Math.max(0, Date.now() - startedAt);
  const totalSeconds = Math.floor(elapsedMs / 1000);
  const mm = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const ss = String(totalSeconds % 60).padStart(2, "0");

  // Colour bands: green up to target − 2 min, gold from target − 2 to
  // target, red after target. Keeps the cue legible at peripheral vision.
  const targetSeconds = targetMinutes * 60;
  let color = "#ffffff";
  let label = "ბუჯეტში";
  if (totalSeconds > targetSeconds) {
    color = "#ff7676";
    label = "გადაცილებული";
  } else if (totalSeconds > targetSeconds - 120) {
    color = "#f5c518";
    label = "ბოლო 2 წუთი";
  } else if (totalSeconds > targetSeconds - 300) {
    color = "#f5c518";
    label = "ბოლო 5 წუთი";
  }

  return (
    <div className="flex flex-col items-start">
      <p className="font-mono text-[11px] uppercase tracking-eyebrow text-white/45">
        ტაიმერი · სამიზნე {targetMinutes} წუთი
      </p>
      <p
        className="mt-1 font-serif text-[72px] font-semibold leading-none tracking-tight tabular-nums"
        style={{ color, transition: "color 600ms ease" }}
      >
        {mm}:{ss}
      </p>
      <p className="mt-2 text-[14px]" style={{ color }}>
        {label}
      </p>
    </div>
  );
}
