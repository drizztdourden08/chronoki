/* @layer bridge-wasm @kind test */
import { describe, expect, it } from 'vitest';
import { INVENTORY_COUNTS, INVENTORY_IDS, SHEET_BASE, SHEET_STRIDE } from '../../game-info/wram-map.constants';
import { createModeHooks } from './create-mode-hooks';
import { createTabAmountWatch } from './create-tab-amount-watch';
import { fakeView } from './memory-view.fake';

const POWER_BASE = SHEET_BASE + 0x0b;
const POWER_WORK = SHEET_BASE + 0x2f;
const SPEED_BASE = SHEET_BASE + SHEET_STRIDE + 0x0d;

const state = (power: number, count: number, extra: Record<number, number> = {}): Record<number, number> => ({
  [INVENTORY_IDS]: 0xcd, [INVENTORY_COUNTS]: count, [POWER_BASE]: power, [POWER_WORK]: power + 10, ...extra,
});

const recorder = (): { writes: [number, number][]; write: (offset: number, bytes: Uint8Array) => boolean } => {
  const writes: [number, number][] = [];
  return { writes, write: (offset, bytes) => { writes.push([offset, bytes[0] ?? 0]); return true; } };
};

describe('createTabAmountWatch', { tags: ['critical'] }, () => {
  it('adds the rest of the amount once when a power tab is used', () => {
    const { writes, write } = recorder();
    const watch = createTabAmountWatch(write, { power: 4, magic: 1, speed: 1 });
    watch.observe(fakeView(state(10, 2)), true, false);
    watch.observe(fakeView(state(11, 2)), true, false);
    watch.observe(fakeView(state(11, 1)), true, false);
    expect(writes).toEqual([[POWER_BASE, 14], [POWER_WORK, 24]]);
    watch.observe(fakeView(state(14, 1)), true, false);
    expect(writes).toHaveLength(2);
  });

  it('does nothing for a stat rise without a tab being spent, or a tab without a rise', () => {
    const { writes, write } = recorder();
    const watch = createTabAmountWatch(write, { power: 4, magic: 1, speed: 1 });
    watch.observe(fakeView(state(10, 2)), true, false);
    watch.observe(fakeView(state(11, 2)), true, false);
    watch.observe(fakeView(state(11, 3)), true, false);
    expect(writes).toEqual([]);
    const sold = recorder();
    const other = createTabAmountWatch(sold.write, { power: 4, magic: 1, speed: 1 });
    other.observe(fakeView(state(10, 2)), true, false);
    other.observe(fakeView(state(10, 1)), true, false);
    expect(sold.writes).toEqual([]);
  });

  it('caps the speed stat at 16 and ignores a vanilla amount', () => {
    const { writes, write } = recorder();
    const speed = (value: number, count: number): Record<number, number> => ({
      [INVENTORY_IDS]: 0xcf, [INVENTORY_COUNTS]: count, [SPEED_BASE]: value,
    });
    const watch = createTabAmountWatch(write, { power: 1, magic: 1, speed: 9 });
    watch.observe(fakeView(speed(14, 1)), true, false);
    watch.observe(fakeView(speed(15, 1)), true, false);
    watch.observe(fakeView(speed(15, 0)), true, false);
    expect(writes[0]).toEqual([SPEED_BASE, 16]);
    const idle = recorder();
    const vanilla = createTabAmountWatch(idle.write, { power: 1, magic: 1, speed: 1 });
    vanilla.observe(fakeView(state(10, 2)), true, false);
    vanilla.observe(fakeView(state(11, 1)), true, false);
    expect(idle.writes).toEqual([]);
  });

  it('is part of the mode hooks only with a seed that changes an amount', () => {
    const { writes, write } = recorder();
    const options = { powerTabMin: 5, powerTabMax: 5 };
    const hooks = createModeHooks(options, write, { seed: 'seed-a' });
    hooks.observe(fakeView(state(10, 2)), true, false);
    hooks.observe(fakeView(state(11, 1)), true, false);
    expect(writes).toEqual([[POWER_BASE, 15], [POWER_WORK, 25]]);
    const none = recorder();
    const off = createModeHooks({}, none.write, { seed: 'seed-a' });
    off.observe(fakeView(state(10, 2)), true, false);
    off.observe(fakeView(state(11, 1)), true, false);
    expect(none.writes).toEqual([]);
  });
});
