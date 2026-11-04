/* @layer renderer-lib @kind logic */
import type { RomImport } from '@drizztdourden08/brock-port-kit';
import { CT_ROM_LABEL } from '@chronoki/game-core';

const refusalMessage = (refused: RomImport & { ok: false }): string => {
  if (refused.message) return refused.message;
  if (refused.reason === 'unknown') {
    return `Not a recognised ${CT_ROM_LABEL} (SHA-1 ${refused.hash.slice(0, 16)}...). Only the supported revision can be used.`;
  }
  return `File is not a valid ${CT_ROM_LABEL} or archive`;
};

export { refusalMessage };
