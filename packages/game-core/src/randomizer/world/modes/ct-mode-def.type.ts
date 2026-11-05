/* @layer bridge-wasm @kind type */
import type { CtRule } from '../ct-region-spec.type';
import type { CtEra, CtEventId, CtKeyItem, CtRegionId, CtSpotId } from '../ct-world-keys.type';

type CtModeId = 'standard' | 'lost-worlds' | 'legacy-of-cyrus' | 'ice-age' | 'vanilla-rando';

type CtGoalId = 'beat-lavos' | 'beat-ozzie' | 'ice-age-woe';

type CtStartStateId = 'jot-standard' | 'jot-lost-worlds';

type CtRulePatches = Readonly<{
  exits?: Readonly<Record<string, CtRule>>;
  spots?: Readonly<Partial<Record<CtSpotId, CtRule>>>;
  events?: Readonly<Partial<Record<CtEventId, CtRule>>>;
}>;

type CtExtraExit = { from: CtRegionId; to: CtRegionId; rule?: CtRule };

type CtModeDef = {
  id: CtModeId;
  label: string;
  implemented: boolean;
  start: CtRegionId;
  eras: readonly CtEra[];
  extraExits: readonly CtExtraExit[];
  rulePatches: CtRulePatches;
  keyItems: readonly CtKeyItem[];
  goal: CtGoalId;
  startState: CtStartStateId;
};

export type { CtExtraExit, CtGoalId, CtModeDef, CtModeId, CtRulePatches, CtStartStateId };
