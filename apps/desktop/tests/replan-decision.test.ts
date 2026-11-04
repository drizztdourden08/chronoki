/* @layer tests @kind test */
import { describe, expect, it } from 'vitest';
import { REPLAN_RETRY_MS, REPLAN_SETTLE_MS } from '@app/views/GameLayer/GameLayer.constants';
import type { ReplanInputs } from '@app/views/GameLayer/GameLayer.type';
import { replanDecision } from '@app/views/GameLayer/behavior/replan-decision';
import { replanDelay } from '@app/views/GameLayer/behavior/replan-delay';

const inField: ReplanInputs = {
  live: true, busy: false, runningFrame: '352x224', plannedFrame: '480x270', blockedFrame: null, savable: true, mode: 'field',
};

describe('re-plan the frame when the stage changes in play', { tags: ['critical'] }, () => {
  it('re-plans a savable field scene whose planned frame differs', () => {
    expect(replanDecision(inField)).toBe('replan');
  });

  it('defers on the world map, in menus and while the scene cannot be saved', () => {
    expect(replanDecision({ ...inField, mode: 'world' })).toBe('defer');
    expect(replanDecision({ ...inField, mode: 'menu-field' })).toBe('defer');
    expect(replanDecision({ ...inField, mode: 'menu-world' })).toBe('defer');
    expect(replanDecision({ ...inField, mode: null })).toBe('defer');
    expect(replanDecision({ ...inField, savable: false })).toBe('defer');
  });

  it('stays idle when paused, busy, unchanged or blocked after a failed try', () => {
    expect(replanDecision({ ...inField, live: false })).toBe('idle');
    expect(replanDecision({ ...inField, busy: true })).toBe('idle');
    expect(replanDecision({ ...inField, plannedFrame: '352x224' })).toBe('idle');
    expect(replanDecision({ ...inField, blockedFrame: '480x270' })).toBe('idle');
    expect(replanDecision({ ...inField, blockedFrame: '512x288' })).toBe('replan');
  });

  it('waits the quiet period after a stage change and retries a deferred frame', () => {
    expect(replanDelay(null, '480x270')).toBe(REPLAN_SETTLE_MS);
    expect(replanDelay('512x288', '480x270')).toBe(REPLAN_SETTLE_MS);
    expect(replanDelay('480x270', '480x270')).toBe(REPLAN_RETRY_MS);
  });
});
