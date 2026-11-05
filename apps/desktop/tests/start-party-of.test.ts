/* @layer tests @kind test */
import { describe, expect, it } from 'vitest';
import { LEGACY_PARTY } from '@chronoki/game-core';
import { startPartyOf } from '@app/game/randomizer/start-party-of';

describe('startPartyOf', { tags: ['critical'] }, () => {
  it('returns the rolled party of the placement', () => {
    expect(startPartyOf({ startParty: ['frog', 'ayla'] })).toEqual(['frog', 'ayla']);
  });

  it('falls back to the legacy party for a seed saved without one', () => {
    expect(startPartyOf({})).toEqual(LEGACY_PARTY);
  });
});
