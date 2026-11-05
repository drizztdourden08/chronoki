/* @layer bridge-wasm @kind logic */
import type { CheckDef } from '../checks/check.type';
import { SPOT_VANILLA_ITEMS } from './spot-vanilla-items.constants';
import type { CtSpotId } from './ct-world-keys.type';

const assertUnboundSpotsVanilla = (
  locations: readonly (readonly [string, string])[], checks: readonly CheckDef[],
): void => {
  const bound = new Set(checks.map((check) => check.id));
  const stray = locations.filter(([location, item]) =>
    location in SPOT_VANILLA_ITEMS && !bound.has(location) && SPOT_VANILLA_ITEMS[location as CtSpotId] !== item);
  if (stray.length > 0) {
    throw new Error(`roll put pool items on unbound spots (never granted in game): ${stray.map(([l, i]) => `${l}=${i}`).join(', ')}`);
  }
};

export { assertUnboundSpotsVanilla };
