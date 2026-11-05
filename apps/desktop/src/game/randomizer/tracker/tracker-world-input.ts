/* @layer bridge-wasm @kind logic */
import type { CtPlacement, CtWorldInput } from '@chronoki/game-core';
import { currentAppliedSeed } from './current-applied-seed';
import { currentChecks } from './current-checks';

const trackerWorldInput = (placement?: CtPlacement): CtWorldInput => {
  const seed = currentAppliedSeed();
  return {
    checks: currentChecks(),
    sealedCheckIds: seed === null ? undefined : new Set(seed.sealedCheckIds),
    options: seed?.options,
    startParty: placement?.startParty,
  };
};

export { trackerWorldInput };
