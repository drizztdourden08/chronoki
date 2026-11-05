/* @layer renderer-components @kind logic */
import { importFile, importUrl } from '@app/storage/roms-store';
import type { RomImportResult } from '@app/storage/rom-files';
import type { RomBuildResult } from '../Roms.type';
import { ROMS_TEXT } from '../Roms.constants';
import { buildRomAssets } from './build-rom-assets';

const settleImport = async (imported: RomImportResult, withSprites: boolean, failure: string): Promise<RomBuildResult> => {
  if (!imported.success) return { success: false, message: imported.error ?? failure, spriteError: null };
  if (imported.alreadyExists) return { success: true, message: ROMS_TEXT.alreadyImported, spriteError: null };
  return buildRomAssets(imported.romFile, withSprites, ROMS_TEXT.imported);
};

const importRom = async (files: File[], withSprites: boolean): Promise<RomBuildResult> => {
  const [file] = files;
  if (!file) return { success: false, message: ROMS_TEXT.noFile, spriteError: null };
  return settleImport(await importFile(file), withSprites, ROMS_TEXT.importFailed);
};

const importRomUrl = async (url: string, withSprites: boolean): Promise<RomBuildResult> =>
  settleImport(await importUrl(url), withSprites, ROMS_TEXT.downloadFailed);

export { importRom, importRomUrl };
