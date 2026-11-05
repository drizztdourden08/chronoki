/* @layer bridge-wasm @kind test */
import { describe, expect, it } from 'vitest';
import { isCtKeyItem } from './is-ct-key-item';
import { poolFillerOf } from './pool-filler-of';
import { treasureItemOf } from './treasure-item-of';

const REST = Array.from({ length: 40 }, (_, index) => treasureItemOf(index + 1));

describe('poolFillerOf', { tags: ['critical'] }, () => {
  it('fills a 20 item shortfall with varied treasure items and no key items', () => {
    const filler = poolFillerOf(REST, 25, 5, 'seed-a');
    expect(filler).toHaveLength(20);
    expect(new Set(filler).size).toBeGreaterThan(10);
    expect(filler.some(isCtKeyItem)).toBe(false);
  });

  it('is deterministic per seed and differs between seeds', () => {
    expect(poolFillerOf(REST, 25, 5, 'seed-a')).toEqual(poolFillerOf(REST, 25, 5, 'seed-a'));
    expect(poolFillerOf(REST, 25, 5, 'seed-a')).not.toEqual(poolFillerOf(REST, 25, 5, 'seed-b'));
  });

  it('adds nothing when the pool is already full', () => {
    expect(poolFillerOf(REST, 5, 5, 'seed-a')).toEqual([]);
  });
});
