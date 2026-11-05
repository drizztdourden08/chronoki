/* @layer bridge-wasm @kind type */
import type { RuleOptionValue } from '@drizztdourden08/brock-randomizer/world';
import type { CheckDef } from '../checks/check.type';
import type { CtOptionKey, CtSpotId } from './ct-world-keys.type';
import type { CtStartParty } from './party/ct-party.type';
import type { CharacterAssignment } from './recruits/character-assignment.type';

type CtOptionValues = Readonly<Partial<Record<CtOptionKey, RuleOptionValue>>>;

type CtWorldInput = {
  checks: readonly CheckDef[];
  spotChecks?: ReadonlyMap<CtSpotId, string>;
  sealedCheckIds?: ReadonlySet<string>;
  options?: CtOptionValues;
  startParty?: CtStartParty;
  characters?: CharacterAssignment;
  fillerSeed?: string;
};

export type { CtOptionValues, CtWorldInput };
