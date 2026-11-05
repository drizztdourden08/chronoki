/* @layer bridge-wasm @kind logic */
import type { MemoryView } from '@drizztdourden08/brock-randomizer/memory';
import { PARTY_JOINED } from '../../game-info/wram-map.constants';
import { CT_WRAM_REGION } from '../memory/ct-memory.constants';
import type { CtCharacter } from '../world/ct-world-keys.type';
import { CT_CHARACTER_ORDER } from './ct-character-order.constants';

const readJoinedCharacters = (view: MemoryView): CtCharacter[] => {
  const mask = view.byte(CT_WRAM_REGION, PARTY_JOINED);
  return CT_CHARACTER_ORDER.filter((_, bit) => (mask & (1 << bit)) !== 0);
};

export { readJoinedCharacters };
