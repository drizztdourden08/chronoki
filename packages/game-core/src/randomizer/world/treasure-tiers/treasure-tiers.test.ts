/* @layer bridge-wasm @kind test */
import { describe, expect, it } from 'vitest';
import { buildTierTable } from './build-tier-table';
import { itemRomFixture } from './item-rom.fixture';
import { readItemStats } from './read-item-stats';
import { shiftItemByDifficulty } from './shift-item-by-difficulty';

const table = () => {
  const rom = itemRomFixture();
  return buildTierTable(readItemStats((at) => rom.get(at) ?? null));
};

describe('treasure tiers from item tables', { tags: ['critical'] }, () => {
  it('reads weapon power per character mask and price for consumables', () => {
    const rom = itemRomFixture();
    const stats = readItemStats((at) => rom.get(at) ?? null);
    expect(stats.find((s) => s.id === 2)).toEqual({ id: 2, kind: 'weapon:128', score: 20 });
    expect(stats.find((s) => s.id === 5)).toEqual({ id: 5, kind: 'weapon:64', score: 8 });
    expect(stats.find((s) => s.id === 11)).toEqual({ id: 11, kind: 'consumable', score: 50 });
  });

  it('ranks within a kind, weakest in tier 0', () => {
    const { slots } = table();
    expect([1, 2, 3].map((id) => slots.get(id)?.tier)).toEqual([0, 1, 2]);
    expect([10, 11, 12].map((id) => slots.get(id)?.tier)).toEqual([0, 1, 2]);
  });

  it('shifts up on easy, down on hard, clamped, inside the same kind', () => {
    const t = table();
    expect(shiftItemByDifficulty(t, 2, 'easy', 'a')).toBe(3);
    expect(shiftItemByDifficulty(t, 2, 'hard', 'a')).toBe(1);
    expect(shiftItemByDifficulty(t, 3, 'easy', 'a')).toBe(3);
    expect(shiftItemByDifficulty(t, 2, 'normal', 'a')).toBe(2);
    expect(shiftItemByDifficulty(t, 0xd6, 'easy', 'a')).toBe(0xd6);
  });

  it('never ranks or picks key items', () => {
    const rom = itemRomFixture();
    const stats = readItemStats((at) => rom.get(at) ?? null).concat({ id: 0xd6, kind: 'consumable', score: 5000 });
    const built = buildTierTable(stats);
    expect(built.slots.has(0xd6)).toBe(false);
  });
});
