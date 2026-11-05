/* @layer renderer-app @kind test */
import { describe, expect, it } from 'vitest';
import { modeOfProfile } from '@app/profiles/mode-of-profile';

describe('modeOfProfile', { tags: ['critical'] }, () => {
  it('reads vanilla and vanilla safe from the flag', () => {
    expect(modeOfProfile({}, false)).toBe('vanilla');
    expect(modeOfProfile(null, true)).toBe('vanilla-safe');
  });

  it('prefers the randomizer mode over the flag', () => {
    expect(modeOfProfile({ randomizer: { mode: 'local' } }, true)).toBe('randomizer');
    expect(modeOfProfile({ randomizer: { mode: 'online' } }, false)).toBe('randomizer-online');
    expect(modeOfProfile({ randomizer: { mode: 'archipelia' } }, false)).toBe('randomizer-archipelia');
  });
});
