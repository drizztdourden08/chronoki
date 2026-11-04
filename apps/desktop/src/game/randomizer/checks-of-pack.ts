/* @layer bridge-wasm @kind logic */
import type { CheckDef } from '@chronoki/game-core';
import { deriveChestChecks, deriveGiftChecks } from '@chronoki/game-core';

const checksOfPack = (pack: Uint8Array): readonly CheckDef[] => [...deriveChestChecks(pack), ...deriveGiftChecks(pack)];

export { checksOfPack };
