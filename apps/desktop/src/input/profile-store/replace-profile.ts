/* @layer renderer-lib @kind logic */
import type { InputProfile } from '@chronoki/input-mapping';
import type { InputManager } from '../input-manager/input-manager';
import { commitInputState } from './commit-input-state';

const replaceProfile = (m: InputManager, updated: InputProfile): Promise<void> => {
  m.setProfiles(m.profiles.map((p) => (p.id === updated.id ? updated : p)));
  if (m.activeProfile?.id === updated.id) m.setProfile(updated);
  return commitInputState(m);
};

export { replaceProfile };
