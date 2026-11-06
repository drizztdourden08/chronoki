/* @layer bridge-wasm @kind logic */
import { RECRUIT_COUNTS } from '../bucket/bucket.constants';
import type { ObjectiveDef } from '../bucket/objective-def.type';
import { CT_KIT } from '../ct-kit.constants';
import { CT_RECRUIT_ORDER } from '../recruits/ct-recruit-spots.constants';

const { has, hasDistinct } = CT_KIT;

const nameOf = (id: string): string => `${id.charAt(0).toUpperCase()}${id.slice(1)}`;

const shapeRecruitObjectives = (): ObjectiveDef[] => [
  ...CT_RECRUIT_ORDER.map((id): ObjectiveDef => ({
    id: `recruit-${id}`, label: `Recruit ${nameOf(id)}`, kind: 'recruit', source: { type: 'joined', character: id },
    regions: [], items: [], rule: has(id),
  })),
  ...RECRUIT_COUNTS.map((count): ObjectiveDef => ({
    id: `recruit-count-${count}`, label: `Recruit ${count} characters`, kind: 'recruit', source: { type: 'joinedCount', count },
    regions: [], items: [], rule: hasDistinct(CT_RECRUIT_ORDER, count),
  })),
];

export { shapeRecruitObjectives };
