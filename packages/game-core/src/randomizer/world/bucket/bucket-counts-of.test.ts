/* @layer bridge-wasm @kind test */
import { describe, expect, it } from 'vitest';
import { bucketCountsOf } from './bucket-counts-of';
import { objectivesOf } from './objectives-of';

describe('bucketCountsOf', { tags: ['critical'] }, () => {
  it('defaults to 5 objectives with 4 needed', () => {
    expect(bucketCountsOf({})).toEqual({ count: 5, needed: 4 });
  });

  it('clamps the needed count to the objective count and both to 1..8', () => {
    expect(bucketCountsOf({ objectiveCount: 2, objectivesNeeded: 7 })).toEqual({ count: 2, needed: 2 });
    expect(bucketCountsOf({ objectiveCount: 99, objectivesNeeded: 0 })).toEqual({ count: 8, needed: 1 });
  });
});

describe('objectivesOf', { tags: ['critical'] }, () => {
  it('is empty with the bucket list off', () => {
    expect(objectivesOf({}, 'seed', ['crono'])).toEqual([]);
  });

  it('is deterministic per seed and as long as the count', () => {
    const options = { bucketList: true, objectiveCount: 3 };
    const first = objectivesOf(options, 'seed', ['crono']).map((o) => o.id);
    expect(first).toHaveLength(3);
    expect(objectivesOf(options, 'seed', ['crono']).map((o) => o.id)).toEqual(first);
  });
});
