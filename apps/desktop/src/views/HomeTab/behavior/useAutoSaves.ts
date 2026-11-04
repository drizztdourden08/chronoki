/* @layer renderer-components @kind hook */
import { useCallback, useState } from 'react';
import { activeStateContext, loadState, platformSaveStore } from '@app/game/save-states';
import { appLog } from '@app/log/app-log';
import { useNamedSaveList } from './useNamedSaveList';

const KIND = 'auto';

const useAutoSaves = (profileId: string | null, running: boolean) => {
  const { list, screenshots, refresh } = useNamedSaveList(profileId, KIND, running);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async (id: string) => {
    const ctx = activeStateContext();
    if (!ctx) return;
    setBusyId(id);
    const result = await loadState(ctx, { kind: KIND, id });
    if (!result.ok) appLog.warn(`[state] load auto-save ${id} failed: ${result.reason}`);
    setBusyId(null);
  }, []);

  const remove = useCallback(async (id: string) => {
    if (!profileId) return;
    setBusyId(id);
    await platformSaveStore().named.remove(profileId, KIND, id);
    await refresh();
    setBusyId(null);
  }, [profileId, refresh]);

  return { saves: list, screenshots, busyId, load, remove };
};

export { useAutoSaves };
