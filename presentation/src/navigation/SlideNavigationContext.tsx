import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { ResolvedSlide } from "@/presentation/types";
import { clamp } from "@/lib/math";

/**
 * Navigation model
 *
 * A "position" is the pair (slideIndex, step). The slideIndex is which slide
 * the camera is on; the step is the in-slide reveal index (0..stepCount-1).
 *
 * Slides that have multi-step reveal animations register their step count by
 * calling `useSlideSteps(total)` from inside their component. The default
 * step count (for slides that never register) is 1 — meaning goNext moves
 * straight to the next slide, exactly the old behavior.
 *
 * Navigation rules:
 *   goNext  → if step < stepCount - 1 increment step, else advance slide
 *             (step resets to 0).
 *   goPrev  → if step > 0 decrement step, else go to previous slide
 *             (step lands at 0, not the previous slide's final step).
 *   goTo(i) → jump to slide i, step 0.
 *
 * Why a separate `currentStep` rather than just incrementing a global
 * progress counter: the camera animation watches `currentIndex` and only
 * tweens when that changes. Step changes leave the camera in place, which
 * is what we want for build-style reveals.
 */

interface SlideNavigation {
  slides: readonly ResolvedSlide[];
  /** Which slide the camera is on (or heading to during a transition). */
  currentIndex: number;
  /** Reveal step within the current slide. Resets to 0 when slide changes. */
  currentStep: number;
  /** True while the camera is animating between slides. */
  isTransitioning: boolean;
  /** Set by the camera rig at the start/end of a journey. */
  setTransitioning: (value: boolean) => void;
  goTo: (index: number) => void;
  goNext: () => void;
  goPrev: () => void;
  /** Slides call this to declare their step count. */
  registerStepCount: (slideIndex: number, count: number) => void;
  /** Read-only: how many steps the currently-active slide has. */
  currentStepCount: number;
}

/**
 * Exported so callers can BRIDGE this context across the React Three Fiber
 * Canvas boundary. R3F's Canvas mounts its children with a separate
 * reconciler, which means React contexts from the outer tree are invisible
 * to anything rendered inside (including drei's `<Html>` portals). The fix
 * is to read this context's value outside the Canvas and re-provide it via
 * `<SlideNavigationContext.Provider>` around the Canvas children. See
 * Presentation.tsx for the bridge in practice.
 */
export const SlideNavigationContext =
  createContext<SlideNavigation | null>(null);

/**
 * Per-slide context providing the slide's own index to its body component.
 * Without this each slide would have to be passed slideIndex as a prop. The
 * `SlideStage` wraps every SlideBody with this provider.
 */
interface SlideSelfContextValue {
  slideIndex: number;
}
const SlideSelfContext = createContext<SlideSelfContextValue | null>(null);

interface SlideSelfProviderProps {
  slideIndex: number;
  children: ReactNode;
}

export function SlideSelfProvider({
  slideIndex,
  children,
}: SlideSelfProviderProps) {
  const value = useMemo(() => ({ slideIndex }), [slideIndex]);
  return (
    <SlideSelfContext.Provider value={value}>
      {children}
    </SlideSelfContext.Provider>
  );
}

interface ProviderProps {
  slides: readonly ResolvedSlide[];
  initialIndex?: number;
  children: ReactNode;
}

export function SlideNavigationProvider({
  slides,
  initialIndex = 0,
  children,
}: ProviderProps) {
  const [currentIndex, setCurrentIndex] = useState(() =>
    clamp(initialIndex, 0, slides.length - 1),
  );
  const [currentStep, setCurrentStep] = useState(0);
  const [isTransitioning, setTransitioning] = useState(false);

  // Per-slide step counts. We use a ref (not state) so registrations from
  // useEffect children don't trigger re-renders of the provider — only the
  // navigation actions read it.
  const stepCountsRef = useRef<Record<number, number>>({});
  // Mirror as state so consumers (NavigationOverlay) can re-render when it
  // changes. Cheap because writes are rare.
  const [currentStepCount, setCurrentStepCount] = useState(1);

  const registerStepCount = useCallback(
    (slideIndex: number, count: number) => {
      const next = Math.max(1, count);
      if (stepCountsRef.current[slideIndex] === next) return;
      stepCountsRef.current[slideIndex] = next;
      // If the slide that just registered is the active one, sync the
      // exposed `currentStepCount`.
      setCurrentStepCount((prev) => {
        if (slideIndex !== currentIndex) return prev;
        return next;
      });
    },
    [currentIndex],
  );

  // Whenever the active slide changes, refresh currentStepCount from the
  // ref (the new slide may already have registered).
  useEffect(() => {
    setCurrentStepCount(stepCountsRef.current[currentIndex] ?? 1);
  }, [currentIndex]);

  const goTo = useCallback(
    (index: number) => {
      const target = clamp(index, 0, slides.length - 1);
      setCurrentIndex((prev) => (prev === target ? prev : target));
      setCurrentStep(0);
    },
    [slides.length],
  );

  const goNext = useCallback(() => {
    setCurrentStep((prevStep) => {
      const total = stepCountsRef.current[currentIndex] ?? 1;
      if (prevStep < total - 1) {
        return prevStep + 1;
      }
      // Step exhausted — advance the slide and reset step.
      setCurrentIndex((prevIdx) =>
        prevIdx < slides.length - 1 ? prevIdx + 1 : prevIdx,
      );
      return 0;
    });
  }, [currentIndex, slides.length]);

  const goPrev = useCallback(() => {
    setCurrentStep((prevStep) => {
      if (prevStep > 0) return prevStep - 1;
      // At step 0 of this slide — back up to previous slide.
      setCurrentIndex((prevIdx) => (prevIdx > 0 ? prevIdx - 1 : prevIdx));
      return 0;
    });
  }, []);

  const value = useMemo<SlideNavigation>(
    () => ({
      slides,
      currentIndex,
      currentStep,
      isTransitioning,
      setTransitioning,
      goTo,
      goNext,
      goPrev,
      registerStepCount,
      currentStepCount,
    }),
    [
      slides,
      currentIndex,
      currentStep,
      isTransitioning,
      goTo,
      goNext,
      goPrev,
      registerStepCount,
      currentStepCount,
    ],
  );

  return (
    <SlideNavigationContext.Provider value={value}>
      {children}
    </SlideNavigationContext.Provider>
  );
}

export function useSlideNavigation(): SlideNavigation {
  const ctx = useContext(SlideNavigationContext);
  if (!ctx) {
    throw new Error(
      "useSlideNavigation must be used inside <SlideNavigationProvider>",
    );
  }
  return ctx;
}

/**
 * Hook for slide components that have multi-step reveal animations.
 *
 * Pass the total number of steps your slide has, including the initial state
 * (so a "single list → split → tagline" sequence is `useSlideSteps(3)`).
 *
 * Returns the current step (0-based). When the slide is not active, this
 * returns 0 so the slide renders its initial state — important because the
 * scene keeps all slides mounted in 3D.
 */
export function useSlideSteps(totalSteps: number): number {
  const nav = useContext(SlideNavigationContext);
  const self = useContext(SlideSelfContext);
  if (!nav || !self) {
    throw new Error(
      "useSlideSteps must be used inside <SlideStage> within <SlideNavigationProvider>",
    );
  }
  const { registerStepCount, currentStep, currentIndex } = nav;
  const { slideIndex } = self;

  useEffect(() => {
    registerStepCount(slideIndex, totalSteps);
  }, [registerStepCount, slideIndex, totalSteps]);

  // Slides that aren't active should show their initial state — otherwise a
  // slide you stepped into and then left would still be at its final step
  // when you flick past it again, breaking the reveal narrative.
  return currentIndex === slideIndex ? currentStep : 0;
}
