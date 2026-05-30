/**
 * Cross-window sync primitives for the presenter mode.
 *
 * Two browser windows participate:
 *
 *   1. The MAIN window — renders the 3D presentation. It owns navigation
 *      state (currentIndex, currentStep, currentStepCount), publishes state
 *      updates whenever they change, and consumes nav commands coming from
 *      the notes window.
 *
 *   2. The NOTES window — renders speaker notes + timer. It owns no
 *      navigation state of its own; it mirrors what the main window
 *      publishes and sends nav commands when its keyboard is used.
 *
 * Wire format
 *
 *   Both windows talk over a single `BroadcastChannel` named
 *   "shopit-presentation". Messages are tagged unions; consumers narrow by
 *   `type`. The channel is same-origin within one browser profile, which
 *   matches the real-world setup: laptop + extended display, both windows
 *   inside the same Chrome.
 *
 *   Timer state persists in `localStorage` (not just over the channel) so
 *   that opening the notes window AFTER the main went fullscreen still
 *   picks up the correct start time.
 *
 * Why BroadcastChannel + localStorage rather than the newer Web Locks or
 * SharedWorker: BroadcastChannel is universally supported in evergreen
 * browsers, requires no server, and is invariant under page reload. The
 * localStorage backup is just an extra safety net for late-arriving notes
 * windows.
 */

/** All messages that flow over the channel. */
export type SyncMessage =
  | StateMessage
  | NavMessage
  | RequestStateMessage
  | TimerMessage;

/**
 * Sent by the MAIN window whenever its navigation state changes (or in
 * response to a `requestState` from a freshly-opened notes window).
 */
export interface StateMessage {
  type: "state";
  currentIndex: number;
  currentStep: number;
  currentStepCount: number;
  totalSlides: number;
  isFullscreen: boolean;
}

/**
 * Sent by the NOTES window when its keyboard advances the presentation.
 * The main window forwards `action` to its navigation context and the
 * resulting state change is then re-broadcast back as a `state` message.
 */
export interface NavMessage {
  type: "nav";
  action: "next" | "prev" | "first" | "last" | "goto";
  /** Required when `action === "goto"`. */
  index?: number;
}

/**
 * Sent by the NOTES window on mount so the main window can publish its
 * current state without waiting for the next change.
 */
export interface RequestStateMessage {
  type: "requestState";
}

/**
 * Timer control messages. The main window emits `start` when it enters
 * fullscreen for the first time; either window can emit `reset`.
 */
export type TimerMessage =
  | { type: "timer"; action: "start"; startedAt: number }
  | { type: "timer"; action: "reset" };

/** Name of the BroadcastChannel both windows open. */
export const CHANNEL_NAME = "shopit-presentation";

/** localStorage key for the timer start timestamp (ms since epoch). */
export const TIMER_KEY = "shopit-presenter-timer-startedAt";

/**
 * Tiny wrapper around `BroadcastChannel` that survives SSR / Node test
 * environments where the constructor is missing.
 */
export function openChannel(): BroadcastChannel | null {
  if (typeof window === "undefined") return null;
  if (typeof BroadcastChannel === "undefined") return null;
  return new BroadcastChannel(CHANNEL_NAME);
}
