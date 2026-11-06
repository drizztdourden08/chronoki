/* @layer tests @kind test */
import { describe, expect, it } from 'vitest';
import { ctPlayerFileOf } from '../src/randomizer/archipelago';
import { withCtOptionDefaults } from '../src/randomizer/world/with-ct-option-defaults';

const fileOf = (over: Record<string, unknown>) =>
  ctPlayerFileOf({ slotName: 'Crono', world: { checks: [], options: withCtOptionDefaults(over) } });

describe('online play locks', { tags: ['critical'] }, () => {
  it('writes the default profile', () => {
    expect(fileOf({}).yaml).toContain('Crono');
  });

  it.each([
    [{ characterRando: true }, 'Online play does not support Character randomization yet.'],
    [{ duplicateCharacters: true }, 'Online play does not support Duplicate characters yet.'],
    [{ bucketList: true }, 'Online play does not support Bucket List yet.'],
    [{ partyMode: 'custom', startingParty: 'frog,lucca' }, 'Online play does not support a starting party other than Crono and Marle yet.'],
  ])('refuses %j', (over, message) => {
    expect(() => fileOf(over)).toThrow(message);
  });

  it('accepts the custom party the export assumes', () => {
    expect(() => fileOf({ partyMode: 'custom', startingParty: 'crono,marle' })).not.toThrow();
  });
});
