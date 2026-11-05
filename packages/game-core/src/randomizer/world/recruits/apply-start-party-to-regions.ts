/* @layer bridge-wasm @kind logic */
import type { CtEventSpec, CtRegionSpec } from '../ct-region-spec.type';
import type { CtRegionId } from '../ct-world-keys.type';
import type { CtStartParty } from '../party/ct-party.type';
import { CT_RECRUIT_ORDER, CT_RECRUITS } from './ct-recruits.constants';

const recruitEventsOf = (spec: CtRegionSpec, party: CtStartParty): CtEventSpec[] =>
  CT_RECRUIT_ORDER.flatMap((id): CtEventSpec[] => {
    const recruit = CT_RECRUITS[id];
    if (party.includes(id) || recruit?.region !== spec.id) return [];
    return [recruit.rule === undefined ? { id } : { id, rule: recruit.rule }];
  });

const applyStartPartyToRegions = (
  specs: readonly CtRegionSpec[], start: CtRegionId, party: CtStartParty,
): CtRegionSpec[] =>
  specs.map((spec): CtRegionSpec => ({
    ...spec,
    events: [
      ...(spec.id === start ? party.map((id): CtEventSpec => ({ id })) : []),
      ...recruitEventsOf(spec, party),
      ...spec.events.filter((event) => !party.some((id) => id === event.id)),
    ],
  }));

export { applyStartPartyToRegions };
