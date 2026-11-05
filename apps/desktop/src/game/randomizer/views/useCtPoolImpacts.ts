/* @layer renderer-components @kind hook */
import { useMemo } from 'react';
import type { ImpactCell } from '@drizztdourden08/brock-randomizer/renderer';
import type { CtOptionValues } from '@chronoki/game-core';
import { ctImpactCell } from './ct-impact-cell';
import { PENDING_CELL } from './ct-impact-cell.constants';
import { ctPoolImpactOf } from './ct-pool-impact';
import { UNAVAILABLE } from './ct-pool-impact.constants';
import { ctPoolOf } from './ct-pool-of';
import type { CtPoolImpacts } from './ct-pool-impacts.type';
import { useCtPack } from './useCtPack';

const messageOf = (error: unknown): string => (error instanceof Error ? error.message : String(error));

const useCtPoolImpacts = (options: CtOptionValues, seed: string, romFile: string | null): CtPoolImpacts => {
  const { pack, error: packError } = useCtPack(romFile);
  const optionsKey = JSON.stringify(options);
  return useMemo(() => {
    if (pack === null) return { pool: null, error: packError, cellOf: () => PENDING_CELL };
    const cache = new Map<string, ImpactCell>();
    try {
      const pool = ctPoolOf(pack, options, seed);
      const cellOf = (key: string): ImpactCell => {
        const cached = cache.get(key);
        if (cached !== undefined) return cached;
        let cell: ImpactCell;
        try {
          cell = ctImpactCell(ctPoolImpactOf(key, pack, options, pool, seed));
        } catch {
          cell = ctImpactCell(UNAVAILABLE);
        }
        cache.set(key, cell);
        return cell;
      };
      return { pool, error: undefined, cellOf };
    } catch (error) {
      return { pool: null, error: messageOf(error), cellOf: () => ctImpactCell(UNAVAILABLE) };
    }
  }, [pack, packError, optionsKey, seed]);
};

export { useCtPoolImpacts };
