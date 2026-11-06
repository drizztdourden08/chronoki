/* @layer bridge-wasm @kind logic */
import type { CtOptionValues } from '../world/ct-world-input.type';
import { CT_AP_LOCKED_PARTY } from './ct-option-rows.constants';

const ctApLockedOptionsOf = (options: CtOptionValues): CtOptionValues =>
  options.partyMode === 'custom' ? options : { ...options, partyMode: 'custom', startingParty: CT_AP_LOCKED_PARTY };

export { ctApLockedOptionsOf };
