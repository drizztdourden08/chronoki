/* @layer renderer-components @kind logic */
import type { CtItem } from '@chronoki/game-core';
import { itemLabelOf } from '../item-label-of';
import { GROUP_LABELS } from './ct-pool-listing.constants';
import type { CtPool } from './ct-pool.type';
import type { CtPoolListingGroup, CtPoolListingRow } from './ct-pool-listing.type';

const rowsOf = (items: readonly CtItem[]): CtPoolListingRow[] => {
  const counts = new Map<string, number>();
  for (const item of items) counts.set(itemLabelOf(item), (counts.get(itemLabelOf(item)) ?? 0) + 1);
  return [...counts]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
};

const groupOf = (id: string, label: string, items: readonly CtItem[]): CtPoolListingGroup =>
  ({ id, label, total: items.length, rows: rowsOf(items) });

const ctPoolGroupsOf = (pool: CtPool): CtPoolListingGroup[] => [
  groupOf('key-items', GROUP_LABELS.keyItems, pool.progression),
  groupOf('items', GROUP_LABELS.items, pool.rest),
].filter((group) => group.total > 0);

export { ctPoolGroupsOf };
