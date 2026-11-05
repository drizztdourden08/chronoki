/* @layer bridge-wasm @kind test */
import { describe, expect, it } from 'vitest';
import {
  CLOCK_BASE, CLOCK_MINUTE_ONES, CLOCK_SECONDS, NEW_GAME_FLAG, PARTY_ACTIVE, PARTY_RESERVE,
} from '../../game-info/wram-map.constants';
import { createGameStartWatch } from './create-game-start-watch';
import { fakeView } from './memory-view.fake';

const view = (partyFilled: boolean, minutes: number, seconds: number, newGame = 0) =>
  fakeView({
    [PARTY_ACTIVE]: partyFilled ? 0 : 0x80,
    [PARTY_ACTIVE + 1]: partyFilled ? 1 : 0x80,
    [PARTY_RESERVE]: partyFilled ? 2 : 0x80,
    [CLOCK_BASE + CLOCK_SECONDS]: seconds,
    [CLOCK_BASE + CLOCK_MINUTE_ONES]: minutes,
    [NEW_GAME_FLAG]: newGame,
  });

describe('createGameStartWatch', { tags: ['critical'] }, () => {
  it('stays unstarted through the title demo: party fills, clock runs, no menu choice', () => {
    const watch = createGameStartWatch();
    expect(watch.observe(view(false, 0, 0, 2))).toBe(false);
    expect(watch.observe(view(true, 0, 1, 2))).toBe(false);
    expect(watch.observe(view(true, 0, 2, 2))).toBe(false);
    expect(watch.observe(view(true, 0, 3, 2))).toBe(false);
    expect(watch.started()).toBe(false);
  });

  it('starts on Continue: the play clock jumps to the saved time', () => {
    const watch = createGameStartWatch();
    watch.observe(view(false, 0, 0, 2));
    expect(watch.observe(view(true, 7, 0, 2))).toBe(true);
  });

  it('starts on New Game: the loader sets the new-game flag', () => {
    const watch = createGameStartWatch();
    watch.observe(view(true, 0, 5, 2));
    expect(watch.observe(view(true, 0, 6, 1))).toBe(true);
  });

  it('stays started once latched', () => {
    const watch = createGameStartWatch();
    watch.observe(view(true, 0, 0, 1));
    expect(watch.observe(view(false, 0, 0, 0))).toBe(true);
  });

  it('reset returns to unstarted', () => {
    const watch = createGameStartWatch();
    watch.observe(view(true, 0, 0, 1));
    watch.reset();
    expect(watch.started()).toBe(false);
  });
});
