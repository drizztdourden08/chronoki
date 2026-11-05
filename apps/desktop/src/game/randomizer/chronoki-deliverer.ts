/* @layer bridge-wasm @kind logic */
import type { ItemDeliverer } from '@drizztdourden08/brock-randomizer/session';
import { chronokiCore } from '../lifecycle/chronoki-core';
import { isLocalDelivery } from './is-local-delivery';

const chronokiDeliverer: ItemDeliverer<unknown> = {
  isSafeFrame: () => chronokiCore.state().status === 'running',
  execute: (action) => {
    if (!isLocalDelivery(action)) return 'refused';
    action.apply();
    return 'settled';
  },
};

export { chronokiDeliverer };
