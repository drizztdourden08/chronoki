/* @layer renderer-components @kind logic */
import { importFile } from '@app/storage/roms-store';
import type { RomBuildResult } from '../Roms.type';
import { ROMS_TEXT } from '../Roms.constants';
import { settleImport } from './settle-import';

const importRom = async (files: File[], withSprites: boolean): Promise<RomBuildResult> => {
  const [file] = files;
  if (!file) return { success: false, message: ROMS_TEXT.noFile, spriteError: null };
  return settleImport(await importFile(file), withSprites, ROMS_TEXT.importFailed);
};

export { importRom };
