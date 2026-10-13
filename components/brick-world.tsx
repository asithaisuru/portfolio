'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { PrintedBrickFace } from './brick-face';
import { LandingMeadow } from './landing-meadow';
import { BrickHair } from './brick-hair';

export type BrickOutfit = 'hello' | 'suit' | 'graduate' | 'work' | 'maker' | 'pilot' | 'contact';
export type BrickMovement = 'idle' | 'drop' | 'climb' | 'walk' | 'wave';
export type BrickEntry = 'none' | 'drop' | 'climb';
export type BrickInteraction = 'idle' | 'present' | 'build' | 'celebrate' | 'email' | 'phone' | 'github' | 'linkedin';
export type ContactInteraction = Extract<BrickInteraction, 'idle' | 'email' | 'phone' | 'github' | 'linkedin'>;

type Cursor = { x: number; y: number };

const ink = '#172b45';
// The reference minifigure has light warm plastic skin, printed facial hair,
// square glasses, sculpted swept hair and a charcoal everyday outfit.
const skin = '#dbb69e';
const headRadius = 0.49;

function useCursor() {
  const cursor = useRef<Cursor>({ x: 0, y: 0 });

  useEffect(() => {
    const move = (event: PointerEvent) => {
      cursor.current.x = (event.clientX / window.innerWidth - 0.5) * 2;
      cursor.current.y = (event.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => window.removeEventListener('pointermove', move);
  }, []);

  return cursor;
}

function useWebGL() {
  const [available, setAvailable] = useState(false);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      setAvailable(Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl')));
    } catch {
      setAvailable(false);
    }
  }, []);

  return available;
}


function MiniTorso({ color }: { color: string }) {
  const outline = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-0.52, 0.49);
    shape.lineTo(0.52, 0.49);
    shape.lineTo(0.64, -0.49);
    shape.lineTo(-0.64, -0.49);
    shape.closePath();
    return shape;
  }, []);

  return (
    <mesh position={[0, 0.18, -0.275]} castShadow>
      <extrudeGeometry args={[outline, { depth: 0.55, bevelEnabled: true, bevelSize: 0.04, bevelThickness: 0.035, bevelSegments: 2, curveSegments: 4 }]} />
      <meshStandardMaterial color={color} metalness={0.03} roughness={0.28} />
    </mesh>
  );
}

/** The hero's formal suit, inspired by the reference portrait. */
function SuitDetails() {
  const shapes = useMemo(() => {
    const polygon = (points: [number, number][]) => {
      const shape = new THREE.Shape();
      points.forEach(([x, y], index) => index === 0 ? shape.moveTo(x, y) : shape.lineTo(x, y));
      shape.closePath();
      return shape;
    };

    return {
      shirt: polygon([[-0.29, 0.62], [0.29, 0.62], [0.16, -0.27], [-0.16, -0.27]]),
      leftLapel: polygon([[-0.52, 0.62], [-0.2, 0.61], [-0.25, 0.46], [-0.045, 0.18], [-0.23, -0.075], [-0.57, 0.13]]),
      rightLapel: polygon([[0.52, 0.62], [0.2, 0.61], [0.25, 0.46], [0.045, 0.18], [0.23, -0.075], [0.57, 0.13]]),
      leftCollar: polygon([[-0.24, 0.61], [-0.02, 0.47], [-0.12, 0.34]]),
      rightCollar: polygon([[0.24, 0.61], [0.02, 0.47], [0.12, 0.34]]),
      tieKnot: polygon([[0, 0.43], [-0.085, 0.36], [0, 0.27], [0.085, 0.36]]),
      tie: polygon([[-0.047, 0.27], [0.047, 0.27], [0.068, -0.13], [0, -0.225], [-0.068, -0.13]]),
    };
  }, []);

  return (
    <group>
      <mesh position={[0, 0, 0.335]}><shapeGeometry args={[shapes.shirt]} /><meshStandardMaterial color="#faf9f6" side={THREE.DoubleSide} roughness={0.75} /></mesh>
      {([shapes.leftLapel, shapes.rightLapel]).map((lapel, index) => (
        <mesh key={index} position={[0, 0, 0.349]} castShadow>
          <shapeGeometry args={[lapel]} />
          <meshStandardMaterial color="#1e2b41" side={THREE.DoubleSide} metalness={0.05} roughness={0.31} />
        </mesh>
      ))}
      {([shapes.leftCollar, shapes.rightCollar]).map((collar, index) => (
        <mesh key={index} position={[0, 0, 0.36]}>
          <shapeGeometry args={[collar]} />
          <meshStandardMaterial color="#ffffff" side={THREE.DoubleSide} roughness={0.8} />
        </mesh>
      ))}
      <mesh position={[0, 0, 0.371]}><shapeGeometry args={[shapes.tie]} /><meshStandardMaterial color="#101218" side={THREE.DoubleSide} roughness={0.4} /></mesh>
      <mesh position={[0, 0, 0.379]}><shapeGeometry args={[shapes.tieKnot]} /><meshStandardMaterial color="#0d111b" side={THREE.DoubleSide} roughness={0.38} /></mesh>
      <mesh position={[0.4, 0.26, 0.365]} rotation={[0, 0, 0.075]}>
        <boxGeometry args={[0.19, 0.055, 0.016]} />
        <meshStandardMaterial color="#f7f9fa" roughness={0.7} />
      </mesh>
      <mesh position={[0.16, -0.16, 0.347]}>
        <sphereGeometry args={[0.026, 10, 8]} />
        <meshStandardMaterial color="#313b4b" metalness={0.15} roughness={0.38} />
      </mesh>
    </group>
  );
}

export function BrickFigure({
  outfit,
  movement = 'idle',
  interaction = 'idle',
  entry = 'none',
  entryKey = 0,
  cursor,
  controlTarget,
  autoWave = true,
}: {
  outfit: BrickOutfit;
  movement?: BrickMovement;
  interaction?: BrickInteraction;
  entry?: BrickEntry;
  entryKey?: number;
  cursor?: React.RefObject<Cursor>;
  autoWave?: boolean;
  /** A contact-console button position in the figure's own local coordinates. */
  controlTarget?: readonly [number, number, number];
}) {
  const root = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const rightArm = useRef<THREE.Group>(null);
  const leftArm = useRef<THREE.Group>(null);
  const rightLeg = useRef<THREE.Group>(null);
  const leftLeg = useRef<THREE.Group>(null);
  const entrance = useRef<{ mode: BrickEntry; startedAt: number }>({ mode: entry, startedAt: -1 });

  useEffect(() => {
    entrance.current = { mode: entry, startedAt: -1 };
  }, [entry, entryKey]);

  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime;
    const arrival = entrance.current;
    const entranceMoving = arrival.mode !== 'none';
    const motion = entranceMoving ? arrival.mode : movement;
    const isMoving = motion === 'walk' || motion === 'climb' || motion === 'drop';
    const stride = motion === 'climb' ? 0.75 : motion === 'drop' ? 0.48 : motion === 'walk' ? 0.55 : 0;
    const wave = autoWave && interaction === 'idle' && (outfit === 'hello' || outfit === 'suit' || (outfit === 'contact' && !controlTarget) || movement === 'wave') && !isMoving;
    let rightPose = wave ? -2.1 + Math.sin(t * 7) * 0.23 : -0.15 + (motion === 'walk' ? 0 : Math.sin(t * 9) * stride);
    let leftPose = 0.16 + (motion === 'walk' ? 0 : Math.sin(t * 9 + Math.PI) * stride);

    if (interaction === 'present') rightPose = -1.3 + Math.sin(t * 2.8) * 0.12;
    if (interaction === 'build' || interaction === 'email' || interaction === 'github') {
      rightPose = -0.85 + Math.sin(t * 7) * 0.18;
      leftPose = 0.85 - Math.sin(t * 7) * 0.16;
    }
    if (interaction === 'celebrate' || interaction === 'linkedin') {
      rightPose = -2.22 + Math.sin(t * 5) * 0.16;
      leftPose = 2.22 + Math.sin(t * 5 + 1) * 0.16;
    }
    if (interaction === 'phone') rightPose = -2.45 + Math.sin(t * 3) * 0.06;

    // Brief section-to-section travel takes priority over card gestures. Once
    // the character arrives, it resumes interacting with the local content.
    if (entranceMoving) {
      rightPose = arrival.mode === 'climb' ? -2.12 + Math.sin(t * 12) * 0.34 : -1.30;
      leftPose = arrival.mode === 'climb' ? 2.12 + Math.sin(t * 12 + Math.PI) * 0.34 : 1.30;
    }

    const operating = outfit === 'contact' && controlTarget && !isMoving;

    if (root.current) {
      root.current.rotation.y = THREE.MathUtils.damp(root.current.rotation.y, operating ? 0.08 + (cursor?.current.x ?? 0) * 0.04 : (cursor?.current.x ?? 0) * 0.19 + Math.sin(t * 0.5) * 0.055 + (interaction !== 'idle' ? 0.22 : 0), 3, delta);
      root.current.rotation.z = THREE.MathUtils.damp(root.current.rotation.z, (cursor?.current.x ?? 0) * -0.04, 3, delta);
      let entranceOffset = 0;
      if (entranceMoving) {
        if (arrival.startedAt < 0) arrival.startedAt = t;
        const progress = Math.min(1, (t - arrival.startedAt) / 0.86);
        const eased = 1 - Math.pow(1 - progress, 3);
        entranceOffset = (arrival.mode === 'drop' ? 2.85 : -2.85) * (1 - eased) + Math.sin(progress * Math.PI) * 0.22;
        if (progress === 1) arrival.mode = 'none';
      }
      root.current.position.y = entranceOffset + Math.sin(t * (isMoving ? 8 : 2.3)) * (motion === 'walk' ? 0.025 : isMoving ? 0.075 : operating ? 0.012 : 0.035);
    }

    if (head.current) {
      head.current.rotation.y = THREE.MathUtils.damp(head.current.rotation.y, operating ? 0.35 + (cursor?.current.x ?? 0) * 0.07 : (cursor?.current.x ?? 0) * 0.32, 5, delta);
      // Pointer Y grows downward; positive X rotation tilts the face downward in Three.js.
      head.current.rotation.x = THREE.MathUtils.damp(head.current.rotation.x, operating ? -0.13 : (cursor?.current.y ?? 0) * 0.16, 5, delta);
    }
    if (rightArm.current) {
      rightArm.current.rotation.z = THREE.MathUtils.damp(rightArm.current.rotation.z, rightPose, 7, delta);
      rightArm.current.rotation.x = THREE.MathUtils.damp(rightArm.current.rotation.x, motion === 'walk' ? Math.sin(t * 9 + Math.PI) * 0.45 : 0, 7, delta);
    }
    if (leftArm.current) {
      if (operating) {
        // Aim the claw at the selected 3D key instead of posing the arm in place.
        const direction = new THREE.Vector3(controlTarget[0] - 0.74, controlTarget[1] - 0.52, controlTarget[2]);
        const distance = direction.length();
        const rotation = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, -1, 0), direction.normalize());
        leftArm.current.quaternion.slerp(rotation, 1 - Math.exp(-10 * delta));
        leftArm.current.scale.y = THREE.MathUtils.damp(leftArm.current.scale.y, THREE.MathUtils.clamp(distance / 0.78, 0.7, 1.12), 9, delta);
        // The claw pushes into the key. The key itself depresses on the same beat.
        const tap = Math.pow(Math.max(0, Math.sin(t * 5)), 8);
        leftArm.current.position.z = THREE.MathUtils.damp(leftArm.current.position.z, -tap * 0.055, 12, delta);
      } else {
        const rest = new THREE.Quaternion().setFromEuler(new THREE.Euler(motion === 'walk' ? Math.sin(t * 9) * 0.45 : 0, 0, leftPose));
        leftArm.current.quaternion.slerp(rest, 1 - Math.exp(-9 * delta));
        leftArm.current.scale.y = THREE.MathUtils.damp(leftArm.current.scale.y, 1, 9, delta);
        leftArm.current.position.z = THREE.MathUtils.damp(leftArm.current.position.z, 0, 9, delta);
      }
    }
    if (rightLeg.current) rightLeg.current.rotation.x = THREE.MathUtils.damp(rightLeg.current.rotation.x, Math.sin(t * 9) * stride, 7, delta);
    if (leftLeg.current) leftLeg.current.rotation.x = THREE.MathUtils.damp(leftLeg.current.rotation.x, -Math.sin(t * 9) * stride, 7, delta);
  });

  const graduating = outfit === 'graduate';
  const working = outfit === 'work';
  const piloting = outfit === 'pilot';
  const suited = outfit === 'suit';
  const casual = outfit === 'hello' || outfit === 'contact';
  const shirt = suited ? '#131d2e' : casual ? '#515158' : graduating ? '#263c7b' : piloting ? '#e7eaf0' : working ? '#42637e' : '#1b9d99';

  return (
    <group ref={root}>
      <MiniTorso color={shirt} />
      {suited && <SuitDetails />}
      {!casual && !suited && (
        <mesh position={[0, 0.19, 0.319]}>
          <boxGeometry args={[0.28, 0.60, 0.018]} />
          <meshStandardMaterial color={graduating ? '#f9c64f' : working ? '#edb96e' : '#fff0d4'} roughness={0.4} />
        </mesh>
      )}
      <mesh position={[0, 0.77, 0]}>
        <cylinderGeometry args={[0.18, 0.18, 0.16, 24]} />
        <meshStandardMaterial color={skin} />
      </mesh>

      {([-1, 1] as const).map((side) => (
        <group key={side} ref={side === -1 ? rightArm : leftArm} position={[side * 0.74, 0.52, 0]}>
          <mesh position={[side * 0.025, -0.29, 0]} castShadow>
            <capsuleGeometry args={[0.245, 0.18, 8, 14]} />
            <meshStandardMaterial color={shirt} roughness={0.3} />
          </mesh>
          <mesh position={[side * 0.025, -0.66, 0]} castShadow>
            <cylinderGeometry args={[0.145, 0.145, 0.21, 18]} />
            <meshStandardMaterial color={skin} />
          </mesh>
          <mesh position={[side * 0.025, -0.78, 0.02]} castShadow>
            <torusGeometry args={[0.14, 0.072, 8, 18, Math.PI * 1.78]} />
            <meshStandardMaterial color={skin} />
          </mesh>
          {graduating && side === -1 && (
            <group position={[-0.04, -0.83, 0.36]} rotation={[0.3, 0, 0.65]}>
              <mesh><cylinderGeometry args={[0.12, 0.12, 0.52, 20]} /><meshStandardMaterial color="#fff8e8" /></mesh>
              <mesh position={[0, -0.24, 0]}><cylinderGeometry args={[0.138, 0.138, 0.055, 20]} /><meshStandardMaterial color="#eaa643" /></mesh>
            </group>
          )}
          {working && side === -1 && (
            <group position={[0, -0.8, 0.2]}>
              <mesh position={[0, -0.29, 0]} castShadow><boxGeometry args={[0.62, 0.43, 0.21]} /><meshStandardMaterial color="#283e5b" roughness={0.6} /></mesh>
              <mesh position={[0, -0.055, 0]}><boxGeometry args={[0.24, 0.10, 0.12]} /><meshStandardMaterial color="#f0bd76" /></mesh>
            </group>
          )}
        </group>
      ))}

      {([-1, 1] as const).map((side) => (
        <group key={side} ref={side === -1 ? rightLeg : leftLeg} position={[side * 0.295, -0.38, 0]}>
          <mesh position={[0, -0.4, 0]} castShadow>
            <boxGeometry args={[0.47, 0.79, 0.56]} />
            <meshStandardMaterial color={suited ? '#131b2b' : piloting ? '#637a9a' : casual ? '#484950' : '#29476b'} roughness={0.3} />
          </mesh>
          <mesh position={[0, -0.83, 0.16]} castShadow>
            <boxGeometry args={[0.5, 0.18, 0.86]} />
            <meshStandardMaterial color={suited ? '#0c1422' : casual ? '#44454b' : ink} roughness={0.28} />
          </mesh>
        </group>
      ))}

      <group ref={head} position={[0, 1.2, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[headRadius, headRadius, 0.77, 40]} />
          <meshStandardMaterial color={skin} roughness={0.56} />
        </mesh>
        <mesh position={[0, 0.415, 0]}>
          <cylinderGeometry args={[0.28, 0.28, 0.12, 32]} />
          <meshStandardMaterial color={skin} />
        </mesh>
        {([-1, 1] as const).map((side) => (
          <mesh key={side} position={[side * 0.505, -0.045, 0]}>
            <sphereGeometry args={[0.1, 12, 12]} />
            <meshStandardMaterial color={skin} roughness={0.62} />
          </mesh>
        ))}

        <PrintedBrickFace radius={headRadius} />

        {!piloting && <BrickHair />}

        {graduating ? (
          <group position={[0, 0.61, 0]}>
            <mesh><boxGeometry args={[0.98, 0.22, 0.97]} /><meshStandardMaterial color={ink} /></mesh>
            <mesh position={[0, 0.16, 0]}><boxGeometry args={[1.38, 0.08, 1.38]} /><meshStandardMaterial color={ink} /></mesh>
            <mesh position={[0.56, -0.06, 0.48]}><cylinderGeometry args={[0.027, 0.027, 0.46, 10]} /><meshStandardMaterial color="#f8b545" /></mesh>
            <mesh position={[0.56, -0.29, 0.48]}><sphereGeometry args={[0.075, 12, 12]} /><meshStandardMaterial color="#f8b545" /></mesh>
          </group>
        ) : piloting ? (
          <group>
            <mesh position={[0, 0.34, 0]}><sphereGeometry args={[0.54, 32, 24]} /><meshStandardMaterial color="#f6f5ec" /></mesh>
            <mesh position={[0, 0.0, 0.26]}><sphereGeometry args={[0.52, 32, 24]} /><meshStandardMaterial color="#9fd5ed" transparent opacity={0.26} metalness={0.1} /></mesh>
            <mesh position={[0, 0.34, 0.48]}><boxGeometry args={[0.5, 0.08, 0.12]} /><meshStandardMaterial color="#ef8960" /></mesh>
          </group>
        ) : (
          null
        )}
      </group>

      {outfit === 'maker' && (
        <group position={[0.05, -0.02, 0.39]}>
          <mesh><boxGeometry args={[0.35, 0.22, 0.04]} /><meshStandardMaterial color="#f3da9c" /></mesh>
          <mesh position={[0, 0, 0.025]}><boxGeometry args={[0.23, 0.04, 0.015]} /><meshStandardMaterial color={ink} /></mesh>
        </group>
      )}
    </group>
  );
}

export function BrickCharacterCanvas({
  outfit = 'hello',
  movement = 'idle',
  interaction = 'idle',
  entry = 'none',
  entryKey = 0,
  className = '',
  showPlatform = false,
  autoWave = true,
  active = true,
}: {
  outfit?: BrickOutfit;
  movement?: BrickMovement;
  interaction?: BrickInteraction;
  entry?: BrickEntry;
  entryKey?: number;
  className?: string;
  showPlatform?: boolean;
  autoWave?: boolean;
  active?: boolean;
}) {
  const cursor = useCursor();
  const hasWebGL = useWebGL();

  return (
    <div className={`relative h-full w-full ${className}`} aria-label={`Interactive 3D brick likeness of Asitha, with short dark hair, glasses and a trimmed beard, dressed for ${outfit}`} role="img">
      {hasWebGL ? (
        <Canvas resize={{ scroll: false, offsetSize: true, debounce: 0 }} frameloop={active ? 'always' : 'never'} style={{ pointerEvents: 'none' }} dpr={[1, 1.75]} camera={{ position: [0, 1.0, 6.1], fov: 40 }} gl={{ alpha: true, antialias: true }}>
          <ambientLight intensity={2.2} />
          <directionalLight position={[-3, 6, 6]} intensity={2.1} />
          <directionalLight position={[3, 2, -2]} intensity={1.1} />
          <group position={[0, -0.25, 0]}>
            <BrickFigure outfit={outfit} movement={movement} interaction={interaction} entry={entry} entryKey={entryKey} autoWave={autoWave} cursor={cursor} />
            {showPlatform && (
              <group position={[0, -1.38, 0]}>
                <mesh position={[0, -0.06, 0]}><cylinderGeometry args={[1.42, 1.55, 0.28, 64]} /><meshStandardMaterial color="#e6dfce" /></mesh>
                <mesh position={[0, 0.06, 0]}><cylinderGeometry args={[1.42, 1.42, 0.08, 64]} /><meshStandardMaterial color="#faf4e7" /></mesh>
              </group>
            )}
          </group>
        </Canvas>
      ) : (
        <div className="flex h-full w-full items-center justify-center" aria-hidden="true">
          <div className={`brick-fallback ${outfit === 'suit' ? 'brick-fallback--suit' : ''}`}>
            <div className="brick-fallback-hair" />
            <div className="brick-fallback-face">
              <span className="brick-fallback-glasses" />
              <span className="brick-fallback-beard" />
              <span className="brick-fallback-mouth" />
            </div>
            <div className="brick-fallback-shirt" />
            <div className="brick-fallback-feet" />
          </div>
        </div>
      )}
    </div>
  );
}

type PlanetKind = 'ocean' | 'gas' | 'desert' | 'ice' | 'lava' | 'forest';
const planetThemes: { kind: PlanetKind; main: string; highlight: string; shadow: string; glow: string; ring: string }[] = [
  { kind: 'ocean', main: '#146b92', highlight: '#8bc9a1', shadow: '#0c234b', glow: '#78d8e3', ring: '#9dcbdf' },
  { kind: 'gas', main: '#9a76b9', highlight: '#edb5bc', shadow: '#423867', glow: '#d0a6ef', ring: '#dec8a1' },
  { kind: 'desert', main: '#b55a3c', highlight: '#eac38c', shadow: '#552d36', glow: '#f1b37b', ring: '#edae75' },
  { kind: 'ice', main: '#4186ac', highlight: '#cbeafa', shadow: '#183c71', glow: '#93e4fe', ring: '#b8dfff' },
  { kind: 'lava', main: '#462937', highlight: '#ec7044', shadow: '#1d1728', glow: '#ff996d', ring: '#e5a680' },
  { kind: 'forest', main: '#416b50', highlight: '#bfcb7c', shadow: '#172f3e', glow: '#b4e4a8', ring: '#d9d6a9' },
];

/** Tile-free noise sampled on the sphere itself: the planet's texture seam closes cleanly. */
function latticeNoise(x: number, y: number, z: number, seed: number) {
  let hash = Math.imul(x, 374761393) + Math.imul(y, 668265263) + Math.imul(z, 1442695041) + Math.imul(seed, 1013904223);
  hash = Math.imul(hash ^ (hash >>> 13), 1274126177);
  return ((hash ^ (hash >>> 16)) >>> 0) / 4294967295;
}

function smoothNoise3D(x: number, y: number, z: number, seed: number) {
  const ix = Math.floor(x), iy = Math.floor(y), iz = Math.floor(z);
  const sx = x - ix, sy = y - iy, sz = z - iz;
  const fx = sx * sx * (3 - 2 * sx);
  const fy = sy * sy * (3 - 2 * sy);
  const fz = sz * sz * (3 - 2 * sz);
  const at = (dx: number, dy: number, dz: number) => latticeNoise(ix + dx, iy + dy, iz + dz, seed);
  const near = THREE.MathUtils.lerp(
    THREE.MathUtils.lerp(at(0, 0, 0), at(1, 0, 0), fx),
    THREE.MathUtils.lerp(at(0, 1, 0), at(1, 1, 0), fx), fy,
  );
  const far = THREE.MathUtils.lerp(
    THREE.MathUtils.lerp(at(0, 0, 1), at(1, 0, 1), fx),
    THREE.MathUtils.lerp(at(0, 1, 1), at(1, 1, 1), fx), fy,
  );
  return THREE.MathUtils.lerp(near, far, fz);
}

function fractalNoise3D(x: number, y: number, z: number, seed: number, octaves = 4) {
  let sum = 0, weight = 0, frequency = 1, amplitude = 1;
  for (let layer = 0; layer < octaves; layer++) {
    sum += smoothNoise3D(x * frequency, y * frequency, z * frequency, seed + layer * 19) * amplitude;
    weight += amplitude;
    frequency *= 2.06;
    amplitude *= 0.52;
  }
  return sum / weight;
}

function planetColor(hex: string): [number, number, number] {
  return [1, 3, 5].map((at) => parseInt(hex.slice(at, at + 2), 16)) as [number, number, number];
}

function planetDataTexture(pixels: Uint8Array, width: number, height: number, color = false) {
  const texture = new THREE.DataTexture(pixels, width, height, THREE.RGBAFormat);
  if (color) texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;
  texture.needsUpdate = true;
  return texture;
}

/** Offline-generated, continuous spherical albedo, relief, illuminated lava, and high clouds. */
function makePlanetMaps(index: number) {
  const theme = planetThemes[index % planetThemes.length];
  const width = 512, height = 256;
  const albedo = new Uint8Array(width * height * 4);
  const relief = new Uint8Array(width * height * 4);
  const lavaLight = theme.kind === 'lava' ? new Uint8Array(width * height * 4) : null;
  const cloudCover = ['ocean', 'ice', 'forest'].includes(theme.kind) ? new Uint8Array(width * height * 4) : null;
  const base = planetColor(theme.main), bright = planetColor(theme.highlight), dark = planetColor(theme.shadow);
  const seed = 137 + index * 59;
  const craters = theme.kind === 'desert' ? Array.from({ length: 11 }, (_, i) => {
    const longitude = i * 2.39996 + index * 1.19;
    const latitude = Math.asin(-1 + 2 * (i + 0.5) / 11);
    return { x: Math.cos(longitude) * Math.cos(latitude), y: Math.sin(latitude), z: Math.sin(longitude) * Math.cos(latitude), radius: 0.065 + (i % 4) * 0.027 };
  }) : [];

  for (let y = 0; y < height; y++) {
    const latitude = Math.PI * (y + 0.5) / height;
    const sy = Math.cos(latitude);
    const spread = Math.sin(latitude);
    const polar = Math.abs(sy);

    for (let x = 0; x < width; x++) {
      const longitude = (x / width) * Math.PI * 2;
      const sx = spread * Math.cos(longitude), sz = spread * Math.sin(longitude);
      const continent = fractalNoise3D(sx * 2.65 + seed * 0.02, sy * 2.65, sz * 2.65, seed, 5);
      const fine = fractalNoise3D(sx * 12.8, sy * 12.8, sz * 12.8, seed + 83, 3);
      const warp = smoothNoise3D(sx * 4.7, sy * 4.7, sz * 4.7, seed + 130);
      const rugged = Math.abs(fine - 0.5) * 2;
      let shade = 0.76 + fine * 0.40;
      let amount = continent;
      let glow = 0;
      let heightField = continent * 0.75 + fine * 0.25;
      let colorA = dark, colorB = bright;

      if (theme.kind === 'ocean' || theme.kind === 'forest') {
        const coast = continent + (warp - 0.5) * 0.32 + (fine - 0.5) * 0.055;
        const land = THREE.MathUtils.smoothstep(coast, theme.kind === 'ocean' ? 0.51 : 0.455, theme.kind === 'ocean' ? 0.57 : 0.53);
        // Dark deep water, shallow bright shorelines, detailed landmasses.
        amount = 0.13 + land * (0.72 + (fine - 0.5) * 0.20);
        shade += (1 - land) * 0.10;
        heightField = Math.max(0.1, land * (continent + rugged * 0.23));
      } else if (theme.kind === 'gas') {
        const swirl = (warp - 0.5) * 24 + (continent - 0.5) * 19;
        const belts = Math.sin(sy * 85 + swirl) * 0.28 + Math.sin(sy * 37 - swirl * 0.5) * 0.19;
        const storm = Math.exp(-((sx - 0.62) ** 2 / 0.045 + (sy + 0.15) ** 2 / 0.02 + (sz - 0.47) ** 2 / 0.13));
        amount = 0.49 + belts + storm * 0.45;
        shade = 0.84 + fine * 0.25;
        heightField = 0.5;
      } else if (theme.kind === 'desert') {
        colorA = base;
        const dunes = Math.sin(sy * 100 + (continent - 0.5) * 32 + longitude * 3) * 0.11;
        amount = 0.4 + (continent - 0.5) * 1.15 + (fine - 0.5) * 0.3 + dunes;
        for (const crater of craters) {
          const distance = Math.hypot(sx - crater.x, sy - crater.y, sz - crater.z);
          const rim = Math.max(0, 1 - Math.abs(distance - crater.radius) / 0.022);
          const basin = Math.max(0, 1 - distance / crater.radius);
          shade += rim * 0.22 - basin * 0.27;
          heightField += rim * 0.18 - basin * 0.21;
        }
      } else if (theme.kind === 'ice') {
        colorA = base;
        const cracks = 1 - THREE.MathUtils.smoothstep(Math.abs(continent - 0.50 + (fine - 0.5) * 0.22), 0.008, 0.039);
        amount = 0.28 + polar * 0.52 + (continent - 0.5) * 0.5 - cracks * 0.43;
        shade += (rugged - 0.45) * 0.14;
        heightField += rugged * 0.33;
      } else if (theme.kind === 'lava') {
        // Molten fault lines sit between contiguous basalt plates, rather than glowing spots.
        const fault = Math.abs(continent - 0.5 + (fine - 0.5) * 0.18);
        const crack = 1 - THREE.MathUtils.smoothstep(fault, 0.009, 0.065);
        const lake = THREE.MathUtils.smoothstep(0.42 - continent + (warp - 0.5) * 0.07, 0.025, 0.11);
        glow = THREE.MathUtils.clamp(crack * 0.83 + lake * 0.96, 0, 1);
        amount = glow * 0.94 + (fine - 0.5) * 0.05;
        shade = 0.72 + fine * 0.42;
        heightField = 0.33 + rugged * 0.42 - glow * 0.19;
      }

      amount = THREE.MathUtils.clamp(amount, 0, 1);
      const iceCap = (theme.kind === 'ocean' || theme.kind === 'forest') ? THREE.MathUtils.smoothstep(polar, 0.84, 0.98) * 0.93 : 0;
      const pixel = (y * width + x) * 4;
      for (let channel = 0; channel < 3; channel++) {
        const raw = (colorA[channel] * (1 - amount) + colorB[channel] * amount) * shade;
        albedo[pixel + channel] = THREE.MathUtils.clamp(raw * (1 - iceCap) + (channel === 0 ? 225 : channel === 1 ? 238 : 245) * iceCap, 0, 255);
      }
      albedo[pixel + 3] = 255;
      const bump = THREE.MathUtils.clamp(heightField * 255, 0, 255);
      relief[pixel] = relief[pixel + 1] = relief[pixel + 2] = bump;
      relief[pixel + 3] = 255;

      if (lavaLight) {
        const light = Math.round(glow * 255);
        lavaLight[pixel] = lavaLight[pixel + 1] = lavaLight[pixel + 2] = light;
        lavaLight[pixel + 3] = 255;
      }
      if (cloudCover) {
        const clouds = fractalNoise3D(sx * 6.2, sy * 6.2, sz * 6.2, seed + 225, 3);
        const coverage = THREE.MathUtils.smoothstep(clouds, 0.51, 0.64) * (1 - polar * 0.38);
        cloudCover[pixel] = 229;
        cloudCover[pixel + 1] = 242;
        cloudCover[pixel + 2] = 255;
        cloudCover[pixel + 3] = Math.round(coverage * 180);
      }
    }
  }

  return {
    surface: planetDataTexture(albedo, width, height, true),
    relief: planetDataTexture(relief, width, height),
    lava: lavaLight ? planetDataTexture(lavaLight, width, height) : null,
    clouds: cloudCover ? planetDataTexture(cloudCover, width, height, true) : null,
  };
}

function Stars({ paused = false }: { paused?: boolean }) {
  const stars = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const points = new Float32Array(1400 * 3);
    for (let i = 0; i < 1400; i++) {
      points[i * 3] = Math.sin(i * 127.1) * 17;
      points[i * 3 + 1] = Math.cos(i * 89.7) * 12;
      points[i * 3 + 2] = -6.5 + Math.sin(i * 28.3) * 5;
    }
    return points;
  }, []);

  useFrame((_, delta) => { if (stars.current && !paused) stars.current.rotation.y += delta * 0.0025; });

  return (
    <points ref={stars}>
      <bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]} /></bufferGeometry>
      <pointsMaterial color="#f0f9ff" size={0.045} transparent opacity={0.9} sizeAttenuation depthWrite={false} />
    </points>
  );
}

/** Streaks approach the chase camera so moving between destinations feels like flying. */
function FlightStreaks({ paused }: { paused: boolean }) {
  const trails = useRef<THREE.LineSegments>(null);
  const positions = useMemo(() => {
    const points = new Float32Array(64 * 6);
    for (let i = 0; i < 64; i++) {
      const x = Math.sin(i * 73.1) * (2.5 + (i % 5) * 0.8);
      const y = Math.cos(i * 51.7) * (1.8 + (i % 4) * 0.65);
      const z = -9 + (i % 32) * 0.42;
      points.set([x, y, z, x, y, z + 0.36 + (i % 4) * 0.12], i * 6);
    }
    return points;
  }, []);

  useFrame((_, delta) => {
    if (!trails.current || paused) return;
    const attribute = trails.current.geometry.getAttribute('position') as THREE.BufferAttribute;
    const data = attribute.array as Float32Array;
    for (let i = 0; i < 64; i++) {
      const at = i * 6;
      let z = data[at + 2] + Math.min(delta, 0.05) * 3.8;
      if (z > 5.5) z = -9.2;
      data[at + 2] = z;
      data[at + 5] = z + 0.36 + (i % 4) * 0.12;
    }
    attribute.needsUpdate = true;
  });

  return (
    <lineSegments ref={trails}>
      <bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]} /></bufferGeometry>
      <lineBasicMaterial color="#b6dcff" transparent opacity={0.33} depthWrite={false} />
    </lineSegments>
  );
}

function BlackHole({ paused }: { paused: boolean }) {
  const disk = useRef<THREE.Group>(null);
  const { viewport } = useThree();
  useFrame((_, delta) => { if (disk.current && !paused) disk.current.rotation.z += delta * 0.13; });

  return (
    <group position={[-viewport.width * 0.31, viewport.height * 0.30, -7.3]} scale={0.8}>
      <mesh><sphereGeometry args={[0.49, 40, 28]} /><meshBasicMaterial color="#01020a" toneMapped={false} /></mesh>
      <group ref={disk} rotation={[0.3, 0.45, 0.2]}>
        {[0.6, 0.76, 0.95, 1.16].map((radius, i) => (
          <mesh key={radius} rotation={[0.49, 0.14, 0]}>
            <torusGeometry args={[radius, i === 0 ? 0.115 : 0.07, 10, 96]} />
            <meshBasicMaterial color={['#fff0bd', '#ffac7d', '#c66bd4', '#7256c0'][i]} transparent opacity={0.88 - i * 0.12} depthWrite={false} toneMapped={false} />
          </mesh>
        ))}
      </group>
      <mesh scale={1.6}><sphereGeometry args={[1, 32, 24]} /><meshBasicMaterial color="#7459ce" transparent opacity={0.035} depthWrite={false} side={THREE.BackSide} /></mesh>
    </group>
  );
}

function Comets({ paused }: { paused: boolean }) {
  const objects = useRef<(THREE.Group | null)[]>([]);
  const { viewport } = useThree();

  useFrame(({ clock }) => {
    if (paused) return;
    objects.current.forEach((comet, i) => {
      if (!comet) return;
      const progress = (clock.elapsedTime * (0.06 + i * 0.009) + i * 0.29) % 1;
      comet.position.set(-viewport.width * 0.68 + progress * viewport.width * 1.5, viewport.height * (0.24 - i * 0.13) - progress * viewport.height * 0.32, -2.5 - i);
      comet.rotation.z = -0.23;
    });
  });

  return (
    <>
      {[0, 1, 2].map((i) => (
        <group key={i} ref={(node) => { objects.current[i] = node; }} scale={0.67 + i * 0.12} visible={!paused}>
          <mesh><sphereGeometry args={[0.11, 16, 12]} /><meshBasicMaterial color={i === 1 ? '#ffcab0' : '#aee9ff'} toneMapped={false} /></mesh>
          <mesh scale={2.8}><sphereGeometry args={[0.12, 12, 10]} /><meshBasicMaterial color={i === 1 ? '#ff9b84' : '#6ac7ff'} transparent opacity={0.13} depthWrite={false} /></mesh>
          <mesh position={[-0.7, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <coneGeometry args={[0.15, 1.55, 16]} />
            <meshBasicMaterial color={i === 1 ? '#ffd5ba' : '#8ad7ff'} transparent opacity={0.42} depthWrite={false} />
          </mesh>
          <mesh position={[-1.25, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <coneGeometry args={[0.055, 1.9, 12]} />
            <meshBasicMaterial color="#b2dfff" transparent opacity={0.24} depthWrite={false} />
          </mesh>
        </group>
      ))}
    </>
  );
}

function Asteroids({ paused }: { paused: boolean }) {
  const belt = useRef<THREE.Group>(null);
  const asteroids = useMemo(() => Array.from({ length: 16 }, (_, i) => ({
    position: [Math.sin(i * 15.8) * 9.8, Math.cos(i * 9.1) * 5.6, -3.5 + Math.sin(i * 4.2) * 2.4] as [number, number, number],
    scale: 0.08 + ((i * 7) % 5) * 0.035,
  })), []);
  useFrame((_, delta) => { if (belt.current && !paused) belt.current.rotation.z += delta * 0.002; });
  return (
    <group ref={belt}>
      {asteroids.map((rock, index) => (
        <mesh key={index} position={rock.position} rotation={[index * 0.71, index * 0.23, index * 0.53]} scale={rock.scale}>
          <icosahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color={index % 3 ? '#8692a8' : '#b7a9a2'} roughness={0.97} />
        </mesh>
      ))}
    </group>
  );
}

export function BrickSpaceship({ flying = true, cursor, chaseView = false, landed = false, showPilot = true, controlledPose = false, pilotWaving = false }: { flying?: boolean; cursor?: React.RefObject<Cursor>; chaseView?: boolean; landed?: boolean; showPilot?: boolean; controlledPose?: boolean; pilotWaving?: boolean }) {
  const ship = useRef<THREE.Group>(null);
  const exhaust = useRef<THREE.Group>(null);
  const wing = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-0.53, 0.17);
    shape.lineTo(-1.25, 1.02);
    shape.lineTo(-1.83, 1.06);
    shape.lineTo(-1.42, 0.17);
    shape.closePath();
    return shape;
  }, []);

  useFrame(({ clock }, delta) => {
    if (ship.current) {
      if (landed || controlledPose) {
        ship.current.position.y = 0;
        ship.current.rotation.set(0, 0, 0);
      } else {
        ship.current.position.y = Math.sin(clock.elapsedTime * 1.9) * (flying ? 0.065 : 0.018);
        ship.current.rotation.z = -0.05 + Math.sin(clock.elapsedTime * 1.3) * 0.028;
        ship.current.rotation.y = THREE.MathUtils.damp(ship.current.rotation.y, (cursor?.current.x ?? 0) * 0.24, 2.5, delta);
        ship.current.rotation.x = THREE.MathUtils.damp(ship.current.rotation.x, (cursor?.current.y ?? 0) * -0.12, 2.5, delta);
      }
    }
    if (exhaust.current) exhaust.current.scale.x = 0.90 + Math.sin(clock.elapsedTime * 14) * 0.15;
  });

  return (
    <group ref={ship}>
      {/* Beveled swept wings sit behind the metallic fuselage. */}
      {([-1, 1] as const).map((side) => (
        <group key={side} rotation={chaseView || landed ? [Math.PI / 2, 0, 0] : [0, 0, 0]}>
          <group scale={[1, side, 1]}>
          <mesh position={[0, -0.02, -0.38]} castShadow>
            <extrudeGeometry args={[wing, { depth: 0.11, bevelEnabled: true, bevelThickness: 0.035, bevelSize: 0.025, bevelSegments: 2 }]} />
            <meshStandardMaterial color="#536e8b" metalness={0.66} roughness={0.31} />
          </mesh>
          <mesh position={[-1.11, 0.58, -0.235]} rotation={[0, 0, -0.68]}>
            <boxGeometry args={[0.9, 0.065, 0.028]} />
            <meshStandardMaterial color="#aac8d6" metalness={0.68} roughness={0.21} />
          </mesh>
          <mesh position={[-1.46, 0.57, -0.11]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.145, 0.18, 0.65, 24]} />
            <meshStandardMaterial color="#30465b" metalness={0.71} roughness={0.3} />
          </mesh>
          <mesh position={[-1.79, 0.57, -0.11]} rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[0.123, 0.035, 8, 24]} />
            <meshBasicMaterial color={flying ? '#88dbfc' : '#8496a9'} toneMapped={false} />
          </mesh>
          <mesh position={[-1.48, 0.92, -0.22]} scale={[0.31, 0.06, 0.13]} rotation={[0, 0, -0.08]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#e68a72" metalness={0.4} roughness={0.28} />
          </mesh>
          <mesh position={[-1.75, 1.04, -0.17]}>
            <sphereGeometry args={[0.065, 12, 12]} />
            <meshBasicMaterial color={side === 1 ? '#72e6ee' : '#ed8d88'} toneMapped={false} />
          </mesh>
          </group>
        </group>
      ))}
      <mesh position={[-0.08, -0.09, 0]} rotation={[0, 0, -Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.38, 0.44, 1.88, 32]} />
        <meshPhysicalMaterial color="#b3c3d1" metalness={0.7} roughness={0.25} clearcoat={0.6} clearcoatRoughness={0.17} />
      </mesh>
      <mesh position={[1.06, -0.09, 0]} rotation={[0, 0, -Math.PI / 2]} castShadow>
        <coneGeometry args={[0.38, 0.52, 32]} />
        <meshStandardMaterial color="#cf755b" metalness={0.56} roughness={0.27} />
      </mesh>
      {/* Aerodynamic seam rings, belly armor and tiny lighted hull vents. */}
      {[0.44, 0.91].map((x) => (
        <mesh key={x} position={[x, -0.09, 0]} rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[x > 0.8 ? 0.363 : 0.377, 0.018, 8, 48]} />
          <meshStandardMaterial color="#49667f" metalness={0.8} roughness={0.23} />
        </mesh>
      ))}
      <mesh position={[-0.17, -0.39, 0]} scale={[0.85, 0.11, 0.39]}>
        <sphereGeometry args={[1, 24, 18]} />
        <meshStandardMaterial color="#344b63" metalness={0.61} roughness={0.31} />
      </mesh>
      {Array.from({ length: 4 }, (_, i) => (
        <mesh key={i} position={[-0.62 + i * 0.16, -0.06, 0.411]} rotation={[0, 0, -0.13]}>
          <boxGeometry args={[0.075, 0.022, 0.014]} />
          <meshBasicMaterial color={i % 2 ? '#8ce3f2' : '#41617d'} toneMapped={false} />
        </mesh>
      ))}
      <mesh position={[-0.72, -0.09, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <cylinderGeometry args={[0.452, 0.452, 0.085, 32]} />
        <meshStandardMaterial color="#50647d" metalness={0.69} roughness={0.27} />
      </mesh>
      <mesh position={[0.59, -0.05, 0.304]} rotation={[0, 0, -0.13]}>
        <boxGeometry args={[0.47, 0.05, 0.12]} />
        <meshStandardMaterial color="#43678a" metalness={0.44} roughness={0.25} />
      </mesh>
      <mesh position={[-0.45, -0.15, 0.397]} rotation={[0, 0, 0.07]}>
        <boxGeometry args={[0.42, 0.045, 0.045]} />
        <meshBasicMaterial color="#83cfe1" toneMapped={false} />
      </mesh>

      {/* Greet the viewer in the Projects preview; face the nose during flight. */}
      {showPilot && (
        <group position={[0.13, 0.13, 0.03]} rotation={[0, pilotWaving ? -0.17 : Math.PI / 2, 0]} scale={0.26}>
          <BrickFigure outfit="hello" autoWave={pilotWaving} />
        </group>
      )}
      <mesh position={[0.12, 0.48, 0.02]} scale={[1.12, 0.82, 0.92]}>
        <sphereGeometry args={[0.54, 32, 24]} />
        <meshPhysicalMaterial color="#8bd3f2" metalness={0.32} roughness={0.07} clearcoat={1} transparent opacity={0.23} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0.12, 0.2, 0.02]} scale={[1.12, 1, 0.92]} rotation={[Math.PI / 2, 0, -0.06]}>
        <torusGeometry args={[0.52, 0.032, 10, 48]} />
        <meshStandardMaterial color="#344e65" metalness={0.8} roughness={0.21} />
      </mesh>
      <mesh position={[0.21, 0.65, 0.47]} rotation={[0, 0, 0.31]}>
        <capsuleGeometry args={[0.026, 0.28, 6, 10]} />
        <meshBasicMaterial color="#ecfaff" transparent opacity={0.58} depthWrite={false} />
      </mesh>

      {/* Exposed turbine with a pulsing ion exhaust. */}
      <mesh position={[-1.09, -0.09, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.35, 0.35, 0.29, 32]} />
        <meshStandardMaterial color="#273d56" metalness={0.8} roughness={0.25} />
      </mesh>
      <mesh position={[-1.25, -0.09, 0]} rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[0.28, 0.065, 12, 36]} />
        <meshStandardMaterial color="#9eb9ca" metalness={0.85} roughness={0.23} />
      </mesh>
      <mesh position={[-1.27, -0.09, 0]} rotation={[0, Math.PI / 2, 0]}>
        <circleGeometry args={[0.22, 32]} />
        <meshBasicMaterial color={flying ? '#6be5ff' : '#455f7b'} toneMapped={false} />
      </mesh>
      {flying && (
        <group ref={exhaust} position={[-1.57, -0.09, 0]}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <coneGeometry args={[0.26, 1.07, 24]} />
            <meshBasicMaterial color="#5fbaff" transparent opacity={0.62} depthWrite={false} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <coneGeometry args={[0.11, 0.78, 20]} />
            <meshBasicMaterial color="#d5fbff" transparent opacity={0.82} depthWrite={false} toneMapped={false} />
          </mesh>
        </group>
      )}
      {landed && ([-0.66, 0.64] as const).flatMap((x) => ([-0.28, 0.32] as const).map((z) => (
        <group key={`${x}-${z}`}>
          <mesh position={[x, -0.51, z]} rotation={[0, 0, x > 0 ? 0.13 : -0.13]} castShadow>
            <cylinderGeometry args={[0.05, 0.065, 0.27, 12]} />
            <meshStandardMaterial color="#a8bdcb" metalness={0.72} roughness={0.35} />
          </mesh>
          <mesh position={[x, -0.635, z]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <capsuleGeometry args={[0.045, 0.43, 6, 12]} />
            <meshStandardMaterial color="#3b5266" metalness={0.42} roughness={0.55} />
          </mesh>
        </group>
      )))}
    </group>
  );
}

function Planet({ index, compact, paused }: { index: number; compact: boolean; paused: boolean }) {
  const approach = useRef<THREE.Group>(null);
  const spinning = useRef<THREE.Group>(null);
  const approachDelay = useRef(0);
  const { viewport } = useThree();
  const theme = planetThemes[index % planetThemes.length];
  const side = index % 2 === 0 ? 1 : -1;
  const maps = useMemo(() => makePlanetMaps(index), [index]);

  useEffect(() => () => {
    maps.surface.dispose();
    maps.relief.dispose();
    maps.lava?.dispose();
    maps.clouds?.dispose();
  }, [maps]);

  useFrame(({ clock }, delta) => {
    // The ship steers first; a moment later the destination flies in from
    // the opposite edge of the screen, like a third-person exploration game.
    if (!paused && approachDelay.current < 0.35) {
      approachDelay.current += delta;
      return;
    }
    if (approach.current) {
      approach.current.position.x = THREE.MathUtils.damp(approach.current.position.x, side * viewport.width * (compact ? 0.19 : 0.25), paused ? 18 : 2.8, delta);
      approach.current.position.y = (compact ? 1.12 : 0.65) + (paused ? 0 : Math.sin(clock.elapsedTime * 0.55) * 0.065);
      const scale = THREE.MathUtils.damp(approach.current.scale.x, compact ? 0.62 : 1.06, paused ? 18 : 2.7, delta);
      approach.current.scale.setScalar(scale);
    }
    if (spinning.current && !paused) spinning.current.rotation.y += delta * (theme.kind === 'gas' ? 0.055 : 0.095);
  });

  return (
    <group ref={approach} position={[side * viewport.width * 0.75, compact ? 1.12 : 0.65, -1.65]} scale={0.16}>
      <group ref={spinning} rotation={[0.14, index * 0.27, -0.10]}>
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[1.77, 96, 72]} />
          <meshPhysicalMaterial
            map={maps.surface}
            bumpMap={maps.relief}
            bumpScale={theme.kind === 'gas' ? 0 : theme.kind === 'desert' ? 0.065 : 0.038}
            emissive={theme.kind === 'lava' ? '#ff6b29' : '#000000'}
            emissiveMap={maps.lava ?? undefined}
            emissiveIntensity={2.2}
            roughness={theme.kind === 'ocean' ? 0.69 : 0.94}
            metalness={0.015}
            clearcoat={theme.kind === 'ocean' ? 0.18 : 0.02}
          />
        </mesh>
        {maps.clouds && (
          <mesh rotation={[0, index * 0.27, 0]}>
            <sphereGeometry args={[1.798, 72, 48]} />
            <meshBasicMaterial map={maps.clouds} transparent opacity={0.83} depthWrite={false} />
          </mesh>
        )}
        <mesh scale={1.075}>
          <sphereGeometry args={[1.77, 48, 32]} />
          <meshBasicMaterial color={theme.glow} transparent opacity={0.085} depthWrite={false} side={THREE.BackSide} />
        </mesh>
        {(theme.kind === 'gas' || theme.kind === 'ice' || theme.kind === 'forest') && (
          <group rotation={[0.60, 0.10, 0.23]}>
            {([
              [2.02, 2.12, 0.34], [2.15, 2.37, 0.17], [2.40, 2.47, 0.38],
              [2.49, 2.67, 0.22], [2.73, 2.81, 0.34], [2.86, 2.99, 0.12],
            ] as const).map(([inner, outer, opacity], i) => (
              <mesh key={inner}>
                <ringGeometry args={[inner, outer, 160]} />
                <meshStandardMaterial
                  color={i % 2 ? theme.highlight : theme.ring}
                  metalness={0.10}
                  roughness={0.80}
                  transparent
                  opacity={theme.kind === 'gas' ? opacity * 1.35 : opacity}
                  depthWrite={false}
                  side={THREE.DoubleSide}
                />
              </mesh>
            ))}
          </group>
        )}
      </group>
      <mesh position={[2.42, -0.76, -0.92]} scale={0.18}>
        <icosahedronGeometry args={[1, 2]} />
        <meshStandardMaterial color={theme.highlight} roughness={0.92} />
      </mesh>
    </group>
  );
}

const EXPLORER_SHIP_HEADING = Math.PI / 2;

function GalaxyPilot({ index, compact, paused }: { index: number; compact: boolean; paused: boolean }) {
  const traveler = useRef<THREE.Group>(null);
  const { viewport } = useThree();
  const side = index % 2 === 0 ? 1 : -1;

  useFrame((_, delta) => {
    if (!traveler.current) return;
    const targetX = index < 0 ? 0 : -side * viewport.width * (compact ? 0.115 : 0.16);
    // Chase-camera framing: keep the rear engines and swept wings in view.
    // The old z=3.15 position made the tail much too close to the camera,
    // cropping it at the bottom and making the body look nearly vertical.
    const targetY = compact ? -1.15 : -1.25;
    const rate = paused ? 16 : 2.4;
    const currentX = traveler.current.position.x;
    traveler.current.position.x = THREE.MathUtils.damp(currentX, targetX, rate, delta);
    traveler.current.position.y = THREE.MathUtils.damp(traveler.current.position.y, targetY, rate, delta);
    const size = THREE.MathUtils.damp(traveler.current.scale.x, compact ? 0.56 : 0.88, rate, delta);
    traveler.current.scale.setScalar(size);
    traveler.current.rotation.z = THREE.MathUtils.damp(traveler.current.rotation.z, paused ? 0 : THREE.MathUtils.clamp((targetX - currentX) * 0.12, -0.20, 0.20), 2, delta);
    traveler.current.rotation.y = THREE.MathUtils.damp(traveler.current.rotation.y, index < 0 ? 0 : side * -0.065, 1.4, delta);
  });

  return (
    <group ref={traveler} position={[0, -1.25, 0.6]} scale={0.88}>
      {/* The ship's nose points along +X. Turn it away from the chase camera;
          its wings are laid flat in chaseView so the cockpit remains on top. */}
      <group rotation={[0, EXPLORER_SHIP_HEADING, 0]}>
        <BrickSpaceship flying={!paused} chaseView />
      </group>
    </group>
  );
}

function GalaxyWorld({ index, paused }: { index: number; paused: boolean }) {
  const compact = useThree((state) => state.size.width < 720);

  return (
    <>
      <Stars paused={paused} />
      <FlightStreaks paused={paused} />
      <BlackHole paused={paused} />
      <Asteroids paused={paused} />
      <Comets paused={paused} />
      {index >= 0 && <Planet key={index} index={index} compact={compact} paused={paused} />}
      <GalaxyPilot index={index} compact={compact} paused={paused} />
    </>
  );
}

export function GalaxyCanvas({ index }: { index: number }) {
  const hasWebGL = useWebGL();
  const [paused, setPaused] = useState(false);
  const theme = planetThemes[Math.max(index, 0) % planetThemes.length];

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setPaused(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  return (
    <div className="h-full w-full" aria-label={index < 0 ? 'Third-person view from behind a spaceship waiting at the center of a starfield with comets' : `Third-person view behind the spaceship approaching a ${theme.kind} planet on the ${index % 2 === 0 ? 'right' : 'left'}`} role="img">
      {hasWebGL ? (
        <Canvas dpr={[1, 1.5]} camera={{ position: [0, 2.65, 9.6], fov: 44 }} gl={{ alpha: true, antialias: true }}>
          <ambientLight intensity={1.1} />
          <directionalLight position={[-4, 5, 6]} intensity={3.3} color="#fff6e9" />
          <pointLight position={[5, -3, 3]} intensity={28} color="#729fdf" />
          <GalaxyWorld index={index} paused={paused} />
        </Canvas>
      ) : (
        <div className="relative h-full w-full">
          {index >= 0 && <div className={`galaxy-fallback-planet ${index % 2 ? 'galaxy-fallback-planet-left' : ''}`} style={{ background: `radial-gradient(circle at 30% 25%, ${theme.highlight}, ${theme.main} 75%, ${theme.shadow})` }} />}
          <div className={`galaxy-fallback-ship ${index < 0 ? 'left-1/2' : index % 2 ? 'right-[29%]' : 'left-[29%]'}`} aria-hidden="true"><span>▲</span><span className="galaxy-fallback-exhaust" /></div>
        </div>
      )}
    </div>
  );
}

/** Frame the full ship, including wings and exhaust, across narrow and wide previews. */
function FitWholeShipCamera() {
  const { camera, size } = useThree();

  useEffect(() => {
    if (!(camera instanceof THREE.PerspectiveCamera) || !size.width || !size.height) return;
    const aspect = size.width / size.height;
    // Leave clearance for the tilted wings, nose and pulsing exhaust on every viewport.
    const verticalSpace = Math.max(4.8, 9 / aspect);
    const halfFov = THREE.MathUtils.degToRad(camera.fov / 2);
    // The exhaust makes the ship longer on the left, so center on its full silhouette.
    camera.position.x = -0.45;
    camera.position.z = Math.max(5.3, verticalSpace / (2 * Math.tan(halfFov)));
    camera.lookAt(-0.45, 0, 0);
    camera.updateProjectionMatrix();
  }, [camera, size.width, size.height]);

  return null;
}

/** Straighten into the explorer's rear view, then accelerate along the depth axis. */
function LaunchingShip() {
  const ship = useRef<THREE.Group>(null);
  const elapsed = useRef(0);
  const reducedMotion = useRef(false);
  const startRotation = useMemo(() => new THREE.Quaternion().setFromEuler(new THREE.Euler(0, -0.26, 0.31)), []);
  const flightRotation = useMemo(() => new THREE.Quaternion().setFromEuler(new THREE.Euler(0, EXPLORER_SHIP_HEADING, 0)), []);

  useEffect(() => {
    reducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  useFrame((_, delta) => {
    if (!ship.current) return;
    elapsed.current += delta;
    const time = elapsed.current;
    const turn = THREE.MathUtils.smoothstep(time, 0.08, 0.7);
    const flight = THREE.MathUtils.clamp((time - 0.7) / 0.9, 0, 1);
    ship.current.quaternion.slerpQuaternions(startRotation, flightRotation, reducedMotion.current ? 1 : turn);
    ship.current.position.z = reducedMotion.current ? 0 : -70 * flight * flight * flight;
    ship.current.scale.setScalar(reducedMotion.current ? 1.8 : 1.8 * (1 - Math.pow(flight, 4)));
    ship.current.visible = time < 1.6;
  });

  return (
    <group ref={ship} scale={1.8} rotation={[0, -0.26, 0.31]}>
      <BrickSpaceship chaseView controlledPose />
    </group>
  );
}

/** A dedicated 3D rocket for the launch bay and the hyperspace transition. */
export function ShipCanvas({ fitWholeShip = false, launching = false, pilotWaving = false, showPilot = true }: { fitWholeShip?: boolean; launching?: boolean; pilotWaving?: boolean; showPilot?: boolean } = {}) {
  const hasWebGL = useWebGL();
  const cursor = useCursor();

  return (
    <div className="h-full w-full" role="img" aria-label={launching ? 'Spaceship straightens into the explorer heading and flies into the distance' : 'Interactive brick-built spaceship with Asitha in the cockpit'}>
      {hasWebGL ? (
        <Canvas dpr={[1, 1.6]} camera={{ position: [0, 0.2, 5.1], fov: 43 }} gl={{ alpha: true, antialias: true }}>
          {fitWholeShip && <FitWholeShipCamera />}
          <ambientLight intensity={2} />
          <directionalLight position={[-2, 4, 5]} intensity={3} />
          <pointLight position={[3, -2, 3]} intensity={12} color="#9fdaf5" />
          {launching ? <LaunchingShip /> : <group scale={1.8} rotation={[0, -0.26, fitWholeShip ? 0.31 : 0.1]}>
            <BrickSpaceship cursor={cursor} pilotWaving={pilotWaving} showPilot={showPilot} />
          </group>}
        </Canvas>
      ) : (
        <div className={`grid h-full w-full place-items-center text-8xl ${launching ? 'warp-rocket-fallback' : ''}`} aria-hidden="true">🚀</div>
      )}
    </div>
  );
}

const contactChannels: ContactInteraction[] = ['email', 'phone', 'github', 'linkedin'];
const contactColors = ['#61cfbb', '#f7ba73', '#a9abf7', '#f19bab'];
const contactConsoleYaw = -0.14;
const contactConsoleX = 1.44;
const contactConsoleZ = 0.15;
const contactWalkerX = 0.14;
const contactWalkerZ = 0.35;
const contactKeyPosition: readonly [number, number, number] = [-0.55, 0.13, 0.29];

function ContactScreen({ selected }: { selected: number }) {
  const texture = useMemo(() => {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const context = canvas.getContext('2d');
    if (!context) return null;

    context.fillStyle = '#0b273b';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = contactColors[selected];
    context.fillRect(30, 29, 10, 27);
    context.font = 'bold 25px Arial, sans-serif';
    context.fillText('CONTACT CHANNEL', 56, 53);
    context.font = '900 67px Arial, sans-serif';
    context.fillStyle = '#f7fcff';
    context.fillText(contactChannels[selected].toUpperCase(), 30, 144);
    context.fillStyle = contactColors[selected];
    context.fillRect(30, 168, 449, 5);
    context.font = 'bold 22px Arial, sans-serif';
    context.fillText('●  READY TO CONNECT', 30, 215);

    const image = new THREE.CanvasTexture(canvas);
    image.colorSpace = THREE.SRGBColorSpace;
    return image;
  }, [selected]);

  useEffect(() => () => { texture?.dispose(); }, [texture]);

  return texture ? (
    <mesh position={[0, 0.66, 0.033]}>
      <planeGeometry args={[1.26, 0.72]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  ) : null;
}

function LandingWalker({ arrived, interaction, cursor, onArrivalComplete }: { arrived: boolean; interaction: ContactInteraction; cursor: React.RefObject<Cursor>; onArrivalComplete?: () => void }) {
  const group = useRef<THREE.Group>(null);
  const startTime = useRef<number | null>(null);
  const [walking, setWalking] = useState(arrived);
  const finished = useRef(false);
  const reducedMotion = useRef(false);
  const complete = useRef(onArrivalComplete);
  const width = useThree((state) => state.size.width);
  const shipX = width < 480 ? -1.15 : -1.6;
  const stopX = contactWalkerX;
  const path = useMemo(() => new THREE.CubicBezierCurve3(
    new THREE.Vector3(shipX + 0.52, -0.5, -0.27),
    new THREE.Vector3(shipX + 0.95, -0.5, 0.95),
    new THREE.Vector3(stopX - 0.35, -0.5, contactWalkerZ),
    new THREE.Vector3(stopX, -0.5, contactWalkerZ),
  ), [shipX, stopX]);

  // The character taps the same large control key; the screen and status lights
  // change to the contact channel chosen on the HTML controls below the scene.
  const fingerTarget: readonly [number, number, number] = [
    (contactConsoleX + contactKeyPosition[0] * Math.cos(contactConsoleYaw) + contactKeyPosition[2] * Math.sin(contactConsoleYaw) - stopX) / 0.7,
    (-0.32 + contactKeyPosition[1] + 0.5) / 0.7,
    (contactConsoleZ - contactKeyPosition[0] * Math.sin(contactConsoleYaw) + contactKeyPosition[2] * Math.cos(contactConsoleYaw) - contactWalkerZ) / 0.7,
  ];

  useEffect(() => { complete.current = onArrivalComplete; }, [onArrivalComplete]);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => { reducedMotion.current = media.matches; };
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  useEffect(() => {
    startTime.current = null;
    finished.current = false;
    setWalking(arrived);
    group.current?.position.copy(arrived ? path.v0 : path.v3);
  }, [arrived, path]);

  useFrame(({ clock }, delta) => {
    if (!group.current) return;
    if (!arrived || finished.current) {
      group.current.position.copy(path.v3);
      group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, 0, 6, delta);
      return;
    }
    if (startTime.current === null) startTime.current = clock.elapsedTime;
    const progress = reducedMotion.current ? 1 : Math.min((clock.elapsedTime - startTime.current) / 3.2, 1);
    const eased = progress * progress * (3 - 2 * progress);
    group.current.position.copy(path.getPointAt(eased));
    const direction = path.getTangentAt(eased);
    const heading = Math.atan2(direction.x, direction.z) * (1 - THREE.MathUtils.smoothstep(progress, 0.72, 1));
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, heading, 10, delta);
    if (progress === 1) {
      finished.current = true;
      setWalking(false);
      complete.current?.();
    }
  });

  return (
    <group ref={group} position={arrived ? path.v0 : path.v3} scale={0.7} name="landing-walker" userData={{ walking }}>
      <BrickFigure outfit="contact" autoWave={false} movement={walking ? 'walk' : 'idle'} interaction={walking ? 'idle' : interaction} controlTarget={walking ? undefined : fingerTarget} cursor={walking ? undefined : cursor} />
    </group>
  );
}

function ContactConsole({ selected }: { selected: number }) {
  const controlKey = useRef<THREE.Group>(null);

  useFrame(({ clock }, delta) => {
    const tap = Math.pow(Math.max(0, Math.sin(clock.elapsedTime * 5)), 8);
    if (!controlKey.current) return;
    controlKey.current.position.z = THREE.MathUtils.damp(controlKey.current.position.z, contactKeyPosition[2] - tap * 0.055, 14, delta);
    controlKey.current.scale.setScalar(THREE.MathUtils.damp(controlKey.current.scale.x, 1 + tap * 0.07, 12, delta));
  });

  return (
    <group position={[contactConsoleX, -0.32, contactConsoleZ]} rotation={[0, contactConsoleYaw, 0]}>
      <mesh position={[0, 0.34, -0.13]} castShadow>
        <boxGeometry args={[1.58, 1.48, 0.2]} />
        <meshStandardMaterial color="#274b63" metalness={0.25} roughness={0.45} />
      </mesh>
      <mesh position={[0, 0.66, 0.005]}>
        <boxGeometry args={[1.31, 0.78, 0.045]} />
        <meshStandardMaterial color="#112b41" emissive={contactColors[selected]} emissiveIntensity={0.4} />
      </mesh>
      <ContactScreen selected={selected} />
      <mesh position={[-0.37 + selected * 0.25, 0.29, 0.044]}>
        <boxGeometry args={[0.17, 0.065, 0.03]} />
        <meshBasicMaterial color={contactColors[selected]} />
      </mesh>
      {contactChannels.map((button, index) => (
        <mesh key={button} position={[-0.49 + index * 0.32, 0.40, 0.045]}>
          <boxGeometry args={[0.15, 0.075, 0.028]} />
          <meshBasicMaterial color={selected === index ? contactColors[index] : '#304d68'} />
        </mesh>
      ))}
      <group ref={controlKey} position={contactKeyPosition}>
        <mesh castShadow>
          <boxGeometry args={[0.31, 0.23, 0.17]} />
          <meshStandardMaterial color={contactColors[selected]} emissive={contactColors[selected]} emissiveIntensity={1.5} />
        </mesh>
        <mesh position={[0, 0, 0.098]}>
          <torusGeometry args={[0.155, 0.028, 8, 32]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <mesh position={[0, 0, 0.102]}>
          <circleGeometry args={[0.044, 16]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>
      <mesh position={[0.1, 0.105, 0.095]}>
        <boxGeometry args={[0.8, 0.085, 0.03]} />
        <meshStandardMaterial color="#5b99a5" emissive={contactColors[selected]} emissiveIntensity={0.35} />
      </mesh>
      <mesh position={[0, -0.48, -0.25]}><boxGeometry args={[0.38, 0.25, 0.33]} /><meshStandardMaterial color="#567b87" /></mesh>
    </group>
  );
}

function ParkedSpaceship() {
  const width = useThree((state) => state.size.width);
  const compact = width < 480;
  const scale = compact ? THREE.MathUtils.clamp(width / 600, 0.48, 0.62) : 0.79;
  const x = compact ? -1.15 : -1.6;

  return (
    <>
      <mesh position={[x, -1.409, -0.7]} rotation={[-Math.PI / 2, 0, 0]} scale={[compact ? 0.8 : 1.1, compact ? 1 : 1.55, 1]}>
        <circleGeometry args={[1, 48]} />
        <meshBasicMaterial color="#537d6c" transparent opacity={0.2} depthWrite={false} />
      </mesh>
      <group position={[x, -1.42 + scale * 0.68, -0.7]} rotation={[0, EXPLORER_SHIP_HEADING - 0.2, 0]} scale={scale} name="parked-spaceship">
        <BrickSpaceship flying={false} landed showPilot={false} />
      </group>
    </>
  );
}

function FitLandingCamera() {
  const { camera, size } = useThree();
  useEffect(() => {
    if (!(camera instanceof THREE.PerspectiveCamera) || !size.width || !size.height) return;
    const aspect = size.width / size.height;
    const distance = Math.max(7, 6.4 / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * aspect));
    camera.position.set(-0.1, 0.3, distance);
    camera.lookAt(-0.1, 0.3, 0);
    camera.updateProjectionMatrix();
  }, [camera, size.width, size.height]);
  return null;
}

export function LandingCanvas({ arrived = false, interaction = 'idle', showCharacter = true, onArrivalComplete }: { arrived?: boolean; interaction?: ContactInteraction; showCharacter?: boolean; onArrivalComplete?: () => void }) {
  const hasWebGL = useWebGL();
  const cursor = useCursor();
  const [demoChannel, setDemoChannel] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => setDemoChannel((current) => (current + 1) % contactChannels.length), 3200);
    return () => window.clearInterval(interval);
  }, []);

  const selected = interaction === 'idle' ? demoChannel : contactChannels.indexOf(interaction);

  return (
    <div className="h-full w-full" role="img" aria-label="Asitha's 3D brick character walks to the terminal, presses its keys, and responds to the contact links">
      {hasWebGL ? (
        <Canvas dpr={[1, 1.75]} camera={{ position: [0, 0.3, 7], fov: 40 }} gl={{ alpha: true, antialias: true }}>
          <FitLandingCamera />
          <ambientLight intensity={2} />
          <directionalLight position={[-3, 6, 5]} intensity={2.8} />
          <LandingMeadow />
          <ParkedSpaceship />
          <ContactConsole selected={selected} />
          {showCharacter && <LandingWalker arrived={arrived} interaction={interaction} cursor={cursor} onArrivalComplete={onArrivalComplete} />}
        </Canvas>
      ) : <div className="flex h-full items-center justify-center text-7xl" aria-hidden="true">🚀 👋</div>}
    </div>
  );
}
