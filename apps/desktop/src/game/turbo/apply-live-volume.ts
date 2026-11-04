/* @layer bridge-wasm @kind logic */
import { activeGameHolder } from '../lifecycle/active-game-holder';
import { turboState } from './turbo-state';

const applyLiveVolume = (volume: number): void => {
  if (turboState.muted) return;
  activeGameHolder.current?.session.audio.setVolume(volume);
};

export { applyLiveVolume };
