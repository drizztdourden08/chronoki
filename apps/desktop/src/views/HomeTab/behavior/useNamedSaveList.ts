/* @layer renderer-components @kind hook */
import { useCallback, useEffect, useState } from 'react';
import type { NamedSaveKind } from '@drizztdourden08/brock-port-kit';
import { EMPTY_NAMED_SAVES } from '../HomeTab.constants';
import type { NamedSavesData } from '../HomeTab.type';
import { fetchNamedSaves } from './fetch-named-saves';

const useNamedSaveList = (profileId: string | null, kind: NamedSaveKind, running: boolean) => {
  const [data, setData] = useState<NamedSavesData>(EMPTY_NAMED_SAVES);

  const refresh = useCallback(async () => {
    const next = profileId ? await fetchNamedSaves(profileId, kind) : EMPTY_NAMED_SAVES;
    if (next) setData(next);
  }, [profileId, kind]);

  useEffect(() => { void refresh(); }, [refresh, running]);

  return { ...data, refresh };
};

export { useNamedSaveList };
