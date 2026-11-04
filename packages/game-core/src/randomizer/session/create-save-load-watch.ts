/* @layer bridge-wasm @kind logic */
import type { MemoryView } from '@drizztdourden08/brock-randomizer/session';
import { playSecondsOf } from './play-seconds-of';
import { SAVE_LOAD_JUMP_SECONDS } from './session.constants';
import type { SaveLoadWatch } from './watch.type';

const createSaveLoadWatch = (jumpSeconds: number = SAVE_LOAD_JUMP_SECONDS): SaveLoadWatch => {
  let last: number | null = null;
  return {
    loaded: (view: MemoryView): boolean => {
      const now = playSecondsOf(view);
      const jumped = last !== null && (now < last || now - last > jumpSeconds);
      last = now;
      return jumped;
    },
    reset: () => {
      last = null;
    },
  };
};

export { createSaveLoadWatch };
