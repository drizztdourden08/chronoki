/* @layer renderer-components @kind hook */
import { useCallback, useEffect, useState } from 'react';
import { activeStateContext, saveState } from '@app/game/save-states';
import { appLog } from '@app/log/app-log';
import type { SlotInfo } from '../HomeTab.type';
import { loadIntoPlay, useGameSession } from '@app/views/GameSession';
import { ensureGameRunning } from './ensure-game-running';
import { emptySlots } from './empty-slots';
import { fetchQuickSlots } from './fetch-quick-slots';

const useQuickSaves = (profileId: string | null, running: boolean) => {
  const { play } = useGameSession();
  const [slots, setSlots] = useState<SlotInfo[]>(emptySlots);
  const [busySlot, setBusySlot] = useState<number | null>(null);

  const refresh = useCallback(async () => {
    const next = profileId ? await fetchQuickSlots(profileId) : emptySlots();
    if (next) setSlots(next);
  }, [profileId]);

  useEffect(() => { void refresh(); }, [refresh, running]);

  const save = useCallback(async (slot: number) => {
    if (!(await ensureGameRunning(running, play))) {
      appLog.warn(`[state] save ${slot + 1} skipped: the game is not running`);
      return;
    }
    const ctx = activeStateContext();
    if (!ctx) return;
    setBusySlot(slot);
    const result = await saveState(ctx, slot);
    if (!result.ok) appLog.warn(`[state] save ${slot + 1} failed: ${result.reason}`);
    await refresh();
    setBusySlot(null);
  }, [refresh, running, play]);

  const load = useCallback(async (slot: number) => {
    if (!(await ensureGameRunning(running, play))) return;
    const ctx = activeStateContext();
    if (!ctx) return;
    setBusySlot(slot);
    const result = await loadIntoPlay(ctx, { kind: 'quick', slot });
    if (!result.ok) appLog.warn(`[state] load ${slot + 1} failed: ${result.reason}`);
    setBusySlot(null);
  }, [running, play]);

  return { slots, busySlot, save, load };
};

export { useQuickSaves };
