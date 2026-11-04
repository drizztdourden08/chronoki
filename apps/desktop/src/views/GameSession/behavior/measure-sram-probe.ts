/* @layer renderer-appshell @kind logic */
import { readProfileSram } from '@app/game/lifecycle/read-profile-sram';
import type { SramProbeEntry } from '@app/ipc/event-log-entry.type';
import { restoreBackupToSram, sramBackupPathOf } from '@app/game/sram-sync';
import { bytesEqual } from './bytes-equal';
import { readLiveSram } from './read-live-sram';
import { restoreLiveSram } from './restore-live-sram';
import { sramRestoredState } from './sram-restored-state';
import type { SramProbeContext } from './sram-probe.type';
import { writeSramPattern } from './write-sram-pattern';

const measureSramProbe = async (ctx: SramProbeContext): Promise<SramProbeEntry> => {
  const { fs, profileId, files, store } = ctx;
  const original = readLiveSram(fs);
  const stored = await readProfileSram(store.sram, profileId);
  const backup = await files.readBytes(sramBackupPathOf(profileId));
  const { pattern, patternStored, errors } = await writeSramPattern(ctx, original);
  await restoreLiveSram(ctx, original);
  await restoreBackupToSram(files, profileId, backup);
  const final = await readProfileSram(store.sram, profileId);
  const identical = bytesEqual(final, stored) && bytesEqual(await files.readBytes(sramBackupPathOf(profileId)), backup);
  if (!identical) errors.push('profile saves differ from before the probe');
  return {
    probe: 'sram', ok: errors.length === 0, original: original?.length ?? null, stored: stored?.length ?? null,
    pattern: pattern.length, patternStored, restored: sramRestoredState(original, final, stored), identical, errors,
  };
};

export { measureSramProbe };
