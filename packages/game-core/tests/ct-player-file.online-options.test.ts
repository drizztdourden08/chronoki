/* @layer tests @kind test */
import { describe, expect, it } from 'vitest';
import { ctPlayerFileOf, ctWidestChecks } from '../src/randomizer/archipelago';
import { withCtOptionDefaults } from '../src/randomizer/world/with-ct-option-defaults';

const SEED = 'online-options-seed';

const fileOf = (over: Record<string, unknown>) =>
  ctPlayerFileOf({ slotName: 'Crono', seedText: SEED, world: { checks: ctWidestChecks(), options: withCtOptionDefaults(over) } });

describe('online play options', { tags: ['critical'] }, () => {
  it.each([
    ['character rando', { characterRando: true }],
    ['character rando with duplicates', { characterRando: true, duplicateCharacters: true }],
    ['bucket list', { bucketList: true }],
    ['a custom party of frog and lucca', { partyMode: 'custom', startingParty: 'frog,lucca' }],
  ])('writes a player file for %s', (_name, over) => {
    expect(fileOf(over).yaml).toContain('Crono');
  });

  it('no longer forces a random party to crono,marle', () => {
    const random = fileOf({ partyMode: 'random' });
    const custom = fileOf({ partyMode: 'custom', startingParty: 'crono,marle' });
    expect(random.yaml).not.toBe(custom.yaml);
  });
});
