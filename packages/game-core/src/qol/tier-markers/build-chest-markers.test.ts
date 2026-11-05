/* @layer bridge-wasm @kind test */
import { describe, expect, it } from 'vitest';
import type { CheckDef } from '../../randomizer/checks/check.type';
import { itemRomFixture } from '../../randomizer/world/treasure-tiers/item-rom.fixture';
import { KEY_IDS } from '../../randomizer/world/treasure-tiers/key-ids.constants';
import { markersOfChecks } from './markers-of-checks';
import { chestTierOf } from './chest-tier-of';

const fixture = itemRomFixture();
const CLASS4_RECORDS = 0x0c0000 + 0x5000;
const rom = (at: number): number | null => fixture.get(at) ?? null;
const put = (id: number, price: number): void => {
  const at = CLASS4_RECORDS + (id - 10) * 8 + 1;
  fixture.set(at, price & 0xff);
  fixture.set(at + 1, price >> 8);
};
put(13, 600);
put(14, 4000);

const chest = (n: number, item: number, idx: number): CheckDef => ({
  id: `chest-${n}`, kind: 'chest', locationId: 7, tile: { x: n, y: 2 },
  probe: { region: 'wram', offset: 0x10001 + (idx >> 3), mask: 1 << (idx & 7), compare: 'set' }, vanillaItem: item,
});

describe('chest tiers', () => {
  it('bands the item price and puts a key item on top', { tags: ['critical'] }, () => {
    expect(chestTierOf(rom, 10)).toBe(1);
    expect(chestTierOf(rom, 13)).toBe(2);
    expect(chestTierOf(rom, 14)).toBe(3);
    expect(chestTierOf(rom, [...KEY_IDS][0] ?? 0xd7)).toBe(4);
    expect(chestTierOf(rom, 1)).toBe(0);
  });

  it('keys markers by location with the opened bit of the record index', { tags: ['critical'] }, () => {
    const markers = markersOfChecks(rom, [chest(1, 10, 0), chest(2, 14, 9), chest(3, 1, 3)]);
    expect(markers.get(7)).toEqual([
      { x: 1, y: 2, tier: 1, opened: { offset: 0x10001, mask: 1 } },
      { x: 2, y: 2, tier: 3, opened: { offset: 0x10002, mask: 2 } },
    ]);
  });
});
