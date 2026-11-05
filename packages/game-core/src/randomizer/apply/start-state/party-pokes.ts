/* @layer bridge-wasm @kind logic */
import type { CtPoke } from './ct-start-state.type';
import { BOOT_FIRST_SLOT, BOOT_MASK, EMPTY_SLOT, JOINED_MASK, ROSTER, ROSTER_SLOTS } from './party-pokes.constants';

const bootValueOf = (slot: number): number => (slot === 0 ? BOOT_FIRST_SLOT : EMPTY_SLOT);

const partyPokes = (ids: readonly number[]): CtPoke[] => {
  const slots = Array.from({ length: ROSTER_SLOTS }, (_, slot) => ({ at: ROSTER + slot, value: ids[slot] ?? EMPTY_SLOT, width: 1 as const }));
  const mask = ids.reduce((bits, id) => bits | (0x80 >> id), 0);
  return [
    ...slots.filter((poke) => poke.value !== bootValueOf(poke.at - ROSTER)),
    ...(mask === BOOT_MASK ? [] : [{ at: JOINED_MASK, value: mask, width: 1 as const }]),
  ];
};

export { partyPokes };
