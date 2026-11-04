/* @layer bridge-wasm @kind logic */
import {
  GOLD, GOLD_MAX, SAVE_COUNT, SAVE_COUNT_CAP, SONG_FIELD, SONG_OVERWORLD, WRAM_MIN_BYTES,
} from './wram-map.constants';
import { byteAt } from './read-bytes';
import { triAt } from './read-tri';
import { wordAt } from './read-word';
import { readClock } from './read-clock';
import { readInventory } from './read-inventory';
import { readLocation } from './read-location';
import { readParty } from './read-party';
import { readStory } from './read-story';
import { readTechs } from './read-techs';
import type { GameInfoSnapshot } from './game-info.type';

const readGameInfo = (heap: Uint8Array, ptr: number): GameInfoSnapshot | null => {
  if (ptr <= 0 || heap.length < ptr + WRAM_MIN_BYTES) return null;
  return {
    location: readLocation(heap, ptr),
    party: readParty(heap, ptr),
    clock: readClock(heap, ptr),
    gold: Math.min(triAt(heap, ptr + GOLD), GOLD_MAX),
    saveCount: Math.min(wordAt(heap, ptr + SAVE_COUNT), SAVE_COUNT_CAP),
    story: readStory(heap, ptr),
    inventory: readInventory(heap, ptr),
    techs: readTechs(heap, ptr),
    songField: byteAt(heap, ptr + SONG_FIELD),
    songOverworld: byteAt(heap, ptr + SONG_OVERWORLD),
  };
};

export { readGameInfo };
