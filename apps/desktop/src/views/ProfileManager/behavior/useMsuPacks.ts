/* @layer renderer-components @kind hook */
import { useCallback, useEffect, useState } from 'react';
import { listMsuPacks } from '@app/storage/msu-store';

const useMsuPacks = (): { packs: string[]; refresh: () => Promise<void> } => {
  const [packs, setPacks] = useState<string[]>([]);

  const refresh = useCallback(async () => {
    const found = await listMsuPacks().catch(() => []);
    setPacks(found.filter((p) => p.notForThisGame === null).map((p) => p.name));
  }, []);

  useEffect(() => { void refresh(); }, [refresh]);

  return { packs, refresh };
};

export { useMsuPacks };
