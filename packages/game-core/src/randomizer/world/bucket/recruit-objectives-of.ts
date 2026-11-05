/* @layer bridge-wasm @kind logic */
import { CT_KIT } from '../ct-kit.constants';
import type { CtCharacter, CtRegionId } from '../ct-world-keys.type';
import type { CtStartParty } from '../party/ct-party.type';
import { CT_RECRUIT_ORDER, CT_RECRUITS } from '../recruits/ct-recruits.constants';
import { RECRUIT_COUNTS } from './bucket.constants';
import type { ObjectiveDef } from './objective-def.type';

const { has, hasDistinct } = CT_KIT;

const nameOf = (id: string): string => `${id.charAt(0).toUpperCase()}${id.slice(1)}`;

const recruitableIn = (party: CtStartParty, kept: ReadonlySet<CtRegionId>): CtCharacter[] =>
  CT_RECRUIT_ORDER.filter((id) => {
    const recruit = CT_RECRUITS[id];
    return !party.includes(id) && recruit !== null && kept.has(recruit.region);
  });

const recruitObjectivesOf = (party: CtStartParty, kept: ReadonlySet<CtRegionId>): ObjectiveDef[] => {
  const recruitable = recruitableIn(party, kept);
  const single = recruitable.map((id): ObjectiveDef => ({
    id: `recruit-${id}`, label: `Recruit ${nameOf(id)}`, kind: 'recruit', source: { type: 'joined', character: id },
    regions: [], items: [], rule: has(id),
  }));
  const reachable = [...party, ...recruitable];
  const counts = RECRUIT_COUNTS.filter((count) => count > party.length && count <= reachable.length).map((count): ObjectiveDef => ({
    id: `recruit-count-${count}`, label: `Recruit ${count} characters`, kind: 'recruit', source: { type: 'joinedCount', count },
    regions: [], items: [], rule: hasDistinct(reachable, count),
  }));
  return [...single, ...counts];
};

export { recruitObjectivesOf };
