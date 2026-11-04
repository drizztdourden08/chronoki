/* @layer bridge-wasm @kind logic */
import {
  SHEET_COUNT, TECH_MULTI_FIRST, TECH_MULTI_LAST, TECH_PROGRESS_BASE, TECH_SINGLE_BASE, TECH_SINGLE_BITS,
} from './wram-map.constants';
import { byteAt } from './read-bytes';
import type { GameInfoTechs } from './game-info.type';

const bitsOf = (value: number): boolean[] =>
  Array.from({ length: TECH_SINGLE_BITS }, (_, i) => (value & (0x80 >> i)) !== 0);

const countBits = (value: number): number => bitsOf(value).filter(Boolean).length;

const readTechs = (heap: Uint8Array, ptr: number): GameInfoTechs => {
  let multiLearned = 0;
  for (let at = TECH_MULTI_FIRST; at <= TECH_MULTI_LAST; at += 1) multiLearned += countBits(byteAt(heap, ptr + at));
  return {
    single: Array.from({ length: SHEET_COUNT }, (_, c) => bitsOf(byteAt(heap, ptr + TECH_SINGLE_BASE + c))),
    progress: Array.from({ length: SHEET_COUNT }, (_, c) => byteAt(heap, ptr + TECH_PROGRESS_BASE + c)),
    multiLearned,
  };
};

export { readTechs };
