/* @layer bridge-wasm @kind logic */
import { readTrackFile } from '@drizztdourden08/brock-msu/packs';
import { ctMsuConfig } from '@chronoki/game-core';
import { platformFiles } from '@app/storage/platform-files';

const readTrackBytes = async (packName: string, fileName: string): Promise<Uint8Array | null> => {
  try {
    return await readTrackFile(ctMsuConfig, platformFiles(), packName, fileName);
  } catch {
    return null;
  }
};

export { readTrackBytes };
