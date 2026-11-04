/* @layer renderer-app @kind logic */
import { getInputManager } from '@app/input/input-manager/get-input-manager';
import { appLog } from '@app/log/app-log';
import { loadInputState } from '@app/input/profile-store/load-input-state';

const loadInputProfile = async (profileId: string): Promise<void> => {
  try {
    const manager = getInputManager();
    await loadInputState(manager, profileId);
    appLog.info(`[input] loaded input profile: ${manager.activeProfile?.name ?? 'none'}`);
  } catch (error) {
    appLog.warn('[input] failed to load input profiles', error);
  }
};

export { loadInputProfile };
