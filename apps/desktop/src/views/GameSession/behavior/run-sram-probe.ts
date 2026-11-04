/* @layer renderer-appshell @kind logic */
import { SRAM_PROBE_FRAMES } from '../GameSession.constants';
import { logProbe } from './log-probe';
import { measureSramProbe } from './measure-sram-probe';
import { sramProbeContext } from './sram-probe-context';
import { waitForFrames } from './wait-for-frames';

const runSramProbe = async (): Promise<void> => {
  await waitForFrames(SRAM_PROBE_FRAMES);
  const ctx = sramProbeContext();
  if (!ctx) {
    await logProbe({
      probe: 'sram', ok: false, original: null, stored: null, pattern: 0, patternStored: false, restored: false, identical: false,
      errors: ['not-running or no profile'],
    });
    return;
  }
  await logProbe(await measureSramProbe(ctx));
};

export { runSramProbe };
