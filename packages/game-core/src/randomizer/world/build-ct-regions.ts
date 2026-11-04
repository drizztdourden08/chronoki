/* @layer bridge-wasm @kind logic */
import type { Exit, Region, WorldLocation } from '@drizztdourden08/brock-randomizer/world';
import type { CtRegionSpec } from './ct-region-spec.type';
import type { CtWorldKeys } from './ct-world-keys.type';
import { exitNameOf } from './exit-name-of';

const buildCtRegions = (
  specs: readonly CtRegionSpec[], locationsOf: (spec: CtRegionSpec) => WorldLocation<CtWorldKeys>[],
): Region<CtWorldKeys>[] => {
  const exits: Exit<CtWorldKeys>[] = specs.flatMap((spec) =>
    spec.exits.map((exit) => ({ name: exitNameOf(spec.id, exit.to), source: spec.id, target: exit.to })));
  return specs.map((spec) => ({
    id: spec.id,
    name: spec.name,
    locations: locationsOf(spec),
    events: spec.events.map((event) => ({ key: event.id, region: spec.id })),
    exits: exits.filter((exit) => exit.source === spec.id),
    entrances: exits.filter((exit) => exit.target === spec.id),
    tags: { era: spec.era },
  }));
};

export { buildCtRegions };
