/* @layer renderer-lib @kind logic */
import type { InputProfile } from '@chronoki/input-mapping';
import type { InputManager } from '../input-manager/input-manager';
import { commitInputState } from './commit-input-state';

const selectProfile = (m: InputManager, profile: InputProfile): Promise<void> => {
  m.setProfile(profile);
  m.reevaluateControllerPresence();
  return commitInputState(m);
};

export { selectProfile };
