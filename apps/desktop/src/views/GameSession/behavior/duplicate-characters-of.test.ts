import type { Profile } from '@drizztdourden08/brock-core';
import { describe, expect, it } from 'vitest';
import { duplicateCharactersOf } from './duplicate-characters-of';

const profileOf = (options: Record<string, unknown>): Profile => ({ randomizer: { options } }) as unknown as Profile;

describe('duplicateCharactersOf', () => {
  it('is off without a profile or the option', () => {
    expect(duplicateCharactersOf(null)).toBe(false);
    expect(duplicateCharactersOf(profileOf({ characterRando: true }))).toBe(false);
  });

  it('needs characterRando as well', () => {
    expect(duplicateCharactersOf(profileOf({ duplicateCharacters: true }))).toBe(false);
    expect(duplicateCharactersOf(profileOf({ characterRando: true, duplicateCharacters: true }))).toBe(true);
  });
});
