/* @layer bridge-wasm @kind logic */
import type { CheckDef } from '../checks/check.type';
import { buildCtRegions } from './build-ct-regions';
import type { CtJoinedWorld } from './ct-joined-world.type';
import { droppedMapsOf } from './dropped-maps-of';
import type { CtWorldInput } from './ct-world-input.type';
import type { CtSpotId } from './ct-world-keys.type';
import { mapRegionIndexOf } from './map-region-index-of';
import type { CtRegionSpec } from './ct-region-spec.type';
import { CT_REGIONS } from './regions/ct-regions.constants';
import { spotLocationOf } from './spot-location-of';
import { treasureLocationsOf } from './treasure-locations-of';

const joinCtChecks = (
  input: CtWorldInput, specs: readonly CtRegionSpec[] = CT_REGIONS, excludeDropped = false,
  droppedFrom: readonly CtRegionSpec[] = specs,
): CtJoinedWorld => {
  const checksById = new Map(input.checks.map((check): [string, CheckDef] => [check.id, check]));
  const spotChecks = input.spotChecks ?? new Map<CtSpotId, string>();
  const boundOf = (spot: CtSpotId): CheckDef | undefined => {
    const id = spotChecks.get(spot);
    return id === undefined ? undefined : checksById.get(id);
  };
  const dropped = excludeDropped ? droppedMapsOf(CT_REGIONS, droppedFrom) : undefined;
  const treasure = treasureLocationsOf(input.checks, new Set(spotChecks.values()), mapRegionIndexOf(specs), dropped);
  const regions = buildCtRegions(specs, (spec) => [
    ...spec.spots.map((spot) => spotLocationOf(spot, spec.id, boundOf(spot.id))),
    ...treasure.filter((location) => location.region === spec.id),
  ]);
  return { regions, treasure };
};

export { joinCtChecks };
