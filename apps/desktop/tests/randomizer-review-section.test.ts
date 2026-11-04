/* @layer tests @kind test */
import { describe, expect, it, vi } from 'vitest';
import { randomizerReviewSection } from '@app/views/ProfileManager/sub-components/ProfileCreateWizard/behavior/randomizer-review-section';
import type { ProfileWizardValues } from '@app/views/ProfileManager/ProfileManager.type';

vi.mock('@drizztdourden08/brock-randomizer/renderer', () => ({
  randomizerRenderer: { profileWizardSteps: [] },
  RANDOMIZER_SLICE: 'randomizer',
  RANDOMIZER_STEP_ID: 'randomizer',
}));

const valuesOf = (form?: unknown): ProfileWizardValues => ({ name: '', rom: '', preset: 'vanilla', randomizer: form });

describe('randomizerReviewSection', { tags: ['critical'] }, () => {
  it('returns null when the wizard has no randomizer slice', () => {
    expect(randomizerReviewSection(valuesOf())).toBeNull();
  });

  it('shows Off when the randomizer is disabled', () => {
    const section = randomizerReviewSection(valuesOf({ enabled: false, seed: 'x', mode: 'local' }));
    expect(section?.rows).toEqual([{ label: 'Randomizer', value: 'Off' }]);
  });

  it('shows the trimmed seed and the mode label when enabled', () => {
    const section = randomizerReviewSection(valuesOf({ enabled: true, seed: '  abc ', mode: 'local' }));
    expect(section?.rows).toEqual([{ label: 'Seed', value: 'abc' }, { label: 'Mode', value: 'Local (offline)' }]);
  });

  it('shows Random for a blank seed and the raw mode when unknown', () => {
    const section = randomizerReviewSection(valuesOf({ enabled: true, seed: '   ', mode: 'weird' }));
    expect(section?.rows).toEqual([{ label: 'Seed', value: 'Random' }, { label: 'Mode', value: 'weird' }]);
  });
});
