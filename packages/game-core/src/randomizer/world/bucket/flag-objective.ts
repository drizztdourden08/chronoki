/* @layer bridge-wasm @kind logic */
import { WRAM_BANK_7F } from '../../../game-info/wram-map.constants';
import type { CtRule } from '../ct-region-spec.type';
import type { CtKeyItem, CtOptionKey, CtRegionId } from '../ct-world-keys.type';
import type { ObjectiveDef, ObjectiveKind } from './objective-def.type';

type FlagObjectiveInput = {
  id: string;
  label: string;
  kind: ObjectiveKind;
  at: number;
  mask: number;
  settle: boolean;
  regions: readonly CtRegionId[];
  rule: CtRule;
  items?: readonly CtKeyItem[];
  option?: CtOptionKey;
  bank7e?: boolean;
};

const flagObjective = (input: FlagObjectiveInput): ObjectiveDef => ({
  id: input.id,
  label: input.label,
  kind: input.kind,
  source: { type: 'flag', at: input.bank7e === true ? input.at : WRAM_BANK_7F + input.at, mask: input.mask, settle: input.settle },
  regions: input.regions,
  items: input.items ?? [],
  rule: input.rule,
  ...(input.option === undefined ? {} : { option: input.option }),
});

export type { FlagObjectiveInput };
export { flagObjective };
