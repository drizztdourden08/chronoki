/* @layer bridge-wasm @kind logic */
import { CT_REGIONS } from '@chronoki/game-core';
import { CHECK_ID_PATTERN, KIND_LABELS, MAP_RADIX } from './tracker-labels.constants';

const spotNames = new Map(CT_REGIONS.flatMap((region) => region.spots.map((spot): [string, string] => [spot.id, spot.name])));

const regionNameOfMap = (map: number): string | undefined => CT_REGIONS.find((region) => region.maps.includes(map))?.name;

const locationLabelOf = (key: string): string => {
  const spot = spotNames.get(key);
  if (spot !== undefined) return spot;
  const match = CHECK_ID_PATTERN.exec(key);
  if (match === null) return key;
  const [, kind, hex, index] = match;
  const region = regionNameOfMap(Number.parseInt(hex, MAP_RADIX));
  const place = region === undefined ? `Map ${hex.toUpperCase()}` : `${region}, map ${hex.toUpperCase()}`;
  return `${place}: ${KIND_LABELS[kind]} ${index}`;
};

export { locationLabelOf };
