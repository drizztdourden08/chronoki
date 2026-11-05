/* @layer tests @kind test */
import type { Profile } from '@drizztdourden08/brock-core';
import { describe, expect, it } from 'vitest';
import { duplicateCharactersOf } from '@app/views/GameSession/behavior/duplicate-characters-of';

type ProfileOptions = NonNullable<Profile['randomizer']>['options'];

const profileOf = (options: ProfileOptions): Profile => ({
  id: 'profile',
  name: 'profile',
  created: 0,
  lastPlayed: 0,
  romFile: 'ct.sfc',
  randomizer: { mode: 'local', seed: 'seed', options },
});

describe('duplicateCharactersOf', { tags: ['critical'] }, () => {
  it('is off without a profile or the option', () => {
    expect(duplicateCharactersOf(null)).toBe(false);
    expect(duplicateCharactersOf(profileOf({ characterRando: true }))).toBe(false);
  });

  it('needs characterRando as well', () => {
    expect(duplicateCharactersOf(profileOf({ duplicateCharacters: true }))).toBe(false);
    expect(duplicateCharactersOf(profileOf({ characterRando: true, duplicateCharacters: true }))).toBe(true);
  });
});
