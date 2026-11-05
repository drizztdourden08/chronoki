/* @layer bridge-wasm @kind test */
import { describe, expect, it } from 'vitest';
import { createGoalWatch } from './create-goal-watch';
import { ICE_AGE_GOAL, LEGACY_OF_CYRUS_GOAL } from './goal-flags.constants';
import { createModeHooks } from './create-mode-hooks';
import { fakeView } from './memory-view.fake';

const noWrite = (): boolean => true;

describe('createGoalWatch', { tags: ['critical'] }, () => {
  it('fires the callback once when the Legacy of Cyrus bit is set', () => {
    let calls = 0;
    const watch = createGoalWatch(LEGACY_OF_CYRUS_GOAL, () => {
      calls += 1;
    });
    watch.observe(fakeView({ [LEGACY_OF_CYRUS_GOAL.at]: 0x7f }), true, false);
    expect(watch.goalReached()).toBe(false);
    watch.observe(fakeView({ [LEGACY_OF_CYRUS_GOAL.at]: 0x80 }), true, false);
    watch.observe(fakeView({ [LEGACY_OF_CYRUS_GOAL.at]: 0x80 }), true, false);
    expect(watch.goalReached()).toBe(true);
    expect(calls).toBe(1);
  });

  it('ignores the bit before the game has started', () => {
    const watch = createGoalWatch(LEGACY_OF_CYRUS_GOAL);
    watch.observe(fakeView({ [LEGACY_OF_CYRUS_GOAL.at]: 0x80 }), false, false);
    expect(watch.goalReached()).toBe(false);
  });

  it('fires the Ice Age goal only on a rising edge', () => {
    const watch = createGoalWatch(ICE_AGE_GOAL);
    watch.observe(fakeView({ [ICE_AGE_GOAL.at]: 0x10 }), true, false);
    expect(watch.goalReached()).toBe(false);
    watch.observe(fakeView({ [ICE_AGE_GOAL.at]: 0x00 }), true, false);
    watch.observe(fakeView({ [ICE_AGE_GOAL.at]: 0x10 }), true, false);
    expect(watch.goalReached()).toBe(true);
  });

  it('clears on reset', () => {
    const watch = createGoalWatch(LEGACY_OF_CYRUS_GOAL);
    watch.observe(fakeView({ [LEGACY_OF_CYRUS_GOAL.at]: 0x80 }), true, false);
    watch.reset();
    expect(watch.goalReached()).toBe(false);
  });
});

describe('createModeHooks goal watch', { tags: ['critical'] }, () => {
  it('is registered for the two goal modes only', () => {
    const loc = createModeHooks({ gameMode: 'legacy-of-cyrus' }, noWrite);
    loc.observe(fakeView({ [LEGACY_OF_CYRUS_GOAL.at]: 0x80 }), true, false);
    expect(loc.goalReached()).toBe(true);
    const standard = createModeHooks({}, noWrite);
    standard.observe(fakeView({ [LEGACY_OF_CYRUS_GOAL.at]: 0x80 }), true, false);
    expect(standard.goalReached()).toBe(false);
  });
});
