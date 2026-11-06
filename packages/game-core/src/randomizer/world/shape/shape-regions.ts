/* @layer bridge-wasm @kind logic */
import type { CtRegionSpec } from '../ct-region-spec.type';
import { exitNameOf } from '../exit-name-of';
import { SHAPE_GOAL_SPEC } from './shape-goal.constants';
import { shapeModesToRegions } from './shape-modes-to-regions';
import { shapeRecruits } from './shape-recruits';
import { shapeStartHub } from './shape-start-hub';
import { SHAPE_MODES } from './shape.constants';

const assertUnique = (names: readonly string[], what: string): void => {
  const seen = new Set<string>();
  for (const name of names) {
    if (seen.has(name)) throw new Error(`Shaped world has a duplicate ${what} "${name}".`);
    seen.add(name);
  }
};

const shapeRegionsOf = (): CtRegionSpec[] => {
  const hub = shapeStartHub(SHAPE_MODES);
  const specs = shapeRecruits([{ ...hub, events: [SHAPE_GOAL_SPEC] }, ...shapeModesToRegions(SHAPE_MODES)]);
  assertUnique(specs.flatMap((spec) => spec.exits.map((exit) => exitNameOf(spec.id, exit.to))), 'exit');
  assertUnique(specs.flatMap((spec) => spec.events.map((event) => event.id)), 'event');
  return specs;
};

export { shapeRegionsOf };
