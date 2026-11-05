/* @layer bridge-wasm @kind logic */
import { FIRST_TECH_ID, LAST_TECH_ID, TECH_SLOTS } from './tech-order.constants';
import type { TechIdMaps } from './tech-id-maps-of.type';
import type { SlotPermutations } from './tech-order.type';

const inRange = (id: number): boolean => id >= FIRST_TECH_ID && id <= LAST_TECH_ID;

const techIdMapsOf = (perms: SlotPermutations): TechIdMaps => {
  const slotOf = (character: number, slot: number): number => perms[character]?.[slot] ?? slot;
  const newIdOf = (id: number): number => {
    if (!inRange(id)) return id;
    const character = Math.floor((id - FIRST_TECH_ID) / TECH_SLOTS);
    return FIRST_TECH_ID + character * TECH_SLOTS + slotOf(character, (id - FIRST_TECH_ID) % TECH_SLOTS);
  };
  const oldIds = new Map(Array.from({ length: LAST_TECH_ID }, (_, i) => FIRST_TECH_ID + i).map((id) => [newIdOf(id), id]));
  const oldIdOf = (id: number): number => (inRange(id) ? oldIds.get(id) ?? id : id);
  return { newIdOf, oldIdOf, slotOf };
};

export { techIdMapsOf };
