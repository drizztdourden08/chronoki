/* @layer bridge-wasm @kind logic */
import type { WorldLocation } from '@drizztdourden08/brock-randomizer/world';
import type { CheckDef } from '../checks/check.type';
import { VANILLA_KEY_ITEM_ROM_IDS } from './ct-key-items.constants';
import { CT_LOCATION_KIND_TREASURE, CT_UNSORTED } from './ct-world.constants';
import type { CtRegionId, CtWorldKeys } from './ct-world-keys.type';
import { treasureItemOf } from './treasure-item-of';

const isTreasureCheck = (check: CheckDef, bound: ReadonlySet<string>): boolean =>
  !bound.has(check.id) && !VANILLA_KEY_ITEM_ROM_IDS.has(check.vanillaItem);

const treasureLocationsOf = (
  checks: readonly CheckDef[], bound: ReadonlySet<string>, mapRegions: ReadonlyMap<number, CtRegionId>,
  dropped: ReadonlySet<number> = new Set(),
): WorldLocation<CtWorldKeys>[] =>
    checks.filter((check) => isTreasureCheck(check, bound) && !dropped.has(check.locationId)).map((check) => ({
      key: check.id,
      region: mapRegions.get(check.locationId) ?? CT_UNSORTED,
      vanillaItem: treasureItemOf(check.vanillaItem),
      tags: { kind: CT_LOCATION_KIND_TREASURE, checkId: check.id, checkKind: check.kind, mapId: check.locationId },
    }));

export { treasureLocationsOf };
