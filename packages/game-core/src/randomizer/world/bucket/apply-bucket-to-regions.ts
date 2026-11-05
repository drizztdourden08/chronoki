/* @layer bridge-wasm @kind logic */
import { CT_KIT } from '../ct-kit.constants';
import type { CtRegionSpec } from '../ct-region-spec.type';
import type { ObjectiveDef } from './objective-def.type';
import { objectiveEventIdOf } from './objective-event-id-of';

const { hasDistinct } = CT_KIT;

const applyBucketToRegions = (
  specs: readonly CtRegionSpec[], objectives: readonly ObjectiveDef[], needed: number,
): CtRegionSpec[] => {
  if (objectives.length === 0) return [...specs];
  const events = objectives.map((objective) => objectiveEventIdOf(objective.id));
  const clamped = Math.min(needed, objectives.length);
  return specs.map((spec): CtRegionSpec => {
    if (spec.id !== 'end-of-time') return spec;
    return {
      ...spec,
      events: [
        ...spec.events,
        ...objectives.map((objective, i) => ({ id: events[i] ?? objectiveEventIdOf(objective.id), rule: objective.rule })),
      ],
      exits: [...spec.exits, { to: 'lavos', rule: hasDistinct(events, clamped) }],
    };
  });
};

export { applyBucketToRegions };
