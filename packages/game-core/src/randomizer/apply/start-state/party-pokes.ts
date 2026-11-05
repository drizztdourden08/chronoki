/* @layer bridge-wasm @kind logic */
import type { CtPoke } from './ct-start-state.type';
import { EMPTY_SLOT, JOINED_MASK, ROSTER, ROSTER_SLOTS } from './party-pokes.constants';

const partyPokes = (ids: readonly number[]): CtPoke[] => [
  ...Array.from({ length: ROSTER_SLOTS }, (_, slot) => ({ at: ROSTER + slot, value: ids[slot] ?? EMPTY_SLOT, width: 1 as const })),
  { at: JOINED_MASK, value: ids.reduce((mask, id) => mask | (0x80 >> id), 0), width: 1 },
];

export { partyPokes };
