/* @layer renderer-lib @kind logic */
import { activeGameHolder } from '@app/game/lifecycle';
import { captureAllowed } from './capture-allowed.state';
import { captureRun } from './debug-capture.state';
import { startDebugCapture } from './start-debug-capture';
import { stopDebugCapture } from './stop-debug-capture';

const toggleDebugCapture = async (): Promise<void> => {
  if (captureRun.current) {
    await stopDebugCapture();
    return;
  }
  const profileId = activeGameHolder.current?.profileId;
  if (profileId && captureAllowed.current) startDebugCapture(profileId);
};

export { toggleDebugCapture };
