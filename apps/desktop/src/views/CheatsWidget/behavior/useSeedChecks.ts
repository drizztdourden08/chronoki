/* @layer renderer-widgets @kind hook */
import { useEffect, useState } from 'react';
import { readSeedChecks } from '@app/game/cheats';
import type { SeedCheckRow } from '@app/game/cheats';
import { SNAPSHOT_REFRESH_MS } from '../CheatsWidget.constants';

const useSeedChecks = (): readonly SeedCheckRow[] | null => {
  const [rows, setRows] = useState<readonly SeedCheckRow[] | null>(readSeedChecks);
  useEffect(() => {
    const timer = setInterval(() => setRows(readSeedChecks()), SNAPSHOT_REFRESH_MS);
    return () => clearInterval(timer);
  }, []);
  return rows;
};

export { useSeedChecks };
