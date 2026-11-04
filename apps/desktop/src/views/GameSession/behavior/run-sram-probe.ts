/* @layer renderer-appshell @kind logic */
import { CT_SRAM_FILE } from '@chronoki/game-core';
import { activeGameHolder, chronokiCore } from '@app/game/lifecycle';
import { readProfileSram } from '@app/game/lifecycle/read-profile-sram';
import { flushSramSync } from '@app/game/sram-sync';
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
      probe: 'sram', ok: false, original: null, stored: null, pattern: 0, patternStored: false, restored: false,
      errors: ['not-running or no profile'],
    });
    return;
  }
  const { sram } = game.store;
  const errors: string[] = [];
  const original = fs.analyzePath(CT_SRAM_FILE).exists ? fs.readFile(CT_SRAM_FILE).slice() : null;
  const stored = await readProfileSram(sram, game.profileId);
  const pattern = sramPattern(original?.length ?? SRAM_PROBE_DEFAULT_BYTES);
  fs.writeFile(CT_SRAM_FILE, pattern);
  const flushed = await flushSramSync();
  const patternStored = bytesEqual(await readProfileSram(sram, game.profileId), pattern);
  if (!flushed) errors.push('flush wrote nothing');
  if (!patternStored) errors.push('stored file does not hold the pattern');
  let restored = false;
  if (original) {
    fs.writeFile(CT_SRAM_FILE, original);
    await flushSramSync();
    restored = bytesEqual(await readProfileSram(sram, game.profileId), stored);
    if (!restored) errors.push('restore did not match the original');
  } else {
    fs.unlink(CT_SRAM_FILE);
    errors.push('profile had no SRAM: the pattern file stays in the saves folder');
  }
  await logProbe({
    probe: 'sram', ok: errors.length === 0, original: original?.length ?? null, stored: stored?.length ?? null,
    pattern: pattern.length, patternStored, restored, errors,
  });
};

export { runSramProbe };
