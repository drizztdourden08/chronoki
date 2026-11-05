/* @layer renderer-components @kind hook */
import { useCallback, useState } from 'react';
import { loadFromSlot, saveToSlot } from '@app/views/GameSession';
import { appLog } from '@app/log/app-log';

const useSlotActions = (loadSlots: () => Promise<void>, onClose: () => void) => {
  const [busy, setBusy] = useState<number | null>(null);

  const handleSave = useCallback(async (slot: number) => {
    setBusy(slot);
    appLog.info(`[UI] Save to slot ${slot}`);
    await saveToSlot(slot);
    await loadSlots();
    setBusy(null);
  }, [loadSlots]);

  const handleLoad = useCallback(async (slot: number) => {
    setBusy(slot);
    appLog.info(`[UI] Load from slot ${slot}`);
    await loadFromSlot(slot);
    setBusy(null);
    onClose();
  }, [onClose]);

  return { busy, handleSave, handleLoad };
};

export { useSlotActions };
