/* @layer bridge-wasm @kind test */
import { describe, expect, it } from 'vitest';
import { applyOptionsOf } from '../enemy-difficulty/apply-options-of';
import { priceOf } from './price-of';
import { planShopPriceEdits } from './plan-shop-price-edits';
import { readPriceSlots } from './read-price-slots';
import { syntheticShopPack } from './shop-prices.fixture';

const pricesAfter = (pack: Uint8Array, mode: 'free' | 'mostly-random' | 'fully-random', seed: string): Map<number, number> => {
  const edited = pack.slice();
  planShopPriceEdits(pack, { mode, seed }).forEach((e) => {
    edited[e.at] = e.next;
  });
  return new Map(readPriceSlots(edited).map((s) => [s.id, s.price]));
};

describe('shop prices', { tags: ['critical'] }, () => {
  it('reads priced items, skipping unpriced and key items', () => {
    const slots = readPriceSlots(syntheticShopPack());
    expect(slots.map((s) => [s.id, s.price])).toEqual([[2, 300], [3, 1200], [10, 10], [11, 50], [12, 900]]);
  });

  it('free makes every price zero with matching old values', () => {
    const pack = syntheticShopPack();
    const edits = planShopPriceEdits(pack, { mode: 'free', seed: 's' });
    edits.forEach((e) => {
      expect(pack[e.at]).toBe(e.old);
      expect(e.next).toBe(0);
    });
    expect(readPriceSlots(pricesAfterPack(pack, edits))).toEqual([]);
  });

  it('mostly-random keeps prices near vanilla and above zero', () => {
    const pack = syntheticShopPack();
    const after = pricesAfter(pack, 'mostly-random', 'seed-a');
    readPriceSlots(pack).forEach((s) => {
      const next = after.get(s.id) ?? 0;
      expect(next).toBeGreaterThanOrEqual(1);
      expect(next).toBeLessThanOrEqual(Math.ceil(s.price * 1.5) + 5);
      expect(next).toBeGreaterThanOrEqual(Math.floor(s.price * 0.5) - 5);
    });
  });

  it('fully-random stays inside the sensible range', () => {
    const after = pricesAfter(syntheticShopPack(), 'fully-random', 'seed-b');
    expect(after.size).toBeGreaterThan(0);
    after.forEach((price) => {
      expect(price).toBeGreaterThanOrEqual(10);
      expect(price).toBeLessThanOrEqual(30000);
    });
  });

  it('is deterministic per seed and differs between seeds', () => {
    const pack = syntheticShopPack();
    expect(planShopPriceEdits(pack, { mode: 'fully-random', seed: 'x' })).toEqual(planShopPriceEdits(pack, { mode: 'fully-random', seed: 'x' }));
    expect(planShopPriceEdits(pack, { mode: 'fully-random', seed: 'x' })).not.toEqual(planShopPriceEdits(pack, { mode: 'fully-random', seed: 'y' }));
  });

  it('maps the rolls onto the documented bounds', () => {
    expect(priceOf('mostly-random', 1000, 0)).toBe(500);
    expect(priceOf('mostly-random', 1000, 1)).toBe(1500);
    expect(priceOf('mostly-random', 1, 0)).toBe(1);
    expect(priceOf('fully-random', 1, 0)).toBe(10);
    expect(priceOf('fully-random', 1, 1)).toBe(30000);
  });

  it('leaves the apply options untouched when off, and carries mode and seed when on', () => {
    expect(applyOptionsOf({ shopPrices: 'normal' }, [], 'seed').shopPrices).toBeUndefined();
    expect(applyOptionsOf({}, [], 'seed').shopPrices).toBeUndefined();
    const on = applyOptionsOf({ shopPrices: 'free' }, [], 'seed');
    expect(on.shopPrices).toEqual({ mode: 'free', seed: 'seed' });
  });
});

const pricesAfterPack = (pack: Uint8Array, edits: { at: number; next: number }[]): Uint8Array => {
  const edited = pack.slice();
  edits.forEach((e) => {
    edited[e.at] = e.next;
  });
  return edited;
};
