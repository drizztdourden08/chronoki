/* @layer bridge-wasm @kind logic */
import { activeGameHolder } from './active-game-holder';

const setGamePaused = (paused: boolean): void => {
  activeGameHolder.current?.session.setPaused(paused);
};

export { setGamePaused };
