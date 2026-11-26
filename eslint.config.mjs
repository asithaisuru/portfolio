import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';

export default defineConfig([
  ...nextVitals,
  {
    files: ['components/brick-world.tsx', 'components/landing-meadow.tsx'],
    // React Three Fiber exposes a mutable Three.js scene/camera by design.
    rules: { 'react-hooks/immutability': 'off' },
  },
  globalIgnores(['.next/**', 'out/**', 'next-env.d.ts']),
]);
