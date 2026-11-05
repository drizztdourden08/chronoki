/* @layer bridge-wasm @kind constants */
import type { CtModeDef } from './ct-mode-def.type';
import { STANDARD_MODE } from './standard-mode.constants';

const VANILLA_RANDO_MODE: CtModeDef = {
  ...STANDARD_MODE,
  id: 'vanilla-rando',
  label: 'Vanilla Rando',
  implemented: true,
};

export { VANILLA_RANDO_MODE };
