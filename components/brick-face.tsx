'use client';

import { useEffect, useMemo } from 'react';
import * as THREE from 'three';

/** Printed features wrap around the head, like the supplied minifigure reference. */
export function PrintedBrickFace({ radius }: { radius: number }) {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 768;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Full cheek and jaw beard, with an open skin-colored area around the smile.
    ctx.fillStyle = '#33282a';
    ctx.beginPath();
    ctx.moveTo(88, 315);
    ctx.lineTo(128, 322);
    ctx.lineTo(155, 454);
    ctx.quadraticCurveTo(186, 515, 273, 552);
    ctx.quadraticCurveTo(363, 580, 393, 563);
    ctx.quadraticCurveTo(421, 490, 512, 488);
    ctx.quadraticCurveTo(603, 490, 631, 563);
    ctx.quadraticCurveTo(661, 580, 751, 552);
    ctx.quadraticCurveTo(838, 515, 869, 454);
    ctx.lineTo(896, 322);
    ctx.lineTo(936, 315);
    ctx.lineTo(916, 598);
    ctx.quadraticCurveTo(873, 730, 512, 735);
    ctx.quadraticCurveTo(151, 730, 108, 598);
    ctx.closePath();
    ctx.fill();
    ctx.save();
    ctx.clip();
    const noise = (seed: number) => {
      const value = Math.sin(seed * 12.9898 + 4.27) * 43758.5453;
      return value - Math.floor(value);
    };
    for (let i = 0; i < 1100; i++) {
      ctx.fillStyle = i % 2 ? '#88706638' : '#201d2138';
      ctx.beginPath();
      ctx.arc(noise(i + 1) * 1024, 315 + noise(i + 1700) * 430, 1 + noise(i + 3500) * 2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
    // Cut out the mouth area so its plastic color and lighting match the head.
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.ellipse(512, 601, 127, 88, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';

    // Two tapered moustache halves and a small goatee.
    ctx.strokeStyle = '#33282a';
    ctx.lineWidth = 24;
    ctx.beginPath();
    ctx.moveTo(402, 554);
    ctx.quadraticCurveTo(443, 514, 495, 535);
    ctx.moveTo(529, 535);
    ctx.quadraticCurveTo(581, 514, 622, 554);
    ctx.stroke();
    ctx.fillStyle = '#33282a';
    ctx.beginPath();
    ctx.moveTo(467, 661);
    ctx.quadraticCurveTo(512, 678, 557, 661);
    ctx.lineTo(536, 686);
    ctx.lineTo(529, 715);
    ctx.lineTo(495, 715);
    ctx.lineTo(488, 686);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#442b27';
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(414, 592);
    ctx.quadraticCurveTo(512, 632, 610, 592);
    ctx.stroke();

    // Thick rectangular glasses with soft lower corners and blue-gray lenses.
    const lens = (mirrored: boolean) => {
      ctx.save();
      if (mirrored) { ctx.translate(1024, 0); ctx.scale(-1, 1); }
      const tint = ctx.createLinearGradient(250, 240, 420, 420);
      tint.addColorStop(0, '#a1b3c5');
      tint.addColorStop(1, '#77899e');
      ctx.fillStyle = tint;
      ctx.strokeStyle = '#29272b';
      ctx.lineWidth = 27;
      ctx.beginPath();
      ctx.moveTo(220, 241);
      ctx.quadraticCurveTo(188, 244, 196, 286);
      ctx.lineTo(216, 387);
      ctx.quadraticCurveTo(221, 418, 257, 422);
      ctx.lineTo(420, 422);
      ctx.quadraticCurveTo(454, 417, 466, 385);
      ctx.lineTo(487, 281);
      ctx.quadraticCurveTo(495, 244, 459, 239);
      ctx.quadraticCurveTo(338, 223, 220, 241);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#252733';
      ctx.beginPath();
      ctx.ellipse(348, 319, 39, 43, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#edf2f7';
      ctx.beginPath();
      ctx.arc(338, 301, 11, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#26303b';
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.moveTo(290, 280);
      ctx.quadraticCurveTo(344, 256, 397, 280);
      ctx.stroke();
      ctx.restore();
    };
    lens(false);
    lens(true);
    ctx.strokeStyle = '#29272b';
    ctx.lineWidth = 26;
    ctx.beginPath();
    ctx.moveTo(487, 264);
    ctx.quadraticCurveTo(512, 255, 537, 264);
    ctx.moveTo(92, 259);
    ctx.lineTo(200, 268);
    ctx.moveTo(824, 268);
    ctx.lineTo(932, 259);
    ctx.stroke();
    ctx.strokeStyle = '#33282a';
    ctx.lineWidth = 24;
    ctx.beginPath();
    ctx.moveTo(241, 207);
    ctx.lineTo(301, 179);
    ctx.lineTo(408, 203);
    ctx.moveTo(616, 203);
    ctx.lineTo(723, 179);
    ctx.lineTo(783, 207);
    ctx.stroke();

    const result = new THREE.CanvasTexture(canvas);
    result.colorSpace = THREE.SRGBColorSpace;
    result.anisotropy = 4;
    return result;
  }, []);

  useEffect(() => () => texture?.dispose(), [texture]);
  if (!texture) return null;
  return (
    <mesh>
      <cylinderGeometry args={[radius + 0.003, radius + 0.003, 0.7, 64, 1, true, -1.15, 2.3]} />
      <meshStandardMaterial map={texture} transparent roughness={0.7} depthWrite={false} />
    </mesh>
  );
}
