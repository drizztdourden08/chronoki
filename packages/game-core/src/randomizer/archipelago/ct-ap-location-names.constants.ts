/* @layer bridge-wasm @kind constants */
import { CT_REGIONS } from '../world/regions/ct-regions.constants';
import { CT_AP_LOCATION_IDS } from './ct-ap-location-ids.constants';

const SPOT_NAMES: ReadonlyMap<string, string> = new Map(
  CT_REGIONS.flatMap((region) => region.spots.map((spot): [string, string] => [spot.id, spot.name])),
);

const nameOfLocation = (key: string): string => {
  const [kind, map, ...tail] = key.split('-');
  if (kind === 'chest') return `Chest ${map?.toUpperCase()} #${tail.join('-')}`;
  if (kind === 'gift') return `Gift ${map?.toUpperCase()} ${tail.join(' ')}`;
  const spot = SPOT_NAMES.get(key);
  if (spot === undefined) throw new Error(`location has no name: ${key}`);
  return spot;
};

const CT_AP_LOCATION_NAMES: Readonly<Record<number, string>> = Object.fromEntries(
  Object.entries(CT_AP_LOCATION_IDS).map(([key, id]) => [id, nameOfLocation(key)]),
);

export { CT_AP_LOCATION_NAMES };
