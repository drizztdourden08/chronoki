/* @layer bridge-wasm @kind logic */
import type { MemoryView } from '@drizztdourden08/brock-randomizer/memory';
import { SHEET_BASE, SHEET_STRIDE } from '../../game-info/wram-map.constants';
import { CT_WRAM_REGION } from '../memory/ct-memory.constants';
import { TAB_WORK_CAP } from './tab-amount-watch.constants';
import type { TabStatSlot } from './tab-stat-slot.type';
import type { WramWrite } from './start-gold-grant.type';

const boostTabStat = (view: MemoryView, write: WramWrite, slot: TabStatSlot, sheet: number, extra: number): number | null => {
  const sheetAt = SHEET_BASE + sheet * SHEET_STRIDE;
  const base = Math.min(slot.baseCap, view.byte(CT_WRAM_REGION, sheetAt + slot.base) + extra);
  const work = Math.min(TAB_WORK_CAP, view.byte(CT_WRAM_REGION, sheetAt + slot.work) + extra);
  return write(sheetAt + slot.base, Uint8Array.of(base)) && write(sheetAt + slot.work, Uint8Array.of(work)) ? base : null;
};

export { boostTabStat };
