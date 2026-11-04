/* @layer renderer-lib @kind logic */
import { cycleProfile, notifyQuietly } from '@chronoki/input-mapping';
import type { InputManager } from './input-manager';

const cycleActiveProfile = (m: InputManager, direction: 1 | -1): void => {
  const next = cycleProfile(m.profiles, m.activeProfile?.id ?? null, direction);
  if (!next) return;
  m.setProfile(next);
  m.persistActiveProfileId?.(next.id);
  notifyQuietly(m.activeProfileListeners, next);
  m.reevaluateControllerPresence();
};

export { cycleActiveProfile };
