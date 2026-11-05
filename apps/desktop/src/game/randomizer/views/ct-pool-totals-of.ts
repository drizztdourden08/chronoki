/* @layer renderer-components @kind logic */
import type { CtPool } from './ct-pool.type';
import type { CtPoolTotals } from './ct-pool-totals.type';

const ctPoolTotalsOf = (pool: CtPool): CtPoolTotals => {
  const keyItems = pool.progression.length;
  const items = pool.rest.length;
  return { keyItems, items, open: Math.max(0, pool.locations - keyItems - items) };
};

export { ctPoolTotalsOf };
