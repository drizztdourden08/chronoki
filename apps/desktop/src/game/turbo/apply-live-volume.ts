/* @layer bridge-wasm @kind logic */
import { activeGameHolder } from '../lifecycle/active-game-holder';

const applyLiveVolume = (volume: number): void => {
  activeGameHolder.current?.session.audio.setVolume(volume);
};

export { applyLiveVolume };
