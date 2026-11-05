/* @layer bridge-wasm @kind test */
import { describe, expect, it } from 'vitest';
import {
  CLOCK_BASE, CLOCK_MINUTE_ONES, CLOCK_SECONDS, PARTY_ACTIVE, PARTY_EMPTY_FLAG,
} from '../../game-info/wram-map.constants';
import { createGameStartWatch } from './create-game-start-watch';
import { fakeView } from './memory-view.fake';

const CRONO = 0;

const view = (partyFirst: number, minutes: number, seconds: number) =>
  fakeView({
    [PARTY_ACTIVE]: partyFirst,
    [CLOCK_BASE + CLOCK_SECONDS]: seconds,
    [CLOCK_BASE + CLOCK_MINUTE_ONES]: minutes,
  });

describe('createGameStartWatch', { tags: ['critical'] }, () => {
  it('stays unstarted through the title attract demo (empty party, clock at rest)', () => {
    const watch = createGameStartWatch();
    expect(watch.observe(view(PARTY_EMPTY_FLAG, 0, 0))).toBe(false);
    expect(watch.observe(view(PARTY_EMPTY_FLAG, 0, 1))).toBe(false);
    expect(watch.started()).toBe(false);
  });

  it('starts on Continue: the play clock jumps to the saved time', () => {
    const watch = createGameStartWatch();
    watch.observe(view(PARTY_EMPTY_FLAG, 0, 0));
    expect(watch.observe(view(CRONO, 7, 0))).toBe(true);
  });

  it('starts on New Game: the party fills after being seen empty', () => {
    const watch = createGameStartWatch();
    watch.observe(view(PARTY_EMPTY_FLAG, 0, 0));
    expect(watch.observe(view(CRONO, 0, 0))).toBe(true);
  });

  it('stays started once latched', () => {
    const watch = createGameStartWatch();
    watch.observe(view(PARTY_EMPTY_FLAG, 0, 0));
    watch.observe(view(CRONO, 0, 0));
    expect(watch.observe(view(PARTY_EMPTY_FLAG, 0, 0))).toBe(true);
  });

  it('reset returns to unstarted', () => {
    const watch = createGameStartWatch();
    watch.observe(view(PARTY_EMPTY_FLAG, 0, 0));
    watch.observe(view(CRONO, 0, 0));
    watch.reset();
    expect(watch.started()).toBe(false);
  });
});
