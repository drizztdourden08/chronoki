/* @layer bridge-wasm @kind logic */
import {
  NAME_BASE, NAME_BYTES, PARTY_ACTIVE, PARTY_ACTIVE_SLOTS, PARTY_EMPTY_FLAG, PARTY_ID_MASK, PARTY_JOINED,
  PARTY_RESERVE, PARTY_RESERVE_SLOTS, SHEET_BASE, SHEET_COUNT, SHEET_EQUIPMENT, SHEET_EQUIPMENT_SLOTS, SHEET_EXP,
  SHEET_EXP_NEXT, SHEET_HP, SHEET_LEVEL, SHEET_MAX_HP, SHEET_MAX_MP, SHEET_MP, SHEET_STRIDE,
} from './wram-map.constants';
import { byteAt } from './read-bytes';
import { triAt } from './read-tri';
import { wordAt } from './read-word';
import { decodeSaveName } from '../save-file/decode-save-name';
import type { GameInfoParty, GameInfoSheet } from './game-info.type';

const readSheet = (heap: Uint8Array, ptr: number, id: number): GameInfoSheet => {
  const sheet = ptr + SHEET_BASE + id * SHEET_STRIDE;
  const nameAt = ptr + NAME_BASE + id * NAME_BYTES;
  const hp = wordAt(heap, sheet + SHEET_HP);
  return {
    id,
    name: decodeSaveName(heap.subarray(nameAt, nameAt + NAME_BYTES)),
    level: byteAt(heap, sheet + SHEET_LEVEL),
    hp,
    maxHp: wordAt(heap, sheet + SHEET_MAX_HP),
    mp: wordAt(heap, sheet + SHEET_MP),
    maxMp: wordAt(heap, sheet + SHEET_MAX_MP),
    exp: triAt(heap, sheet + SHEET_EXP),
    expToNext: wordAt(heap, sheet + SHEET_EXP_NEXT),
    equipment: Array.from({ length: SHEET_EQUIPMENT_SLOTS }, (_, i) => byteAt(heap, sheet + SHEET_EQUIPMENT + i)),
    ko: hp === 0,
  };
};

const slotsAt = (heap: Uint8Array, at: number, count: number): (number | null)[] =>
  Array.from({ length: count }, (_, i) => {
    const raw = byteAt(heap, at + i);
    return raw & PARTY_EMPTY_FLAG ? null : raw & PARTY_ID_MASK;
  });

const readParty = (heap: Uint8Array, ptr: number): GameInfoParty => ({
  active: slotsAt(heap, ptr + PARTY_ACTIVE, PARTY_ACTIVE_SLOTS),
  reserve: slotsAt(heap, ptr + PARTY_RESERVE, PARTY_RESERVE_SLOTS),
  joinedMask: byteAt(heap, ptr + PARTY_JOINED),
  sheets: Array.from({ length: SHEET_COUNT }, (_, id) => readSheet(heap, ptr, id)),
});

export { readParty };
