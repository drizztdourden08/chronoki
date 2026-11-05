/* @layer bridge-wasm @kind logic */
import { frameCaptureState } from './frame-capture-state';

const setEffectLive = (live: boolean): void => {
  frameCaptureState.effectLive = live;
};

export { setEffectLive };
