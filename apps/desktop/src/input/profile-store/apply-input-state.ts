/* @layer renderer-lib @kind logic */
import type { InputManager } from '../input-manager/input-manager';
import { commitInputState } from './commit-input-state';
import type { InputProfilesState } from './input-profiles-state.type';

const applyInputState = (m: InputManager, profileId: string, state: InputProfilesState): void => {
  m.profileId = profileId;
  m.setProfiles(state.profiles);
  m.setFunctionMappings(state.functionMappings);
  m.setActiveProfilePersist(() => { void commitInputState(m); });
  const active = state.profiles.find((p) => p.id === state.activeProfileId) ?? state.profiles[0];
  if (active) m.setProfile(active);
};

export { applyInputState };
