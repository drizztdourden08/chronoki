/* @layer bridge-wasm @kind logic */
import type { CheckDef, CtEra } from '@chronoki/game-core';
import { CT_ERA_LABELS, CT_REGIONS } from '@chronoki/game-core';
import { currentChecks } from './current-checks';

type LocationIndex = { eraOf: ReadonlyMap<string, CtEra>; nameOf: ReadonlyMap<string, string> };

const ERA_OF_MAP = new Map<number, CtEra>(
  CT_REGIONS.flatMap((spec) => spec.maps.map((map): [number, CtEra] => [map, spec.era])),
);

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

const eraLabelOf = (location: string): string => CT_ERA_LABELS[indexOfChecks().eraOf.get(location) ?? 'none'];

const locationNameOf = (location: string): string => indexOfChecks().nameOf.get(location) ?? location;

export { eraLabelOf, locationNameOf };
