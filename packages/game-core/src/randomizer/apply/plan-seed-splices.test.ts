/* @layer bridge-wasm @kind test */
import { describe, expect, it } from 'vitest';
import { planSeedSplices } from './plan-seed-splices';
import { LEGACY_PARTY } from './start-state/legacy-party.constants';
import { planStartState } from './start-state/plan-start-state';
import { STANDARD_START } from './start-state/standard-start.constants';
import { withOptionFlags } from './start-state/with-option-flags';

describe('planSeedSplices', () => {
  it('builds only the start block for standard, as the old path did', { tags: ['critical'] }, () => {
    expect(planSeedSplices({}, LEGACY_PARTY)).toEqual([planStartState(STANDARD_START, LEGACY_PARTY)]);
    expect(planSeedSplices({ gameMode: 'standard' }, LEGACY_PARTY)).toEqual([planStartState(STANDARD_START, LEGACY_PARTY)]);
  });

  it('carries the option flags into the start block', { tags: ['critical'] }, () => {
    const options = { earlyPendantCharge: true, unlockedMagic: true };
    expect(planSeedSplices(options, LEGACY_PARTY))
      .toEqual([planStartState(withOptionFlags(STANDARD_START, options), LEGACY_PARTY)]);
  });

  it('refuses a mode that is not available yet', { tags: ['critical'] }, () => {
    expect(() => planSeedSplices({ gameMode: 'ice-age' }, LEGACY_PARTY)).toThrow(/not available yet/);
  });
});
