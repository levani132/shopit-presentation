import { CatmullRomCurve3, Vector3 } from "three";
import type { ResolvedSlide, Vec3 } from "@/presentation/types";

/**
 * Builds two curves used by the presentation:
 *
 *   - `cameraCurve` — passes through each slide's `position`. The camera
 *     follows this so the slide content stays centered on screen at every
 *     stop, with smooth Catmull-Rom interpolation between slides.
 *
 *   - `lineCurve` — passes through each slide's `linePoint`. This is the
 *     visible white line drawn in the scene and is what the arrow rides
 *     along. linePoints are placed in screen corners so the arrow doesn't
 *     overlap the slide content.
 *
 * Both curves are indexed by the same continuous `progress` value in
 * [0, N-1], where integer values correspond to slide stops.
 */
export interface JourneyCurves {
  cameraCurve: CatmullRomCurve3;
  lineCurve: CatmullRomCurve3;
}

function curveThroughPoints(points: Vec3[]): CatmullRomCurve3 {
  const vecs = points.map((p) => new Vector3(...p));

  // Degenerate case: <2 points — duplicate so getPointAt(0/1) still works.
  if (vecs.length < 2) {
    const p = vecs[0]?.clone() ?? new Vector3();
    return new CatmullRomCurve3([p, p.clone()], false, "catmullrom", 0.5);
  }
  return new CatmullRomCurve3(vecs, false, "catmullrom", 0.5);
}

export function buildJourneyCurves(
  slides: readonly ResolvedSlide[],
): JourneyCurves {
  return {
    cameraCurve: curveThroughPoints(slides.map((s) => s.position)),
    lineCurve: curveThroughPoints(slides.map((s) => s.linePoint)),
  };
}
