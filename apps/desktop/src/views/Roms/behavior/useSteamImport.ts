/* @layer renderer-components @kind hook */
import { useCallback, useEffect, useState } from 'react';
import { useDialogStore } from '@drizztdourden08/brock-react';
import type { SteamPick } from '@app/ipc';
import { NO_FILE_ERROR, importSteamArchive, importSteamPath, onSteamDataChanged, readSteamMarker, removeSteamData } from '@app/storage/steam-store';
import type { SteamImportResult, SteamMarker } from '@app/storage/steam-store';
import { STEAM_TEXT } from '../Roms.constants';
import type { RomStatusMessage } from '../Roms.type';
import { steamDetectApi } from './steam-detect-api';

const messageOf = (result: SteamImportResult): RomStatusMessage => ({ success: result.success, message: result.success ? STEAM_TEXT.imported : (result.error ?? '') });

const useSteamImport = () => {
  const [marker, setMarker] = useState<SteamMarker | null>(null);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<RomStatusMessage | null>(null);

  useEffect(() => {
    const read = (): void => {
      void readSteamMarker().then(setMarker);
    };
    read();
    return onSteamDataChanged(read);
  }, []);

  const run = useCallback(async (job: () => Promise<SteamImportResult>) => {
    setBusy(true);
    setStatus({ success: true, message: STEAM_TEXT.working });
    setStatus(messageOf(await job()));
    setBusy(false);
  }, []);

  const handleDrop = useCallback((files: File[]) => {
    const file = files[0];
    if (!file) {
      setStatus({ success: false, message: NO_FILE_ERROR });
      return;
    }
    void run(() => importSteamArchive(file));
  }, [run]);

  const handleImportPick = useCallback((pick: SteamPick) => run(() => importSteamPath(pick)), [run]);

  const handleBrowse = useCallback(async () => {
    const pick = await steamDetectApi()?.steamPick();
    if (pick) await handleImportPick(pick);
  }, [handleImportPick]);

  const handleRemove = useCallback(() => {
    const { show, dismiss } = useDialogStore.getState();
    show({
      title: STEAM_TEXT.removeTitle,
      message: STEAM_TEXT.removeMessage,
      confirmLabel: STEAM_TEXT.removeLabel,
      variant: 'danger',
      onConfirm: () => { dismiss(); void removeSteamData(); },
    });
  }, []);

  return { marker, busy, status, handleDrop, handleImportPick, handleBrowse, handleRemove };
};

export { useSteamImport };
