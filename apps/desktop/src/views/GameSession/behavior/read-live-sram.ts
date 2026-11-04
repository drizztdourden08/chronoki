/* @layer renderer-appshell @kind logic */
import { CT_SRAM_FILE } from '@chronoki/game-core';
import type { SramProbeContext } from './sram-probe.type';

const readLiveSram = (fs: SramProbeContext['fs']): Uint8Array | null =>
  fs.analyzePath(CT_SRAM_FILE).exists ? fs.readFile(CT_SRAM_FILE).slice() : null;

export { readLiveSram };
