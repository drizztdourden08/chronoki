/* @layer bridge-wasm @kind test */
import { describe, expect, it } from 'vitest';
import { isCtKeyItem } from '../is-ct-key-item';
import { poolFillerOf } from '../pool-filler-of';
import { treasureItemOf } from '../treasure-item-of';
import { tabFillerOf } from './tab-filler-of';

const REST = Array.from({ length: 40 }, (_, index) => treasureItemOf(index + 1));
const TABS = new Set([treasureItemOf(0xcd), treasureItemOf(0xce), treasureItemOf(0xcf)]);

describe('tabsanity filler', { tags: ['critical'] }, () => {
  it('turns every filler slot into a non-key tab with a seeded mix', () => {
    const filler = tabFillerOf(60, 'seed-a');
    expect(filler).toHaveLength(60);
    expect(filler.every((item) => TABS.has(item) && !isCtKeyItem(item))).toBe(true);
    expect(new Set(filler).size).toBe(3);
    expect(tabFillerOf(60, 'seed-a')).toEqual(filler);
    expect(tabFillerOf(60, 'seed-b')).not.toEqual(filler);
  });

  it('replaces only the filler of the pool, with the same count', () => {
    const plain = poolFillerOf(REST, 25, 5, 'seed-a');
    const tabbed = poolFillerOf(REST, 25, 5, 'seed-a', true);
    expect(tabbed).toHaveLength(plain.length);
    expect(tabbed.every((item) => TABS.has(item))).toBe(true);
  });

  it('is unchanged with tabsanity off', () => {
    expect(poolFillerOf(REST, 25, 5, 'seed-a', false)).toEqual(poolFillerOf(REST, 25, 5, 'seed-a'));
  });

  it('adds nothing when the pool is already full', () => {
    expect(poolFillerOf(REST, 5, 5, 'seed-a', true)).toEqual([]);
  });
});
