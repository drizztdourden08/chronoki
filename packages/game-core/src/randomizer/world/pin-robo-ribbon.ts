/* @layer bridge-wasm @kind logic */
import type { CheckDef } from '../checks/check.type';
import { CT_KEY_ITEM_ROM_IDS } from './ct-key-item-rom-ids.constants';

const pinRoboRibbon = (checks: readonly CheckDef[]): CheckDef[] =>
  checks.filter((check) => check.vanillaItem !== CT_KEY_ITEM_ROM_IDS['robo-ribbon']);

export { pinRoboRibbon };
