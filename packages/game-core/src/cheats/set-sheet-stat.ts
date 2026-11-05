/* @layer bridge-wasm @kind logic */
import { SHEET_BASE, SHEET_COUNT, SHEET_STRIDE } from '../game-info/wram-map.constants';
import { STAT_CAPS, STAT_OFFSETS } from './set-sheet-stat.constants';
import type { SheetStat } from './set-sheet-stat.type';
import type { CheatWrite } from './cheat-write.type';

const setSheetStat = (write: CheatWrite, id: number, stat: SheetStat, value: number): boolean => {
  if (!Number.isInteger(id) || id < 0 || id >= SHEET_COUNT) return false;
  const clamped = Math.min(Math.max(Math.trunc(value), 0), STAT_CAPS[stat]);
  return write(SHEET_BASE + id * SHEET_STRIDE + STAT_OFFSETS[stat], Uint8Array.of(clamped & 0xff, (clamped >> 8) & 0xff));
};

export { setSheetStat };
