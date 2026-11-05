/* @layer bridge-wasm @kind logic */
import type { MemoryView } from '@drizztdourden08/brock-randomizer/memory';
import { CT_WRAM_REGION } from '../memory/ct-memory.constants';
import type { ObjectiveSource } from '../world/bucket/objective-def.type';
import { LOCATION_ID, LOCATION_MASK } from './jets-wings.constants';
import { readInventoryCounts } from './read-inventory-counts';
import { readJoinedCharacters } from './read-joined-characters';

const objectiveDoneNow = (source: ObjectiveSource, view: MemoryView): boolean => {
  if (source.type === 'flag') return (view.byte(CT_WRAM_REGION, source.at) & source.mask) !== 0;
  if (source.type === 'item') return (readInventoryCounts(view, new Set([source.itemId])).get(source.itemId) ?? 0) > 0;
  const joined = readJoinedCharacters(view);
  return source.type === 'joined' ? joined.includes(source.character) : joined.length >= source.count;
};

const locationOf = (view: MemoryView): number => view.word(CT_WRAM_REGION, LOCATION_ID) & LOCATION_MASK;

export { locationOf, objectiveDoneNow };
