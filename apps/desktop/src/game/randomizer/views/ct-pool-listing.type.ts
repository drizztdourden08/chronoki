/* @layer renderer-components @kind type */
import type { CtPoolTotals } from './ct-pool-totals.type';

type CtPoolListingRow = {
  name: string;
  count: number;
};

type CtPoolListingGroup = {
  id: string;
  label: string;
  total: number;
  rows: readonly CtPoolListingRow[];
};

type CtPoolListingProps = {
  groups: readonly CtPoolListingGroup[];
  totals: CtPoolTotals | null;
  error?: string;
  titled?: boolean;
};

export type { CtPoolListingGroup, CtPoolListingProps, CtPoolListingRow };
