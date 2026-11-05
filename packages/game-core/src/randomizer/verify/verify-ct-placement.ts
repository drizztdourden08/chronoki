/* @layer bridge-wasm @kind logic */
import { createRng, sweepPlacementSpheres } from '@drizztdourden08/brock-randomizer/world';
import { OBJECTIVE_EVENT_PREFIX } from '../world/bucket/bucket.constants';
import { createCtWorldGame } from '../world/create-ct-world-game';
import type { CtWorldInput } from '../world/ct-world-input.type';
import { rollCtPlacement } from '../world/roll-ct-placement';
import type { VerifyResult } from './verify-result.type';

const optionsSummaryOf = (input: CtWorldInput): string =>
  Object.entries(input.options ?? {}).map(([key, value]) => `${key}=${String(value)}`).join(',') || 'default';

const verifyCtPlacement = (input: CtWorldInput, seed: string): VerifyResult => {
  const options = optionsSummaryOf(input);
  try {
    const placement = rollCtPlacement(input, seed);
    const startParty = placement.startParty ?? [];
    const { world } = createCtWorldGame({ ...input, startParty, fillerSeed: seed })
      .build({ request: { seed }, prep: undefined, rng: createRng(seed), attempt: 0 });
    world.placedItems.clear();
    placement.locations.forEach(([location, item]) => world.placedItems.set(location, item));
    const sweep = sweepPlacementSpheres(world);
    const spheres = sweep.spheres.map((sphere) =>
      sphere.locations.map((location) => `${String(location)}: ${String(world.placedItems.get(location) ?? 'nothing')}`));
    const missedObjectives = sweep.missedEvents.filter((event) => String(event).startsWith(OBJECTIVE_EVENT_PREFIX));
    if (sweep.beaten && missedObjectives.length === 0) return { ok: true, seed, options, startParty, spheres };
    return {
      ok: false, seed, options, startParty, spheres,
      stuckAt: {
        sphere: sweep.spheres.length,
        unreachable: sweep.uncollected.map(String),
        missingItems: sweep.uncollected.map((location) => String(world.placedItems.get(location) ?? 'nothing')),
        missingEvents: sweep.missedEvents.map(String),
      },
    };
  } catch (error) {
    return { ok: false, seed, options, startParty: input.startParty ?? [], spheres: [], error: String(error) };
  }
};

export { verifyCtPlacement };
