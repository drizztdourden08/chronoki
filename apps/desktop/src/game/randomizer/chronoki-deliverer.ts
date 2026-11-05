/* @layer bridge-wasm @kind logic */
import type { ItemDeliverer } from '@drizztdourden08/brock-randomizer/session';
import { isCtGiveAction } from '@chronoki/game-core';
import { chronokiCore } from '../lifecycle/chronoki-core';
import { giveCtAction } from './give-ct-action';
import { giveResultOutcome } from './give-result-outcome';
import { isLocalDelivery } from './is-local-delivery';

const chronokiDeliverer: ItemDeliverer<unknown> = {
  isSafeFrame: () => chronokiCore.state().status === 'running',
  execute: (action) => {
    if (isLocalDelivery(action)) {
      action.apply();
      return 'settled';
    }
    if (isCtGiveAction(action)) return giveResultOutcome(giveCtAction(action));
    return 'refused';
  },
};

export { chronokiDeliverer };
