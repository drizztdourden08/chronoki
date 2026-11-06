/* @layer bridge-wasm @kind logic */
import type { ApOptionDef } from '@drizztdourden08/brock-randomizer/archipelago';
import type { CtOptionDef } from '../world/ct-option-def.type';
import { ctUiOptions } from '../world/ct-ui-options';
import { CT_DEATH_LINK_DEF } from './ct-death-link-def.constants';
import { CT_AP_EXCLUDED_OPTIONS } from './ct-option-rows.constants';

const kindOf = (option: CtOptionDef): ApOptionDef['kind'] => {
  if (option.kind !== undefined) return option.kind;
  if (option.choices !== undefined) return 'choice';
  return typeof option.default === 'boolean' ? 'toggle' : 'text';
};

const defOf = (option: CtOptionDef): ApOptionDef => ({
  key: option.key,
  kind: kindOf(option),
  displayName: option.label,
  description: option.description ?? option.hint ?? option.label,
  baseline: option.default,
  locked: option.frozen === true,
  ...(option.choices === undefined ? {} : { choices: option.choices.map((value) => ({ value: String(value) })) }),
  ...(option.range === undefined ? {} : { range: option.range }),
});

const ctApOptionDefs = (): readonly ApOptionDef[] =>
  [
    ...ctUiOptions()
      .filter((option) => option.implemented && !CT_AP_EXCLUDED_OPTIONS.includes(option.key))
      .map(defOf),
    CT_DEATH_LINK_DEF,
  ];

export { ctApOptionDefs };
