'use client';
import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Golden ratio for Icosahedron vertex calculations
const t = (1 + Math.sqrt(5)) / 2;

const vertices: [number, number, number][] = [
  [-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0],
  [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t],
  [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1]
].map(v => {
  const len = Math.sqrt(v[0]*v[0] + v[1]*v[1] + v[2]*v[2]);
  return [v[0]/len, v[1]/len, v[2]/len] as [number, number, number];
});

const faces = [
  [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11],
  [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
  [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9],
  [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1]
];

function Panel({ position, isPentagon }: { position: [number, number, number]; isPentagon: boolean }) {
  const quaternion = useMemo(() => {
    const q = new THREE.Quaternion();
    const dir = new THREE.Vector3(...position).normalize();
    // Circle geometry faces the Z axis by default
    q.setFromUnitVectors(new THREE.Vector3(0, 0, 1), dir);
    return q;
  }, [position]);

  const scale = new THREE.Vector3(...position).multiplyScalar(1.002);

  return (
    <mesh position={scale} quaternion={quaternion}>
      {/* 5 segments for pentagons, 6 segments for hexagons */}
      <circleGeometry args={[isPentagon ? 0.225 : 0.238, isPentagon ? 5 : 6]} />
      <meshStandardMaterial
        color={isPentagon ? "#1e293b" : "#f8fafc"}
        roughness={isPentagon ? 0.08 : 0.12}
        metalness={isPentagon ? 0.85 : 0.15}
      />
    </mesh>
  );
}

function SoccerBall() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.7;
      groupRef.current.rotation.x += delta * 0.25;
    }
  });

  const pentagonCenters = vertices;

  const hexagonCenters = useMemo(() => {
    return faces.map(face => {
      const vA = vertices[face[0]];
      const vB = vertices[face[1]];
      const vC = vertices[face[2]];
      const x = (vA[0] + vB[0] + vC[0]) / 3;
      const y = (vA[1] + vB[1] + vC[1]) / 3;
      const z = (vA[2] + vB[2] + vC[2]) / 3;
      const len = Math.sqrt(x*x + y*y + z*z);
      return [x/len, y/len, z/len] as [number, number, number];
    });
  }, []);

  return (
    <group ref={groupRef}>
      {/* Inner dark sphere representing seams */}
      <mesh>
        <sphereGeometry args={[0.99, 32, 32]} />
        <meshStandardMaterial color="#0f172a" roughness={0.6} metalness={0.4} />
      </mesh>

      {/* 12 black pentagons at icosahedron vertices */}
      {pentagonCenters.map((pos, i) => (
        <Panel key={`pent-${i}`} position={pos} isPentagon={true} />
      ))}

      {/* 20 white hexagons at icosahedron face centers */}
      {hexagonCenters.map((pos, i) => (
        <Panel key={`hex-${i}`} position={pos} isPentagon={false} />
      ))}
    </group>
  );
}

export function FootballModel({ size = 300 }: { size?: number }) {
  return (
    <div className="flex flex-col items-center justify-center">
      <div style={{ width: size, height: size }} className="animate-float">
        <Canvas camera={{ position: [0, 0, 2.5] }}>
          <ambientLight intensity={0.55} />
          {/* Professional directional keylight for specularity */}
          <directionalLight 
            position={[4, 5, 3]} 
            intensity={1.8} 
            color="#ffffff"
          />
          {/* Blue accent backlight */}
          <pointLight position={[-4, -2, -3]} intensity={1.5} color="#3b82f6" />
          <SoccerBall />
        </Canvas>
      </div>
      {/* Glowing breathing drop shadow underneath ball */}
      <div className="w-24 h-1.5 bg-primary/15 rounded-full blur-md mt-2 animate-pulse" />
    </div>
  );
}
