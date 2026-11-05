/* @layer bridge-wasm @kind test */
import { createRng } from '@drizztdourden08/brock-randomizer/world';
import { describe, expect, it } from 'vitest';
import type { CheckDef } from '../../checks/check.type';
import { createCtWorldGame } from '../create-ct-world-game';
import { CT_KIT } from '../ct-kit.constants';
import type { CtWorldInput } from '../ct-world-input.type';
import type { CtEventId, CtItem } from '../ct-world-keys.type';
import { goalOf } from '../goal-of';
import { rollCtPlacement } from '../roll-ct-placement';
import { modeOf } from './mode-of';

type Held = readonly (CtItem | CtEventId)[];

const MAPS = [0x001, 0x087, 0x0c4, 0x0d6, 0x121, 0x18d, 0x3ff];
const SEEDS = ['falcon-epoch', 'iron-lotus', 'amber-gate', 'ninth-moon', 'quiet-tide'];
const LOC_KEYS: Held = ['bent-sword', 'bent-hilt', 'hero-medal', 'grand-leon'];
const IA_KEYS: Held = ['gate-key', 'dreamstone'];

const chest = (n: number): CheckDef => ({
  id: `chest-test-${n}`, kind: 'chest', locationId: MAPS[n % MAPS.length] ?? 0, vanillaItem: n + 1,
});

const inputOf = (gameMode: string): CtWorldInput => ({
  checks: Array.from({ length: 42 }, (_, n) => chest(n)),
  options: { gameMode },
});

const stateOf = (gameMode: string, held: Held) => {
  const { world } = createCtWorldGame(inputOf(gameMode)).build({
    request: { seed: 's' }, prep: undefined, rng: createRng('s'), attempt: 0,
  });
  const state = CT_KIT.createCollectionState(world);
  held.forEach((item) => state.collect(item));
  return state;
};

const reachesGoal = (gameMode: string, held: Held): boolean => {
  const state = stateOf(gameMode, held);
  CT_KIT.collectReachableEvents(state);
  const mode = modeOf({ gameMode });
  return goalOf(mode.goal, mode.goalEvent)(state);
};

describe('Legacy of Cyrus goal', { tags: ['critical'] }, () => {
  it('is reachable with the sword, hilt, Hero Medal and Grand Leon', () => {
    expect(reachesGoal('legacy-of-cyrus', LOC_KEYS)).toBe(true);
  });

  it('is not reachable without the Hero Medal, the Grand Leon or the Masamune', () => {
    expect(reachesGoal('legacy-of-cyrus', LOC_KEYS.filter((item) => item !== 'hero-medal'))).toBe(false);
    expect(reachesGoal('legacy-of-cyrus', LOC_KEYS.filter((item) => item !== 'grand-leon'))).toBe(false);
    expect(reachesGoal('legacy-of-cyrus', LOC_KEYS.filter((item) => item !== 'bent-hilt'))).toBe(false);
  });

  it('needs Magus and the Cyrus event for the Ozzie event', () => {
    const base: Held = ['bent-sword', 'bent-hilt', 'frog', 'hero-medal', 'grand-leon'];
    expect(CT_KIT.canReachEvent(stateOf('legacy-of-cyrus', [...base, 'cyrus-done']), 'beat-ozzie')).toBe(false);
    expect(CT_KIT.canReachEvent(stateOf('legacy-of-cyrus', [...base, 'magus']), 'beat-ozzie')).toBe(false);
    expect(CT_KIT.canReachEvent(stateOf('legacy-of-cyrus', [...base, 'magus', 'cyrus-done']), 'beat-ozzie')).toBe(true);
  });

  it('drops the future and the Ocean Palace links', () => {
    const state = stateOf('legacy-of-cyrus', ['gate-key', 'pendant', 'ruby-knife', 'bent-sword', 'bent-hilt', 'frog']);
    expect(state.canReachRegion('future')).toBe(false);
    expect(state.canReachRegion('ocean-palace')).toBe(false);
  });
});

describe('Ice Age goal', { tags: ['critical'] }, () => {
  it('is reachable with the Gate Key and Dreamstone', () => {
    expect(reachesGoal('ice-age', IA_KEYS)).toBe(true);
  });

  it('is not reachable without the Dreamstone or the Gate Key', () => {
    expect(reachesGoal('ice-age', ['gate-key'])).toBe(false);
    expect(reachesGoal('ice-age', ['dreamstone'])).toBe(false);
  });

  it('needs the Ayla event', () => {
    expect(CT_KIT.canReachEvent(stateOf('ice-age', IA_KEYS), 'beat-giga-gaia')).toBe(false);
    expect(CT_KIT.canReachEvent(stateOf('ice-age', [...IA_KEYS, 'ayla']), 'beat-giga-gaia')).toBe(true);
  });

  it('closes the Ocean Palace and the Magus Castle, and the Dark Ages without the Tyrano Lair', () => {
    const state = stateOf('ice-age', ['gate-key', 'bent-sword', 'bent-hilt', 'frog', 'ruby-knife']);
    expect(state.canReachRegion('end-of-time')).toBe(true);
    expect(state.canReachRegion('dark-ages')).toBe(false);
    expect(state.canReachRegion('ocean-palace')).toBe(false);
    expect(state.canReachRegion('magus-castle')).toBe(false);
  });
});

describe('beatable seeds', { tags: ['critical'] }, () => {
  it('rolls a placement for each seed in both modes', () => {
    for (const gameMode of ['legacy-of-cyrus', 'ice-age']) {
      for (const seed of SEEDS) {
        expect(() => rollCtPlacement(inputOf(gameMode), seed)).not.toThrow();
      }
    }
  });
});
