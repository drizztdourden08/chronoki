/* @layer bridge-wasm @kind test */
import { describe, expect, it } from 'vitest';
import { tabAmountsOf } from './tab-amounts-of';

const WIDE = {
  powerTabMin: 1, powerTabMax: 9, magicTabMin: 2, magicTabMax: 6, speedTabMin: 3, speedTabMax: 3,
};

describe('tabAmountsOf', { tags: ['critical'] }, () => {
  it('leaves the vanilla amounts alone with the default options', () => {
    expect(tabAmountsOf({}, 'seed-a')).toBeNull();
    expect(tabAmountsOf({ powerTabMin: 1, powerTabMax: 1 }, 'seed-a')).toBeNull();
  });

  it('rolls one value per tab inside its range', () => {
    for (let n = 0; n < 40; n += 1) {
      const amounts = tabAmountsOf(WIDE, `seed-${n}`);
      expect(amounts?.power).toBeGreaterThanOrEqual(1);
      expect(amounts?.power).toBeLessThanOrEqual(9);
      expect(amounts?.magic).toBeGreaterThanOrEqual(2);
      expect(amounts?.magic).toBeLessThanOrEqual(6);
      expect(amounts?.speed).toBe(3);
    }
  });

  it('is deterministic per seed and varies between seeds', () => {
    expect(tabAmountsOf(WIDE, 'seed-a')).toEqual(tabAmountsOf(WIDE, 'seed-a'));
    const powers = new Set(Array.from({ length: 30 }, (_, n) => tabAmountsOf(WIDE, `seed-${n}`)?.power));
    expect(powers.size).toBeGreaterThan(3);
  });

  it('swaps an inverted range and clamps out-of-range values', () => {
    const amounts = tabAmountsOf({ powerTabMin: 5, powerTabMax: 2, magicTabMin: 99, magicTabMax: 99, speedTabMin: 'x' }, 's');
    expect(amounts?.power).toBeGreaterThanOrEqual(2);
    expect(amounts?.power).toBeLessThanOrEqual(5);
    expect(amounts?.magic).toBe(9);
    expect(amounts?.speed).toBe(1);
  });
});
