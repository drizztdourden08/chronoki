/* @layer bridge-wasm @kind logic */
import { msuSyncVolume } from '@drizztdourden08/brock-msu/session';
import { msuLiveState } from './msu-live-state';
import type { MsuLive } from './msu-session.type';

const setMsuLive = (live: MsuLive): void => {
  msuLiveState.current = live;
  msuSyncVolume();
};

export { setMsuLive };
