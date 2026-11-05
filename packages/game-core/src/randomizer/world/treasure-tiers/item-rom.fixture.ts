/* @layer bridge-wasm @kind test */
import {
  CLASS_BOUNDS_ROM, ITEM_PAGE_ROM, POWER_BASE_ROM, POWER_STRIDE_ROM, RECORD_BASE_ROM, RECORD_STRIDE_ROM,
} from './treasure-tiers.constants';
import { BOUNDS, POWER_STRIDE, RECORD_STRIDE } from './item-rom-fixture.constants';

const recordBase = (cls: number): number => 0x1000 * (cls + 1);
const powerBase = (cls: number): number => 0x8000 + 0x400 * cls;

const itemRomFixture = (): Map<number, number> => {
  const rom = new Map<number, number>();
  const put16 = (at: number, v: number): void => {
    rom.set(at, v & 0xff);
    rom.set(at + 1, v >> 8);
  };
  BOUNDS.forEach((b, i) => rom.set(CLASS_BOUNDS_ROM + i, b));
  for (let cls = 0; cls < 5; cls += 1) {
    put16(RECORD_BASE_ROM + cls * 2, recordBase(cls));
    rom.set(RECORD_STRIDE_ROM + cls, RECORD_STRIDE);
    put16(POWER_BASE_ROM + cls * 2, powerBase(cls));
    rom.set(POWER_STRIDE_ROM + cls, POWER_STRIDE);
  }
  const gear = (id: number, cls: number, mask: number, power: number): void => {
    const at = id - (BOUNDS[cls] ?? 0);
    rom.set(ITEM_PAGE_ROM + recordBase(cls) + at * RECORD_STRIDE + 3, mask);
    rom.set(ITEM_PAGE_ROM + powerBase(cls) + at * POWER_STRIDE, power);
  };
  const priced = (id: number, cls: number, price: number): void => {
    put16(ITEM_PAGE_ROM + recordBase(cls) + (id - (BOUNDS[cls] ?? 0)) * RECORD_STRIDE + 1, price);
  };
  [[1, 5], [2, 20], [3, 50]].forEach(([id, power]) => gear(id ?? 0, 0, 0x80, power ?? 0));
  [[4, 7], [5, 8], [6, 9]].forEach(([id, power]) => gear(id ?? 0, 0, 0x40, power ?? 0));
  priced(9, 3, 300);
  priced(10, 4, 10);
  priced(11, 4, 50);
  priced(12, 4, 900);
  return rom;
};

export { itemRomFixture };
