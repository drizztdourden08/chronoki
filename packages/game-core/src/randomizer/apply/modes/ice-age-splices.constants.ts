/* @layer bridge-wasm @kind constants */
import type { EndingPoint } from './ending-splice.type';
import type { StoryWrite } from './story-write.type';

const STORY_WRITES: readonly StoryWrite[] = [
  { scene: 0x184, bytes: [0x5a, 0xb4], why: 'ice-age-no-story-b4' },
  { scene: 0x184, bytes: [0x5a, 0xb7], why: 'ice-age-no-story-b7' },
  { scene: 0x17e, bytes: [0x5a, 0xbb], why: 'ice-age-no-story-bb' },
];

const ICE_AGE_ENDING: EndingPoint = {
  scene: 0x18d,
  anchor: [0xeb, 0x30, 0x00],
  story: 0x75,
  place: 'after',
  why: 'ice-age-ending',
};

export { ICE_AGE_ENDING, STORY_WRITES };
