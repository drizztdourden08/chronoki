/* @layer bridge-wasm @kind logic */
import type { CtEventSpec, CtRegionSpec } from '../ct-region-spec.type';
import type { CtRegionId } from '../ct-world-keys.type';
import type { CtStartParty } from '../party/ct-party.type';
import { CT_RECRUIT_ORDER, CT_RECRUIT_SPOTS } from './ct-recruit-spots.constants';
import type { RecruitGrants } from './recruit-grants.type';

const recruitEventsOf = (
  spec: CtRegionSpec, party: CtStartParty, grants: RecruitGrants,
): CtEventSpec[] =>
  CT_RECRUIT_ORDER.flatMap((spot): CtEventSpec[] => {
    const recruit = CT_RECRUIT_SPOTS[spot];
    const id = grants.duplicate === true ? spot : grants.assignment?.[spot] ?? spot;
    if (party.includes(id) || recruit?.region !== spec.id) return [];
    return [recruit.rule === undefined ? { id } : { id, rule: recruit.rule }];
  });

const applyStartPartyToRegions = (
  specs: readonly CtRegionSpec[], start: CtRegionId, party: CtStartParty, grants: RecruitGrants = {},
): CtRegionSpec[] =>
  specs.map((spec): CtRegionSpec => ({
    ...spec,
    events: [
      ...(spec.id === start ? party.map((id): CtEventSpec => ({ id })) : []),
      ...recruitEventsOf(spec, party, grants),
      ...spec.events.filter((event) => !party.some((id) => id === event.id)),
    ],
  }));

export { applyStartPartyToRegions };
