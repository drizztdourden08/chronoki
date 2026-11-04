/* @layer bridge-wasm @kind logic */
import {
  LEAD_OBJECT_INDEX, LOCATION_ARRIVAL_X, LOCATION_ARRIVAL_Y, LOCATION_ID,
  LOCATION_LAST_INSIDE, LOCATION_MASK, LOCATION_OVERWORLD_FIRST, LOCATION_OVERWORLD_LAST, LOCATION_RETURN,
  OBJECT_X_BASE, OBJECT_Y_BASE,
} from './wram-map.constants';
import { byteAt } from './read-bytes';
import { wordAt } from './read-word';
import { readEpoch } from './read-epoch';
import { objectPixel } from './read-object-position';
import type { GameInfoLocation } from './game-info.type';

const readLocation = (heap: Uint8Array, ptr: number): GameInfoLocation => {
  const id = wordAt(heap, ptr + LOCATION_ID) & LOCATION_MASK;
  return {
    id,
    overworld: id >= LOCATION_OVERWORLD_FIRST && id <= LOCATION_OVERWORLD_LAST,
    returnId: wordAt(heap, ptr + LOCATION_RETURN) & LOCATION_MASK,
    lastInsideId: wordAt(heap, ptr + LOCATION_LAST_INSIDE) & LOCATION_MASK,
    arrivalX: byteAt(heap, ptr + LOCATION_ARRIVAL_X),
    arrivalY: byteAt(heap, ptr + LOCATION_ARRIVAL_Y),
    leadX: objectPixel(heap, ptr, OBJECT_X_BASE, LEAD_OBJECT_INDEX),
    leadY: objectPixel(heap, ptr, OBJECT_Y_BASE, LEAD_OBJECT_INDEX),
    epoch: readEpoch(heap, ptr),
  };
};

export { readLocation };
