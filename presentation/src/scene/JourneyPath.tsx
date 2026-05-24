import { useMemo } from "react";
import { TubeGeometry, type CatmullRomCurve3 } from "three";

interface JourneyPathProps {
  curve: CatmullRomCurve3;
  /** Stroke color of the tube. */
  color?: string;
  /** Radius of the tube (in world units). Kept very thin to feel like a 2D line. */
  radius?: number;
  /** Tubular segment count — higher is smoother. */
  segments?: number;
}

/**
 * The visible journey line — a very thin white tube tracing the line
 * curve. Because the camera looks straight down at the plane, it reads
 * as a clean 2D stroke.
 */
export function JourneyPath({
  curve,
  color = "#ffffff",
  radius = 0.018,
  segments = 320,
}: JourneyPathProps) {
  const geometry = useMemo(
    () => new TubeGeometry(curve, segments, radius, 8, false),
    [curve, segments, radius],
  );

  return (
    <mesh geometry={geometry}>
      <meshBasicMaterial color={color} transparent opacity={0.65} />
    </mesh>
  );
}
