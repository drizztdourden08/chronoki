/* @layer bridge-wasm @kind logic */
import type { CheckDef } from '@chronoki/game-core';
import { deriveChestChecks, deriveGiftChecks } from '@chronoki/game-core';

let primed: readonly CheckDef[] | null = null;

const ctChecksCache = {
  prime: (pack: Uint8Array): readonly CheckDef[] => {
    primed = [...deriveChestChecks(pack), ...deriveGiftChecks(pack)];
    return primed;
  },
  checks: (): readonly CheckDef[] | null => primed,
};

export { ctChecksCache };
