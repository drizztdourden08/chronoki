/* @layer bridge-wasm @kind type */
import type { RandomizerOptions } from '@drizztdourden08/brock-randomizer';
import type { CheckDef, CtPlacement } from '@chronoki/game-core';

type WriteSeedInput = {
  profileId: string; placement: CtPlacement; checks: readonly CheckDef[]; assets: Uint8Array; options: RandomizerOptions;
};

export type { WriteSeedInput };
