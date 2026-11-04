/* @layer renderer-appshell @kind logic */
import { screenshotHold } from '@app/boot/screenshot-hold';
import { requireAppApi } from '@app/ipc/require-app-api';
import { isProbeInput } from '@app/launch-flags/is-probe-input';
import { isProbeSram } from '@app/launch-flags/is-probe-sram';
import { isProbeState } from '@app/launch-flags/is-probe-state';
import { isScreenshotRequested } from '@app/launch-flags/is-screenshot-requested';
import { probeFrames } from '@app/launch-flags/probe-frames';
import { appLog } from '@app/log/app-log';
import { DEFAULT_SCREENSHOT_FRAMES } from '../GameSession.constants';
import { runFramesProbe } from './run-frames-probe';
import { runInputProbe } from './run-input-probe';
import { runSramProbe } from './run-sram-probe';
import { runStateProbe } from './run-state-probe';
import { settleAutoState } from './settle-auto-state';
import { waitForFrames } from './wait-for-frames';

const runLaunchProbes = async (): Promise<void> => {
  try {
    await settleAutoState(await requireAppApi().getTestArgs());
    const frames = probeFrames();
    if (frames !== null) await runFramesProbe(frames);
    if (isProbeInput()) await runInputProbe();
    if (isProbeSram()) await runSramProbe();
    if (isProbeState()) await runStateProbe();
    else if (frames === null && !isProbeInput() && !isProbeSram() && isScreenshotRequested()) await waitForFrames(DEFAULT_SCREENSHOT_FRAMES);
  } catch (error) {
    appLog.error('[launch] probes failed', error);
  } finally {
    screenshotHold.release();
  }
};

export { runLaunchProbes };
