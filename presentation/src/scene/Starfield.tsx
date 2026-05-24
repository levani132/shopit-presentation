import { Stars } from "@react-three/drei";

/**
 * Distant starfield using drei's built-in <Stars>. A second, denser cluster
 * gives the scene a sense of depth: as the camera moves the closer stars
 * parallax visibly, while the far layer feels like fixed background.
 */
export function Starfield() {
  return (
    <>
      <Stars
        radius={120}
        depth={60}
        count={6000}
        factor={4}
        saturation={0}
        fade
        speed={0.4}
      />
      <Stars
        radius={45}
        depth={20}
        count={800}
        factor={2}
        saturation={0.4}
        fade
        speed={1.2}
      />
    </>
  );
}
