/* @layer bridge-wasm @kind fixture */
import { itemRomFixture } from '../../world/treasure-tiers/item-rom.fixture';
import { ITEM_PAGE_ROM, RECORD_BASE_ROM } from '../../world/treasure-tiers/treasure-tiers.constants';

const le32 = (v: number): number[] => [v & 0xff, (v >> 8) & 0xff, (v >> 16) & 0xff, (v >>> 24) & 0xff];

const runsOf = (rom: Map<number, number>): { id: number; data: number[] }[] => {
  const runs: { id: number; data: number[] }[] = [];
  [...rom.keys()].sort((a, b) => a - b).forEach((at) => {
    const last = runs[runs.length - 1];
    if (last !== undefined && last.id + last.data.length === at) last.data.push(rom.get(at) ?? 0);
    else runs.push({ id: at, data: [rom.get(at) ?? 0] });
  });
  return runs;
};

const syntheticShopPack = (): Uint8Array => {
  const rom = itemRomFixture();
  const recordOf = (cls: number, index: number): number => ITEM_PAGE_ROM + (rom.get(RECORD_BASE_ROM + cls * 2) ?? 0) + (rom.get(RECORD_BASE_ROM + cls * 2 + 1) ?? 0) * 256 + index * 8;
  const setPrice = (at: number, price: number): void => {
    rom.set(at + 1, price & 0xff);
    rom.set(at + 2, price >> 8);
  };
  setPrice(recordOf(0, 2), 300);
  setPrice(recordOf(0, 3), 1200);
  setPrice(recordOf(4, 0xd6 - 10), 5000);
  const tables = runsOf(rom);
  const bytes: number[] = [0x43, 0x54, 0x41, 0x53, ...le32(1), ...le32(tables.length)];
  let at = 12 + tables.length * 16;
  tables.forEach((t) => {
    bytes.push(...le32(37), ...le32(t.id), ...le32(at), ...le32(t.data.length));
    at += t.data.length;
  });
  tables.forEach((t) => bytes.push(...t.data));
  return Uint8Array.from(bytes);
};

export { syntheticShopPack };
