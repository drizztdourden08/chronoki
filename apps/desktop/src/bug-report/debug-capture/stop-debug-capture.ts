/* @layer renderer-lib @kind logic */
import { appLog } from '@app/log/app-log';
import { platformFiles } from '@app/storage/platform-files';
import { capturePathOf, captureDirOf } from './capture-path';
import { captureRun } from './debug-capture.state';
import { debugCaptureStore } from './debug-capture-store';

const stopDebugCapture = async (): Promise<void> => {
  const run = captureRun.current;
  if (!run) return;
  captureRun.current = null;
  run.stops.forEach((stop) => stop());
  debugCaptureStore.set(false);
  const { session } = run;
  session.endedAt = Date.now();
  try {
    const files = platformFiles();
    await files.mkdir(captureDirOf(session.profileId));
    await files.writeText(capturePathOf(session.profileId, session.sessionKey), JSON.stringify(session));
  } catch (cause) {
    appLog.warn('[debug-capture] could not save the capture', cause);
  }
};

export { stopDebugCapture };
