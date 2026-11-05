/* @layer bridge-wasm @kind logic */
import type { CheckDef, CtPlacement } from '@chronoki/game-core';
import { createCtWorldDef, ctPollEntries } from '@chronoki/game-core';
import type { TrackerProvider } from '@drizztdourden08/brock-randomizer/tracker';
import { trackerFromDef } from '@drizztdourden08/brock-randomizer/tracker';
import { itemLabelOf } from '../item-label-of';
import { randomizerConfigOf } from '../randomizer-config-of';
import { checksCache } from './checks-cache';
import type { CachedChecks } from './checks-cache';
import { completedKeys } from './completed-keys';
import { locationLabelOf } from './location-label-of';

type Built = Pick<Required<TrackerProvider<CtPlacement>>, 'world' | 'vanilla' | 'sphereOf'>;
type Current = { source: CachedChecks | null; checks: readonly CheckDef[]; built: Built };

const packOf = (checks: readonly CheckDef[]): Readonly<Record<string, number>> =>
  Object.fromEntries(checks.map((check): [string, number] => [check.id, 0]));

const build = (source: CachedChecks | null): Current => {
  const checks = source?.checks ?? [];
  const options = source === null ? undefined : randomizerConfigOf(source.profileId)?.options;
  const def = createCtWorldDef({ checks, options });
  const built = trackerFromDef(def, { completed: completedKeys, labelOf: locationLabelOf, itemLabelOf }) as Built;
  return { source, checks, built };
};

let current: Current | null = null;

const currentOf = (): Current => {
  const source = checksCache.latest();
  if (current === null || current.source?.checks !== source?.checks) current = build(source);
  return current;
};

const chronokiTracker: TrackerProvider<CtPlacement> = {
  world: (input) => currentOf().built.world(input),
  vanilla: () => currentOf().built.vanilla(),
  sphereOf: (placement) => currentOf().built.sphereOf(placement),
  get checks() {
    const { checks } = currentOf();
    return ctPollEntries(checks, packOf(checks));
  },
  completed: completedKeys,
  labelOf: locationLabelOf,
  itemLabelOf,
};

export { chronokiTracker };
