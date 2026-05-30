import { useCallback, useEffect, useRef, useState } from "react";
import { openChannel, TIMER_KEY, type SyncMessage } from "./sync";

export interface NotesSyncState {
  /** Slide the main window is currently on. -1 = state never received yet. */
  currentIndex: number;
  /** Sub-step within the current slide. */
  currentStep: number;
  /** How many sub-steps the current slide has. */
  currentStepCount: number;
  /** Total slides in the deck. */
  totalSlides: number;
  /** True if the main presentation window is in browser fullscreen mode. */
  isFullscreen: boolean;
  /** When the timer started, or null if not yet running. */
  timerStartedAt: number | null;
}

export interface NotesSyncControls {
  goNext: () => void;
  goPrev: () => void;
  goFirst: () => void;
  goLast: () => void;
  goTo: (index: number) => void;
  /** Restart the timer (clears both windows' state). */
  resetTimer: () => void;
}

const INITIAL_STATE: NotesSyncState = {
  currentIndex: -1,
  currentStep: 0,
  currentStepCount: 1,
  totalSlides: 0,
  isFullscreen: false,
  timerStartedAt: null,
};

/**
 * Connects the presenter window to the main presentation.
 *
 * Returns the latest state mirrored from the main window plus controls for
 * sending navigation + timer commands back.
 *
 * On mount the hook:
 *   1. opens the shared BroadcastChannel;
 *   2. reads any pre-existing timer start from localStorage so a
 *      late-arriving notes window doesn't reset the clock;
 *   3. broadcasts `requestState`, prompting the main window to publish a
 *      fresh state snapshot immediately.
 */
export function useNotesSync(): [NotesSyncState, NotesSyncControls] {
  const [state, setState] = useState<NotesSyncState>(() => {
    // Boot with any cached timer timestamp so the clock resumes correctly
    // when the notes window is opened after the talk has already started.
    let cachedStart: number | null = null;
    try {
      const raw = localStorage.getItem(TIMER_KEY);
      const parsed = raw == null ? NaN : Number.parseInt(raw, 10);
      if (Number.isFinite(parsed) && parsed > 0) cachedStart = parsed;
    } catch {
      /* ignore quota / storage disabled */
    }
    return { ...INITIAL_STATE, timerStartedAt: cachedStart };
  });

  const channelRef = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    const channel = openChannel();
    channelRef.current = channel;
    if (!channel) return undefined;

    function handle(event: MessageEvent<SyncMessage>) {
      const msg = event.data;
      if (msg.type === "state") {
        setState((prev) => ({
          ...prev,
          currentIndex: msg.currentIndex,
          currentStep: msg.currentStep,
          currentStepCount: msg.currentStepCount,
          totalSlides: msg.totalSlides,
          isFullscreen: msg.isFullscreen,
        }));
      } else if (msg.type === "timer") {
        if (msg.action === "start") {
          setState((prev) => ({ ...prev, timerStartedAt: msg.startedAt }));
        } else if (msg.action === "reset") {
          setState((prev) => ({ ...prev, timerStartedAt: null }));
        }
      }
    }

    channel.addEventListener("message", handle);
    // Ask main window to publish its current state immediately.
    channel.postMessage({ type: "requestState" });

    return () => {
      channel.removeEventListener("message", handle);
      channel.close();
      channelRef.current = null;
    };
  }, []);

  const send = useCallback((msg: SyncMessage) => {
    channelRef.current?.postMessage(msg);
  }, []);

  const controls: NotesSyncControls = {
    goNext: useCallback(() => send({ type: "nav", action: "next" }), [send]),
    goPrev: useCallback(() => send({ type: "nav", action: "prev" }), [send]),
    goFirst: useCallback(() => send({ type: "nav", action: "first" }), [send]),
    goLast: useCallback(() => send({ type: "nav", action: "last" }), [send]),
    goTo: useCallback(
      (index: number) => send({ type: "nav", action: "goto", index }),
      [send],
    ),
    resetTimer: useCallback(() => {
      try {
        localStorage.removeItem(TIMER_KEY);
      } catch {
        /* ignore */
      }
      setState((prev) => ({ ...prev, timerStartedAt: null }));
      send({ type: "timer", action: "reset" });
    }, [send]),
  };

  return [state, controls];
}
