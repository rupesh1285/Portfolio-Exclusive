"use client";

import React, { useRef, useMemo, useLayoutEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";

function NeuralFabric() {
  const geometryRef = useRef<THREE.BufferGeometry>(null);
  const { mouse } = useThree();

  // 1. Generate the initial point data
  const points = useMemo(() => {
    const p = new Float32Array(100 * 100 * 3);
    for (let i = 0; i < 10000; i++) {
      const x = (i % 100) - 50;
      const z = Math.floor(i / 100) - 50;
      p[i * 3] = x * 1.5;
      p[i * 3 + 1] = 0; 
      p[i * 3 + 2] = z * 1.5;
    }
    return p;
  }, []);

  // 2. The "Bulletproof" Fix: Inject the attribute manually
  useLayoutEffect(() => {
    if (geometryRef.current) {
      geometryRef.current.setAttribute(
        "position",
        new THREE.BufferAttribute(points, 3)
      );
    }
  }, [points]);

  // 3. High-Intensity Hover Physics
  useFrame((state) => {
    if (!geometryRef.current) return;
    
    const time = state.clock.getElapsedTime();
    const posAttribute = geometryRef.current.getAttribute("position") as THREE.BufferAttribute;
    
    for (let i = 0; i < 10000; i++) {
      const x = points[i * 3];
      const z = points[i * 3 + 2];
      
      const mouseX = mouse.x * 45; // Wider reach
      const mouseZ = -mouse.y * 45;
      const dist = Math.sqrt((x - mouseX) ** 2 + (z - mouseZ) ** 2);
      
      // Dramatic ripples + physical lift
      const ripple = Math.sin(dist / 3 - time * 4) * 2;
      const hoverEffect = Math.max(0, (25 - dist) / 10) * 6; 
      
      posAttribute.setY(i, (ripple + hoverEffect) * (dist < 30 ? 1 : 0.15));
    }
    posAttribute.needsUpdate = true;
  });

  return (
    <points>
      {/* No more red lines here - we handle attributes in the hook above */}
      <bufferGeometry ref={geometryRef} />
      <pointsMaterial
        size={0.18}
        color="#FFFFFF"
        transparent
        opacity={0.5}
        sizeAttenuation={true}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function BackgroundStage() {
  return (
    <div className="absolute inset-0 z-0 h-full w-full bg-black">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 25, 40]} fov={40} />
        <ambientLight intensity={0.2} />
        <pointLight position={[15, 25, 15]} intensity={2.5} color="#FFFFFF" />
        <spotLight position={[-25, 35, 15]} angle={0.25} penumbra={1} intensity={4} color="#FFFFFF" />
        
        <NeuralFabric />
        
        {/* Floating Architectural Pillars */}
        <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
          <mesh position={[-20, 8, -15]} rotation={[0.2, 0.4, 0]}>
            <boxGeometry args={[5, 12, 0.3]} />
            <meshStandardMaterial color="#222" metalness={1} roughness={0.1} />
          </mesh>
        </Float>

        <fog attach="fog" args={["#000000", 20, 80]} />
      </Canvas>
      
      {/* Noise overlay for that high-end cinematic texture */}
      <div className="pointer-events-none absolute inset-0 z-50 opacity-[0.05] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </div>
  );
}