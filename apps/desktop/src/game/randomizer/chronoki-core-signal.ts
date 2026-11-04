/* @layer bridge-wasm @kind logic */
import type { CoreSignal } from '@drizztdourden08/brock-randomizer';
import { chronokiCore } from '../lifecycle/chronoki-core';
import { RUNNING_STATUS, SESSION_LIVE_STATUSES } from './chronoki-core-signal.constants';

const chronokiCoreSignal: CoreSignal = {
  state: () => {
    const { status } = chronokiCore.state();
    return { status: SESSION_LIVE_STATUSES.has(status) ? RUNNING_STATUS : status };
  },
  subscribe: (fn) => chronokiCore.subscribe(() => fn()),
};

export { chronokiCoreSignal };
