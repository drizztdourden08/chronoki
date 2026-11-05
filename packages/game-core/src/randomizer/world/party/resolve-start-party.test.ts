/* @layer bridge-wasm @kind logic */
import { createRng } from '@drizztdourden08/brock-randomizer/world';
import { describe, expect, it } from 'vitest';
import { ctOptionValues } from '../ct-option-values';
import { CT_CHARACTERS } from './ct-party.constants';
import { partyIdsOf } from './party-ids-of';
import { resolveStartParty } from './resolve-start-party';

const customOf = (startingParty: unknown) => () =>
  resolveStartParty({ partyMode: 'custom', startingParty: startingParty as string }, 's');

describe('resolveStartParty', { tags: ['critical'] }, () => {
  it('gives the same party for the same seed and options', () => {
    const options = { partyMode: 'random', partySize: 4 };
    expect(resolveStartParty(options, 'seed-a')).toEqual(resolveStartParty(options, 'seed-a'));
  });

  it('random gives N unique ids from the pool', () => {
    for (const size of [1, 2, 3, 7]) {
      const party = resolveStartParty({ partyMode: 'random', partySize: size }, `s${size}`);
      expect(party).toHaveLength(size);
      expect(new Set(party).size).toBe(size);
      for (const id of party) expect(CT_CHARACTERS).toContain(id);
    }
  });

  it('random uses its own stream and leaves the main one alone', () => {
    const before = createRng('seed-b').next();
    resolveStartParty({ partyMode: 'random', partySize: 3 }, 'seed-b');
    expect(createRng('seed-b').next()).toBe(before);
  });

  it('rejects a bad random size', () => {
    expect(() => resolveStartParty({ partyMode: 'random', partySize: 0 }, 's')).toThrow();
    expect(() => resolveStartParty({ partyMode: 'random', partySize: 8 }, 's')).toThrow();
    expect(() => resolveStartParty({ partyMode: 'random', partySize: 2.5 }, 's')).toThrow();
  });

  it('custom keeps slot order', () => {
    const party = resolveStartParty({ partyMode: 'custom', startingParty: 'frog,crono,ayla,robo' }, 's');
    expect(party).toEqual(['frog', 'crono', 'ayla', 'robo']);
    expect(partyIdsOf(party)).toEqual([4, 0, 5, 3]);
  });

  it('custom accepts all 7 including magus', () => {
    expect(resolveStartParty({ partyMode: 'custom', startingParty: CT_CHARACTERS.join(',') }, 's')).toEqual(CT_CHARACTERS);
  });

  it('throws on empty, 8 entries, duplicates and unknown ids', () => {
    expect(customOf('')).toThrow();
    expect(customOf('crono,marle,lucca,robo,frog,ayla,magus,crono')).toThrow();
    expect(customOf('crono,crono')).toThrow();
    expect(customOf('crono,glenn')).toThrow();
    expect(customOf(3)).toThrow();
  });

  it('throws on an unknown mode', () => {
    expect(() => resolveStartParty({ partyMode: 'shuffle' }, 's')).toThrow();
  });

  it('puts the three party keys in the seed-hashed values', () => {
    expect(Object.keys(ctOptionValues())).toEqual(expect.arrayContaining(['partyMode', 'partySize', 'startingParty']));
  });
});
