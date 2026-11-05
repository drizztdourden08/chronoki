/* @layer bridge-wasm @kind type */
import type { DefPlacement } from '@drizztdourden08/brock-randomizer/world';
import type { CtWorldKeys } from './ct-world-keys.type';
import type { CtStartParty } from './party/ct-party.type';

type CtPlacement = DefPlacement<CtWorldKeys> & { startParty?: CtStartParty };

export type { CtPlacement };
