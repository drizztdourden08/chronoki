/* @layer renderer-app @kind test */
import { describe, expect, it } from 'vitest';
import type { Profile } from '@drizztdourden08/brock-core';
import { modeOf } from '@app/profile-modes';

type RandomizerMode = NonNullable<Profile['randomizer']>['mode'];

const profileOf = (mode?: RandomizerMode): Profile => ({
  id: 'profile',
  name: 'profile',
  created: 0,
  lastPlayed: 0,
  romFile: 'ct.sfc',
  ...(mode ? { randomizer: { mode, seed: 'seed', options: {} } } : {}),
});

describe('modeOf', { tags: ['critical'] }, () => {
  it('reads vanilla and vanilla safe from the flag', () => {
    expect(modeOf(profileOf(), {})).toBe('vanilla');
    expect(modeOf(profileOf(), { vanillaSafe: false })).toBe('vanilla');
    expect(modeOf(profileOf(), null)).toBe('vanilla');
    expect(modeOf(profileOf(), { vanillaSafe: true })).toBe('vanilla-safe');
  });

  it('prefers the randomizer mode over the flag', () => {
    expect(modeOf(profileOf('local'), { vanillaSafe: true })).toBe('randomizer');
    expect(modeOf(profileOf('online'), {})).toBe('randomizer-online');
    expect(modeOf(profileOf('archipelia'), {})).toBe('randomizer-archipelia');
  });
});
