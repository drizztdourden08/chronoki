/* @layer renderer-components @kind hook */
import { useCallback, useEffect, useState } from 'react';
import type { NamedSaveKind } from '@drizztdourden08/brock-port-kit';
import type { NamedSavesData } from '../HomeTab.type';
import { fetchNamedSaves } from './fetch-named-saves';

const EMPTY: NamedSavesData = { list: [], screenshots: {} };

const useNamedSaveList = (profileId: string | null, kind: NamedSaveKind, running: boolean) => {
  const [data, setData] = useState<NamedSavesData>(EMPTY);

  const refresh = useCallback(async () => {
    const next = profileId ? await fetchNamedSaves(profileId, kind) : EMPTY;
    if (next) setData(next);
  }, [profileId, kind]);

  useEffect(() => { void refresh(); }, [refresh, running]);

  return { ...data, refresh };
};

export { useNamedSaveList };
