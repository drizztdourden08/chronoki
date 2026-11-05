/* @layer bridge-wasm @kind logic */
import type { CheckDef, CtEra } from '@chronoki/game-core';
import { CT_REGIONS } from '@chronoki/game-core';
import { currentChecks } from './current-checks';
import { ERA_OF_MAP } from './location-index.constants';
import type { LocationIndex } from './location-index.type';

const buildIndex = (checks: readonly CheckDef[]): LocationIndex => {
  const eraOf = new Map<string, CtEra>();
  const nameOf = new Map<string, string>();
  for (const spec of CT_REGIONS) {
    for (const spot of spec.spots) {
      eraOf.set(spot.id, spec.era);
      nameOf.set(spot.id, spot.name);
    }
  }
  for (const check of checks) eraOf.set(check.id, ERA_OF_MAP.get(check.locationId) ?? 'none');
  return { eraOf, nameOf };
};

const cache = new WeakMap<readonly CheckDef[], LocationIndex>();

const indexOfChecks = (): LocationIndex => {
  const checks = currentChecks();
  const hit = cache.get(checks);
  if (hit !== undefined) return hit;
  const built = buildIndex(checks);
  cache.set(checks, built);
  return built;
};

export { indexOfChecks };
