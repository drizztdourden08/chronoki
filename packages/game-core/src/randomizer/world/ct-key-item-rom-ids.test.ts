/* @layer bridge-wasm @kind test */
import { describe, expect, it } from 'vitest';
import { CT_KEY_ITEM_ROM_IDS } from './ct-key-item-rom-ids.constants';
import { CT_KEY_ITEMS, VANILLA_KEY_ITEM_ROM_IDS } from './ct-key-items.constants';

describe('CT_KEY_ITEM_ROM_IDS', { tags: ['critical'] }, () => {
  const ids = Object.values(CT_KEY_ITEM_ROM_IDS);

  it('has one entry per key item', () => {
    expect(Object.keys(CT_KEY_ITEM_ROM_IDS).sort()).toEqual([...CT_KEY_ITEMS].sort());
    expect(ids).toHaveLength(15);
  });

  it('has unique ids', () => {
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('agrees with the vanilla key item set for every id in its range', () => {
    const inRange = ids.filter((id) => id >= 0xd6 && id <= 0xe3);
    expect(inRange.length).toBeGreaterThan(0);
    expect(inRange.every((id) => VANILLA_KEY_ITEM_ROM_IDS.has(id))).toBe(true);
  });
});
