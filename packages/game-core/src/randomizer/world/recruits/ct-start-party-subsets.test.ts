/* @layer bridge-wasm @kind test */
import { createRng, generate } from '@drizztdourden08/brock-randomizer/world';
import { describe, expect, it } from 'vitest';
import type { CheckDef } from '../../checks/check.type';
import { createCtWorldGame } from '../create-ct-world-game';
import { CT_KIT } from '../ct-kit.constants';
import type { CtWorldInput } from '../ct-world-input.type';
import { CT_CHARACTERS } from '../party/ct-party.constants';
import type { CtStartParty } from '../party/ct-party.type';
import { rollCtPlacement } from '../roll-ct-placement';

const MAPS = [0x001, 0x087, 0x0c4, 0x0d6, 0x121, 0x18d, 0x3ff];
const SEEDS = ['falcon-epoch', 'iron-lotus', 'amber-gate', 'ninth-moon', 'quiet-tide'];
const REFUSED_PARTIES: readonly string[] = [];

const chest = (n: number): CheckDef => ({
  id: `chest-test-${n}`, kind: 'chest', locationId: MAPS[n % MAPS.length] ?? 0, vanillaItem: n + 1,
});

const inputOf = (options: CtWorldInput['options'] = {}): CtWorldInput => ({
  checks: Array.from({ length: 42 }, (_, n) => chest(n)),
  options,
});

const SUBSETS: CtStartParty[] = Array.from({ length: 127 }, (_, index) =>
  CT_CHARACTERS.filter((_id, bit) => (index + 1) & (1 << bit)));

const startersInSphereZero = (party: CtStartParty): boolean => {
  const input = { ...inputOf(), startParty: party };
  const { world } = createCtWorldGame(input).build({ request: { seed: 's' }, prep: undefined, rng: createRng('s'), attempt: 0 });
  const reachable = CT_KIT.reachableEvents(CT_KIT.createCollectionState(world));
  return party.every((id) => reachable.includes(id));
};

describe('start party subsets', { tags: ['e2e'] }, () => {
  it('has 127 non-empty subsets', () => {
    expect(SUBSETS).toHaveLength(127);
  });

  it('every subset rolls beatable for 5 seeds, or is listed as refused', () => {
    const failed: string[] = [];
    for (const party of SUBSETS) {
      const options = { partyMode: 'custom', startingParty: party.join(',') };
      for (const seed of SEEDS) {
        try {
          expect(rollCtPlacement(inputOf(options), seed).startParty).toEqual(party);
        } catch {
          failed.push(party.join(','));
          break;
        }
      }
    }
    expect(failed).toEqual([...REFUSED_PARTIES]);
  });

  it('puts every starter event in sphere 0', () => {
    const missing = SUBSETS.filter((party) => !startersInSphereZero(party)).map((party) => party.join(','));
    expect(missing).toEqual([]);
  });
});

describe('legacy Crono + Marle party', { tags: ['critical'] }, () => {
  it('gives the same placement as the pre-party world for fixed seeds', () => {
    const options = { partyMode: 'custom', startingParty: 'crono,marle' };
    for (const seed of SEEDS) {
      const before = generate(createCtWorldGame({ ...inputOf(options), fillerSeed: seed }), { seed });
      const after = rollCtPlacement(inputOf(options), seed);
      expect(after.locations).toEqual(before.locations);
      expect(after.spheres).toEqual(before.spheres);
      expect(after.startParty).toEqual(['crono', 'marle']);
    }
  });

  it('resolves the party once and the same seed gives the same placement', () => {
    const first = rollCtPlacement(inputOf({ partyMode: 'random', partySize: 3 }), SEEDS[0] ?? '');
    const second = rollCtPlacement(inputOf({ partyMode: 'random', partySize: 3 }), SEEDS[0] ?? '');
    expect(second).toEqual(first);
    expect(first.startParty).toHaveLength(3);
  });
});
