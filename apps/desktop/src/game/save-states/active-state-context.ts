/* @layer bridge-wasm @kind logic */
import { activeGameHolder } from '../lifecycle/active-game-holder';
import { chronokiCore } from '../lifecycle/chronoki-core';
import type { SaveStateContext } from './save-state.type';

const activeStateContext = (): SaveStateContext | null => {
  const game = activeGameHolder.current;
  if (!game) return null;
  return { core: chronokiCore, store: game.store, canvas: game.canvas, romFile: game.romFile, profileId: game.profileId };
};

export { activeStateContext };
