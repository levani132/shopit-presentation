import { useRef, type ComponentType } from "react";
import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import type { ResolvedSlide } from "@/presentation/types";
import { clamp } from "@/lib/math";
import {
  SlideNavigationContext,
  SlideSelfProvider,
  useSlideNavigation,
} from "@/navigation/SlideNavigationContext";

interface SlideStageProps {
  slide: ResolvedSlide;
  /** Position of this slide in the journey (i.e., its index). */
  slideIndex: number;
  /** Shared continuous progress driven by the camera. */
  progressRef: React.MutableRefObject<{ value: number }>;
  /** The body component to render inside the slide. */
  component: ComponentType;
}

const FADE_FALLOFF = 0.45;
const FULLY_VISIBLE_RANGE = 0.2;

/**
 * Places slide HTML in the scene as a 2D overlay anchored to the slide's
 * world position. drei <Html> (non-transform mode) projects the anchor
 * point to screen coordinates each frame, so the card stays crisp at a
 * fixed CSS size while the camera pan moves it across the screen.
 *
 * Opacity fades based on how close the camera's continuous progress is to
 * this slide's index — only adjacent slides are legible at once, keeping
 * the screen calm.
 */
export function SlideStage({
  slide,
  slideIndex,
  progressRef,
  component: SlideBody,
}: SlideStageProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  // SlideStage is rendered inside the Canvas, so it can see the
  // canvas-level navigation bridge (provided in Presentation.tsx). We read
  // the value here and pass it through the Html portal below.
  const navigation = useSlideNavigation();

  useFrame(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const distance = Math.abs(progressRef.current.value - slideIndex);
    const opacity = clamp(
      1 - Math.max(0, distance - FULLY_VISIBLE_RANGE) / FADE_FALLOFF,
      0,
      1,
    );
    wrapper.style.opacity = String(opacity);
    wrapper.style.pointerEvents = opacity < 0.05 ? "none" : "auto";
  });

  return (
    <Html position={slide.position} center style={{ pointerEvents: "none" }}>
      {/*
        drei's <Html> mounts its children with `ReactDOM.createRoot()` — a
        BRAND NEW React root that has no connection to any outer context,
        not even the bridge we already added inside the Canvas. So we
        re-provide the navigation context one more time here, at the very
        top of the Html portal's React tree, before the slide body reads it.
      */}
      <SlideNavigationContext.Provider value={navigation}>
        <div ref={wrapperRef} style={{ transition: "opacity 80ms linear" }}>
          <SlideSelfProvider slideIndex={slideIndex}>
            <SlideBody />
          </SlideSelfProvider>
        </div>
      </SlideNavigationContext.Provider>
    </Html>
  );
}
