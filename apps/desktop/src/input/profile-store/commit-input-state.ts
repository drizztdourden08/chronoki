/* @layer renderer-lib @kind logic */
import type { InputManager } from '../input-manager/input-manager';
import { writeInputProfilesState } from './write-input-profiles-state';

const commitInputState = async (m: InputManager): Promise<void> => {
  if (!m.profileId) return;
  try {
    await writeInputProfilesState(m.profileId, {
      activeProfileId: m.activeProfile?.id ?? null,
      profiles: m.profiles,
      functionMappings: m.getFunctionMappings(),
    });
  } catch (error) {
    console.warn('[input] failed to write input-profiles.json', error);
  }
};

export { commitInputState };
