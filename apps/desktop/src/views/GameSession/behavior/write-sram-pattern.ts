/* @layer renderer-appshell @kind logic */
import { CT_SRAM_FILE } from '@chronoki/game-core';
import { flushSramSync } from '@app/game/sram-sync';
import { readProfileSram } from '@app/game/lifecycle/read-profile-sram';
import { SRAM_PROBE_DEFAULT_BYTES } from '../GameSession.constants';
import { bytesEqual } from './bytes-equal';
import { sramPattern } from './sram-pattern';
import type { PatternWrite, SramProbeContext } from './sram-probe.type';

const writeSramPattern = async (ctx: SramProbeContext, original: Uint8Array | null): Promise<PatternWrite> => {
  const pattern = sramPattern(original?.length ?? SRAM_PROBE_DEFAULT_BYTES);
  ctx.fs.writeFile(CT_SRAM_FILE, pattern);
  const flushed = await flushSramSync();
  const patternStored = bytesEqual(await readProfileSram(ctx.store.sram, ctx.profileId), pattern);
  const errors: string[] = [];
  if (!flushed) errors.push('flush wrote nothing');
  if (!patternStored) errors.push('stored file does not hold the pattern');
  return { pattern, patternStored, errors };
};

export { writeSramPattern };
