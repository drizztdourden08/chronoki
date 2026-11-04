/* @layer renderer-appshell @kind logic */
import { HOST_PROBE_BOOT_FRAMES } from '../GameSession.constants';
import { logProbe } from './log-probe';
import { probeHostSaves } from './probe-host-saves';
import { probeHostTurbo } from './probe-host-turbo';
import { waitForFrames } from './wait-for-frames';

const runHostProbe = async (): Promise<void> => {
  await waitForFrames(HOST_PROBE_BOOT_FRAMES);
  const errors: string[] = [];
  const turbo = await probeHostTurbo(errors);
  const { autoSave, saveOnQuit } = await probeHostSaves(errors);
  await logProbe({ probe: 'host', ok: errors.length === 0, turbo, autoSave, saveOnQuit, errors });
};

export { runHostProbe };
