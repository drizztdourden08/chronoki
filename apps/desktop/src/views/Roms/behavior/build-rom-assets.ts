/* @layer renderer-components @kind logic */
import { extractAssets } from '@app/storage/assets-store';
import { extractPartySprites } from '@app/storage/sprites-store';
import type { RomBuildResult } from '../Roms.type';
import { ROMS_TEXT } from '../Roms.constants';

const spriteErrorOf = async (romFile: string): Promise<string | null> => {
  const result = await extractPartySprites(romFile);
  return result.success ? null : (result.error ?? ROMS_TEXT.spritesFailed);
};

const buildRomAssets = async (romFile: string, withSprites: boolean, done: string): Promise<RomBuildResult> => {
  const result = await extractAssets(romFile);
  if (!result.success) return { success: false, message: result.error ?? ROMS_TEXT.buildFailed, spriteError: null };
  return { success: true, message: done, spriteError: withSprites ? await spriteErrorOf(romFile) : null };
};

export { buildRomAssets };
