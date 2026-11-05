/* @layer renderer-app @kind test */
import { describe, expect, it } from 'vitest';
import type { Profile } from '@drizztdourden08/brock-core';
import { modeOf } from '@app/profile-modes';

const profileOf = (randomizer?: { mode: string }): Profile => ({ randomizer }) as unknown as Profile;

describe('modeOf', { tags: ['critical'] }, () => {
  it('reads vanilla and vanilla safe from the flag', () => {
    expect(modeOf(profileOf(), {})).toBe('vanilla');
    expect(modeOf(profileOf(), { vanillaSafe: false })).toBe('vanilla');
    expect(modeOf(profileOf(), null)).toBe('vanilla');
    expect(modeOf(profileOf(), { vanillaSafe: true })).toBe('vanilla-safe');
  });

  it('prefers the randomizer mode over the flag', () => {
    expect(modeOf(profileOf({ mode: 'local' }), { vanillaSafe: true })).toBe('randomizer');
    expect(modeOf(profileOf({ mode: 'online' }), {})).toBe('randomizer-online');
    expect(modeOf(profileOf({ mode: 'archipelia' }), {})).toBe('randomizer-archipelia');
  });
});
