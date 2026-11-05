/* @layer bridge-wasm @kind logic */
import type { CtOptionDef } from './ct-option-def.type';
import { CT_OPTION_CATALOG } from './ct-options.constants';
import { CT_OPTION_DOCS } from './ct-option-docs.constants';
import { CT_NOT_YET_HINT } from './ct-ui-options.constants';

const documented = (option: CtOptionDef): CtOptionDef => ({ ...option, ...CT_OPTION_DOCS[option.key] });

const ctUiOptions = (): readonly CtOptionDef[] =>
  CT_OPTION_CATALOG.map(documented).map((option) =>
    (option.implemented
      ? { ...option, implementation: 'active' as const }
      : { ...option, frozen: true, hint: CT_NOT_YET_HINT, implementation: 'not-implemented' as const }));

export { ctUiOptions };
