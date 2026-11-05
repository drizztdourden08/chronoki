/* @layer bridge-wasm @kind type */
import type { CtItem } from '@chronoki/game-core';

type CtPool = {
  locations: number;
  progression: readonly CtItem[];
  rest: readonly CtItem[];
};

export type { CtPool };
