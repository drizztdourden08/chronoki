/* @layer renderer-lib @kind logic */
import type { InputManager } from '../input-manager/input-manager';
import { applyInputState } from './apply-input-state';
import { readInputProfilesState } from './read-input-profiles-state';

const loadInputState = async (m: InputManager, profileId: string): Promise<void> => {
  applyInputState(m, profileId, await readInputProfilesState(profileId));
};

export { loadInputState };
