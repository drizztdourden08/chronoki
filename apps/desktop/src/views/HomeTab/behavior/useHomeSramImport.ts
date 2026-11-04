/* @layer renderer-components @kind hook */
import { useCallback, useState } from 'react';
import { SRAM_SLOT_COUNT, validSramSlots } from '@chronoki/game-core';
import { usePlatform } from '@drizztdourden08/brock-react';
import { toast } from '@drizztdourden08/tessera/composites';
import { writeProfileSram } from '@app/game/sram-sync';
import { appLog } from '@app/log/app-log';
import { SRAM_BYTES, SRAM_EXTENSIONS, TOAST_DURATION_MS } from '../HomeTab.constants';
import type { SramDialogState } from '../HomeTab.type';

const useHomeSramImport = (profileId: string | null) => {
  const { filePicker } = usePlatform();
  const [dialog, setDialog] = useState<SramDialogState>({ type: null });
  const [confirmText, setConfirmText] = useState('');

  const close = useCallback(() => {
    setDialog({ type: null });
    setConfirmText('');
  }, []);

  const pick = useCallback(async () => {
    const picked = await filePicker.pickFile({ extensions: SRAM_EXTENSIONS, anyType: 'mobile' });
    if (!picked) return;
    if (picked.bytes.byteLength !== SRAM_BYTES) {
      const detail = `"${picked.name}" is ${picked.bytes.byteLength} bytes. A raw SRAM save is always exactly ${SRAM_BYTES} bytes.`;
      setDialog({ type: 'import-sram-invalid', targetName: picked.name, detail });
      return;
    }
    const verified = validSramSlots(picked.bytes).length;
    const type = verified === 0 ? 'import-sram-unverified' : 'import-sram';
    setConfirmText('');
    setDialog({ type, targetName: picked.name, pendingBytes: picked.bytes, verified });
  }, [filePicker]);

  const acceptUnverified = useCallback(() => setDialog((current) => ({ ...current, type: 'import-sram' })), []);

  const confirm = useCallback(async () => {
    const { pendingBytes, targetName } = dialog;
    close();
    if (!pendingBytes || !profileId) return;
    await writeProfileSram(profileId, pendingBytes);
    appLog.info(`Imported SRAM save from "${targetName}". It takes effect the next time this profile starts`);
    toast({ message: `Save imported from "${targetName}"`, variant: 'success', duration: TOAST_DURATION_MS });
  }, [dialog, profileId, close]);

  return { dialog, confirmText, setConfirmText, pick, confirm, close, acceptUnverified, slotCount: SRAM_SLOT_COUNT };
};

export { useHomeSramImport };
