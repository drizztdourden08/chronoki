/* @layer bridge-wasm @kind type */
import type { CtStartStateId } from '../../world/modes/ct-mode-def.type';

type CtFlagBit = { at: number; bits: number };

type CtPoke = { at: number; value: number; width: 1 | 2 };

type CtStartState = {
  id: CtStartStateId;
  flags: readonly CtFlagBit[];
  clear?: readonly CtFlagBit[];
  pokes: readonly CtPoke[];
  warp: { location: number; x: number; y: number; facing?: number };
};

export type { CtFlagBit, CtPoke, CtStartState };
