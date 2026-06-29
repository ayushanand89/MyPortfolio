"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sparkles } from "@react-three/drei";
import { useEffect, useRef } from "react";
import * as THREE from "three";

type Palette = {
  base: string;
  spark: string;
  ambient: number;
  point: number;
};

function Blob({ base, spark, ambient, point }: Palette) {
  const group = useRef<THREE.Group>(null);
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      target.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      target.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame(() => {
    const g = group.current;
    if (!g) return;
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, target.current.x * 0.5, 0.04);
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, target.current.y * 0.3, 0.04);
    g.rotation.z += 0.0007;
  });

  return (
    <>
      <ambientLight intensity={ambient} />
      <directionalLight position={[5, 4, 6]} intensity={point * 1.6} color={spark} />
      <pointLight position={[-5, -3, 2]} intensity={point} color={spark} />

      <group ref={group} position={[1.2, 0.15, 0]}>
        <Float speed={1.1} rotationIntensity={0.6} floatIntensity={0.9}>
          <mesh scale={2.7}>
            <sphereGeometry args={[1, 64, 64]} />
            <MeshDistortMaterial
              color={base}
              emissive={base}
              emissiveIntensity={0.25}
              distort={0.45}
              speed={1.4}
              roughness={0.35}
              metalness={0.35}
              transparent
              opacity={0.98}
            />
          </mesh>
        </Float>
      </group>

      <Sparkles
        count={45}
        scale={[15, 10, 6]}
        size={2.4}
        speed={0.35}
        opacity={0.65}
        color={spark}
      />
    </>
  );
}

export default function BackdropScene(palette: Palette) {
  return (
    <Canvas
      dpr={[1, 1.25]}
      camera={{ position: [0, 0, 5], fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      frameloop="always"
    >
      <Blob {...palette} />
    </Canvas>
  );
}
