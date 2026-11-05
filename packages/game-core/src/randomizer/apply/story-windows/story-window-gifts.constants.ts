/* @layer bridge-wasm @kind constants */
import type { StoryWindowGift } from './story-window-gift.type';

const OP_IF_HAS_ITEM = 0xc9;
const OP_JUMP = 0x10;
const OP_RETURN = 0x00;
const OP_STORY_BELOW = 0x18;
const GIVE_IF_MISSING_LENGTH = 7;

const REPTITE_LAIR_WINDOW: StoryWindowGift = {
  check: 'gift-121-o0',
  scene: 0x121,
  scope: { object: 0, fn: 0 },
  anchor: [0x0a, 0x10],
  before: [],
  after: [0x0a, 0x10],
  why: 'story-window-reptite-lair',
};

const ARRIS_DOME_WINDOW: StoryWindowGift = {
  check: 'gift-0d6-o15',
  scene: 0x0d6,
  scope: { object: 15, fn: 2 },
  anchor: [OP_STORY_BELOW, 0x37, 0xc4],
  before: [OP_STORY_BELOW, 0x37, 0x03, OP_JUMP, GIVE_IF_MISSING_LENGTH + 2],
  after: [OP_RETURN],
  why: 'story-window-arris-dome',
};

const STORY_WINDOW_GIFTS: readonly StoryWindowGift[] = [REPTITE_LAIR_WINDOW, ARRIS_DOME_WINDOW];

export { ARRIS_DOME_WINDOW, OP_IF_HAS_ITEM, OP_JUMP, REPTITE_LAIR_WINDOW, STORY_WINDOW_GIFTS };
