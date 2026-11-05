/* @layer bridge-wasm @kind logic */
import type { CheckDef } from '../checks/check.type';
import { spotChecksOf } from '../checks/spot-checks-of';
import type { CtPlacement } from '../world/ct-placement.type';
import type { CtSpotId } from '../world/ct-world-keys.type';
import { chestRomIdOf } from '../world/chest-rom-id-of';
import { treasureRomIdOf } from '../world/treasure-rom-id-of';
import { CHEST_ID_PREFIX } from '../checks/checks.constants';
import type { PackPlacementPlan } from './pack-placement-plan.type';

const planPackPlacement = (placement: CtPlacement, checks: readonly CheckDef[]): PackPlacementPlan => {
  const checkIds = new Set(checks.map((check) => check.id));
  const spotChecks: ReadonlyMap<string, string> = spotChecksOf(checks) ?? new Map<CtSpotId, string>();
  const pack: Record<string, number> = {};
  const items = new Map<string, string>();
  const virtual: (readonly [string, string])[] = [];
  let unbound = 0;
  for (const [location, item] of placement.locations) {
    const checkId = spotChecks.get(location) ?? location;
    const keyItemsFit = location.startsWith(`${CHEST_ID_PREFIX}-`) || spotChecks.has(location);
    const romId = keyItemsFit ? chestRomIdOf(item) : treasureRomIdOf(item);
    if (checkIds.has(checkId) && romId !== null) {
      pack[checkId] = romId;
      items.set(location, item);
      continue;
    }
    virtual.push([location, item]);
    if (!checkIds.has(checkId)) unbound += 1;
  }
  return { pack, items, virtual, unbound };
};

export { planPackPlacement };
