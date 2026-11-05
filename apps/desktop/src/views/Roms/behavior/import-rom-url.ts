/* @layer renderer-components @kind logic */
import { importUrl } from '@app/storage/roms-store';
import type { RomBuildResult } from '../Roms.type';
import { ROMS_TEXT } from '../Roms.constants';
import { settleImport } from './settle-import';

const importRomUrl = async (url: string, withSprites: boolean): Promise<RomBuildResult> =>
  settleImport(await importUrl(url), withSprites, ROMS_TEXT.downloadFailed);

export { importRomUrl };
