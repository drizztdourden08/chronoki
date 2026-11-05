/* @layer bridge-wasm @kind constants */
import { TAB_ROM_IDS } from '../world/tabs/tab.constants';
import type { TabStatSlot } from './tab-stat-slot.type';

const TAB_WORK_CAP = 0x63;
const TAB_USE_WINDOW_POLLS = 600;

const TAB_STAT_SLOTS: readonly TabStatSlot[] = [
  { kind: 'power', id: TAB_ROM_IDS.power, base: 0x0b, work: 0x2f, baseCap: 0x63 },
  { kind: 'magic', id: TAB_ROM_IDS.magic, base: 0x0e, work: 0x34, baseCap: 0x63 },
  { kind: 'speed', id: TAB_ROM_IDS.speed, base: 0x0d, work: 0x31, baseCap: 0x10 },
];

const TAB_ITEM_IDS: ReadonlySet<number> = new Set(TAB_STAT_SLOTS.map((slot) => slot.id));

export { TAB_ITEM_IDS, TAB_STAT_SLOTS, TAB_USE_WINDOW_POLLS, TAB_WORK_CAP };
