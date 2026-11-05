/* @layer bridge-wasm @kind logic */
import type { CtPlacement } from '@chronoki/game-core';
import { currentAppliedSeed } from './current-applied-seed';
import { currentChecks } from './current-checks';

const worldKeyOf = (placement: CtPlacement): string => {
  const seed = currentAppliedSeed();
  return [
    placement.seed,
    currentChecks().length,
    placement.startParty?.join(',') ?? '',
    JSON.stringify(seed?.options ?? {}),
    seed?.sealedCheckIds.join(',') ?? '',
  ].join(':');
};

export { worldKeyOf };
