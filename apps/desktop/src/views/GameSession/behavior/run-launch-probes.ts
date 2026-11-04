/* @layer renderer-appshell @kind logic */
import { requireHostApi } from '@drizztdourden08/brock-react';
import { screenshotHold } from '@app/boot/screenshot-hold';
import { isProbeState } from '@app/launch-flags/is-probe-state';
import { isScreenshotRequested } from '@app/launch-flags/is-screenshot-requested';
import { probeFrames } from '@app/launch-flags/probe-frames';
import { DEFAULT_SCREENSHOT_FRAMES } from '../GameSession.constants';
import { runFramesProbe } from './run-frames-probe';
import { runStateProbe } from './run-state-probe';
import { settleAutoState } from './settle-auto-state';
import { waitForFrames } from './wait-for-frames';

const runLaunchProbes = async (): Promise<void> => {
  try {
    await settleAutoState(await requireHostApi().getTestArgs());
    const frames = probeFrames();
    if (frames !== null) await runFramesProbe(frames);
    if (isProbeState()) await runStateProbe();
    else if (frames === null && isScreenshotRequested()) await waitForFrames(DEFAULT_SCREENSHOT_FRAMES);
  } catch (error) {
    console.error('[launch] probes failed', error);
  } finally {
    screenshotHold.release();
  }
};

export { runLaunchProbes };
