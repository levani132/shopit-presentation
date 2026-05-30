import { useEffect, useRef } from "react";
import { useSlideNavigation } from "@/navigation/SlideNavigationContext";
import {
  openChannel,
  TIMER_KEY,
  type StateMessage,
  type SyncMessage,
} from "./sync";

interface UseMainBroadcastOptions {
  /** Whether the main window is currently in browser fullscreen mode. */
  isFullscreen: boolean;
}

/**
 * Wires the MAIN presentation window into the cross-window sync.
 *
 *   - publishes a `state` message whenever navigation OR fullscreen changes;
 *   - consumes `nav` commands coming from the notes window and forwards
 *     them to the local navigation API;
 *   - responds to `requestState` pings from a freshly-opened notes window;
 *   - emits a `timer.start` message + writes the timestamp to localStorage
 *     the FIRST time the window enters fullscreen during this session.
 *
 * The hook intentionally lives outside the navigation context provider so
 * `useSlideNavigation()` can be read without prop-drilling. It must still
 * be rendered as a descendant of `<SlideNavigationProvider>`.
 */
export function useMainBroadcast({ isFullscreen }: UseMainBroadcastOptions) {
  const nav = useSlideNavigation();
  const channelRef = useRef<BroadcastChannel | null>(null);
  // Track whether we've already fired `timer.start` this session — the
  // user can re-enter fullscreen after Esc without restarting the clock.
  const timerStartedRef = useRef<boolean>(false);

  // Open / close the channel once over the component lifetime. The first
  // effect just owns the channel object; the second wires the message
  // handler with fresh `nav` / `isFullscreen` closures.
  useEffect(() => {
    const channel = openChannel();
    channelRef.current = channel;
    return () => {
      channel?.close();
      channelRef.current = null;
    };
  }, []);

  // Bind the message handler — re-runs when nav or isFullscreen change so
  // the closure always sees fresh values. Same channel object though.
  useEffect(() => {
    const channel: BroadcastChannel | null = channelRef.current;
    if (!channel) return undefined;
    // Pin a non-null reference for use inside the handler closure —
    // TypeScript's control-flow narrowing doesn't cross function boundaries.
    const ch: BroadcastChannel = channel;

    function handleMessage(event: MessageEvent<SyncMessage>) {
      const msg = event.data;
      if (msg.type === "nav") {
        switch (msg.action) {
          case "next":
            nav.goNext();
            break;
          case "prev":
            nav.goPrev();
            break;
          case "first":
            nav.goTo(0);
            break;
          case "last":
            nav.goTo(nav.slides.length - 1);
            break;
          case "goto":
            if (typeof msg.index === "number") nav.goTo(msg.index);
            break;
        }
      } else if (msg.type === "requestState") {
        const snapshot: StateMessage = {
          type: "state",
          currentIndex: nav.currentIndex,
          currentStep: nav.currentStep,
          currentStepCount: nav.currentStepCount,
          totalSlides: nav.slides.length,
          isFullscreen,
        };
        ch.postMessage(snapshot);
      } else if (msg.type === "timer" && msg.action === "reset") {
        // Allow the notes window to reset the clock without re-entering
        // fullscreen on the main side.
        timerStartedRef.current = false;
        try {
          localStorage.removeItem(TIMER_KEY);
        } catch {
          /* ignore quota / storage disabled */
        }
      }
    }

    ch.addEventListener("message", handleMessage);
    return () => {
      ch.removeEventListener("message", handleMessage);
    };
  }, [nav, isFullscreen]);

  // Publish a fresh state snapshot every time navigation OR fullscreen
  // changes. The notes window listens for these and re-renders.
  useEffect(() => {
    const channel = channelRef.current;
    if (!channel) return;
    const snapshot: StateMessage = {
      type: "state",
      currentIndex: nav.currentIndex,
      currentStep: nav.currentStep,
      currentStepCount: nav.currentStepCount,
      totalSlides: nav.slides.length,
      isFullscreen,
    };
    channel.postMessage(snapshot);
  }, [
    nav.currentIndex,
    nav.currentStep,
    nav.currentStepCount,
    nav.slides.length,
    isFullscreen,
  ]);

  // Start the timer the first time we enter fullscreen during this session.
  useEffect(() => {
    if (!isFullscreen) return;
    if (timerStartedRef.current) return;
    timerStartedRef.current = true;

    const startedAt = Date.now();
    try {
      localStorage.setItem(TIMER_KEY, String(startedAt));
    } catch {
      /* ignore */
    }
    const channel = channelRef.current;
    if (channel) {
      channel.postMessage({ type: "timer", action: "start", startedAt });
    }
  }, [isFullscreen]);
}
