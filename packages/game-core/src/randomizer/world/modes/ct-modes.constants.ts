/* @layer bridge-wasm @kind constants */
import type { CtModeDef, CtModeId } from './ct-mode-def.type';
import { ICE_AGE_MODE } from './ice-age-mode.constants';
import { LEGACY_OF_CYRUS_MODE } from './legacy-of-cyrus-mode.constants';
import { LOST_WORLDS_MODE } from './lost-worlds-mode.constants';
import { CT_ALL_ERAS, STANDARD_MODE } from './standard-mode.constants';
import { VANILLA_RANDO_MODE } from './vanilla-rando-mode.constants';

const CT_MODES: readonly CtModeDef[] = [
  STANDARD_MODE,
  LOST_WORLDS_MODE,
  LEGACY_OF_CYRUS_MODE,
  ICE_AGE_MODE,
  VANILLA_RANDO_MODE,
];

const CT_DEFAULT_MODE: CtModeId = 'standard';

export { CT_ALL_ERAS, CT_DEFAULT_MODE, CT_MODES };
