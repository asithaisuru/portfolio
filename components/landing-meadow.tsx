'use client';

import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo } from 'react';
import * as THREE from 'three';

/** One grass mesh; the wind bends blade tips while their roots stay planted. */
export function LandingMeadow() {
  const wind = useMemo(() => ({ time: { value: 0 }, motion: { value: 1 } }), []);
  const geometry = useMemo(() => {
    const positions: number[] = [];
    const colors: number[] = [];
    const bends: number[] = [];
    const indices: number[] = [];
    const random = (seed: number) => {
      const value = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
      return value - Math.floor(value);
    };
    for (let i = 0; i < 850; i++) {
      const angle = random(i * 7 + 1) * Math.PI * 2;
      const radius = Math.sqrt(random(i * 7 + 2));
      const x = Math.cos(angle) * radius * 2.8;
      const z = Math.sin(angle) * radius * 1.35;
      // Keep the walking lane and the ship's parking spot clear.
      if ((Math.abs(z) < 0.42 && x > -1.7 && x < 2.1) || (x < -0.8 && z > -1.05 && z < 0.85)) continue;
      const baseY = -0.1 + 0.1 * Math.sqrt(Math.max(0, 1 - (x / 2.95) ** 2 - (z / 1.5) ** 2));
      const height = 0.13 + random(i * 7 + 3) * 0.24;
      const direction = random(i * 7 + 4) * Math.PI * 2;
      const shade = new THREE.Color().setHSL(0.24 + random(i * 7 + 5) * 0.06, 0.33 + random(i * 7 + 6) * 0.2, 0.23 + random(i * 7 + 7) * 0.14);
      const first = positions.length / 3;
      for (let segment = 0; segment <= 3; segment++) {
        const t = segment / 3;
        const width = 0.025 * (1 - t);
        const lean = t * t * 0.06;
        for (const side of [-1, 1]) {
          positions.push(x + Math.cos(direction) * width * side + lean, baseY + height * t, z + Math.sin(direction) * width * side);
          const brightness = 0.78 + t * 0.3;
          colors.push(shade.r * brightness, shade.g * brightness, shade.b * brightness);
          bends.push(t * t);
        }
        if (segment < 3) {
          const n = first + segment * 2;
          indices.push(n, n + 1, n + 2, n + 1, n + 3, n + 2);
        }
      }
    }
    const result = new THREE.BufferGeometry();
    result.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    result.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    result.setAttribute('grassBend', new THREE.Float32BufferAttribute(bends, 1));
    result.setIndex(indices);
    result.computeVertexNormals();
    return result;
  }, []);
  const material = useMemo(() => {
    const result = new THREE.MeshStandardMaterial({ vertexColors: true, side: THREE.DoubleSide, roughness: 1 });
    result.onBeforeCompile = (shader) => {
      shader.uniforms.grassTime = wind.time;
      shader.uniforms.grassMotion = wind.motion;
      shader.vertexShader = `uniform float grassTime; uniform float grassMotion; attribute float grassBend;\n${shader.vertexShader}`;
      shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>', `
        #include <begin_vertex>
        float breeze = sin(grassTime * 1.35 + position.x * 1.7 + position.z * 2.3);
        float ripple = sin(grassTime * 2.1 + position.x * 3.4) * 0.025;
        transformed.x += (breeze * 0.075 + ripple) * grassBend * grassMotion;
        transformed.z += cos(grassTime * 1.1 + position.z * 2.0) * 0.035 * grassBend * grassMotion;
      `);
    };
    return result;
  }, [wind]);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => { wind.motion.value = media.matches ? 0 : 1; };
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, [wind]);
  useEffect(() => () => { geometry.dispose(); material.dispose(); }, [geometry, material]);
  useFrame(({ clock }) => { wind.time.value = clock.elapsedTime; });

  return (
    <group position={[0, -1.42, 0]} name="landing-meadow">
      <mesh position={[0, -0.1, 0]} scale={[2.95, 0.1, 1.5]}>
        <sphereGeometry args={[1, 64, 24]} />
        <meshStandardMaterial color="#668b55" roughness={1} />
      </mesh>
      <mesh geometry={geometry} material={material} frustumCulled={false} name="windblown-grass" />
    </group>
  );
}
