/* @layer bridge-wasm @kind test */
import { createRng, generate, sweepPlacementSpheres } from '@drizztdourden08/brock-randomizer/world';
import { describe, expect, it } from 'vitest';
import type { CheckDef } from '../checks/check.type';
import { createCtWorldGame } from './create-ct-world-game';
import { CT_KEY_ITEMS } from './ct-key-items.constants';
import type { CtWorldInput } from './ct-world-input.type';
import type { CtItem } from './ct-world-keys.type';
import { isCtKeyItem } from './is-ct-key-item';
import { joinCtChecks } from './join-ct-checks';

const MAPS = [0x001, 0x087, 0x0c4, 0x0d6, 0x121, 0x18d, 0x3ff];
const SEED = 'falcon-epoch';

const chest = (n: number): CheckDef => ({
  id: `chest-test-${n}`, kind: 'chest', locationId: MAPS[n % MAPS.length] ?? 0, vanillaItem: n + 1,
});

const INPUT: CtWorldInput = { checks: Array.from({ length: 42 }, (_, n) => chest(n)) };

const replaySweep = (input: CtWorldInput, seed: string, locations: readonly [string, CtItem][]): boolean => {
  const game = createCtWorldGame(input);
  const { world } = game.build({ request: { seed }, prep: undefined, rng: createRng(seed), attempt: 0 });
  world.placedItems.clear();
  for (const [location, item] of locations) world.placedItems.set(location, item);
  return sweepPlacementSpheres(world).beaten;
};

describe('createCtWorldGame', () => {
  it('fills a fixed seed and the sweep reaches the goal', { tags: ['critical'] }, () => {
    const placement = generate(createCtWorldGame(INPUT), { seed: SEED });
    expect(placement.locations).toHaveLength(15 + 42);
    expect(replaySweep(INPUT, SEED, placement.locations)).toBe(true);
  });

  it('places every key item once, only on key-item spots', { tags: ['critical'] }, () => {
    const placement = generate(createCtWorldGame(INPUT), { seed: SEED });
    const keyPlacements = placement.locations.filter(([, item]) => isCtKeyItem(item));
    expect(keyPlacements.map(([, item]) => item).sort()).toEqual([...CT_KEY_ITEMS].sort());
    expect(keyPlacements.every(([location]) => location.startsWith('ki-'))).toBe(true);
  });

  it('gives the same placement for the same seed, with locked characters too', { tags: ['critical'] }, () => {
    const locked: CtWorldInput = { ...INPUT, options: { lockedCharacters: true } };
    const first = generate(createCtWorldGame(locked), { seed: SEED });
    const second = generate(createCtWorldGame(locked), { seed: SEED });
    expect(second.locations).toEqual(first.locations);
    expect(replaySweep(locked, SEED, first.locations)).toBe(true);
  });

  it('joins derived checks by id and fills vanillaItem from them', { tags: ['critical'] }, () => {
    const gift: CheckDef = { id: 'gift-087-o3', kind: 'gift', locationId: 0x087, vanillaItem: 0x20 };
    const gateKey: CheckDef = { id: 'gift-1b0-o1', kind: 'gift', locationId: 0x1b0, vanillaItem: 0xd7 };
    const joined = joinCtChecks({
      checks: [chest(0), gift, gateKey], spotChecks: new Map([['ki-zenan-bridge', gift.id]]),
    });
    expect(joined.treasure.map((location) => location.key)).toEqual(['chest-test-0']);
    expect(joined.treasure[0]?.vanillaItem).toBe('treasure-001');
    const zenan = joined.regions.flatMap((region) => region.locations).find((l) => l.key === 'ki-zenan-bridge');
    expect(zenan?.vanillaItem).toBe('treasure-020');
    expect(zenan?.tags?.['checkId']).toBe(gift.id);
  });
});
