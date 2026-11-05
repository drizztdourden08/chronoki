/* @layer bridge-wasm @kind logic */
import type { CheckDef } from '@chronoki/game-core';
import { deriveChestChecks, deriveGiftChecks, spotGiftChecksOf } from '@chronoki/game-core';

const checksOfPack = (pack: Uint8Array, options?: Readonly<Record<string, unknown>>): readonly CheckDef[] => [
  ...deriveChestChecks(pack), ...deriveGiftChecks(pack), ...spotGiftChecksOf(options),
];

export { checksOfPack };
