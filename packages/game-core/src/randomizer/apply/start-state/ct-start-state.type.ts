/* @layer bridge-wasm @kind type */
type CtStartStateId = 'jot-standard' | 'jot-lost-worlds';

type CtFlagBit = { at: number; bits: number };

type CtPoke = { at: number; value: number; width: 1 | 2 };

type CtStartState = {
  id: CtStartStateId;
  flags: readonly CtFlagBit[];
  clear?: readonly CtFlagBit[];
  pokes: readonly CtPoke[];
  party: { join: readonly number[] };
  warp: { location: number; x: number; y: number; facing?: number };
};

export type { CtFlagBit, CtPoke, CtStartState, CtStartStateId };
