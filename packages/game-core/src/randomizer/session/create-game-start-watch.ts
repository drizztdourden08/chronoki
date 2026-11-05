/* @layer bridge-wasm @kind logic */
import type { MemoryView } from '@drizztdourden08/brock-randomizer/memory';
import { NEW_GAME_FLAG } from '../../game-info/wram-map.constants';
import { CT_WRAM_REGION } from '../memory/ct-memory.constants';
import { playSecondsOf } from './play-seconds-of';
import { GAME_START_JUMP_SECONDS, NEW_GAME_CHOSEN } from './session.constants';
import type { GameStartWatch } from './watch.type';

const createGameStartWatch = (): GameStartWatch => {
  let last: number | null = null;
  let latched = false;
  let fresh = false;

  const jumpedForward = (view: MemoryView): boolean => {
    const now = playSecondsOf(view);
    const jumped = last !== null && now - last > GAME_START_JUMP_SECONDS;
    last = now;
    return jumped;
  };

  const observe = (view: MemoryView): boolean => {
    if (latched) return true;
    const loaded = jumpedForward(view);
    const newGame = view.byte(CT_WRAM_REGION, NEW_GAME_FLAG) === NEW_GAME_CHOSEN;
    latched = loaded || newGame;
    fresh = newGame && !loaded;
    return latched;
  };

  return {
    observe,
    started: () => latched,
    newGame: () => latched && fresh,
    reset: () => {
      last = null;
      latched = false;
      fresh = false;
    },
  };
};

export { createGameStartWatch };
