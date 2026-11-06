/* @layer bridge-wasm @kind logic */
import { FALSE } from '@drizztdourden08/brock-randomizer/world';
import { objectiveEventIdOf } from '../bucket/objective-event-id-of';
import { CT_KIT } from '../ct-kit.constants';
import type { CtEventSpec } from '../ct-region-spec.type';
import { shapeObjectiveKey } from './shape-objective-key';
import { shapeObjectiveUniverse } from './shape-objective-universe';

const { seedIs, when } = CT_KIT;

const shapeObjectiveEvents = (): CtEventSpec[] =>
  shapeObjectiveUniverse().map((objective): CtEventSpec => ({
    id: objectiveEventIdOf(objective.id),
    rule: when(seedIs(shapeObjectiveKey(objective.id), true), objective.rule, FALSE),
  }));

export { shapeObjectiveEvents };
