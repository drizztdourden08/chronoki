/* @layer renderer-components @kind hook */
import { useCallback, useEffect, useState } from 'react';
import { armIdleClose, closeSaveOverlay } from '@app/game/save-overlay';
import { loadFromSlot, saveToSlot } from '@app/views/GameSession';
import { emptySlots, fetchQuickSlots } from '@app/game/save-slots';
import type { SlotInfo } from '@app/game/save-slots';

const useOverlaySlots = (open: boolean, profileId: string | null) => {
  const [slots, setSlots] = useState<SlotInfo[]>(emptySlots);
  const [busySlot, setBusySlot] = useState<number | null>(null);

  const refresh = useCallback(async () => {
    const next = profileId ? await fetchQuickSlots(profileId) : null;
    if (next) setSlots(next);
  }, [profileId]);

  useEffect(() => {
    if (open) void refresh();
  }, [open, refresh]);

  const save = useCallback(async (slot: number) => {
    setBusySlot(slot);
    await saveToSlot(slot);
    await refresh();
    setBusySlot(null);
    armIdleClose();
  }, [refresh]);

  const load = useCallback(async (slot: number) => {
    setBusySlot(slot);
    await loadFromSlot(slot);
    setBusySlot(null);
    closeSaveOverlay();
  }, []);

  return { slots, busySlot, save, load };
};

export { useOverlaySlots };
