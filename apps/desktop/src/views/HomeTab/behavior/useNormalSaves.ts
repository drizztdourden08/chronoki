/* @layer renderer-components @kind hook */
import { useCallback, useState } from 'react';
import { activeStateContext, loadState, overwriteNamedState, platformSaveStore, saveNamedState } from '@app/game/save-states';
import { appLog } from '@app/log/app-log';
import { defaultSaveName } from './default-save-name';
import { useNamedSaveList } from './useNamedSaveList';

const KIND = 'normal';

const useNormalSaves = (profileId: string | null, running: boolean) => {
  const { list, screenshots, refresh } = useNamedSaveList(profileId, KIND, running);
  const [busyId, setBusyId] = useState<string | null>(null);

  const create = useCallback(async (typed: string): Promise<string | null> => {
    const ctx = activeStateContext();
    if (!ctx || !profileId) return null;
    const name = typed.trim() || defaultSaveName();
    const result = await saveNamedState(ctx, KIND, name);
    if (!result.ok) appLog.warn(`[state] create "${name}" failed: ${result.reason}`);
    await refresh();
    return result.ok ? (await ctx.store.named.find(profileId, KIND, name))?.id ?? null : null;
  }, [profileId, refresh]);

  const load = useCallback(async (id: string) => {
    const ctx = activeStateContext();
    if (!ctx) return;
    setBusyId(id);
    const result = await loadState(ctx, { kind: KIND, id });
    if (!result.ok) appLog.warn(`[state] load save ${id} failed: ${result.reason}`);
    setBusyId(null);
  }, []);

  const overwrite = useCallback(async (id: string) => {
    const ctx = activeStateContext();
    if (!ctx) return;
    setBusyId(id);
    const result = await overwriteNamedState(ctx, KIND, id);
    if (!result.ok) appLog.warn(`[state] overwrite save ${id} failed: ${result.reason}`);
    await refresh();
    setBusyId(null);
  }, [refresh]);

  const remove = useCallback(async (id: string) => {
    if (!profileId) return;
    setBusyId(id);
    await platformSaveStore().named.remove(profileId, KIND, id);
    await refresh();
    setBusyId(null);
  }, [profileId, refresh]);

  const rename = useCallback(async (id: string, name: string) => {
    if (!profileId) return;
    await platformSaveStore().named.rename(profileId, KIND, id, name);
    await refresh();
  }, [profileId, refresh]);

  return { saves: list, screenshots, busyId, create, load, overwrite, remove, rename };
};

export { useNormalSaves };
