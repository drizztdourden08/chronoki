/* @layer bridge-wasm @kind logic */
import type { RuleOptionValue } from '@drizztdourden08/brock-randomizer/world';
import type { CtOptionValues } from './ct-world-input.type';
import { CT_OPTION_CATALOG } from './ct-options.constants';

const ctOptionValues = (overrides: CtOptionValues = {}): Readonly<Record<string, RuleOptionValue>> =>
  Object.fromEntries(CT_OPTION_CATALOG.filter((option) => option.implemented).map((option) =>
    [option.key, option.frozen === true ? option.default : overrides[option.key] ?? option.default]));

export { ctOptionValues };
