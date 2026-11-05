/* @layer bridge-wasm @kind constants */
import type { ApExportSource } from '@drizztdourden08/brock-randomizer/archipelago';
import type { CtWorldKeys } from '../world/ct-world-keys.type';
import { AP_GAME, AP_WORLD_VERSION } from './ap-game.constants';
import { CT_AP_ITEM_IDS } from './ct-ap-item-ids.constants';
import { CT_AP_ITEM_NAMES } from './ct-ap-item-names.constants';
import { CT_AP_LOCATION_IDS } from './ct-ap-location-ids.constants';
import { CT_AP_LOCATION_NAMES } from './ct-ap-location-names.constants';
import { ctApOptionDefs } from './ct-ap-option-defs';
import { ctEventNameOf } from './ct-event-name-of';
import { CT_GOAL_EVENT } from './ct-goal-event.constants';
import { CT_HELPER_REGISTRY } from './ct-helper-registry.constants';
import { ctIsLocationPrize } from './ct-is-location-prize';
import { ctItemClassOf } from './ct-item-class-of';
import { ctLocationRequiresOf } from './ct-location-requires-of';
import { ctWidestWorld } from './ct-widest-world';

const CT_AP_EXPORT_SOURCE: ApExportSource<CtWorldKeys> = {
  game: AP_GAME,
  worldVersion: AP_WORLD_VERSION,
  goalEvent: CT_GOAL_EVENT,
  world: ctWidestWorld,
  helpers: CT_HELPER_REGISTRY,
  primitives: [],
  locationIds: CT_AP_LOCATION_IDS,
  locationNames: CT_AP_LOCATION_NAMES,
  itemIds: CT_AP_ITEM_IDS,
  itemNames: CT_AP_ITEM_NAMES,
  itemClass: ctItemClassOf,
  isPrize: ctIsLocationPrize,
  requires: ctLocationRequiresOf,
  eventName: ctEventNameOf,
  options: ctApOptionDefs(),
};

export { CT_AP_EXPORT_SOURCE };
