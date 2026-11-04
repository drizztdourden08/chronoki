/* @layer renderer-appshell @kind logic */
import { CT_SRAM_FILE } from '@chronoki/game-core';
import { flushSramSync, removeProfileSram } from '@app/game/sram-sync';
import type { SramProbeContext } from './sram-probe.type';

const restoreLiveSram = async (ctx: SramProbeContext, original: Uint8Array | null): Promise<void> => {
  if (original) {
    ctx.fs.writeFile(CT_SRAM_FILE, original);
    await flushSramSync();
    return;
  }
  ctx.fs.unlink(CT_SRAM_FILE);
  await removeProfileSram(ctx.files, ctx.profileId);
};

export { restoreLiveSram };
