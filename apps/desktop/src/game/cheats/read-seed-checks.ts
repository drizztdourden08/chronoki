/* @layer bridge-wasm @kind logic */
import { chronokiPollHooks } from '../randomizer/chronoki-poll-hooks';
import { itemLabelOf } from '../randomizer/item-label-of';
import { currentAppliedSeed } from '../randomizer/tracker/current-applied-seed';
import { locationNameOf } from '../randomizer/tracker/location-name-of';
import type { SeedCheckRow } from './seed-check-row.type';

const readSeedChecks = (): readonly SeedCheckRow[] | null => {
  const seed = currentAppliedSeed();
  if (seed === null) return null;
  const done = chronokiPollHooks.completed();
  return seed.checks.map((check) => ({
    id: check.id,
    name: locationNameOf(check.id),
    kind: check.kind,
    item: itemLabelOf(seed.plan.items.get(check.id) ?? check.id),
    done: done.has(check.id),
  }));
};

export { readSeedChecks };
