/* @layer bridge-wasm @kind logic */
import type { AppSettings } from '@app/settings.type';
import { msuLiveState } from './msu-live-state';
import { FULL_VOLUME, PER_GROUP_GATE } from './msu-session.constants';

const groupVolume = (read: (settings: AppSettings) => number): number => {
  const live = msuLiveState.current;
  if (!live?.gates.has(PER_GROUP_GATE)) return FULL_VOLUME;
  return read(live.settings);
};

export { groupVolume };
