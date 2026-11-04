/* @layer renderer-components @kind logic */
import { extractAssets } from '@app/storage/assets-store';
import { importFile } from '@app/storage/roms-store';
import type { LibraryImportResult } from '../Library.type';
import { LIBRARY_TEXT } from '../Library.constants';

const importRom = async (files: File[]): Promise<LibraryImportResult> => {
  const file = files[0];
  if (!file) return { success: false, message: LIBRARY_TEXT.empty };
  const imported = await importFile(file);
  if (!imported.success) return { success: false, message: imported.error ?? 'Import failed' };
  const extracted = await extractAssets(imported.romFile);
  if (!extracted.success) return { success: false, message: extracted.error ?? 'Building the assets failed' };
  return { success: true, message: LIBRARY_TEXT.imported };
};

export { importRom };
