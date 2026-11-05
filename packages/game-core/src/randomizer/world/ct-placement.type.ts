/* @layer bridge-wasm @kind type */
import type { DefPlacement } from '@drizztdourden08/brock-randomizer/world';
import type { BossAssignment } from '../apply/boss-rando/boss-rando.type';
import type { CtOptionValues } from './ct-world-input.type';
import type { CtWorldKeys } from './ct-world-keys.type';
import type { CtStartParty } from './party/ct-party.type';

type CtPlacement = DefPlacement<CtWorldKeys> & { startParty?: CtStartParty; bosses?: BossAssignment; mystery?: CtOptionValues };

export type { CtPlacement };
