/* @layer renderer-components @kind type */
import type { ImpactCell } from '@drizztdourden08/brock-randomizer/renderer';
import type { CtPool } from './ct-pool.type';

type CtPoolImpacts = {
  pool: CtPool | null;
  error: string | undefined;
  cellOf: (key: string) => ImpactCell;
};

export type { CtPoolImpacts };
