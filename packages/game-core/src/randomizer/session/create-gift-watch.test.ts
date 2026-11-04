/* @layer bridge-wasm @kind test */
import { describe, expect, it } from 'vitest';
import { INVENTORY_COUNTS, INVENTORY_IDS, LOCATION_ID } from '../../game-info/wram-map.constants';
import { createGiftWatch } from './create-gift-watch';
import { fakeView } from './memory-view.fake';

const ITEM = 0x30;
const view = (location: number, count: number) =>
  fakeView({ [LOCATION_ID]: location & 0xff, [LOCATION_ID + 1]: location >> 8, [INVENTORY_IDS]: ITEM, [INVENTORY_COUNTS]: count });

describe('createGiftWatch', { tags: ['critical'] }, () => {
  it('marks a gift when its item is gained on the gift map', () => {
    const watch = createGiftWatch([{ id: 'g1', locationId: 5, item: ITEM }]);
    watch.observe(view(5, 0));
    watch.observe(view(5, 1));
    expect([...watch.completed()]).toEqual(['g1']);
  });

  it('does not mark anything on the first observation (baseline)', () => {
    const watch = createGiftWatch([{ id: 'g1', locationId: 5, item: ITEM }]);
    watch.observe(view(5, 4));
    expect(watch.completed().size).toBe(0);
  });

  it('does not mark a gain made on another map', () => {
    const watch = createGiftWatch([{ id: 'g1', locationId: 5, item: ITEM }]);
    watch.observe(view(9, 0));
    watch.observe(view(9, 1));
    expect(watch.completed().size).toBe(0);
  });

  it('marks one gift per unit gained', () => {
    const watch = createGiftWatch([
      { id: 'g1', locationId: 5, item: ITEM },
      { id: 'g2', locationId: 5, item: ITEM },
    ]);
    watch.observe(view(5, 0));
    watch.observe(view(5, 1));
    expect(watch.completed().size).toBe(1);
    watch.observe(view(5, 2));
    expect(watch.completed().size).toBe(2);
  });

  it('ignores a loss of items', () => {
    const watch = createGiftWatch([{ id: 'g1', locationId: 5, item: ITEM }]);
    watch.observe(view(5, 3));
    watch.observe(view(5, 2));
    expect(watch.completed().size).toBe(0);
  });

  it('reset drops the baseline so the next observation marks nothing', () => {
    const watch = createGiftWatch([{ id: 'g1', locationId: 5, item: ITEM }]);
    watch.observe(view(5, 0));
    watch.reset();
    watch.observe(view(5, 1));
    expect(watch.completed().size).toBe(0);
  });
});
