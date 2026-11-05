/* @layer bridge-wasm @kind logic */
import type { CtOptionDef } from './ct-option-def.type';
import { CT_OPTION_CATALOG } from './ct-options.constants';
import { CT_NOT_YET_HINT } from './ct-ui-options.constants';

const ctUiOptions = (): readonly CtOptionDef[] =>
  CT_OPTION_CATALOG.map((option) =>
    (option.implemented ? option : { ...option, frozen: true, hint: CT_NOT_YET_HINT }));

export { ctUiOptions };
