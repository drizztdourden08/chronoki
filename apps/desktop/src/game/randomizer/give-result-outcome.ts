/* @layer bridge-wasm @kind logic */
import type { DeliveryOutcome } from '@drizztdourden08/brock-randomizer/session';
import type { CtGiveResult } from '@chronoki/game-core';

const giveResultOutcome = (result: CtGiveResult): DeliveryOutcome =>
  result === 'retry' ? 'refused' : 'settled';

export { giveResultOutcome };
