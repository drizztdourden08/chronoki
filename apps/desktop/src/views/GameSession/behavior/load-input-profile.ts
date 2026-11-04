/* @layer renderer-app @kind logic */
import { getInputManager } from '@app/input/input-manager/get-input-manager';
import { loadInputState } from '@app/input/profile-store/load-input-state';

const loadInputProfile = async (profileId: string): Promise<void> => {
  try {
    const manager = getInputManager();
    await loadInputState(manager, profileId);
    console.info(`[input] loaded input profile: ${manager.activeProfile?.name ?? 'none'}`);
  } catch (error) {
    console.warn('[input] failed to load input profiles', error);
  }
};

export { loadInputProfile };
