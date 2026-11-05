/* @layer bridge-wasm @kind logic */
import type { CtPlacement } from '@chronoki/game-core';
import { EMPTY_VANILLA } from './tracker.constants';

const vanillaOf = (build: () => CtPlacement | undefined): CtPlacement => {
  try {
    return build() ?? EMPTY_VANILLA;
  } catch {
    return EMPTY_VANILLA;
  }
};

export { vanillaOf };
