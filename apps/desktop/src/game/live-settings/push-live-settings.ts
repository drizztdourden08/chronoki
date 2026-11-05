/* @layer bridge-wasm @kind logic */
import { reassertLive } from '@chronoki/game-core';
import { LIVE_STATUSES } from '../game-info/game-info.constants';
import { chronokiCore } from '../lifecycle/chronoki-core';

const pushLiveSettings = (): void => {
  const live = LIVE_STATUSES.includes(chronokiCore.state().status);
  reassertLive(live ? chronokiCore.calls() : null);
};

export { pushLiveSettings };
