/* @layer bridge-wasm @kind test */
import { describe, expect, it } from 'vitest';
import { LEGACY_PARTY } from '@chronoki/game-core';
import { startPartyOf } from './start-party-of';

describe('startPartyOf', () => {
  it('returns the rolled party of the placement', () => {
    expect(startPartyOf({ startParty: ['frog', 'ayla'] })).toEqual(['frog', 'ayla']);
  });

  it('falls back to the legacy party for a seed saved without one', () => {
    expect(startPartyOf({})).toEqual(LEGACY_PARTY);
  });
});
