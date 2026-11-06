/* @layer bridge-wasm @kind logic */
import { FALSE, seedRef } from '@drizztdourden08/brock-randomizer/world';
import { objectiveEventIdOf } from '../bucket/objective-event-id-of';
import { CT_KIT } from '../ct-kit.constants';
import type { CtRegionSpec } from '../ct-region-spec.type';
import { SHAPE_BUCKET_NEEDED_KEY, SHAPE_BUCKET_OPEN_KEY, SHAPE_BUCKET_REGION } from './shape-bucket.constants';
import { shapeObjectiveEvents } from './shape-objective-events';
import { shapeObjectiveUniverse } from './shape-objective-universe';

const { hasDistinct, seedIs, when } = CT_KIT;

const shapeBucket = (specs: readonly CtRegionSpec[]): CtRegionSpec[] => {
  const events = shapeObjectiveUniverse().map((objective) => objectiveEventIdOf(objective.id));
  const rule = when(seedIs(SHAPE_BUCKET_OPEN_KEY, true), hasDistinct(events, seedRef(SHAPE_BUCKET_NEEDED_KEY)), FALSE);
  return specs.map((spec): CtRegionSpec => (spec.id === SHAPE_BUCKET_REGION
    ? { ...spec, events: [...spec.events, ...shapeObjectiveEvents()], exits: [...spec.exits, { to: 'lavos', rule }] }
    : spec));
};

export { shapeBucket };
