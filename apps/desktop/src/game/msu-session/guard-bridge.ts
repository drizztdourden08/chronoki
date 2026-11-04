/* @layer bridge-wasm @kind logic */
import type { MsuBridge } from '@chronoki/game-core';
import { isCoreLive } from './is-core-live';

const guardBridge = (bridge: MsuBridge): MsuBridge => ({
  poll: () => { if (isCoreLive()) bridge.poll(); },
  setPackPlaying: (on) => { if (isCoreLive()) bridge.setPackPlaying(on); },
  announce: () => { if (isCoreLive()) bridge.announce(); },
  reset: () => { if (isCoreLive()) bridge.reset(); },
});

export { guardBridge };
