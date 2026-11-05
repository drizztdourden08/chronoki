/* @layer bridge-wasm @kind logic */
import {
  SHEET_BASE, SHEET_COUNT, SHEET_HP, SHEET_MAX_HP, SHEET_MAX_MP, SHEET_MP, SHEET_STRIDE,
} from '../game-info/wram-map.constants';
import { wordAt } from '../game-info/read-word';
import type { CheatWrite } from './cheat-write.type';

const wordBytes = (value: number): Uint8Array => Uint8Array.of(value & 0xff, (value >> 8) & 0xff);

const refillCharacter = (heap: Uint8Array, ptr: number, write: CheatWrite, id: number): boolean => {
  if (!Number.isInteger(id) || id < 0 || id >= SHEET_COUNT) return false;
  const sheet = SHEET_BASE + id * SHEET_STRIDE;
  const maxHp = wordAt(heap, ptr + sheet + SHEET_MAX_HP);
  const maxMp = wordAt(heap, ptr + sheet + SHEET_MAX_MP);
  return write(sheet + SHEET_HP, wordBytes(maxHp)) && write(sheet + SHEET_MP, wordBytes(maxMp));
};

export { refillCharacter };
