/* @layer bridge-wasm @kind logic */
import type { CtOptionValues } from '../ct-world-input.type';
import { DEFAULT_OBJECTIVE_COUNT, DEFAULT_OBJECTIVES_NEEDED, OBJECTIVE_LIMIT } from './bucket.constants';
import type { BucketCounts } from './bucket-counts.type';

const clamped = (value: unknown, fallback: number): number => {
  const parsed = typeof value === 'number' ? Math.trunc(value) : fallback;
  return Math.min(OBJECTIVE_LIMIT, Math.max(1, parsed));
};

const bucketCountsOf = (options: CtOptionValues, available = OBJECTIVE_LIMIT): BucketCounts => {
  const count = Math.min(available, clamped(options.objectiveCount, DEFAULT_OBJECTIVE_COUNT));
  return { count, needed: Math.min(count, clamped(options.objectivesNeeded, DEFAULT_OBJECTIVES_NEEDED)) };
};

export { bucketCountsOf };
