/* @layer bridge-wasm @kind logic */
import type { MsuHost } from '@drizztdourden08/brock-msu';
import type { MsuBridge } from './music-state.type';

const createCtMsuHost = (bridge: MsuBridge, audioTarget: MsuHost['audioTarget']): MsuHost => ({
  audioTarget,
  setExternalMusic: (on) => bridge.setPackPlaying(on),
  restoreCoreMusic: () => bridge.setPackPlaying(false),
  announceCoreMusic: () => bridge.announce(),
  setSoundClaim: () => undefined,
});

export { createCtMsuHost };
