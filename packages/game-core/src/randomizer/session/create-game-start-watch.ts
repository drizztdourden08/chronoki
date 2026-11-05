/* @layer bridge-wasm @kind logic */
import type { MemoryView } from '@drizztdourden08/brock-randomizer/memory';
import { PARTY_ACTIVE, PARTY_EMPTY_FLAG } from '../../game-info/wram-map.constants';
import { CT_WRAM_REGION } from '../memory/ct-memory.constants';
import { createSaveLoadWatch } from './create-save-load-watch';
import type { GameStartWatch } from './watch.type';

const partyFilled = (view: MemoryView): boolean => (view.byte(CT_WRAM_REGION, PARTY_ACTIVE) & PARTY_EMPTY_FLAG) === 0;

const createGameStartWatch = (): GameStartWatch => {
  let clock = createSaveLoadWatch();
  let sawEmptyParty = false;
  let latched = false;

  const observe = (view: MemoryView): boolean => {
    if (latched) return true;
    const jumped = clock.loaded(view);
    const filled = partyFilled(view);
    if (!filled) sawEmptyParty = true;
    latched = jumped || (sawEmptyParty && filled);
    return latched;
  };

  return {
    observe,
    started: () => latched,
    reset: () => {
      clock = createSaveLoadWatch();
      sawEmptyParty = false;
      latched = false;
    },
  };
};

export { createGameStartWatch };
