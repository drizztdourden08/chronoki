/* @layer bridge-wasm @kind type */
import type { DefPlacement } from '@drizztdourden08/brock-randomizer/world';
import type { BossAssignment } from '../apply/boss-rando/boss-rando.type';
import type { CharacterAssignment } from './recruits/character-assignment.type';
import type { CtWorldKeys } from './ct-world-keys.type';
import type { CtStartParty } from './party/ct-party.type';

type CtPlacement = DefPlacement<CtWorldKeys> & { startParty?: CtStartParty; bosses?: BossAssignment; characters?: CharacterAssignment };

export type { CtPlacement };
