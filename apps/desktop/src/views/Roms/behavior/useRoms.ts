/* @layer renderer-components @kind hook */
import { useCallback, useEffect, useState } from 'react';
import { useDialogStore } from '@drizztdourden08/brock-react';
import { deleteRom, listRomsWithStatus } from '@app/storage/roms-store';
import type { RomEntry, RomStatusMessage } from '../Roms.type';
import { ROMS_TEXT } from '../Roms.constants';
import { importRom } from './import-rom';
import { rebuildRomAssets } from './rebuild-rom-assets';
import { useRomDetail } from './useRomDetail';

const readRoms = async (): Promise<RomEntry[]> =>
  (await listRomsWithStatus()).map(({ romFile, label, hasAssets, assetSize }) => ({
    romFile,
    label,
    ready: hasAssets,
    assetBytes: assetSize,
  }));

const useRoms = () => {
  const [roms, setRoms] = useState<RomEntry[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [status, setStatus] = useState<RomStatusMessage | null>(null);
  const [busy, setBusy] = useState(false);
  const [version, setVersion] = useState(0);
  const { detail, loading } = useRomDetail(selected, version);

  const refresh = useCallback(async () => {
    setRoms(await readRoms());
    setVersion((v) => v + 1);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const run = useCallback(async (working: string, job: () => Promise<RomStatusMessage>) => {
    setBusy(true);
    setStatus({ success: true, message: working });
    setStatus(await job());
    await refresh();
    setBusy(false);
  }, [refresh]);

  const handleDrop = useCallback((files: File[]) => run(ROMS_TEXT.working, () => importRom(files)), [run]);
  const handleRebuild = useCallback((romFile: string) => run(ROMS_TEXT.rebuilding, () => rebuildRomAssets(romFile)), [run]);

  const removeRom = useCallback(async (romFile: string) => {
    await deleteRom(romFile);
    if (selected === romFile) setSelected(null);
    await refresh();
  }, [refresh, selected]);

  const handleDelete = useCallback((romFile: string) => {
    const { show, dismiss } = useDialogStore.getState();
    show({
      title: ROMS_TEXT.deleteTitle,
      message: `${ROMS_TEXT.deleteMessage} ${romFile}`,
      confirmLabel: ROMS_TEXT.deleteLabel,
      variant: 'danger',
      onConfirm: () => { dismiss(); void removeRom(romFile); },
    });
  }, [removeRom]);

  return { roms, selected, setSelected, status, busy, detail, loading, handleDrop, handleRebuild, handleDelete };
};

export { useRoms };
