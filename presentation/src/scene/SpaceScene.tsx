import { Canvas } from "@react-three/fiber";
import type { ReactNode } from "react";
import { Starfield } from "./Starfield";

interface SpaceSceneProps {
  children: ReactNode;
}

/**
 * Top-level R3F Canvas. The camera floats above the z=0 slide plane and
 * looks straight down; <CameraRig> overrides position/orientation each
 * frame, so the values here only matter for the first frame.
 */
export function SpaceScene({ children }: SpaceSceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 50, near: 0.1, far: 400 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      dpr={[1, 2]}
    >
      <color attach="background" args={["#02020a"]} />
      <fog attach="fog" args={["#02020a", 50, 260]} />

      <ambientLight intensity={0.6} />
      <pointLight position={[0, 0, 10]} intensity={0.5} color="#ffffff" />

      <Starfield />
      {children}
    </Canvas>
  );
}
