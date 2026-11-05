/* @layer bridge-wasm @kind test */
import { createRng, generate, sweepPlacementSpheres } from '@drizztdourden08/brock-randomizer/world';
import { describe, expect, it } from 'vitest';
import { planPackPlacement } from '../apply/plan-pack-placement';
import type { CheckDef } from '../checks/check.type';
import { createCtWorldGame } from './create-ct-world-game';
import { describeCtPlacement } from './describe-ct-placement';
import type { CtOptionValues, CtWorldInput } from './ct-world-input.type';
import type { CtItem } from './ct-world-keys.type';
import { isCtKeyItem } from './is-ct-key-item';
import { keyItemsInChestsOf } from './key-items-in-chests-of';

const MAPS = [0x001, 0x087, 0x0c4, 0x0d6, 0x121, 0x18d, 0x3ff];
const UNSORTED_MAP = 0x3ff;
const SEEDS = Array.from({ length: 25 }, (_, n) => `chrono-${n}`);

const chest = (n: number): CheckDef => ({
  id: `chest-test-${n}`, kind: 'chest', locationId: MAPS[n % MAPS.length] ?? 0, vanillaItem: n + 1,
});

const inputOf = (options?: CtOptionValues): CtWorldInput => ({
  checks: Array.from({ length: 42 }, (_, n) => chest(n)), ...(options ? { options } : {}),
});

const beaten = (input: CtWorldInput, seed: string, locations: readonly [string, CtItem][]): boolean => {
  const { world } = createCtWorldGame(input).build({ request: { seed }, prep: undefined, rng: createRng(seed), attempt: 0 });
  world.placedItems.clear();
  for (const [location, item] of locations) world.placedItems.set(location, item);
  return sweepPlacementSpheres(world).beaten;
};

describe('chronosanity', () => {
  it('keeps the placement unchanged when off', { tags: ['critical'] }, () => {
    const implicit = generate(createCtWorldGame(inputOf()), { seed: SEEDS[0] ?? '' });
    const explicit = generate(createCtWorldGame(inputOf({ chronosanity: false })), { seed: SEEDS[0] ?? '' });
    expect(explicit.locations).toEqual(implicit.locations);
    expect(keyItemsInChestsOf(implicit)).toBe(0);
  });

  it('can put key items in chests, never in unsorted ones, and stays beatable', { tags: ['critical'] }, () => {
    const input = inputOf({ chronosanity: true });
    const unsortedIds = new Set(input.checks.filter((c) => c.locationId === UNSORTED_MAP).map((c) => c.id));
    let inChests = 0;
    for (const seed of SEEDS) {
      const placement = generate(createCtWorldGame(input), { seed });
      inChests += keyItemsInChestsOf(placement);
      expect(placement.locations.filter(([l, item]) => unsortedIds.has(l) && isCtKeyItem(item))).toEqual([]);
      expect(beaten(input, seed, placement.locations)).toBe(true);
    }
    expect(inChests).toBeGreaterThan(0);
  });

  it('writes a key item placed in a chest into the pack plan and counts it in the summary', { tags: ['critical'] }, () => {
    const input = inputOf({ chronosanity: true });
    const seed = SEEDS.find((s) => keyItemsInChestsOf(generate(createCtWorldGame(input), { seed: s })) > 0) ?? '';
    const placement = generate(createCtWorldGame(input), { seed });
    const plan = planPackPlacement(placement, input.checks);
    const chestKeys = placement.locations.filter(([l, item]) => l.startsWith('chest-') && isCtKeyItem(item));
    expect(chestKeys.length).toBeGreaterThan(0);
    chestKeys.forEach(([location]) => expect(plan.pack[location]).toBeGreaterThan(0));
    expect(describeCtPlacement(placement).rows.some((row) => row.label === 'Key items in chests')).toBe(true);
  });
});
