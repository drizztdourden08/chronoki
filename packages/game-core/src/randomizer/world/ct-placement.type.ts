/* @layer bridge-wasm @kind type */
import type { DefPlacement } from '@drizztdourden08/brock-randomizer/world';
import type { BossAssignment } from '../apply/boss-rando/boss-rando.type';
import type { ElementAssignment } from '../apply/element-rando/element-rando.type';
import type { ObjectiveRow } from './bucket/objective-def.type';
import type { CharacterAssignment } from './recruits/character-assignment.type';
import type { CtOptionValues } from './ct-world-input.type';
import type { CtWorldKeys } from './ct-world-keys.type';
import type { CtStartParty } from './party/ct-party.type';

type CtPlacement = DefPlacement<CtWorldKeys> & {
  startParty?: CtStartParty; bosses?: BossAssignment; characters?: CharacterAssignment; elements?: ElementAssignment;
  mystery?: CtOptionValues; objectives?: readonly ObjectiveRow[];
};

export type { CtPlacement };
