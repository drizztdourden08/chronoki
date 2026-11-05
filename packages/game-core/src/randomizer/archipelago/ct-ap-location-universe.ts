/* @layer bridge-wasm @kind logic */
import { compareApKeys } from './ap-key-order';
import { CT_AP_LOCATION_IDS } from './ct-ap-location-ids.constants';

const ctApLocationUniverse = (): readonly string[] => Object.keys(CT_AP_LOCATION_IDS).sort(compareApKeys);

export { ctApLocationUniverse };
