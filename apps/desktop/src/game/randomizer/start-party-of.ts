/* @layer bridge-wasm @kind logic */
import type { CtPlacement, CtStartParty } from '@chronoki/game-core';
import { LEGACY_PARTY } from '@chronoki/game-core';

const startPartyOf = (placement: Pick<CtPlacement, 'startParty'>): CtStartParty => placement.startParty ?? LEGACY_PARTY;

export { startPartyOf };
