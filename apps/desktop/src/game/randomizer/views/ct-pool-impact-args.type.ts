/* @layer bridge-wasm @kind type */
import type { CtOptionValues } from '@chronoki/game-core';
import type { CtPool } from './ct-pool.type';

type CtPoolImpactArgs = {
  key: string;
  pack: Uint8Array;
  options: CtOptionValues;
  current: CtPool;
  seed: string;
};

export type { CtPoolImpactArgs };
