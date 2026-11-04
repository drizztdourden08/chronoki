/* @layer renderer-lib @kind logic */
import { romStoreOf } from '../rom-files';
import { platformFiles } from '../platform-files';
import type { RomInfo } from './roms-store.type';

const listRomsWithStatus = async (): Promise<RomInfo[]> =>
  (await romStoreOf(platformFiles()).listNames()).map(({ file, label, hasAssets, assetBytes }) => ({
    romFile: file,
    label,
    hasAssets,
    assetSize: hasAssets ? assetBytes : null,
  }));

export { listRomsWithStatus };
