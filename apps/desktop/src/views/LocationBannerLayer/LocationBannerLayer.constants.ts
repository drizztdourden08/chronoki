/* @layer renderer-components @kind constants */
import { CT_REGIONS } from '@chronoki/game-core';

const LOCATION_BANNER_GATE = 'locationBanner';
const LOCATION_WRAM = 0x0100;
const LOCATION_MASK = 0x1ff;
const LOCATION_POLL_MS = 250;
const UNSORTED_REGION_ID = 'unsorted';

const REGION_NAME_OF_MAP: ReadonlyMap<number, string> = new Map(
  CT_REGIONS.filter((region) => region.id !== UNSORTED_REGION_ID).flatMap((region) =>
    region.maps.map((map): [number, string] => [map, region.name]),
  ),
);

export { LOCATION_BANNER_GATE, LOCATION_MASK, LOCATION_POLL_MS, LOCATION_WRAM, REGION_NAME_OF_MAP };
