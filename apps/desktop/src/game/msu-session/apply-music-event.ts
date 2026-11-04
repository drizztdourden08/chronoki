/* @layer bridge-wasm @kind logic */
import type { MsuBridge, MsuBridgeEvent } from '@chronoki/game-core';
import type { MsuSession } from '@drizztdourden08/brock-msu/session';
import { msuLiveState } from './msu-live-state';
import { routeMusic } from './route-music';

const applyMusicEvent = (event: MsuBridgeEvent, session: MsuSession, bridge: MsuBridge, has: (track: number) => boolean): void => {
  const chipFallback = msuLiveState.current?.settings.msuChipFallback ?? true;
  const route = routeMusic(event.ctrl, has, chipFallback);
  if (route.cue !== null) session.onMusicCue({ ctrl: route.cue, scene: event.ctrl, context: undefined });
  if (route.packPlaying !== null) bridge.setPackPlaying(route.packPlaying);
};

export { applyMusicEvent };
