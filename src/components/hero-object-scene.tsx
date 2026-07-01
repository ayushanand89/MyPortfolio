"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * A slowly self-rotating wireframe torus knot that also leans toward the cursor.
 * Crisp line-art in the accent sage — a deliberately different visual language
 * from the diffuse background blob, so the two 3D layers read as depth rather
 * than clutter.
 */
function Knot() {
  const mesh = useRef<THREE.Mesh>(null);
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      target.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      target.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((_, delta) => {
    const m = mesh.current;
    if (!m) return;
    m.rotation.z += delta * 0.12;
    m.rotation.x = THREE.MathUtils.lerp(
      m.rotation.x,
      target.current.y * 0.6 + 0.35,
      0.045,
    );
    m.rotation.y = THREE.MathUtils.lerp(m.rotation.y, target.current.x * 0.7, 0.045);
  });

  return (
    <mesh ref={mesh} scale={1.35}>
      <torusKnotGeometry args={[1, 0.28, 200, 28]} />
      <meshStandardMaterial
        color="#7cc8a2"
        emissive="#7cc8a2"
        emissiveIntensity={0.4}
        roughness={0.3}
        metalness={0.45}
        wireframe
      />
    </mesh>
  );
}

export default function HeroObjectScene() {
  return (
    <Canvas
      dpr={[1, 1.25]}
      camera={{ position: [0, 0, 4.2], fov: 40 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[4, 3, 5]} intensity={1.4} color="#8fd4ad" />
      <pointLight position={[-4, -2, 2]} intensity={1} color="#8fd4ad" />
      <Knot />
    </Canvas>
  );
}
