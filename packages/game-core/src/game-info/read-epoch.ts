/* @layer bridge-wasm @kind logic */
import { EPOCH_BOARDED, EPOCH_UNSET_WORD, EPOCH_X, EPOCH_Y } from './wram-map.constants';
import { byteAt } from './read-bytes';
import { wordAt } from './read-word';
import type { GameInfoEpoch } from './game-info.type';

const readEpoch = (heap: Uint8Array, ptr: number): GameInfoEpoch | null => {
  const x = wordAt(heap, ptr + EPOCH_X);
  const y = wordAt(heap, ptr + EPOCH_Y);
  const boarded = byteAt(heap, ptr + EPOCH_BOARDED) !== 0;
  if (!boarded && ((x === 0 && y === 0) || x === EPOCH_UNSET_WORD || y === EPOCH_UNSET_WORD)) return null;
  return { x, y, boarded };
};

export { readEpoch };
