import { useEffect, useRef } from "react";
import gsap from "gsap";
import type { MutableRefObject } from "react";
import type { ResolvedSlide } from "@/presentation/types";

/**
 * Drives the camera's continuous progress (`0..N-1`) toward the active slide
 * index using GSAP, with per-slide duration and easing. Returns a ref whose
 * `.current` value can be read every frame to position the camera.
 *
 * Notification of transition start/end is delegated to the caller via the
 * `onTransitionChange` callback — this keeps the hook decoupled from any
 * particular state container.
 */
export function useCameraJourney(
  slides: readonly ResolvedSlide[],
  currentIndex: number,
  onTransitionChange: (isTransitioning: boolean) => void,
): MutableRefObject<{ value: number }> {
  // Wrap in an object because GSAP tweens object properties, not raw refs.
  const progressRef = useRef<{ value: number }>({ value: currentIndex });

  useEffect(() => {
    const slide = slides[currentIndex];
    if (!slide) return;

    // Skip no-op animations (e.g., first mount when initial index matches).
    if (Math.abs(progressRef.current.value - currentIndex) < 0.001) {
      return;
    }

    onTransitionChange(true);
    const tween = gsap.to(progressRef.current, {
      value: currentIndex,
      duration: slide.transition.durationSec,
      ease: slide.transition.ease,
      onComplete: () => onTransitionChange(false),
    });

    return () => {
      tween.kill();
      onTransitionChange(false);
    };
  }, [currentIndex, slides, onTransitionChange]);

  return progressRef;
}
