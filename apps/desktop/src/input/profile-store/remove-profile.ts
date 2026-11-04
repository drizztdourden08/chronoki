/* @layer renderer-lib @kind logic */
import type { InputManager } from '../input-manager/input-manager';
import { commitInputState } from './commit-input-state';

const removeProfile = (m: InputManager, id: string): Promise<void> => {
  const remaining = m.profiles.filter((p) => p.id !== id);
  if (remaining.length === 0 || remaining.length === m.profiles.length) return Promise.resolve();
  m.setProfiles(remaining);
  const fallback = remaining[0];
  if (m.activeProfile?.id === id && fallback) {
    m.setProfile(fallback);
    m.reevaluateControllerPresence();
  }
  return commitInputState(m);
};

export { removeProfile };
