/* @layer bridge-wasm @kind constants */
import type { StoryGatedGift } from './story-gated-gift.type';
import { STORY_STAGES } from './story-stages.constants';

const DARK_AGES_GIFTS: readonly string[] = [
  'gift-00c-o17-0', 'gift-00c-o17-1', 'gift-014-o18', 'gift-02f-o12-0', 'gift-02f-o12-1', 'gift-033-o9-0',
  'gift-033-o9-1', 'gift-033-o10-0', 'gift-033-o10-1', 'gift-075-o12', 'gift-077-o62', 'gift-09a-o13',
  'gift-09a-o14', 'gift-0a4-o25', 'gift-1e0-o8', 'gift-1e6-o8-0', 'gift-1e6-o8-1',
];

const STORY_GATED_GIFTS: readonly StoryGatedGift[] = [
  { check: 'gift-004-o8-1', stage: STORY_STAGES.masamune },
  { check: 'gift-004-o8-2', stage: STORY_STAGES.keepersDome },
  ...DARK_AGES_GIFTS.map((check): StoryGatedGift => ({ check, stage: STORY_STAGES.darkAges })),
];

export { STORY_GATED_GIFTS };
