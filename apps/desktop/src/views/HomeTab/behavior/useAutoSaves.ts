/* @layer renderer-components @kind hook */
import { useCallback, useState } from 'react';
import { activeStateContext, loadState, platformSaveStore } from '@app/game/save-states';
import { appLog } from '@app/log/app-log';
import { useGameSession } from '@app/views/GameSession';
import { ensureGameRunning } from './ensure-game-running';
import { AUTO_KIND } from '../HomeTab.constants';
import { useNamedSaveList } from './useNamedSaveList';

const useAutoSaves = (profileId: string | null, running: boolean) => {
  const { play } = useGameSession();
  const { list, screenshots, refresh } = useNamedSaveList(profileId, AUTO_KIND, running);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async (id: string) => {
    if (!(await ensureGameRunning(running, play))) return;
    const ctx = activeStateContext();
    if (!ctx) return;
    setBusyId(id);
    const result = await loadState(ctx, { kind: AUTO_KIND, id });
    if (!result.ok) appLog.warn(`[state] load auto-save ${id} failed: ${result.reason}`);
    setBusyId(null);
  }, [running, play]);

  const remove = useCallback(async (id: string) => {
    if (!profileId) return;
    setBusyId(id);
    await platformSaveStore().named.remove(profileId, AUTO_KIND, id);
    await refresh();
    setBusyId(null);
  }, [profileId, refresh]);

  return { saves: list, screenshots, busyId, load, remove };
};

export { useAutoSaves };
