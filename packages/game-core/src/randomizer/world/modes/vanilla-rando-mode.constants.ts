/* @layer bridge-wasm @kind constants */
import type { CtModeDef } from './ct-mode-def.type';
import { stubModeOf } from './stub-mode-of';

const VANILLA_RANDO_MODE: CtModeDef = stubModeOf('vanilla-rando', 'Vanilla Rando');

export { VANILLA_RANDO_MODE };
