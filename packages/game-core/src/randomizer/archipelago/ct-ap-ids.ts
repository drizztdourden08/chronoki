/* @layer bridge-wasm @kind logic */
import { createApIdLookup } from '@drizztdourden08/brock-randomizer/archipelago';
import { CT_AP_ITEM_IDS } from './ct-ap-item-ids.constants';
import { CT_AP_LOCATION_IDS } from './ct-ap-location-ids.constants';

const ctApIds = createApIdLookup(CT_AP_LOCATION_IDS, CT_AP_ITEM_IDS);

export { ctApIds };
