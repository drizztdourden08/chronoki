/* @layer tests @kind test */
import { describe, expect, it } from 'vitest';
import { DEFAULT_GATES } from '@chronoki/features';
import { RANDOMIZER_GATE } from '@app/game/randomizer';
import { withRandomizerGate } from '@app/views/ProfileManager/sub-components/ProfileCreateWizard/behavior/with-randomizer-gate';

describe('withRandomizerGate', { tags: ['critical'] }, () => {
  it('leaves a normal profile config untouched', () => {
    const config = { gates: ['turbo'] };
    expect(withRandomizerGate(config, false)).toBe(config);
  });

  it('adds the randomizer gate to the default gates for a randomizer profile', () => {
    expect(withRandomizerGate({}, true).gates).toEqual([...DEFAULT_GATES, RANDOMIZER_GATE]);
  });

  it('keeps the profile gates and adds the randomizer gate once', () => {
    const once = withRandomizerGate({ gates: ['turbo'] }, true);
    expect(once.gates).toEqual(['turbo', RANDOMIZER_GATE]);
    expect(withRandomizerGate(once, true)).toBe(once);
  });
});
