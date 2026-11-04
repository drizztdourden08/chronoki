/* @layer bridge-wasm @kind logic */
import { stateLoadedSignal } from '../save-states/state-loaded-signal';
import { gameLoadedSignal } from './game-loaded-signal';

const onAnyLoad = (cb: () => void): (() => void) => {
  const stopState = stateLoadedSignal.on(cb);
  const stopGame = gameLoadedSignal.on(cb);
  return () => {
    stopState();
    stopGame();
  };
};

export { onAnyLoad };
