import { describe, expect, it } from 'vitest';
import { gameFlagsOf } from './game-flags-of';

describe('gameFlagsOf', () => {
  it('leaves duplicateCharacters off by default', () => {
    expect(gameFlagsOf(true, false).duplicateCharacters).toBe(false);
  });

  it('passes duplicateCharacters only in a randomizer run', () => {
    expect(gameFlagsOf(true, false, true).duplicateCharacters).toBe(true);
    expect(gameFlagsOf(false, false, true).duplicateCharacters).toBe(false);
  });
});
