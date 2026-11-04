/* @layer bridge-wasm @kind logic */
import { STORY_CHEST_FIRST, STORY_CHEST_LAST, STORY_COUNTER } from './wram-map.constants';
import { byteAt } from './read-bytes';
import type { GameInfoStory } from './game-info.type';

const countBits = (value: number): number => {
  let n = 0;
  for (let v = value; v; v >>= 1) n += v & 1;
  return n;
};

const readStory = (heap: Uint8Array, ptr: number): GameInfoStory => {
  let chestsOpened = 0;
  for (let at = STORY_CHEST_FIRST; at <= STORY_CHEST_LAST; at += 1) chestsOpened += countBits(byteAt(heap, ptr + at));
  return { counter: byteAt(heap, ptr + STORY_COUNTER), chestsOpened };
};

export { readStory };
