/* @layer bridge-wasm @kind logic */
import type { ActiveGame } from '../lifecycle/active-game.type';
import { chronokiCore } from '../lifecycle/chronoki-core';
import type { SaveStateContext } from '../save-states/save-state.type';

const contextOfGame = (game: ActiveGame): SaveStateContext => ({
  core: chronokiCore,
  store: game.store,
  canvas: game.canvas,
  romFile: game.romFile,
  profileId: game.profileId,
});

export { contextOfGame };
