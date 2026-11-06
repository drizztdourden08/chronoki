/* @layer bridge-wasm @kind logic */
import type { CtWorldInput } from '../ct-world-input.type';
import { CT_RECRUIT_ORDER, CT_RECRUIT_SPOTS } from '../recruits/ct-recruit-spots.constants';
import { LEGACY_PARTY } from '../recruits/legacy-party.constants';

const shapeSeedValues = (
  input: Pick<CtWorldInput, 'startParty' | 'characters'>, duplicate: boolean,
): Record<string, string | boolean> => {
  const party = input.startParty ?? LEGACY_PARTY;
  const values: Record<string, string | boolean> = {};
  for (const character of CT_RECRUIT_ORDER) values[`party:${character}`] = party.includes(character);
  for (const spot of CT_RECRUIT_ORDER) {
    if (CT_RECRUIT_SPOTS[spot] === null) continue;
    values[`recruit:${spot}`] = duplicate ? spot : input.characters?.[spot] ?? spot;
  }
  return values;
};

export { shapeSeedValues };
