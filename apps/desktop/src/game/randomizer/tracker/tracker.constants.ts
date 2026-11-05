/* @layer bridge-wasm @kind constants */
import type { CheckDef, CtKeyItem } from '@chronoki/game-core';
import { CT_KEY_ITEMS, CT_KEY_ITEM_ROM_IDS } from '@chronoki/game-core';
import type { TrackerGrouping } from '@drizztdourden08/brock-randomizer/tracker';

const ERA_GROUPING_ID = 'era';

const TRACKER_GROUPINGS: readonly TrackerGrouping[] = [{ id: ERA_GROUPING_ID, label: 'Era' }];

const NO_CHECKS: readonly CheckDef[] = [];

const KEY_ITEM_ROM_ID_SET: ReadonlySet<number> = new Set(CT_KEY_ITEMS.map((item) => CT_KEY_ITEM_ROM_IDS[item]));

const KEY_ITEM_OF_ROM_ID: ReadonlyMap<number, CtKeyItem> =
  new Map(CT_KEY_ITEMS.map((item): [number, CtKeyItem] => [CT_KEY_ITEM_ROM_IDS[item], item]));

export { ERA_GROUPING_ID, KEY_ITEM_OF_ROM_ID, KEY_ITEM_ROM_ID_SET, NO_CHECKS, TRACKER_GROUPINGS };
