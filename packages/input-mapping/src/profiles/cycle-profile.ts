/* @layer renderer-lib @kind logic */
import type { InputProfile } from './profiles.type';

const cycleProfile = (profiles: readonly InputProfile[], activeId: string | null, direction: 1 | -1): InputProfile | null => {
  if (profiles.length < 2) return null;
  const currentIndex = profiles.findIndex((p) => p.id === activeId);
  const base = currentIndex < 0 ? 0 : currentIndex;
  const next = profiles[(base + direction + profiles.length) % profiles.length];
  return next && next.id !== activeId ? next : null;
};

export { cycleProfile };
