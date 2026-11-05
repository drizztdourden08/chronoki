/* @layer bridge-wasm @kind test */
import { describe, expect, it } from 'vitest';
import { formatVerifySummary } from './format-verify-summary';
import type { VerifyOptionSet } from './verify-option-set.type';
import { verifySeeds } from './verify-seeds';

const STORY_SETS: readonly VerifyOptionSet[] = [
  { name: 'mode:lost-worlds', options: { gameMode: 'lost-worlds' } },
  { name: 'mode:lost-worlds+chronosanity', options: { gameMode: 'lost-worlds', chronosanity: true } },
  { name: 'mode:ice-age', options: { gameMode: 'ice-age' } },
  { name: 'mode:ice-age+chronosanity', options: { gameMode: 'ice-age', chronosanity: true } },
  { name: 'epochFail+chronosanity', options: { epochFail: true, chronosanity: true } },
];

describe('story-gated seeds', { tags: ['e2e'] }, () => {
  it('proves 100 seeds beatable for Lost Worlds, Ice Age and Epoch Fail with the story gates', () => {
    const summary = verifySeeds({ count: 100, baseSeed: 'verify-story', party: 'legacy', optionSets: STORY_SETS });
    expect(summary.runs).toBe(100 * STORY_SETS.length);
    expect(summary.failures.length, formatVerifySummary(summary)).toBe(0);
  });
});
