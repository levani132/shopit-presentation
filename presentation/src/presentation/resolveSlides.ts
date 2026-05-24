import type { ResolvedSlide, SlideConfig, Vec3 } from "./types";

/** Camera floats this far above the slide plane by default. */
const DEFAULT_CAMERA_OFFSET: Vec3 = [0, 0, 8];
const DEFAULT_TRANSITION = { durationSec: 2.2, ease: "power2.inOut" } as const;

function addVec3(a: Vec3, b: Vec3): Vec3 {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

/**
 * Applies defaults to raw SlideConfig entries. Done once at startup so the
 * scene + camera don't need to know about defaults.
 */
export function resolveSlides(configs: readonly SlideConfig[]): ResolvedSlide[] {
  return configs.map((cfg) => {
    const cameraOffset = cfg.cameraOffset ?? DEFAULT_CAMERA_OFFSET;
    const lookAt = cfg.lookAt ?? cfg.position;
    const linePoint = cfg.linePoint ?? cfg.position;
    const cameraStop = addVec3(cfg.position, cameraOffset);
    const transition = {
      durationSec: cfg.transition?.durationSec ?? DEFAULT_TRANSITION.durationSec,
      ease: cfg.transition?.ease ?? DEFAULT_TRANSITION.ease,
    };

    return {
      id: cfg.id,
      label: cfg.label,
      position: cfg.position,
      linePoint,
      lookAt,
      cameraStop,
      transition,
    };
  });
}
