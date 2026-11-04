/* @layer tests @kind test */
import { describe, expect, it } from 'vitest';
import { STAGE_SETTLE_MAX_MS, STAGE_SETTLE_MS } from '@app/views/GameLayer/GameLayer.constants';
import { settleDelay } from '@app/views/GameLayer/behavior/settle-delay';

describe('stage settle before the core boots', { tags: ['critical'] }, () => {
  it('waits a quiet period after the last stage change', () => {
    expect(settleDelay({ elapsed: 0, fullscreenPending: false })).toBe(STAGE_SETTLE_MS);
    expect(settleDelay({ elapsed: 1000, fullscreenPending: false })).toBe(STAGE_SETTLE_MS);
  });

  it('waits for a requested fullscreen up to the cap', () => {
    expect(settleDelay({ elapsed: 0, fullscreenPending: true })).toBe(STAGE_SETTLE_MAX_MS);
    expect(settleDelay({ elapsed: 1000, fullscreenPending: true })).toBe(STAGE_SETTLE_MAX_MS - 1000);
  });

  it('never waits past the cap, even while the stage keeps changing', () => {
    expect(settleDelay({ elapsed: STAGE_SETTLE_MAX_MS - 100, fullscreenPending: false })).toBe(100);
    expect(settleDelay({ elapsed: STAGE_SETTLE_MAX_MS + 500, fullscreenPending: true })).toBe(0);
  });
});
