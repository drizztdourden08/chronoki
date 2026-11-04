/* @layer bridge-wasm @kind logic */
import { turboState } from './turbo-state';

const setTurboVolume = (volume: number): void => {
  turboState.volume = volume;
};

export { setTurboVolume };
