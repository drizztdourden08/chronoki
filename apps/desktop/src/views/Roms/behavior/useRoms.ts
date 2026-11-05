/* @layer renderer-components @kind hook */
import { useCallback, useEffect, useState } from 'react';
import { useDialogStore } from '@drizztdourden08/brock-react';
import { deleteRom, listRomsWithStatus } from '@app/storage/roms-store';
import type { RomBuildResult, RomEntry, RomStatusMessage } from '../Roms.type';
import { ROMS_TEXT } from '../Roms.constants';
import { buildRomAssets } from './build-rom-assets';
import { importRom } from './import-rom';
import { importRomUrl } from './import-rom-url';
import { useRomDetail } from './useRomDetail';
import { useRomExtraction } from './useRomExtraction';

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
  const extraction = useRomExtraction();
  const { withSprites, setSpriteError } = extraction;
  const { detail, loading } = useRomDetail(selected, version);

  const refresh = useCallback(async () => {
    setRoms(await readRoms());
    setVersion((v) => v + 1);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const run = useCallback(async (job: () => Promise<RomBuildResult>): Promise<RomBuildResult> => {
    setBusy(true);
    setSpriteError(null);
    const result = await job();
    setSpriteError(result.spriteError);
    await refresh();
    setBusy(false);
    return result;
  }, [refresh, setSpriteError]);

  const handleFileImport = useCallback((files: File[]) => run(() => importRom(files, withSprites)), [run, withSprites]);
  const handleUrlImport = useCallback((url: string) => run(() => importRomUrl(url, withSprites)), [run, withSprites]);

  const handleRebuild = useCallback(async (romFile: string) => {
    setStatus({ success: true, message: ROMS_TEXT.rebuilding });
    const { success, message } = await run(() => buildRomAssets(romFile, withSprites, ROMS_TEXT.rebuilt));
    setStatus({ success, message });
  }, [run, withSprites]);

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

  return { roms, selected, setSelected, status, busy, detail, loading, extraction, handleFileImport, handleUrlImport, handleRebuild, handleDelete };
};

export { useRoms };
