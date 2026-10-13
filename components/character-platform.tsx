/** A permanent platform, projected with the same camera as the character. */
export function CharacterPlatform() {
  const cameraLength = Math.hypot(1, 6.1);
  const lens = Math.tan(20 * Math.PI / 180);
  const project = (x: number, y: number, z: number) => {
    const depth = -(y - 1) / cameraLength - (z - 6.1) * 6.1 / cameraLength;
    const vertical = (y - 1) * 6.1 / cameraLength - (z - 6.1) / cameraLength;
    return `${(320 + x * 320 / (depth * lens)).toFixed(2)},${(320 - vertical * 320 / (depth * lens)).toFixed(2)}`;
  };
  const arc = (radius: number, y: number, start: number, end: number) => Array.from({ length: 65 }, (_, i) => {
    const angle = start + (end - start) * i / 64;
    return project(Math.sin(angle) * radius, y, Math.cos(angle) * radius);
  });
  const rim = [...arc(1.42, -1.55, -Math.PI / 2, Math.PI / 2), ...arc(1.55, -1.83, Math.PI / 2, -Math.PI / 2)];
  const top = arc(1.42, -1.53, 0, Math.PI * 2);

  return (
    <svg data-character-platform aria-hidden="true" viewBox="0 0 640 640" width="640" height="640" style={{ position: 'absolute', left: '50%', top: 0, width: 'auto', maxWidth: 'none', height: '100%', transform: 'translateX(-50%)', pointerEvents: 'none', zIndex: 1 }}>
      <path d={`M${rim.join(' L')} Z`} fill="#deddd7" />
      <path d={`M${top.join(' L')} Z`} fill="#efeee9" />
    </svg>
  );
}
