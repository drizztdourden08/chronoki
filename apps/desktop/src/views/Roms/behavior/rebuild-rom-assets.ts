/* @layer renderer-components @kind logic */
import { extractAssets } from '@app/storage/assets-store';
import type { RomStatusMessage } from '../Roms.type';
import { ROMS_TEXT } from '../Roms.constants';

const rebuildRomAssets = async (romFile: string): Promise<RomStatusMessage> => {
  const result = await extractAssets(romFile);
  if (!result.success) return { success: false, message: result.error ?? 'Building the assets failed' };
  return { success: true, message: ROMS_TEXT.rebuilt };
};

export { rebuildRomAssets };
