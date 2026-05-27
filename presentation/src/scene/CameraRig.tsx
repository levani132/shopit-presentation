import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Vector3, type CatmullRomCurve3 } from "three";
import type { ResolvedSlide } from "@/presentation/types";
import { clamp, lerp } from "@/lib/math";

interface CameraRigProps {
  slides: readonly ResolvedSlide[];
  /** Curve that the camera (x, y) traces through slide positions. */
  cameraCurve: CatmullRomCurve3;
  progressRef: React.MutableRefObject<{ value: number }>;
}

const SCRATCH_POSITION = new Vector3();

/**
 * Positions the active R3F camera each frame from the journey's progress.
 *
 * The camera follows `cameraCurve` — built through each slide's
 * `position` — so the slide content stays centered on screen at every
 * stop. The camera floats at its own z (cameraOffset.z) and always looks
 * straight down at the path point beneath it. This is what gives the
 * scene its 2D-canvas feel even though it's rendered with a 3D camera.
 *
 * Renders no geometry — purely a side-effecting controller.
 *
 * IMPORTANT: we use `getPoint(t)` here, NOT `getPointAt(t)`. CatmullRom
 * curves are uniformly parameterized by `getPoint`, so at t = i/(n-1) the
 * curve sits exactly on the i-th control point (i.e., slide i's
 * position). `getPointAt` re-parameterizes by arc length, which only
 * matches control points at the endpoints — every intermediate slide
 * lands slightly off-centre, which on a laptop viewport reads as the
 * slide card being visibly shifted from the centre of the screen.
 */
export function CameraRig({
  slides,
  cameraCurve,
  progressRef,
}: CameraRigProps) {
  const { camera } = useThree();
  const lookAtRef = useRef(new Vector3());

  useFrame(() => {
    const n = slides.length;
    if (n === 0) return;

    const progress = progressRef.current.value;
    const t = n === 1 ? 0 : clamp(progress / (n - 1), 0, 1);

    cameraCurve.getPoint(t, SCRATCH_POSITION);

    // Interpolate the z-offset between adjacent slides in case any slide
    // wants a custom altitude.
    const lower = clamp(Math.floor(progress), 0, n - 1);
    const upper = clamp(lower + 1, 0, n - 1);
    const frac = progress - lower;
    const a = slides[lower];
    const b = slides[upper];
    if (!a || !b) return;

    const offsetZ = lerp(
      a.cameraStop[2] - a.position[2],
      b.cameraStop[2] - b.position[2],
      frac,
    );

    camera.position.set(
      SCRATCH_POSITION.x,
      SCRATCH_POSITION.y,
      SCRATCH_POSITION.z + offsetZ,
    );

    lookAtRef.current.copy(SCRATCH_POSITION);
    camera.lookAt(lookAtRef.current);
  });

  return null;
}
