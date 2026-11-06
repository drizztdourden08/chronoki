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

  it('forces a random party to custom crono,marle in the YAML and in pre_rolled', () => {
    const random = ctPlayerFileOf({ slotName: 'Crono', seedText: 'lock-seed', world: { checks: [], options: withCtOptionDefaults({ partyMode: 'random' }) } });
    const custom = ctPlayerFileOf({
      slotName: 'Crono', seedText: 'lock-seed',
      world: { checks: [], options: withCtOptionDefaults({ partyMode: 'custom', startingParty: 'crono,marle' }) },
    });
    expect(random.yaml).toBe(custom.yaml);
    expect(random.yaml).toMatch(/partyMode: (custom|\d+)/);
  });

  it('accepts the custom party the export assumes', () => {
    expect(() => fileOf({ partyMode: 'custom', startingParty: 'crono,marle' })).not.toThrow();
  });
});
