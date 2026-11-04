/* @layer renderer-components @kind hook */
import { useCallback, useEffect, useState } from 'react';
import { activeStateContext, loadState, saveState } from '@app/game/save-states';
import { appLog } from '@app/log/app-log';
import type { SlotInfo } from '../HomeTab.type';
import { emptySlots } from './empty-slots';
import { fetchQuickSlots } from './fetch-quick-slots';

const useQuickSaves = (profileId: string | null, running: boolean) => {
  const [slots, setSlots] = useState<SlotInfo[]>(emptySlots);
  const [busySlot, setBusySlot] = useState<number | null>(null);

  const refresh = useCallback(async () => {
    const next = profileId ? await fetchQuickSlots(profileId) : emptySlots();
    if (next) setSlots(next);
  }, [profileId]);

  useEffect(() => { void refresh(); }, [refresh, running]);

  const save = useCallback(async (slot: number) => {
    const ctx = activeStateContext();
    if (!ctx) return;
    setBusySlot(slot);
    const result = await saveState(ctx, slot);
    if (!result.ok) appLog.warn(`[state] save ${slot + 1} failed: ${result.reason}`);
    await refresh();
    setBusySlot(null);
  }, [refresh]);

  const load = useCallback(async (slot: number) => {
    const ctx = activeStateContext();
    if (!ctx) return;
    setBusySlot(slot);
    const result = await loadState(ctx, { kind: 'quick', slot });
    if (!result.ok) appLog.warn(`[state] load ${slot + 1} failed: ${result.reason}`);
    setBusySlot(null);
  }, []);

  return { slots, busySlot, save, load };
};

export { useQuickSaves };
