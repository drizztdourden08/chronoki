/* @layer bridge-wasm @kind logic */
import { CT_KIT } from '../ct-kit.constants';
import type { CtEventSpec, CtRegionSpec, CtRule } from '../ct-region-spec.type';
import type { CtCharacter } from '../ct-world-keys.type';
import { CT_RECRUIT_ORDER, CT_RECRUIT_SPOTS } from '../recruits/ct-recruit-spots.constants';
import { SHAPE_MENU_REGION } from './shape.constants';

const { all, any, region, seedIs } = CT_KIT;

const isCharacter = (id: string): id is CtCharacter => CT_RECRUIT_ORDER.some((character) => character === id);

const branchOf = (regionId: CtRegionSpec['id'], rule: CtRule | undefined): CtRule =>
  (rule === undefined ? region(regionId) : all(region(regionId), rule));

const spotBranchesOf = (character: CtCharacter): CtRule[] =>
  CT_RECRUIT_ORDER.flatMap((spot): CtRule[] => {
    const recruit = CT_RECRUIT_SPOTS[spot];
    if (recruit === null) return [];
    return [all(seedIs(`recruit:${spot}`, character), branchOf(recruit.region, recruit.rule))];
  });

const legacyBranchesOf = (specs: readonly CtRegionSpec[], character: CtCharacter): CtRule[] =>
  specs.flatMap((spec) => spec.events.filter((event) => event.id === character)
    .map((event) => branchOf(spec.id, event.rule)));

const recruitEventOf = (specs: readonly CtRegionSpec[], character: CtCharacter): CtEventSpec => ({
  id: character,
  rule: any(seedIs(`party:${character}`, true), ...spotBranchesOf(character), ...legacyBranchesOf(specs, character)),
});

const shapeRecruits = (specs: readonly CtRegionSpec[]): CtRegionSpec[] => {
  const recruits = CT_RECRUIT_ORDER.map((character) => recruitEventOf(specs, character));
  return specs.map((spec): CtRegionSpec => {
    const events = spec.events.filter((event) => !isCharacter(event.id));
    return spec.id === SHAPE_MENU_REGION ? { ...spec, events: [...events, ...recruits] } : { ...spec, events };
  });
};

export { shapeRecruits };
