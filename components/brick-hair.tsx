'use client';

import { useMemo } from 'react';
import * as THREE from 'three';

type Lock = { points: [number, number, number][]; radius: number };
const locks: Lock[] = [
  { points: [[-0.45, 0.39, 0.33], [-0.36, 0.56, 0.4], [-0.22, 0.67, 0.4], [-0.06, 0.7, 0.31], [0.1, 0.61, 0.29]], radius: 0.075 },
  { points: [[-0.32, 0.4, 0.44], [-0.2, 0.58, 0.48], [-0.04, 0.65, 0.43], [0.18, 0.57, 0.4], [0.39, 0.43, 0.29]], radius: 0.07 },
  { points: [[-0.16, 0.35, 0.49], [-0.02, 0.5, 0.52], [0.16, 0.55, 0.46], [0.35, 0.48, 0.4], [0.48, 0.3, 0.23]], radius: 0.07 },
  { points: [[-0.42, 0.43, 0.13], [-0.25, 0.68, 0.17], [0.02, 0.73, 0.08], [0.29, 0.6, -0.05], [0.44, 0.42, -0.13]], radius: 0.08 },
  { points: [[-0.34, 0.45, -0.16], [-0.16, 0.66, -0.22], [0.13, 0.66, -0.26], [0.36, 0.48, -0.32]], radius: 0.08 },
  { points: [[-0.46, 0.21, 0.27], [-0.48, 0.35, 0.27], [-0.4, 0.48, 0.3], [-0.3, 0.51, 0.23]], radius: 0.06 },
  { points: [[0.46, 0.15, 0.2], [0.48, 0.32, 0.25], [0.4, 0.46, 0.29], [0.3, 0.52, 0.25]], radius: 0.06 },
];

function HairLock({ points, radius }: Lock) {
  const curve = useMemo(() => new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p))), [points]);
  return (
    <mesh castShadow>
      <tubeGeometry args={[curve, 24, radius, 10, false]} />
      <meshStandardMaterial color="#111216" roughness={0.32} metalness={0.04} />
    </mesh>
  );
}

/** A loose, side-swept wave and shorter sides, modeled after the black hair reference. */
export function BrickHair() {
  return (
    <group>
      <mesh position={[0, 0.39, -0.055]} scale={[1.07, 0.64, 0.98]} castShadow>
        <sphereGeometry args={[0.51, 32, 24]} />
        <meshStandardMaterial color="#090a0d" roughness={0.34} metalness={0.04} />
      </mesh>
      {([-1, 1] as const).map((side) => (
        <mesh key={side} position={[side * 0.455, 0.23, -0.02]} scale={[0.13, 0.29, 0.44]} castShadow>
          <sphereGeometry args={[1, 20, 16]} />
          <meshStandardMaterial color="#0b0c10" roughness={0.38} />
        </mesh>
      ))}
      {locks.map((lock, index) => <HairLock key={index} {...lock} />)}
    </group>
  );
}
