/* @layer bridge-wasm @kind logic */
import { FALSE, TRUE } from '@drizztdourden08/brock-randomizer/world';
import { CT_KIT } from '../ct-kit.constants';
import type { CtRule } from '../ct-region-spec.type';
import type { CtModeId } from '../modes/ct-mode-def.type';
import { modeGateOf } from './mode-gate-of';
import { SHAPE_MODES } from './shape.constants';

const { optionSwitch } = CT_KIT;

const keyOf = (rule: CtRule | undefined): string => JSON.stringify(rule ?? TRUE);

const gatedRuleOf = (perMode: ReadonlyMap<CtModeId, CtRule | undefined>): CtRule | undefined => {
  const rules = [...perMode.values()];
  if (new Set(rules.map(keyOf)).size <= 1) return modeGateOf(new Set(perMode.keys()), rules[0]);
  return optionSwitch(
    'gameMode',
    SHAPE_MODES.map((mode): [CtModeId, CtRule] => [mode.id, perMode.has(mode.id) ? perMode.get(mode.id) ?? TRUE : FALSE]),
    FALSE,
  );
};

export { gatedRuleOf };
