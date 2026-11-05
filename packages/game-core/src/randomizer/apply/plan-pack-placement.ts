/* @layer bridge-wasm @kind logic */
import type { CheckDef } from '../checks/check.type';
import type { CtPlacement } from '../world/ct-placement.type';
import type { CtSpotId } from '../world/ct-world-keys.type';
import { SPOT_VANILLA_ITEMS } from '../world/spot-vanilla-items.constants';
import { chestRomIdOf } from '../world/chest-rom-id-of';
import { treasureRomIdOf } from '../world/treasure-rom-id-of';
import { CHEST_ID_PREFIX } from '../checks/checks.constants';
import type { PackPlacementPlan } from './pack-placement-plan.type';

const planPackPlacement = (placement: CtPlacement, checks: readonly CheckDef[]): PackPlacementPlan => {
  const checkIds = new Set(checks.map((check) => check.id));
  const pack: Record<string, number> = {};
  const items = new Map<string, string>();
  const virtual: (readonly [string, string])[] = [];
  let unbound = 0;
  for (const [location, item] of placement.locations) {
    const romId = location.startsWith(`${CHEST_ID_PREFIX}-`) ? chestRomIdOf(item) : treasureRomIdOf(item);
    if (checkIds.has(location) && romId !== null) {
      pack[location] = romId;
      items.set(location, item);
      continue;
    }
    if (!checkIds.has(location) && SPOT_VANILLA_ITEMS[location as CtSpotId] === item) continue;
    virtual.push([location, item]);
    if (!checkIds.has(location)) unbound += 1;
  }
  return { pack, items, virtual, unbound };
};

export { planPackPlacement };
