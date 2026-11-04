/* @layer renderer-lib @kind logic */
import { captureRun } from './debug-capture.state';
import { debugCaptureStore } from './debug-capture-store';
import { watchFrames } from './watch-frames';
import { watchInput } from './watch-input';
import { watchLogs } from './watch-logs';
import type { CaptureSession } from './debug-capture.type';

const startDebugCapture = (profileId: string): void => {
  if (captureRun.current) return;
  const startedAt = Date.now();
  const session: CaptureSession = { sessionKey: `${startedAt}`, profileId, startedAt, endedAt: startedAt, events: [] };
  captureRun.current = { session, stops: [watchLogs(session), watchInput(session), watchFrames(session)] };
  debugCaptureStore.set(true);
};

export { startDebugCapture };
