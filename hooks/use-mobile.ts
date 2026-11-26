import { useSyncExternalStore } from 'react';
const query = '(max-width: 767px)';
const subscribe = (changed: () => void) => {
  const media = window.matchMedia(query);
  media.addEventListener('change', changed);
  return () => media.removeEventListener('change', changed);
};
const snapshot = () => window.matchMedia(query).matches;
export function useIsMobile() {
  return useSyncExternalStore(subscribe, snapshot, () => false);
}
