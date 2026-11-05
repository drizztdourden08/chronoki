/* @layer bridge-wasm @kind logic */
import type { CtPlacement, CtWorldInput } from '@chronoki/game-core';
import { currentChecks } from './current-checks';
import { trackerSeedContext } from './tracker-seed-context';

const trackerWorldInput = (placement?: CtPlacement): CtWorldInput => ({
  checks: currentChecks(),
  sealedCheckIds: trackerSeedContext.sealedCheckIds,
  options: trackerSeedContext.options,
  startParty: placement?.startParty,
});

export { trackerWorldInput };
