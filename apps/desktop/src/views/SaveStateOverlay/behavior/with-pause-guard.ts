/* @layer renderer-components @kind logic */
import { getInputManager } from '@app/input/input-manager/get-input-manager';

const withPauseGuard = async (action: () => Promise<void>): Promise<void> => {
  const inputMgr = getInputManager();
  const wasPaused = inputMgr.isPaused();
  if (wasPaused) {
    inputMgr.resume();
    await new Promise(r => requestAnimationFrame(r));
  }
  await action();
  if (wasPaused) {
    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
    inputMgr.togglePause();
  }
};

export { withPauseGuard };
