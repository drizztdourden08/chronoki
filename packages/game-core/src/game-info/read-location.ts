/* @layer bridge-wasm @kind logic */
import {
  EPOCH_BOARDED, EPOCH_X, EPOCH_Y, LEAD_OBJECT_INDEX, LOCATION_ARRIVAL_X, LOCATION_ARRIVAL_Y, LOCATION_ID,
  LOCATION_LAST_INSIDE, LOCATION_MASK, LOCATION_OVERWORLD_FIRST, LOCATION_OVERWORLD_LAST, LOCATION_RETURN,
  OBJECT_STRIDE, OBJECT_X_BASE, OBJECT_Y_BASE,
} from './wram-map.constants';
import { byteAt } from './read-bytes';
import { wordAt } from './read-word';
import type { GameInfoLocation } from './game-info.type';

const readLocation = (heap: Uint8Array, ptr: number): GameInfoLocation => {
  const id = wordAt(heap, ptr + LOCATION_ID) & LOCATION_MASK;
  const lead = LEAD_OBJECT_INDEX * OBJECT_STRIDE;
  return {
    id,
    overworld: id >= LOCATION_OVERWORLD_FIRST && id <= LOCATION_OVERWORLD_LAST,
    returnId: wordAt(heap, ptr + LOCATION_RETURN) & LOCATION_MASK,
    lastInsideId: wordAt(heap, ptr + LOCATION_LAST_INSIDE) & LOCATION_MASK,
    arrivalX: byteAt(heap, ptr + LOCATION_ARRIVAL_X),
    arrivalY: byteAt(heap, ptr + LOCATION_ARRIVAL_Y),
    leadX: wordAt(heap, ptr + OBJECT_X_BASE + lead),
    leadY: wordAt(heap, ptr + OBJECT_Y_BASE + lead),
    epochX: wordAt(heap, ptr + EPOCH_X),
    epochY: wordAt(heap, ptr + EPOCH_Y),
    epochBoarded: byteAt(heap, ptr + EPOCH_BOARDED) !== 0,
  };
};

export { readLocation };
