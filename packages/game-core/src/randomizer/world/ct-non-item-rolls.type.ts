/* @layer bridge-wasm @kind type */
import type { BossAssignment } from '../apply/boss-rando/boss-rando.type';
import type { ElementAssignment } from '../apply/element-rando/element-rando.type';
import type { ObjectiveRow } from './bucket/objective-def.type';
import type { CtOptionValues, CtWorldInput } from './ct-world-input.type';
import type { CtStartParty } from './party/ct-party.type';
import type { CharacterAssignment } from './recruits/character-assignment.type';

type CtNonItemRolls = {
  options: CtOptionValues;
  input: CtWorldInput;
  startParty: CtStartParty;
  bosses: BossAssignment | undefined;
  characters: CharacterAssignment | undefined;
  elements: ElementAssignment | undefined;
  objectives: readonly ObjectiveRow[] | undefined;
};

export type { CtNonItemRolls };
