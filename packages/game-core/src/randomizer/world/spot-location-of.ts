/* @layer bridge-wasm @kind logic */
import type { WorldLocation } from '@drizztdourden08/brock-randomizer/world';
import type { CheckDef } from '../checks/check.type';
import type { CtSpotSpec } from './ct-region-spec.type';
import { CT_LOCATION_KIND_SPOT } from './ct-world.constants';
import type { CtRegionId, CtWorldKeys } from './ct-world-keys.type';
import { SPOT_VANILLA_ITEMS } from './spot-vanilla-items.constants';
import { treasureItemOf } from './treasure-item-of';

const spotLocationOf = (
  spot: CtSpotSpec, region: CtRegionId, bound: CheckDef | undefined,
): WorldLocation<CtWorldKeys> => {
  const tags = { kind: CT_LOCATION_KIND_SPOT, name: spot.name };
  if (bound === undefined) return { key: spot.id, region, vanillaItem: SPOT_VANILLA_ITEMS[spot.id], tags };
  return {
    key: spot.id,
    region,
    vanillaItem: treasureItemOf(bound.vanillaItem),
    tags: { ...tags, checkId: bound.id, checkKind: bound.kind, mapId: bound.locationId },
  };
};

export { spotLocationOf };
