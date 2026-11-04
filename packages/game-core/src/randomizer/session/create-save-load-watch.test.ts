/* @layer bridge-wasm @kind test */
import { describe, expect, it } from 'vitest';
import { CLOCK_BASE, CLOCK_MINUTE_ONES, CLOCK_MINUTE_TENS, CLOCK_SECONDS } from '../../game-info/wram-map.constants';
import { createSaveLoadWatch } from './create-save-load-watch';
import { fakeView } from './memory-view.fake';

const clock = (minutes: number, seconds: number) =>
  fakeView({
    [CLOCK_BASE + CLOCK_SECONDS]: seconds,
    [CLOCK_BASE + CLOCK_MINUTE_ONES]: minutes % 10,
    [CLOCK_BASE + CLOCK_MINUTE_TENS]: Math.floor(minutes / 10),
  });

describe('createSaveLoadWatch', { tags: ['critical'] }, () => {
  it('reports no load on the first reading', () => {
    expect(createSaveLoadWatch().loaded(clock(30, 0))).toBe(false);
  });

  it('reports no load while the clock advances normally', () => {
    const watch = createSaveLoadWatch();
    watch.loaded(clock(1, 0));
    expect(watch.loaded(clock(1, 1))).toBe(false);
  });

  it('reports a load when the clock goes back', () => {
    const watch = createSaveLoadWatch();
    watch.loaded(clock(10, 0));
    expect(watch.loaded(clock(9, 59))).toBe(true);
  });

  it('reports a load when the clock jumps forward by more than 300 s', () => {
    const watch = createSaveLoadWatch();
    watch.loaded(clock(1, 0));
    expect(watch.loaded(clock(6, 1))).toBe(true);
  });

  it('does not report exactly 300 s of advance', () => {
    const watch = createSaveLoadWatch();
    watch.loaded(clock(1, 0));
    expect(watch.loaded(clock(6, 0))).toBe(false);
  });

  it('reset forgets the last reading', () => {
    const watch = createSaveLoadWatch();
    watch.loaded(clock(10, 0));
    watch.reset();
    expect(watch.loaded(clock(1, 0))).toBe(false);
  });
});
