/* @layer renderer-components @kind hook */
import { useCallback, useEffect, useState } from 'react';
import { listRomsWithStatus } from '@app/storage/roms-store';
import type { LibraryImportResult, LibraryRom } from '../Library.type';
import { LIBRARY_TEXT } from '../Library.constants';
import { importRom } from './import-rom';

const readRoms = async (): Promise<LibraryRom[]> =>
  (await listRomsWithStatus()).map(({ romFile, label, hasAssets, assetSize }) => ({
    romFile,
    label,
    ready: hasAssets,
    assetBytes: assetSize,
  }));

const useLibrary = () => {
  const [roms, setRoms] = useState<LibraryRom[]>([]);
  const [status, setStatus] = useState<LibraryImportResult | null>(null);
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(async () => {
    setRoms(await readRoms());
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const handleDrop = useCallback(async (files: File[]) => {
    setBusy(true);
    setStatus({ success: true, message: LIBRARY_TEXT.working });
    setStatus(await importRom(files));
    await refresh();
    setBusy(false);
  }, [refresh]);

  return { roms, status, busy, handleDrop };
};

export { useLibrary };
