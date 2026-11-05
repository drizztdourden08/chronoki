/* @layer tests @kind test */
import { describe, expect, it } from 'vitest';
import { startOutcomeOf } from '@app/views/GameLayer/behavior/start-outcome-of';

describe('a start that fails never leaves the stage blank', { tags: ['critical'] }, () => {
  it('reports a successful current start as started', () => {
    expect(startOutcomeOf({ ok: true, stale: false })).toBe('started');
  });

  it('abandons a failed current start so the menu comes back', () => {
    expect(startOutcomeOf({ ok: false, stale: false })).toBe('abandon');
  });

  it('ignores the result of a launch that was replaced or stopped', () => {
    expect(startOutcomeOf({ ok: true, stale: true })).toBe('ignore');
    expect(startOutcomeOf({ ok: false, stale: true })).toBe('ignore');
  });
});
