/* @layer bridge-wasm @kind logic */
import type { CtPlacement } from '@chronoki/game-core';

const dumpPlacement = (placement: CtPlacement): string => JSON.stringify({ ...placement, spheres: [] });

export { dumpPlacement };
