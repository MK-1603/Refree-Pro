'use client';
import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial } from '@react-three/drei';
import type { Mesh } from 'three';

function Ball() {
  const ref = useRef<Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.6;
      ref.current.rotation.x += delta * 0.1;
    }
  });
  return (
    <Sphere ref={ref} args={[1, 32, 32]}>
      <MeshDistortMaterial color="#0F8A5F" distort={0.15} speed={2} roughness={0.4} metalness={0.6} />
    </Sphere>
  );
}

export function FootballModel({ size = 300 }: { size?: number }) {
  return (
    <div style={{ width: size, height: size }} className="animate-float">
      <Canvas camera={{ position: [0, 0, 3] }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[5, 5, 5]} intensity={1.5} color="#0F8A5F" />
        <pointLight position={[-5, -3, -5]} intensity={0.5} color="#ffffff" />
        <Ball />
      </Canvas>
    </div>
  );
}
