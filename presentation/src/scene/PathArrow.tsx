import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  Mesh,
  Quaternion,
  Shape,
  ShapeGeometry,
  Vector3,
  type CatmullRomCurve3,
} from "three";
import { clamp } from "@/lib/math";

interface PathArrowProps {
  curve: CatmullRomCurve3;
  /** Continuous progress (0..N-1) where N is the number of slides. */
  progressRef: React.MutableRefObject<{ value: number }>;
  totalSlides: number;
  /** Arrow color. */
  color?: string;
}

const SHAPE_UP = new Vector3(0, 1, 0);
const SCRATCH_TANGENT = new Vector3();
const SCRATCH_POSITION = new Vector3();
const SCRATCH_QUATERNION = new Quaternion();

/**
 * Builds a small flat arrowhead shape (triangle pointing +Y in its local
 * frame). Lying in the z=0 plane it reads as a clean 2D pointer when the
 * camera looks straight down at it.
 */
function buildArrowGeometry(): ShapeGeometry {
  const halfWidth = 0.14;
  const length = 0.28;
  const shape = new Shape();
  shape.moveTo(0, length); // tip
  shape.lineTo(-halfWidth, 0); // back-left
  shape.lineTo(halfWidth, 0); // back-right
  shape.lineTo(0, length);
  return new ShapeGeometry(shape);
}

/**
 * A small flat arrow that sits at the current slide's `linePoint` on the
 * visible line curve. Its orientation follows the curve's tangent at that
 * point, so it always reads as "pointing forward" along the path.
 *
 * When the slide changes, GSAP smoothly tweens the shared progress value
 * and the arrow rides forward along the line to the next slide's
 * linePoint.
 */
export function PathArrow({
  curve,
  progressRef,
  totalSlides,
  color = "#ffffff",
}: PathArrowProps) {
  const meshRef = useRef<Mesh>(null);
  const geometry = useMemo(buildArrowGeometry, []);

  useFrame(() => {
    const mesh = meshRef.current;
    if (!mesh || totalSlides < 2) return;

    const progress = progressRef.current.value;
    const t = clamp(progress / (totalSlides - 1), 0, 1);

    // Use getPoint / getTangent (uniform parameterization) rather than
    // getPointAt / getTangentAt (arc-length parameterization) so that at
    // t = i/(n-1) we sit exactly on the i-th linePoint. This matches
    // CameraRig and keeps the arrow visually planted on each slide's
    // anchor corner when the camera comes to rest.
    curve.getPoint(t, SCRATCH_POSITION);
    curve.getTangent(t, SCRATCH_TANGENT).normalize();

    // Keep the arrow flush with the slide plane — drop any z component of
    // the tangent so the flat geometry stays parallel to the plane.
    SCRATCH_TANGENT.z = 0;
    if (SCRATCH_TANGENT.lengthSq() > 1e-6) SCRATCH_TANGENT.normalize();

    mesh.position.set(SCRATCH_POSITION.x, SCRATCH_POSITION.y, 0.01);
    SCRATCH_QUATERNION.setFromUnitVectors(SHAPE_UP, SCRATCH_TANGENT);
    mesh.quaternion.copy(SCRATCH_QUATERNION);
  });

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshBasicMaterial color={color} />
    </mesh>
  );
}
