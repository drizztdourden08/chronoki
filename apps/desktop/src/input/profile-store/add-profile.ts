/* @layer renderer-lib @kind logic */
import type { InputProfile } from '@chronoki/input-mapping';
import type { InputManager } from '../input-manager/input-manager';
import { commitInputState } from './commit-input-state';

const addProfile = (m: InputManager, profile: InputProfile): Promise<void> => {
  m.setProfiles([...m.profiles, profile]);
  m.setProfile(profile);
  m.reevaluateControllerPresence();
  return commitInputState(m);
};

export { addProfile };
