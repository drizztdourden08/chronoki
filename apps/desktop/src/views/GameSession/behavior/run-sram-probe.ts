/* @layer renderer-appshell @kind logic */
import { CT_SRAM_FILE } from '@chronoki/game-core';
import { activeGameHolder, chronokiCore } from '@app/game/lifecycle';
import { readProfileSram } from '@app/game/lifecycle/read-profile-sram';
import { flushSramSync, removeProfileSram, restoreSramBackup, sramBackupPathOf } from '@app/game/sram-sync';
import { SRAM_PROBE_DEFAULT_BYTES, SRAM_PROBE_FRAMES } from '../GameSession.constants';
import { bytesEqual } from './bytes-equal';
import { logProbe } from './log-probe';
import { sramPattern } from './sram-pattern';
import { waitForFrames } from './wait-for-frames';

const runSramProbe = async (): Promise<void> => {
  await waitForFrames(SRAM_PROBE_FRAMES);
  const game = activeGameHolder.current;
  const fs = chronokiCore.fs();
  if (!game?.profileId || !fs) {
    await logProbe({
      probe: 'sram', ok: false, original: null, stored: null, pattern: 0, patternStored: false, restored: false, identical: false,
      errors: ['not-running or no profile'],
    });
    return;
  }
  const { profileId, files, store } = game;
  const errors: string[] = [];
  const original = fs.analyzePath(CT_SRAM_FILE).exists ? fs.readFile(CT_SRAM_FILE).slice() : null;
  const stored = await readProfileSram(store.sram, profileId);
  const backup = await files.readBytes(sramBackupPathOf(profileId));
  const pattern = sramPattern(original?.length ?? SRAM_PROBE_DEFAULT_BYTES);
  fs.writeFile(CT_SRAM_FILE, pattern);
  const flushed = await flushSramSync();
  const patternStored = bytesEqual(await readProfileSram(store.sram, profileId), pattern);
  if (!flushed) errors.push('flush wrote nothing');
  if (!patternStored) errors.push('stored file does not hold the pattern');
  if (original) {
    fs.writeFile(CT_SRAM_FILE, original);
    await flushSramSync();
  } else {
    fs.unlink(CT_SRAM_FILE);
    await removeProfileSram(files, profileId);
  }
  await restoreSramBackup(files, profileId, backup);
  const final = await readProfileSram(store.sram, profileId);
  const identical = bytesEqual(final, stored) && bytesEqual(await files.readBytes(sramBackupPathOf(profileId)), backup);
  if (!identical) errors.push('profile saves differ from before the probe');
  const restored = original ? bytesEqual(final, stored) : final === null ? 'removed' : false;
  await logProbe({
    probe: 'sram', ok: errors.length === 0, original: original?.length ?? null, stored: stored?.length ?? null,
    pattern: pattern.length, patternStored, restored, identical, errors,
  });
};

export { runSramProbe };
