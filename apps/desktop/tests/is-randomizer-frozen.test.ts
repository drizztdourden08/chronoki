/* @layer tests @kind test */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { isRandomizerFrozen } from '@app/settings-controls/is-randomizer-frozen';

const state = vi.hoisted(() => ({ active: undefined as { randomizer?: { frozen: string[] } } | undefined }));

vi.mock('@drizztdourden08/brock-react', () => ({ useProfilesStore: { getState: () => ({ active: state.active }) } }));
vi.mock('@drizztdourden08/brock-randomizer', () => ({
  frozenKeysOf: (randomizer?: { frozen: string[] }) => randomizer?.frozen ?? [],
}));

describe('isRandomizerFrozen', { tags: ['critical'] }, () => {
  beforeEach(() => {
    state.active = undefined;
  });

  it('is false when no profile is active', () => {
    expect(isRandomizerFrozen('pixelPerfect')).toBe(false);
  });

  it('is true for a key the active randomizer profile freezes', () => {
    state.active = { randomizer: { frozen: ['pixelPerfect'] } };
    expect(isRandomizerFrozen('pixelPerfect')).toBe(true);
  });

  it('is false for a key it does not freeze', () => {
    state.active = { randomizer: { frozen: ['pixelPerfect'] } };
    expect(isRandomizerFrozen('volume')).toBe(false);
  });
});
