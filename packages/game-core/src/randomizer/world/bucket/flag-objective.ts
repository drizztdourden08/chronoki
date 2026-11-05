/* @layer bridge-wasm @kind logic */
import { WRAM_BANK_7F } from '../../../game-info/wram-map.constants';
import type { FlagObjectiveInput } from './flag-objective.type';
import type { ObjectiveDef } from './objective-def.type';

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

export { flagObjective };
