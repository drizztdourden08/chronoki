/* @layer bridge-wasm @kind logic */
import { createRng } from '@drizztdourden08/brock-randomizer/world';
import { FIELD_USABLE_TECH_IDS, TECH_CHARACTERS, TECH_ORDER_STREAM, TECH_SLOTS } from './tech-order.constants';
import type { SlotPermutations, TechOrderMode } from './tech-order.type';

type Picker = { int(maxExclusive: number): number };

const range = (count: number): number[] => Array.from({ length: count }, (_, i) => i);

const fixedSlotsOf = (character: number): number[] =>
  FIELD_USABLE_TECH_IDS.filter((id) => Math.floor((id - 1) / TECH_SLOTS) === character).map((id) => (id - 1) % TECH_SLOTS);

const earlyWeightOf = (slot: number): number => TECH_SLOTS - slot;

const weightedOrder = (rng: Picker, slots: readonly number[]): number[] => {
  const left = [...slots];
  const order: number[] = [];
  while (left.length > 0) {
    let roll = rng.int(left.reduce((sum, slot) => sum + earlyWeightOf(slot), 0));
    const index = left.findIndex((slot) => {
      roll -= earlyWeightOf(slot);
      return roll < 0;
    });
    order.push(...left.splice(index, 1));
  }
  return order;
};

const planSlotPermutations = (mode: TechOrderMode, seed: string): SlotPermutations => {
  const rng = createRng(`${seed}${TECH_ORDER_STREAM}`);
  return range(TECH_CHARACTERS).map((character) => {
    const fixed = new Set(fixedSlotsOf(character));
    const movable = range(TECH_SLOTS).filter((slot) => !fixed.has(slot));
    const order = mode === 'full-random' ? rng.shuffle(movable) : weightedOrder(rng, movable);
    const perm = range(TECH_SLOTS);
    order.forEach((slot, position) => {
      perm[slot] = movable[position] ?? slot;
    });
    return perm;
  });
};

export { planSlotPermutations };
