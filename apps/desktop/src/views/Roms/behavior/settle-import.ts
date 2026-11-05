/* @layer renderer-components @kind logic */
import type { RomImportResult } from '@app/storage/rom-files';
import type { RomBuildResult } from '../Roms.type';
import { ROMS_TEXT } from '../Roms.constants';
import { buildRomAssets } from './build-rom-assets';

const settleImport = async (imported: RomImportResult, withSprites: boolean, failure: string): Promise<RomBuildResult> => {
  if (!imported.success) return { success: false, message: imported.error ?? failure, spriteError: null };
  if (imported.alreadyExists) return { success: true, message: ROMS_TEXT.alreadyImported, spriteError: null };
  return buildRomAssets(imported.romFile, withSprites, ROMS_TEXT.imported);
};

export { settleImport };
