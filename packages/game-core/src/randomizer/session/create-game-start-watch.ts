/* @layer bridge-wasm @kind logic */
import type { MemoryView } from '@drizztdourden08/brock-randomizer/memory';
import { NEW_GAME_FLAG } from '../../game-info/wram-map.constants';
import { CT_WRAM_REGION } from '../memory/ct-memory.constants';
import { createSaveLoadWatch } from './create-save-load-watch';
import { GAME_START_JUMP_SECONDS, NEW_GAME_CHOSEN } from './session.constants';
import type { GameStartWatch } from './watch.type';

const createGameStartWatch = (): GameStartWatch => {
  let clock = createSaveLoadWatch(GAME_START_JUMP_SECONDS);
  let latched = false;

  const observe = (view: MemoryView): boolean => {
    if (latched) return true;
    const loaded = clock.loaded(view);
    const newGame = view.byte(CT_WRAM_REGION, NEW_GAME_FLAG) === NEW_GAME_CHOSEN;
    latched = loaded || newGame;
    return latched;
  };

  return {
    observe,
    started: () => latched,
    reset: () => {
      clock = createSaveLoadWatch(GAME_START_JUMP_SECONDS);
      latched = false;
    },
  };
};

export { createGameStartWatch };
