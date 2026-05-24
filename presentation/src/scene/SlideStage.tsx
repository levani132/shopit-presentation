import { useRef, type ComponentType } from "react";
import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import type { ResolvedSlide } from "@/presentation/types";
import { clamp } from "@/lib/math";
import { SlideSelfProvider } from "@/navigation/SlideNavigationContext";

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
      <div ref={wrapperRef} style={{ transition: "opacity 80ms linear" }}>
        <SlideSelfProvider slideIndex={slideIndex}>
          <SlideBody />
        </SlideSelfProvider>
      </div>
    </Html>
  );
}
